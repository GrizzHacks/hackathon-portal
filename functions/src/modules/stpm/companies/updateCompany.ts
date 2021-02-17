import type { ExpressFunction } from "../../../@types";

const updateCompany: ExpressFunction = (req, res, next) => {
  res.status(200).send();
  next();
};

export default updateCompany;
