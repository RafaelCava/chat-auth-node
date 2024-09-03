export interface HttpResponse<B = any> {
  statusCode: number;
  body: B;
}
