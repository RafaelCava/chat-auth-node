export class RoomNameAlreadyInUseError extends Error {
  constructor() {
    super('Room name already in use');
    this.name = 'RoomNameAlreadyInUseError';
  }
}