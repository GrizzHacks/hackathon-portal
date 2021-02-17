import type { ExpressFunction } from "../../../@types";

const getTier: ExpressFunction = (req, res, next) => {
  res.status(200).send();
  next();
};

export default getTier;
