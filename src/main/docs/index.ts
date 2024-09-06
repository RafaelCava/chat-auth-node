import components from "./components";
import schemas from "./schemas";
import paths from "./paths";

export default {
  openapi: "3.0.0",
  info: {
    title: "Chat Auth Node",
    description: "API para chat com autenticação",
    version: "1.0.0",
    license: {
      name: "MIT",
      url: "https://github.com/RafaelCava/clean-node-types/blob/master/LICENSE",
    },
    contact: {
      name: "Rafael Cavalcante",
      email: "ra.facavalcante@hotmail.com",
      url: "https://www.linkedin.com/in/rafael-cavalcantee/",
    },
  },
  servers: [
    {
      url: "/api",
    },
  ],
  tags: [
    {
      name: "Users",
    },
    {
      name: "Rooms",
    },
    {
      name: "Auth",
    },
    {
      name: "Messages",
    },
  ],
  paths,
  schemas,
  components,
};
