import { v4 as uuidV4 } from "uuid";

export class Message {
  public readonly id: string;

  public content: string;

  public readonly createdAt: Date;

  public readonly updatedAt: Date;

  public ownerId: string;

  public roomId: string;

  constructor(props: Omit<Message, "id" | "updatedAt">, id?: string) {
    Object.assign(this, props);

    this.id = id || uuidV4();
    this.updatedAt = new Date();
  }
}
