import {
  loginPath,
  roomsPath,
  usersPath,
  refreshPath,
  profilePath,
} from "./paths";

export default {
  "/auth/login": loginPath,
  "/auth/refresh": refreshPath,
  "/auth/profile": profilePath,
  "/rooms": roomsPath,
  "/users": usersPath,
};
