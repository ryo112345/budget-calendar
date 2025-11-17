import "@typespec/http";

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

model BadRequestErrorResponse<T> {
  @statusCode status: 400;
  @body body: T;
}

model NotFoundErrorResponse {
  @statusCode status: 404;
  @body body: {
    message: string;
  };
}

model InternalServerErrorResponse {
  @statusCode status: 500;
  @body body: {
    message: string;
  };
}
