import type { ExpressFunction } from "../../../@types";

const getCompanyBenefits: ExpressFunction = (req, res, next) => {
  res.status(200).send();
  next();
};

export default getCompanyBenefits;
