import { type Request, type Response } from "express";
import { Controller } from "@/presentation/protocols";

export const adaptRoute =
  (controller: Controller) => async (req: Request, res: Response) => {
    const request = {
      ...(req.body || {}),
      ...(req.params || {}),
      ...(req.query || {}),
      userId: req.userId,
    };
    const httpResponse = await controller.handle(request);
    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      res.status(httpResponse.statusCode).json(httpResponse.body);
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message,
      });
    }
  };
