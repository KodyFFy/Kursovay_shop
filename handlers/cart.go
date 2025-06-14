package main

import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "sync"
)

type Product struct {
    ID    string  `json:"id"`
    Name  string  `json:"name"`
    Price float64 `json:"price"`
    Stock int     `json:"stock"`
}

var productCatalog = []Product{
    {"p001", "Game Key: Cyber Adventure", 49.99, 100},
    {"p002", "Game Key: Fantasy Quest", 29.99, 50},
    {"p003", "Game Key: Space Battle", 59.99, 25},
    {"p004", "Game Key: Puzzle Master", 19.99, 200},
    {"p005", "Game Key: Racing Fever", 39.99, 75},
}

type CartItem struct {
    Product  Product `json:"product"`
    Quantity int     `json:"quantity"`
}

type Cart struct {
    mu    sync.RWMutex
    Items map[string]*CartItem
}

func NewCart() *Cart {
    return &Cart{
        Items: make(map[string]*CartItem),
    }
}

func (c *Cart) AddItem(p Product, quantity int) error {
    if quantity <= 0 {
        return fmt.Errorf("quantity must be positive")
    }
    c.mu.Lock()
    defer c.mu.Unlock()
    existing, ok := c.Items[p.ID]
    if ok {
        existing.Quantity += quantity
    } else {
        if quantity > p.Stock {
            return fmt.Errorf("not enough stock for product %s", p.Name)
        }
        c.Items[p.ID] = &CartItem{Product: p, Quantity: quantity}
    }
    return nil
}

func (c *Cart) UpdateItem(p Product, quantity int) error {
    if quantity < 0 {
        return fmt.Errorf("quantity cannot be negative")
    }
    c.mu.Lock()
    defer c.mu.Unlock()
    if quantity == 0 {
        delete(c.Items, p.ID)
        return nil
    }
    if quantity > p.Stock {
        return fmt.Errorf("not enough stock for product %s", p.Name)
    }
    c.Items[p.ID] = &CartItem{Product: p, Quantity: quantity}
    return nil
}

func (c *Cart) RemoveItem(productID string) {
    c.mu.Lock()
    defer c.mu.Unlock()
    delete(c.Items, productID)
}

func (c *Cart) ListItems() []CartItem {
    c.mu.RLock()
    defer c.mu.RUnlock()
    items := make([]CartItem, 0, len(c.Items))
    for _, item := range c.Items {
        items = append(items, *item)
    }
    return items
}

func (c *Cart) TotalPrice() float64 {
    c.mu.RLock()
    defer c.mu.RUnlock()
    total := 0.0
    for _, item := range c.Items {
        total += item.Product.Price * float64(item.Quantity)
    }
    return total
}

var carts = make(map[string]*Cart)

func getCart(w http.ResponseWriter, r *http.Request) {
    sessionID := r.Header.Get("Session-ID")
    cart, ok := carts[sessionID]
    if !ok {
        cart = NewCart()
        carts[sessionID] = cart
    }
    json.NewEncoder(w).Encode(cart.ListItems())
}

func addItemToCart(w http.ResponseWriter, r *http.Request) {
    sessionID := r.Header.Get("Session-ID")
    cart, ok := carts[sessionID]
    if !ok {
        cart = NewCart()
        carts[sessionID] = cart
    }
    var item CartItem
    if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    if err := cart.AddItem(item.Product, item.Quantity); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    w.WriteHeader(http.StatusOK)
}

func removeItemFromCart(w http.ResponseWriter, r *http.Request) {
    sessionID := r.Header.Get("Session-ID")
    cart, ok := carts[sessionID]
    if !ok {
        http.Error(w, "cart not found", http.StatusNotFound)
        return
    }
    productID := r.URL.Query().Get("id")
    cart.RemoveItem(productID)
    w.WriteHeader(http.StatusOK)
}

func main() {
    http.HandleFunc("/cart", getCart)
    http.HandleFunc("/cart/add", addItemToCart)
    http.HandleFunc("/cart/remove", removeItemFromCart)
    log.Fatal(http.ListenAndServe(":8080", nil))
}
