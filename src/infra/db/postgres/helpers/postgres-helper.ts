import { PrismaClient } from '@prisma/client'

export class PostgresHelper {
  static client: PrismaClient = null
  static async connect (): Promise<void> {
    this.client = new PrismaClient()
    await this.client.$connect()
    this.startListeners()
  }
  static async disconnect (): Promise<void> {
    await this.client.$disconnect()
    this.client = null
  }
  static startListeners (): void {
    if (process.env.NODE_ENV === 'development') {
      this.client.$on('query' as never, (event: any) => {
        console.log('Query: ' + event.query)
        console.log('Params: ' + event.params)
        console.log('Duration: ' + event.duration + 'ms')
      })
    }
  }
  static async isConnected (): Promise<boolean> {
    return !!await this.client.$executeRaw`SELECT 1;`
  }
}