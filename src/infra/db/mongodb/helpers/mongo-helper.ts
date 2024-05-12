import mongoose from 'mongoose'

export class MongoHelper {
  static client: mongoose.Connection = null
  static async connect (uri: string): Promise<void> {
    if ([1, 2].includes(this.client?.readyState)) return
    this.client = mongoose.createConnection(uri)
    this.startListeners()
    await this.client.asPromise()
  }

  static startListeners (): void {
    if (process.env.NODE_ENV === 'development') {
      /* istanbul ignore next */
      this.client.on('connected', () => { console.log('MongoDB connected') })
      /* istanbul ignore next */
      this.client.on('disconnected', () => { console.log('MongoDB disconnected') })
    }
  }

  static async disconnect (): Promise<void> {
    await this.client.close()
  }

  static getModel<T> (model: string, schema: any): mongoose.Model<T> {
    return this.client.model(model, schema) as unknown as mongoose.Model<T>
  }

  static isConnected (): boolean {
    return this.client?.readyState === 1
  }

  static map<T = any> (collection: any): T {
    /* istanbul ignore next */
    if (collection?.length) {
      return collection.map((c: any) => this.map(c))
    }
    const { _id, ...collectionWithoutId } = collection
    return Object.assign({}, collectionWithoutId, { id: _id })
  }
}