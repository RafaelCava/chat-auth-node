export class DatabaseConnectionError extends Error {
  constructor (database: string, error: Error) {
    super(`Could not connect to ${database}. Error: ${error.message}`)
    this.name = 'DatabaseConnectionError'
  }
}