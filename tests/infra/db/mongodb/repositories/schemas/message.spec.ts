import { Schema } from "mongoose";
import { messageSchema } from "@/infra/db/mongodb/schemas";

describe("Message schema", () => {
  it("Should be defined", () => {
    const sut = messageSchema;
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(Schema);
  });
});
