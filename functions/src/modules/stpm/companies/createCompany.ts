import type { ExpressFunction } from "../../../@types";

const createCompany: ExpressFunction = (req, res, next) => {
  res.status(200).send();
  next();
};

export default createCompany;
