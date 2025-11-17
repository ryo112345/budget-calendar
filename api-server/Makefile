PATH := $(PATH):$(GOPATH)/bin

gen-schema:
	@oapi-codegen -config oapi_codegen_config.yaml -package api apis/schema/openapi.yaml > apis/openapi.go
