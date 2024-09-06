import {
  loginPath,
  roomsPath,
  usersPath,
  refreshPath,
  profilePath,
  messagesPath,
} from "./paths/";

export default {
  "/auth/login": loginPath,
  "/auth/refresh": refreshPath,
  "/auth/profile": profilePath,
  "/rooms": roomsPath,
  "/users": usersPath,
  "/messages": messagesPath,
};
