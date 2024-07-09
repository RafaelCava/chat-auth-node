import { DatabaseConnectionError } from '@/presentation/erros';
import env from '@/main/config/env';
import {createClient, RedisClientType, SetOptions} from 'redis';

export class RedisHelper {
  static client: RedisClientType = null
  static async connect (urlConnection: string): Promise<void> {
    try {
      this.client = createClient({
        url: urlConnection
      })
      this.startListeners()
      await this.client.connect()
    } catch (error) {
      throw new DatabaseConnectionError('Redis', error)
    }
  }

  static startListeners (): void {
    if (env.env !== 'development') return
    this.client.on('error', (err) => {
      console.error('Erro de conexão com o Redis:', err);
    }); 
    
    // Evento de conexão
    this.client.on('connect', () => {
        console.log('Redis connected');
    });
    
    // Evento de desconexão
    this.client.on('end', () => {
        console.log('Cliente Redis desconectado');
    });
    
    // Evento de tentativa de reconexão
    this.client.on('reconnecting', (delay, attempt) => {
        console.log(`Tentando reconectar ao Redis: tentativa ${attempt} em ${delay}ms`);
    });
  }

  static async disconnect (): Promise<void> {
    await this.client.quit()
    this.client = null
  }

  static async set (key: string, value: string, EX: number): Promise<void> {
    const options: SetOptions = {
      EX,
      NX: true
    }
    await this.client.set(key, value, options)
  }

  static async get (key: string): Promise<string> {
    return await this.client.get(key)
  }

  static async isConnected (): Promise<boolean> {
    return !!await this.client?.ping()
  }
}