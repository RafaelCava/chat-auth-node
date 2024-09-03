import { PrismaClient } from "@prisma/client";

export class PostgresHelper {
  static client: PrismaClient = null;

  static async connect(): Promise<void> {
    this.client = new PrismaClient();
    await this.client.$connect();
    this.startListeners();
  }

  static formateProjection(projection: string[]): Record<string, boolean> {
    const select = {};
    projection?.forEach((key) => {
      select[key] = true;
    });
    return select;
  }

  static async disconnect(): Promise<void> {
    await this.client.$disconnect();
    this.client = null;
  }

  static startListeners(): void {
    if (process.env.NODE_ENV === "development") {
      this.client.$on("query" as never, (event: any) => {
        // eslint-disable-next-line no-console
        console.log(`Query: ${event.query}`);
        // eslint-disable-next-line no-console
        console.log(`Params: ${event.params}`);
        // eslint-disable-next-line no-console
        console.log(`Duration: ${event.duration}ms`);
      });
      // eslint-disable-next-line no-console
      console.log("Postgres connected");
    }
  }

  static async isConnected(): Promise<boolean> {
    return !!(await this.client.$executeRaw`SELECT 1;`);
  }
}
