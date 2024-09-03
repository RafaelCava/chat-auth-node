export interface Decrypter {
  decrypt: (value: string) => Promise<Decrypter.Result>;
}

export namespace Decrypter {
  export type Result = {
    id: string;
  };
}
