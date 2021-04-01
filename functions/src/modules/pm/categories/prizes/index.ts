import type { Express } from "express";
import createPrize from "./createPrize";
import deletePrize from "./deletePrize";
import getPrize from "./getPrize";
import listPrizes from "./listPrize";
import updatePrize from "./updatePrize";

export default (app: Express, endpoint: string) => {
  app.get(`${endpoint}/`, listPrizes);
  app.get(`${endpoint}/:prizeId`, getPrize);
  app.post(`${endpoint}/`, createPrize);
  app.patch(`${endpoint}/:prizeId`, updatePrize);
  app.delete(`${endpoint}/:prizeId`, deletePrize);
};
