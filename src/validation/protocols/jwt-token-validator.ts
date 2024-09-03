export interface JwtTokenValidator {
  isJwt: (token: string) => boolean;
}
