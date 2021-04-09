import React from "react";
import { Route, Switch } from "react-router-dom";
import Error404Page from "../../pages/Error404Page";
import CompaniesPages from "./CompaniesPages";
import TiersPages from "./TiersPages";

const STPMPages: React.FunctionComponent = () => {
  return (
    <Switch>
      <Route path="/stpm/tiers" component={TiersPages} />
      <Route path="/stpm/companies" component={CompaniesPages} />
      <Route component={Error404Page} />
    </Switch>
  );
};

export default STPMPages;
