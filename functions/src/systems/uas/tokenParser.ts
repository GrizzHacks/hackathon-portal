import { logger } from "../../helpers";
import type { ExpressFunction } from "../../@types";

const tokenParser: ExpressFunction = (req, res, next) => {
  // Store the permission level of the current user
  const currentPermissions: UserPermission = {
    role: "ORGANZIER",
    accepted: true,
  };
  res.locals.permissions = currentPermissions;
  logger.info(
    `Current user is a${
      currentPermissions.accepted ? "n accepted" : " pending"
    } ${currentPermissions.role.toString().toLowerCase()}`
  );
  next();
};

export default tokenParser;
