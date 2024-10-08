import jwt from "jsonwebtoken";
import { JwtAdapter } from "@/infra/criptography/jwt/jwt-adapter";

jest.mock("jsonwebtoken", () => ({
  async sign(): Promise<string> {
    return Promise.resolve("any_token");
  },
  async verify(): Promise<string> {
    return Promise.resolve("any_token");
  },
}));

const makeSut = (secret: string, issuer: string): JwtAdapter =>
  new JwtAdapter(secret, issuer);

describe("Jwt Adapter", () => {
  describe("sign()", () => {
    test("Should call sign with correct values", async () => {
      const sut = makeSut("secret", "issuer");
      const signSpy = jest.spyOn(jwt, "sign");
      await sut.encrypt("any_id");
      expect(signSpy).toHaveBeenCalledWith({ id: "any_id" }, "secret", {
        expiresIn: "1d",
        issuer: "issuer",
      });
    });

    test("Should return a encrypt value on sign succeeds", async () => {
      const sut = makeSut("secret", "issuer");
      const encrypteValue = await sut.encrypt("any_id");
      expect(encrypteValue).toBe("any_token");
    });

    test("Should throws if sign throws", async () => {
      const sut = makeSut("secret", "issuer");
      jest.spyOn(jwt, "sign").mockImplementationOnce(() => {
        throw new Error();
      });
      const promise = sut.encrypt("any_id");
      await expect(promise).rejects.toThrow();
    });
  });

  describe("verify()", () => {
    test("Should call decrypt with correct values", async () => {
      const secret = "secret";
      const issuer = "issuer";
      const sut = makeSut(secret, issuer);
      const verifySpy = jest.spyOn(jwt, "verify");
      await sut.decrypt("any_token");
      expect(verifySpy).toHaveBeenCalledWith("any_token", secret, { issuer });
    });

    test("Should return a value on verify succeeds", async () => {
      const secret = "secret";
      const issuer = "issuer";
      const sut = makeSut(secret, issuer);
      const value = await sut.decrypt("any_token");
      expect(value).toBeTruthy();
      expect(value).toBe("any_token");
    });

    test("Should throws if verify throws", async () => {
      const sut = makeSut("secret", "issuer");
      jest.spyOn(jwt, "verify").mockImplementationOnce(() => {
        throw new Error();
      });
      const promise = sut.decrypt("any_id");
      await expect(promise).rejects.toThrow();
    });
  });
});
