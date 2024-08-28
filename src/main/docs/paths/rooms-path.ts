export const roomsPath = {
  get: {
    security: [{
      apiKeyAuth: []
    }],
    tags: ['Rooms'],
    summary: 'API para listar todas as salas',
    parameters: [{
      in: 'query',
      name: 'page',
      required: true,
      schema: {
        example: 1,
        type: 'integer'
      }
    }, {
      in: 'query',
      name: 'limit',
      required: true,
      schema: {
        example: 10,
        type: 'integer'
      }
    }, {
      in: 'query',
      name: 'name',
      required: false,
      schema: {
        example: 'Sala 1',
        type: 'string'
      }
    }, {
      in: 'query',
      name: 'ownerId',
      required: false,
      schema: {
        example: '132312-123123-123123-123123',
        type: 'string'
      }
    }],
    responses: {
      201: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/rooms'
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
  }
}