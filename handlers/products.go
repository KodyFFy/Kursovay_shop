
package handlers

import (
        "database/sql"
        "encoding/json"
        "fmt"
        "html/template"
        "license_keys_shop/internal/database"
        "license_keys_shop/internal/middleware"
        "license_keys_shop/internal/models"
        "net/http"
        "strconv"

        "github.com/gorilla/mux"
)

type ProductHandler struct {
        db        *database.DB
        templates *template.Template
}

func NewProductHandler(db *database.DB, templates *template.Template) *ProductHandler {
        return &ProductHandler{
                db:        db,
                templates: templates,
        }
}

func (h *ProductHandler) GetProducts(w http.ResponseWriter, r *http.Request) {
        filter := h.parseFilter(r)
        
        query := `
                SELECT p.id, p.title, p.description, p.price, p.category_id, p.is_sold, 
                       p.image_url, p.created_at, p.updated_at,
                       c.name as category_name, c.slug as category_slug
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE 1=1`
        
        args := []interface{}{}
        argCount := 0

        if filter.CategoryID != nil {
                argCount++
                query += fmt.Sprintf(" AND p.category_id = $%d", argCount)
                args = append(args, *filter.CategoryID)
        }

        if filter.Search != "" {
                argCount++
                query += fmt.Sprintf(" AND (p.title ILIKE $%d OR p.description ILIKE $%d)", argCount, argCount)
                args = append(args, "%"+filter.Search+"%")
        }

        if filter.MinPrice != nil {
                argCount++
                query += fmt.Sprintf(" AND p.price >= $%d", argCount)
                args = append(args, *filter.MinPrice)
        }

        if filter.MaxPrice != nil {
                argCount++
                query += fmt.Sprintf(" AND p.price <= $%d", argCount)
                args = append(args, *filter.MaxPrice)
        }

        query += " AND p.is_sold = FALSE ORDER BY p.created_at DESC"

        if filter.Limit > 0 {
                argCount++
                query += fmt.Sprintf(" LIMIT $%d", argCount)
                args = append(args, filter.Limit)
                
                if filter.Page > 0 {
                        argCount++
                        query += fmt.Sprintf(" OFFSET $%d", argCount)
                        args = append(args, (filter.Page-1)*filter.Limit)
                }
        }

        rows, err := h.db.Query(query, args...)
        if err != nil {
                http.Error(w, "Database error", http.StatusInternalServerError)
                return
        }
        defer rows.Close()

        var products []models.Product
        for rows.Next() {
                var p models.Product
                var categoryName, categorySlug sql.NullString
                
                err := rows.Scan(
                        &p.ID, &p.Title, &p.Description, &p.Price, &p.CategoryID,
                        &p.IsSold, &p.ImageURL, &p.CreatedAt, &p.UpdatedAt,
                        &categoryName, &categorySlug)
                if err != nil {
                        continue
                }

                if categoryName.Valid {
                        p.Category = &models.Category{
                                ID:   p.CategoryID,
                                Name: categoryName.String,
                                Slug: categorySlug.String,
                        }
                }

                // Load tags for each product
                p.Tags = h.getProductTags(p.ID)
                products = append(products, p)
        }

        if r.Header.Get("Accept") == "application/json" {
                w.Header().Set("Content-Type", "application/json")
                json.NewEncoder(w).Encode(products)
                return
        }

        // Get categories for filter
        categories := h.getCategories()
        tags := h.getTags()

        data := map[string]interface{}{
                "Title":      "Каталог товаров",
                "Products":   products,
                "Categories": categories,
                "Tags":       tags,
                "Filter":     filter,
        }

        h.templates.ExecuteTemplate(w, "products.html", data)
}

func (h *ProductHandler) GetProduct(w http.ResponseWriter, r *http.Request) {
        vars := mux.Vars(r)
        id, err := strconv.Atoi(vars["id"])
        if err != nil {
                http.Error(w, "Invalid product ID", http.StatusBadRequest)
                return
        }

        var p models.Product
        var categoryName, categorySlug sql.NullString
        
        err = h.db.QueryRow(`
                SELECT p.id, p.title, p.description, p.price, p.category_id, p.is_sold,
                       p.image_url, p.created_at, p.updated_at,
                       c.name as category_name, c.slug as category_slug
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE p.id = $1`, id).Scan(
                &p.ID, &p.Title, &p.Description, &p.Price, &p.CategoryID,
                &p.IsSold, &p.ImageURL, &p.CreatedAt, &p.UpdatedAt,
                &categoryName, &categorySlug)

        if err == sql.ErrNoRows {
                http.Error(w, "Product not found", http.StatusNotFound)
                return
        }
        if err != nil {
                http.Error(w, "Database error", http.StatusInternalServerError)
                return
        }

        if categoryName.Valid {
                p.Category = &models.Category{
                        ID:   p.CategoryID,
                        Name: categoryName.String,
                        Slug: categorySlug.String,
                }
        }

        p.Tags = h.getProductTags(p.ID)

        if r.Header.Get("Accept") == "application/json" {
                w.Header().Set("Content-Type", "application/json")
                json.NewEncoder(w).Encode(p)
                return
        }

        data := map[string]interface{}{
                "Title":   p.Title,
                "Product": p,
        }

        h.templates.ExecuteTemplate(w, "product.html", data)
}

func (h *ProductHandler) CreateProduct(w http.ResponseWriter, r *http.Request) {
        if r.Method != http.MethodPost {
                http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
                return
        }

        var p models.Product
        if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
                http.Error(w, "Invalid JSON", http.StatusBadRequest)
                return
        }

        err := h.db.QueryRow(`
                INSERT INTO products (title, description, price, category_id, license_key, image_url)
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at, updated_at`,
                p.Title, p.Description, p.Price, p.CategoryID, p.LicenseKey, p.ImageURL).Scan(
                &p.ID, &p.CreatedAt, &p.UpdatedAt)

        if err != nil {
                http.Error(w, "Failed to create product", http.StatusInternalServerError)
                return
        }

        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(p)
}

func (h *ProductHandler) UpdateProduct(w http.ResponseWriter, r *http.Request) {
        if r.Method != "PUT" {
                http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
                return
        }

        vars := mux.Vars(r)
        id, err := strconv.Atoi(vars["id"])
        if err != nil {
                http.Error(w, "Invalid product ID", http.StatusBadRequest)
                return
        }

        var p models.Product
        if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
                http.Error(w, "Invalid JSON", http.StatusBadRequest)
                return
        }

        _, err = h.db.Exec(`
                UPDATE products 
                SET title = $1, description = $2, price = $3, category_id = $4, 
                    license_key = $5, image_url = $6, updated_at = CURRENT_TIMESTAMP
                WHERE id = $7`,
                p.Title, p.Description, p.Price, p.CategoryID, p.LicenseKey, p.ImageURL, id)

        if err != nil {
                http.Error(w, "Failed to update product", http.StatusInternalServerError)
                return
        }

        p.ID = id
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(p)
}

func (h *ProductHandler) DeleteProduct(w http.ResponseWriter, r *http.Request) {
        if r.Method != "DELETE" {
                http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
                return
        }

        vars := mux.Vars(r)
        id, err := strconv.Atoi(vars["id"])
        if err != nil {
                http.Error(w, "Invalid product ID", http.StatusBadRequest)
                return
        }

        _, err = h.db.Exec("DELETE FROM products WHERE id = $1", id)
        if err != nil {
                http.Error(w, "Failed to delete product", http.StatusInternalServerError)
                return
        }

        w.WriteHeader(http.StatusNoContent)
}

func (h *ProductHandler) parseFilter(r *http.Request) models.ProductFilter {
        filter := models.ProductFilter{
                Page:  1,
                Limit: 20,
        }

        if categoryID := r.URL.Query().Get("category"); categoryID != "" {
                if id, err := strconv.Atoi(categoryID); err == nil {
                        filter.CategoryID = &id
                }
        }

        if tagID := r.URL.Query().Get("tag"); tagID != "" {
                if id, err := strconv.Atoi(tagID); err == nil {
                        filter.TagID = &id
                }
        }

        filter.Search = r.URL.Query().Get("search")

        if minPrice := r.URL.Query().Get("min_price"); minPrice != "" {
                if price, err := strconv.ParseFloat(minPrice, 64); err == nil {
                        filter.MinPrice = &price
                }
        }

        if maxPrice := r.URL.Query().Get("max_price"); maxPrice != "" {
                if price, err := strconv.ParseFloat(maxPrice, 64); err == nil {
                        filter.MaxPrice = &price
                }
        }

        if page := r.URL.Query().Get("page"); page != "" {
                if p, err := strconv.Atoi(page); err == nil && p > 0 {
                        filter.Page = p
                }
        }

        if limit := r.URL.Query().Get("limit"); limit != "" {
                if l, err := strconv.Atoi(limit); err == nil && l > 0 {
                        filter.Limit = l
                }
        }

        return filter
}

func (h *ProductHandler) getProductTags(productID int) []models.Tag {
        rows, err := h.db.Query(`
                SELECT t.id, t.name, t.color
                FROM tags t
                JOIN product_tags pt ON t.id = pt.tag_id
                WHERE pt.product_id = $1`, productID)
        if err != nil {
                return []models.Tag{}
        }
        defer rows.Close()

        var tags []models.Tag
        for rows.Next() {
                var tag models.Tag
                rows.Scan(&tag.ID, &tag.Name, &tag.Color)
                tags = append(tags, tag)
        }
        return tags
}

func (h *ProductHandler) getCategories() []models.Category {
        rows, err := h.db.Query(`
                SELECT id, name, slug, description, parent_id
                FROM categories ORDER BY parent_id NULLS FIRST, name`)
        if err != nil {
                return []models.Category{}
        }
        defer rows.Close()

        var categories []models.Category
        for rows.Next() {
                var cat models.Category
                var parentID sql.NullInt32
                rows.Scan(&cat.ID, &cat.Name, &cat.Slug, &cat.Description, &parentID)
                if parentID.Valid {
                        cat.ParentID = new(int)
                        *cat.ParentID = int(parentID.Int32)
                }
                categories = append(categories, cat)
        }
        return categories
}

func (h *ProductHandler) getTags() []models.Tag {
        rows, err := h.db.Query("SELECT id, name, color FROM tags ORDER BY name")
        if err != nil {
                return []models.Tag{}
        }
        defer rows.Close()

        var tags []models.Tag
        for rows.Next() {
                var tag models.Tag
                rows.Scan(&tag.ID, &tag.Name, &tag.Color)
                tags = append(tags, tag)
        }
        return tags
}

func (h *ProductHandler) ShowAdminProducts(w http.ResponseWriter, r *http.Request) {
        user, ok := middleware.GetUserFromContext(r.Context())
        if !ok || !user.IsAdmin {
                http.Error(w, "Access denied", http.StatusForbidden)
                return
        }

        // Get all products including sold ones for admin
        rows, err := h.db.Query(`
                SELECT p.id, p.title, p.description, p.price, p.category_id, p.is_sold,
                       p.image_url, p.created_at, p.updated_at,
                       c.name as category_name
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                ORDER BY p.created_at DESC`)
        if err != nil {
                http.Error(w, "Database error", http.StatusInternalServerError)
                return
        }
        defer rows.Close()

        var products []models.Product
        for rows.Next() {
                var p models.Product
                var categoryName sql.NullString
                
                rows.Scan(&p.ID, &p.Title, &p.Description, &p.Price, &p.CategoryID,
                        &p.IsSold, &p.ImageURL, &p.CreatedAt, &p.UpdatedAt, &categoryName)
                
                if categoryName.Valid {
                        p.Category = &models.Category{Name: categoryName.String}
                }
                products = append(products, p)
        }

        categories := h.getCategories()
        tags := h.getTags()

        data := map[string]interface{}{
                "Title":      "Управление товарами",
                "Products":   products,
                "Categories": categories,
                "Tags":       tags,
                "User":       user,
        }

        h.templates.ExecuteTemplate(w, "admin_products.html", data)
}
