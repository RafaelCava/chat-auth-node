import { Router } from "express";
import { adaptRoute } from "@/main/adapters";
import { makeSendMessageControllerFactory } from "@/main/factories/controllers";
import { auth } from "../middlewares";

export default (router: Router): void => {
  router.post(
    "/messages",
    auth,
    adaptRoute(makeSendMessageControllerFactory()),
  );
};
