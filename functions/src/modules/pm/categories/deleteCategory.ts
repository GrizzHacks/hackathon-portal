import type { ExpressFunction } from "../../../@types";

const deleteCategory: ExpressFunction = (req, res, next) => {
  res.status(200).send();
  next();
};

export default deleteCategory;
