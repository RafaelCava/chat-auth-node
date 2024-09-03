export interface Encrypter {
  encrypt: (value: string, expiresIn?: string | number) => Promise<string>;
}
