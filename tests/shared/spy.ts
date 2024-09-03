export interface Spy<Params = any, Result = any> {
  params: Params;
  count: number;
  returnError: boolean;
  returnNull?: boolean;
  errorValue: Error;
  result: Result;
}
