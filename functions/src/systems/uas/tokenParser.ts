import { logger } from "../../helpers";
import { firebaseApp } from "./../../config/firebaseConfig";
import type { ExpressFunction } from "../../@types";

const tokenParser: ExpressFunction = (req, res, next) => {
  const setPermission = setPermissionFactory(req, res, next);
  const publicPermission: UserPermission = {
    role: "PUBLIC",
  };
  const authorizationHeader = req.header("Authorization")?.split(" ");
  if (
    authorizationHeader &&
    authorizationHeader[0].toLowerCase() === "bearer"
  ) {
    firebaseApp
      .auth()
      .verifyIdToken(authorizationHeader[1])
      .then((decodedUser) => {
        firebaseApp
          .auth()
          .getUser(decodedUser.uid)
          .then((user) => {
            if (user.customClaims) {
              setPermission(user.customClaims as UserPermission);
            } else {
              logger.warn(
                `The user with the uid of ${decodedUser.uid} does not have any auth information. The user is now being treated as a PUBLIC user.`
              );
              setPermission(publicPermission);
            }
          })
          .catch((err) => {
            logger.debug(err);
            logger.warn(
              `UAS failed to get the user with the uid of ${decodedUser.uid}. The user is now being treated as a PUBLIC user.`
            );
            setPermission(publicPermission);
          });
      })
      .catch((err) => {
        logger.debug(err);
        logger.warn(
          "UAS failed to parse the bearer token. The user is now being treated as a PUBLIC user."
        );
        setPermission(publicPermission);
      });
  } else {
    setPermission(publicPermission);
  }
};

const setPermissionFactory: ExpressFunction<
  (userPermission: UserPermission) => void
> = (req, res, next) => (userPermission) => {
  res.locals.permissions = userPermission;
  logger.info(
    `Current user is a${
      res.locals.permissions.accepted
        ? "n accepted"
        : res.locals.permissions.accepted === undefined
        ? " pending"
        : "rejected"
    } ${res.locals.permissions.role.toLowerCase()}`
  );
  // Set auth to organizer for testing
  const currentPermissions: UserPermission = {
    role: "ORGANZIER",
    accepted: true,
  };
  res.locals.permissions = currentPermissions;
  next();
};

export default tokenParser;
