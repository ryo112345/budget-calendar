import "@typespec/http";
import "./error.tsp";

using Http;

model SuccessResponse<T> {
  @statusCode status: 200;
  @body body: T;
}

model CreatedSuccessResponse<T> {
  @statusCode status: 201;
  @body body: T;
}

model NoContentSuccessResponse {
  @statusCode status: 204;
}

model NotFoundErrorResponse {
  @statusCode status: 404;
  @header contentType: "application/json";
  @body body: ErrorBody;
}
