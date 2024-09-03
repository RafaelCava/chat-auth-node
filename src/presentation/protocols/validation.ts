export interface Validation<Input = any> {
  validate: (input: Input) => Promise<Error | null>;
}
