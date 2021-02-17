import type { ExpressFunction } from "../../../@types";

const createTier: ExpressFunction = (req, res, next) => {
  res.status(200).send();
  next();
};

export default createTier;
