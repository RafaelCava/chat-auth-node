import { Router } from "express";
import { adaptRoute } from "@/main/adapters";
import {
  makeCreateUserController,
  makeListAllUsersController,
} from "@/main/factories/controllers";
import { auth } from "../middlewares";

export default (router: Router): void => {
  router.post("/users", adaptRoute(makeCreateUserController()));
  router.get("/users", auth, adaptRoute(makeListAllUsersController()));
};
