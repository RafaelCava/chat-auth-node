export const usersWithoutPasswordSchema = {
  type: 'array',
  items: {
    $ref: '#/schemas/user-without-password'
  }
}