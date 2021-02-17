import type { ExpressFunction } from "../../../@types";

const updateTier: ExpressFunction = (req, res, next) => {
  res.status(200).send();
  next();
};

export default updateTier;
