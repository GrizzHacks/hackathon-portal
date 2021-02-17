import type { ExpressFunction } from "../../../@types";

const getCompany: ExpressFunction = (req, res, next) => {
  res.status(200).send();
  next();
};

export default getCompany;
