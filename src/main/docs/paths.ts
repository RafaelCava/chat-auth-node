import { loginPath, roomsPath, usersPath, refreshPath } from "./paths/";

export default {
  '/auth/login': loginPath,
  '/auth/refresh': refreshPath,
  '/rooms': roomsPath,
  '/users': usersPath,
}