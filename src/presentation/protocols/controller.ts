import { type HttpResponse } from "./http";

export interface Controller<Request = any, Data = any> {
  handle: (request: Request) => Promise<HttpResponse<Data>>;
}
