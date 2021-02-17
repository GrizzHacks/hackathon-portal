import type { ExpressFunction } from "../../../@types";

const deleteTier: ExpressFunction = (req, res, next) => {
  res.status(200).send();
  next();
};

export default deleteTier;
