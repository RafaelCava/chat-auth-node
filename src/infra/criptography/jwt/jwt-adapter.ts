import { Encrypter } from '@/data/protocols/criptography/encrypter'
import jwt from 'jsonwebtoken'
import { Decrypter } from '@/data/protocols/criptography/decrypter'
export class JwtAdapter implements Encrypter, Decrypter {
  constructor (
    private readonly secret: string,
    private readonly issuer: string
  ) {}

  /**
   * Function to generate a jwt token
   * @param value string to be encrypted
   * @param expiresIn expiration on seconds or string format (eg: 1d)
   * @returns Promise<string> encrypted value
   */
  async encrypt (value: string, expiresIn: string | number = '1d'): Promise<string> {
    return jwt.sign({ 
      id: value
    }, 
    this.secret, 
    {
      expiresIn,
      issuer: this.issuer
    })
  }

  async decrypt (token: string): Promise<Decrypter.Result> {
    return await Promise.resolve(jwt.verify(
      token, 
      this.secret,
      {
        issuer: this.issuer
      }
    )) as Decrypter.Result
  }
}
