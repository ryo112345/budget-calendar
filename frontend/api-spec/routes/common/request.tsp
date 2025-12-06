import "@typespec/http";

using Http;

alias SecuritySchema = ApiKeyAuth<ApiKeyLocation.cookie, "token">;
