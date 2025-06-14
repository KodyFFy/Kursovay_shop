
package handlers

import (
        "database/sql"
        "html/template"
        "license_keys_shop/internal/database"
        "license_keys_shop/internal/middleware"
        "license_keys_shop/internal/models"
        "net/http"
)

type HomeHandler struct {
        db        *database.DB
        templates *template.Template
}

func NewHomeHandler(db *database.DB, templates *template.Template) *HomeHandler {
        return &HomeHandler{
                db:        db,
                templates: templates,
        }
}

func (h *HomeHandler) ShowHome(w http.ResponseWriter, r *http.Request) {
        // Get featured products (latest 8 products)
        rows, err := h.db.Query(`
                SELECT p.id, p.title, p.description, p.price, p.image_url, p.created_at,
                       c.name as category_name, c.slug as category_slug
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE p.is_sold = FALSE
                ORDER BY p.created_at DESC
                LIMIT 8`)

        var featuredProducts []models.Product
        if err == nil {
                defer rows.Close()
                for rows.Next() {
                        var p models.Product
                        var categoryName, categorySlug sql.NullString
                        
                        err := rows.Scan(&p.ID, &p.Title, &p.Description, &p.Price, 
                                &p.ImageURL, &p.CreatedAt, &categoryName, &categorySlug)
                        if err != nil {
                                continue
                        }

                        if categoryName.Valid {
                                p.Category = &models.Category{
                                        Name: categoryName.String,
                                        Slug: categorySlug.String,
                                }
                        }

                        featuredProducts = append(featuredProducts, p)
                }
        }

        // Get categories
        categories := h.getMainCategories()

        // Get current user if logged in
        var currentUser *models.User
        if user, ok := middleware.GetUserFromContext(r.Context()); ok {
                currentUser = user
        }

        data := map[string]interface{}{
                "Title":            "Магазин лицензионных ключей",
                "FeaturedProducts": featuredProducts,
                "Categories":       categories,
                "User":             currentUser,
        }

        err = h.templates.ExecuteTemplate(w, "base.html", data)
        if err != nil {
                http.Error(w, "Template error: "+err.Error(), http.StatusInternalServerError)
                return
        }
}

func (h *HomeHandler) ShowProfile(w http.ResponseWriter, r *http.Request) {
        user, ok := middleware.GetUserFromContext(r.Context())
        if !ok {
                http.Redirect(w, r, "/login", http.StatusSeeOther)
                return
        }

        // Get user's recent orders
        rows, err := h.db.Query(`
                SELECT o.id, o.total_amount, o.payment_status, o.created_at,
                       p.title, p.image_url
                FROM orders o
                JOIN products p ON o.product_id = p.id
                WHERE o.user_id = $1
                ORDER BY o.created_at DESC
                LIMIT 5`, user.ID)

        var recentOrders []models.Order
        if err == nil {
                defer rows.Close()
                for rows.Next() {
                        var order models.Order
                        var product models.Product
                        
                        err := rows.Scan(&order.ID, &order.TotalAmount, &order.PaymentStatus,
                                &order.CreatedAt, &product.Title, &product.ImageURL)
                        if err != nil {
                                continue
                        }

                        order.Product = &product
                        recentOrders = append(recentOrders, order)
                }
        }

        data := map[string]interface{}{
                "Title":        "Личный кабинет",
                "User":         user,
                "RecentOrders": recentOrders,
        }

        h.templates.ExecuteTemplate(w, "profile.html", data)
}

func (h *HomeHandler) getMainCategories() []models.Category {
        rows, err := h.db.Query(`
                SELECT id, name, slug, description
                FROM categories 
                WHERE parent_id IS NULL
                ORDER BY name`)
        if err != nil {
                return []models.Category{}
        }
        defer rows.Close()

        var categories []models.Category
        for rows.Next() {
                var cat models.Category
                rows.Scan(&cat.ID, &cat.Name, &cat.Slug, &cat.Description)
                
                // Get subcategories
                subRows, err := h.db.Query(`
                        SELECT id, name, slug, description
                        FROM categories 
                        WHERE parent_id = $1
                        ORDER BY name`, cat.ID)
                if err == nil {
                        for subRows.Next() {
                                var subCat models.Category
                                subRows.Scan(&subCat.ID, &subCat.Name, &subCat.Slug, &subCat.Description)
                                cat.Children = append(cat.Children, subCat)
                        }
                        subRows.Close()
                }
                
                categories = append(categories, cat)
        }
        return categories
}
