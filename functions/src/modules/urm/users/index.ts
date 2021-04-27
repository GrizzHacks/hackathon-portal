import type { Express } from "express";
import applications from "./applications";
import createUsers from "./createUser";
import deleteUsers from "./deleteUser";
import getMinimalUserByEmail from "./getMinimalUserProfileByEmail";
import getUsers from "./getUser";
import listUsers from "./listUsers";
import updateUsers from "./updateUser";

export default (app: Express, endpoint: string) => {
  app.get(`${endpoint}/:userId`, getUsers);
  app.post(`${endpoint}/`, createUsers);
  app.patch(`${endpoint}/:userId`, updateUsers);
  app.delete(`${endpoint}/:userId`, deleteUsers);
  app.get(`${endpoint}/`, listUsers);
  applications(app, `${endpoint}/:userId/applications`);

  // For the login page
  app.post(`${endpoint}-by-email`, getMinimalUserByEmail);
};
