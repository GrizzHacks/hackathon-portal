import type { ExpressFunction } from "../../../@types";

const listTiers: ExpressFunction = (req, res, next) => {
  res.status(200).send();
  next();
};

export default listTiers;
