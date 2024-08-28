export const refreshPath = {
  get: {
    tags: ['Auth'],
    summary: 'API para renovar o token de autenticação',
    parameters: [
      {
        in: 'query',
        name: 'refreshToken',
        required: true,
        schema: {
          type: 'string',
          example: 'refreshToken'
        }
      }
    ],
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/authentication-result'
            }
          }
        }
      },
      400: {
        $ref: '#/components/badRequest'
      },
      401: {
        $ref: '#/components/unauthorized'
      },
      500: {
        $ref: '#/components/serverError'
      },
    }
  }
}