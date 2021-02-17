import type { ExpressFunction } from "../../../@types";

const deleteCompany: ExpressFunction = (req, res, next) => {
  res.status(200).send();
  next();
};

export default deleteCompany;
