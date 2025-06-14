
package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"html/template"
	"license_keys_shop/internal/database"
	"license_keys_shop/internal/middleware"
	"license_keys_shop/internal/models"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
)

type OrderHandler struct {
	db        *database.DB
	templates *template.Template
}

func NewOrderHandler(db *database.DB, templates *template.Template) *OrderHandler {
	return &OrderHandler{
		db:        db,
		templates: templates,
	}
}

func (h *OrderHandler) CreateOrder(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	user, ok := middleware.GetUserFromContext(r.Context())
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	productID, err := strconv.Atoi(vars["productId"])
	if err != nil {
		http.Error(w, "Invalid product ID", http.StatusBadRequest)
		return
	}

	paymentMethod := r.FormValue("payment_method")
	if paymentMethod == "" {
		paymentMethod = "mir" // default
	}

	// Check if product exists and is not sold
	var product models.Product
	err = h.db.QueryRow(`
		SELECT id, title, price, is_sold 
		FROM products WHERE id = $1`, productID).Scan(
		&product.ID, &product.Title, &product.Price, &product.IsSold)

	if err == sql.ErrNoRows {
		http.Error(w, "Product not found", http.StatusNotFound)
		return
	}
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	if product.IsSold {
		http.Error(w, "Product already sold", http.StatusConflict)
		return
	}

	// Generate transaction ID
	transactionID := fmt.Sprintf("%s_%d_%d", paymentMethod, time.Now().Unix(), rand.Intn(10000))

	// Create order
	var orderID int
	err = h.db.QueryRow(`
		INSERT INTO orders (user_id, product_id, total_amount, payment_method, transaction_id, payment_status)
		VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING id`,
		user.ID, productID, product.Price, paymentMethod, transactionID).Scan(&orderID)

	if err != nil {
		http.Error(w, "Failed to create order", http.StatusInternalServerError)
		return
	}

	// Simulate payment processing
	go h.processPayment(orderID, paymentMethod)

	if r.Header.Get("Accept") == "application/json" {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"order_id":       orderID,
			"transaction_id": transactionID,
			"status":         "pending",
			"message":        "Order created, processing payment...",
		})
		return
	}

	// Redirect to payment page
	http.Redirect(w, r, fmt.Sprintf("/payment/%d", orderID), http.StatusSeeOther)
}

func (h *OrderHandler) ShowPayment(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	orderID, err := strconv.Atoi(vars["orderId"])
	if err != nil {
		http.Error(w, "Invalid order ID", http.StatusBadRequest)
		return
	}

	user, ok := middleware.GetUserFromContext(r.Context())
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var order models.Order
	var productTitle string
	err = h.db.QueryRow(`
		SELECT o.id, o.user_id, o.product_id, o.total_amount, o.payment_method,
		       o.payment_status, o.transaction_id, o.created_at, p.title
		FROM orders o
		JOIN products p ON o.product_id = p.id
		WHERE o.id = $1 AND o.user_id = $2`, orderID, user.ID).Scan(
		&order.ID, &order.UserID, &order.ProductID, &order.TotalAmount,
		&order.PaymentMethod, &order.PaymentStatus, &order.TransactionID,
		&order.CreatedAt, &productTitle)

	if err == sql.ErrNoRows {
		http.Error(w, "Order not found", http.StatusNotFound)
		return
	}
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	data := map[string]interface{}{
		"Title":        "Оплата заказа",
		"Order":        order,
		"ProductTitle": productTitle,
		"User":         user,
	}

	h.templates.ExecuteTemplate(w, "payment.html", data)
}

func (h *OrderHandler) GetOrderStatus(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	orderID, err := strconv.Atoi(vars["orderId"])
	if err != nil {
		http.Error(w, "Invalid order ID", http.StatusBadRequest)
		return
	}

	user, ok := middleware.GetUserFromContext(r.Context())
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var order models.Order
	var licenseKey sql.NullString
	err = h.db.QueryRow(`
		SELECT o.id, o.payment_status, o.transaction_id, p.license_key
		FROM orders o
		JOIN products p ON o.product_id = p.id
		WHERE o.id = $1 AND o.user_id = $2`, orderID, user.ID).Scan(
		&order.ID, &order.PaymentStatus, &order.TransactionID, &licenseKey)

	if err == sql.ErrNoRows {
		http.Error(w, "Order not found", http.StatusNotFound)
		return
	}
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"order_id":       order.ID,
		"status":         order.PaymentStatus,
		"transaction_id": order.TransactionID,
	}

	if order.PaymentStatus == "completed" && licenseKey.Valid {
		response["license_key"] = licenseKey.String
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (h *OrderHandler) GetUserOrders(w http.ResponseWriter, r *http.Request) {
	user, ok := middleware.GetUserFromContext(r.Context())
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	rows, err := h.db.Query(`
		SELECT o.id, o.product_id, o.total_amount, o.payment_method,
		       o.payment_status, o.transaction_id, o.created_at,
		       p.title, p.image_url
		FROM orders o
		JOIN products p ON o.product_id = p.id
		WHERE o.user_id = $1
		ORDER BY o.created_at DESC`, user.ID)

	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var orders []models.Order
	for rows.Next() {
		var order models.Order
		var product models.Product
		
		err := rows.Scan(
			&order.ID, &order.ProductID, &order.TotalAmount, &order.PaymentMethod,
			&order.PaymentStatus, &order.TransactionID, &order.CreatedAt,
			&product.Title, &product.ImageURL)
		if err != nil {
			continue
		}

		order.Product = &product
		orders = append(orders, order)
	}

	if r.Header.Get("Accept") == "application/json" {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(orders)
		return
	}

	data := map[string]interface{}{
		"Title":  "Мои заказы",
		"Orders": orders,
		"User":   user,
	}

	h.templates.ExecuteTemplate(w, "user_orders.html", data)
}

func (h *OrderHandler) processPayment(orderID int, paymentMethod string) {
	// Simulate payment processing delay
	time.Sleep(time.Duration(rand.Intn(5)+3) * time.Second)

	// Simulate payment success (90% success rate)
	success := rand.Float32() < 0.9

	if success {
		// Mark order as completed and product as sold
		tx, err := h.db.Begin()
		if err != nil {
			return
		}
		defer tx.Rollback()

		_, err = tx.Exec(`
			UPDATE orders SET payment_status = 'completed' WHERE id = $1`, orderID)
		if err != nil {
			return
		}

		_, err = tx.Exec(`
			UPDATE products SET is_sold = TRUE 
			WHERE id = (SELECT product_id FROM orders WHERE id = $1)`, orderID)
		if err != nil {
			return
		}

		tx.Commit()
	} else {
		// Mark order as failed
		h.db.Exec(`
			UPDATE orders SET payment_status = 'failed' WHERE id = $1`, orderID)
	}
}

func (h *OrderHandler) ShowCart(w http.ResponseWriter, r *http.Request) {
	user, ok := middleware.GetUserFromContext(r.Context())
	if !ok {
		http.Redirect(w, r, "/login", http.StatusSeeOther)
		return
	}

	// For simplicity, we'll show the product to purchase from URL parameter
	productID := r.URL.Query().Get("product")
	if productID == "" {
		http.Redirect(w, r, "/", http.StatusSeeOther)
		return
	}

	id, err := strconv.Atoi(productID)
	if err != nil {
		http.Error(w, "Invalid product ID", http.StatusBadRequest)
		return
	}

	var product models.Product
	err = h.db.QueryRow(`
		SELECT id, title, description, price, image_url, is_sold
		FROM products WHERE id = $1`, id).Scan(
		&product.ID, &product.Title, &product.Description, 
		&product.Price, &product.ImageURL, &product.IsSold)

	if err == sql.ErrNoRows {
		http.Error(w, "Product not found", http.StatusNotFound)
		return
	}
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	if product.IsSold {
		http.Error(w, "Product already sold", http.StatusConflict)
		return
	}

	data := map[string]interface{}{
		"Title":   "Корзина",
		"Product": product,
		"User":    user,
	}

	h.templates.ExecuteTemplate(w, "cart.html", data)
}
