import { Express } from "express";
import request from "supertest";
import { setupApp } from "@/main/config/app";

let app: Express;

jest.mock("@/infra/db/mongodb/helpers/mongo-helper");

describe("BodyParser", () => {
  beforeAll(async () => {
    app = await setupApp();
  });

  test("Should parse body as json", async () => {
    app.post("/test_body_parser", (req, res) => {
      res.send(req.body);
    });
    await request(app)
      .post("/test_body_parser")
      .send({ name: "any_name" })
      .expect({ name: "any_name" });
  });
});
