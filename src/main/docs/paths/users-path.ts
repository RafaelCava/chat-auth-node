export const usersPath = {
  post: {
    tags: ["Users"],
    summary: "API para criar um usuário",
    responses: {
      201: {
        description: "Sucesso",
        content: {
          "application/json": {
            schema: {
              $ref: "#/schemas/user-without-password",
            },
          },
        },
      },
      400: {
        $ref: "#/components/badRequest",
      },
      500: {
        $ref: "#/components/serverError",
      },
    },
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/schemas/create-user-params",
          },
        },
      },
    },
  },
  get: {
    security: [
      {
        apiKeyAuth: [],
      },
    ],
    tags: ["Users"],
    summary: "API para listar todos os usuários",
    parameters: [
      {
        in: "query",
        name: "page",
        required: true,
        schema: {
          type: "integer",
          example: 1,
        },
      },
      {
        in: "query",
        name: "limit",
        required: true,
        schema: {
          example: 10,
          type: "integer",
        },
      },
    ],
    responses: {
      200: {
        description: "Sucesso",
        content: {
          "application/json": {
            schema: {
              $ref: "#/schemas/users-without-password",
            },
          },
        },
      },
      500: {
        $ref: "#/components/serverError",
      },
      403: {
        $ref: "#/components/forbidden",
      },
      400: {
        $ref: "#/components/badRequest",
      },
    },
  },
};
