import {v4 as uuidV4} from 'uuid';
export class Room {
  public readonly id: string;
  public name: string;
  public description: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public ownerId: string;

  constructor(props: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>, id?: string) {
    Object.assign(this, props);

    this.id = id || uuidV4();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}