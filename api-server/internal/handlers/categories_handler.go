package handlers

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/yamao/budget-calendar/internal/models"
	"github.com/yamao/budget-calendar/internal/services"
)

type CategoriesHandler struct {
	service services.CategoryService
}

func NewCategoriesHandler(service services.CategoryService) *CategoriesHandler {
	return &CategoriesHandler{service: service}
}

func (h *CategoriesHandler) FetchList(c echo.Context) error {
	userID := uint(1)

	categories, err := h.service.FetchCategoriesByUserID(userID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
	}

	return c.JSON(http.StatusOK, categories)
}

func (h *CategoriesHandler) FetchDetail(c echo.Context) error {
	userID := uint(1)

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid ID",
		})
	}

	category, err := h.service.FetchCategoryByID(uint(id), userID)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Category not found",
		})
	}

	return c.JSON(http.StatusOK, category)
}

func (h *CategoriesHandler) Create(c echo.Context) error {
	userID := uint(1)

	var req struct {
		Name  string `json:"name"`
		Color string `json:"color"`
	}

	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid request",
		})
	}

	category := &models.Category{
		UserID: userID,
		Name:   req.Name,
		Color:  req.Color,
	}

	if err := h.service.CreateCategory(category); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
	}

	return c.JSON(http.StatusCreated, category)
}

func (h *CategoriesHandler) Update(c echo.Context) error {
	userID := uint(1)

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid ID",
		})
	}

	var req struct {
		Name  *string `json:"name"`
		Color *string `json:"color"`
	}

	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid request",
		})
	}

	updates := make(map[string]interface{})
	if req.Name != nil {
		updates["name"] = *req.Name
	}
	if req.Color != nil {
		updates["color"] = *req.Color
	}

	if err := h.service.UpdateCategory(uint(id), userID, updates); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Category updated",
	})
}

func (h *CategoriesHandler) Delete(c echo.Context) error {
	userID := uint(1)

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid ID",
		})
	}

	if err := h.service.DeleteCategory(uint(id), userID); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Category deleted",
	})
}
