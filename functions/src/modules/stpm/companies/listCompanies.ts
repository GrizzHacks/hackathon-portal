import type { ExpressFunction } from "../../../@types";

const listCompanies: ExpressFunction = (req, res, next) => {
  res.status(200).send();
  next();
};

export default listCompanies;
