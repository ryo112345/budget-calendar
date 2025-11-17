import "@typespec/http";
import "@typespec/openapi";
import "@typespec/openapi3";

using Http;

@service
@doc("Budget Calendar API")
@OpenAPI.info(#{
  version: "1.0",
  title: "Budget Calendar Service"
})
@server("http://localhost:8080")
namespace BudgetCalendarService {};
