export class User {
  public readonly id: string;
  public name: string;
  public email: string;
  public password: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: Omit<User, 'id' | 'createdAt' | 'updatedAt'>, id?: string) {
    Object.assign(this, props);

    this.id = id || '';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}