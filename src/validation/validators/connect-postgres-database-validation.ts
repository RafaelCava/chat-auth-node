/* eslint-disable consistent-return */
import { PostgresHelper } from "@/infra/db/postgres/helpers/postgres-helper";
import { type Validation } from "@/presentation/protocols";

export class ConnectPostgresDatabaseValidation implements Validation {
  async validate(): Promise<Error> {
    try {
      if (!(await PostgresHelper.isConnected())) {
        return new Error("Postgres database not connected");
      }
    } catch (error) {
      return new Error("Postgres database not connected");
    }
  }
}
