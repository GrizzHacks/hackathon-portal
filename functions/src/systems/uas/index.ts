import type { NextFunction, Request, Response } from "express";
import * as functions from "firebase-functions";

export default (req: Request, res: Response, next: NextFunction) => {
  // Store the permission level of the current user
  const currentPermissions: UserPermission = {
    role: "ORGANZIER",
    accepted: true,
  };
  res.locals.permissions = currentPermissions;
  functions.logger.info(
    `Current user is a${
      currentPermissions.accepted ? "n accepted" : " pending"
    } ${currentPermissions.role.toString().toLowerCase()}`
  );
  next();
};
