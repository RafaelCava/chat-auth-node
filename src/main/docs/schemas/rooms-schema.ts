export const roomsSchema = {
  type: 'array',
  items: {
    $ref: '#/schemas/room'
  }
}
