import { RedisHelper } from "@/infra/db/redis/helpers/redis-helper";
import { Validation } from "@/presentation/protocols";

export class ConnectRedisDatabaseValidation implements Validation {
  async validate(): Promise<Error> {
    try {      
      const isConnected = await RedisHelper.isConnected()
      if (!isConnected) {
        return new Error('Redis database not connected')
      }
    } catch (error) {
      return new Error('Redis database not connected')
    }
  }
}