export const loginPath = {
  post: {
    tags: ['Auth'],
    summary: 'API para autenticar usuário',
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
      403: {
        $ref: '#/components/forbidden'
      },
      500: {
        $ref: '#/components/serverError'
      }
    },
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/loginParams'
          }
        }
      }
    }
  }
}
