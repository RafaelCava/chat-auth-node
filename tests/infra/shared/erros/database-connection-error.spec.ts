import { DatabaseConnectionError } from "@/presentation/erros";

describe("DatabaseConnectionError", () => {
  it("should be defined", () => {
    const database = "Teste Database";
    const error = new Error("Teste Error");
    const sut = new DatabaseConnectionError(database, error);
    expect(sut).toBeDefined();
  });

  it("should have a correct error message", () => {
    const database = "Teste Database";
    const error = new Error("Teste Error");
    const sut = new DatabaseConnectionError(database, error);
    expect(sut.message).toBe(
      `Could not connect to ${database}. Error: ${error.message}`,
    );
  });
});
