import type { ExpressFunction } from "../../../@types";

const updateCategory: ExpressFunction = (req, res, next) => {
  res.status(200).send();
  next();
};

export default updateCategory;
