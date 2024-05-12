import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { type Validation } from '@/presentation/protocols'

export class ConnectMongoDatabaseValidation implements Validation {
  validate(input: any): Promise<Error> {
    return new Promise((resolve, reject) => {
      if (!MongoHelper.isConnected()) {
        reject(new Error('Mongo database not connected'))
      }
      resolve(null)
    })
  }
}