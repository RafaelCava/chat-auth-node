import { Express } from "express";
import request from "supertest";
import { setupApp } from "@/main/config/app";

let app: Express;

jest.mock("@/infra/db/mongodb/helpers/mongo-helper");

describe("Content Type middleware", () => {
  beforeAll(async () => {
    app = await setupApp();
  });

  test("Should return default content type as json", async () => {
    app.get("/test_content_type", (req, res) => {
      res.send("");
    });
    await request(app)
      .get("/test_content_type")
      .expect("content-type", /json/gi);
  });
  test("Should return xml content type when forced", async () => {
    app.get("/test_content_type_xml", (req, res) => {
      res.type("xml");
      res.send("");
    });
    await request(app)
      .get("/test_content_type_xml")
      .expect("content-type", /xml/gi);
  });
});
