import React from "react";
import { Route, Switch } from "react-router-dom";
import Error404Page from "../../pages/Error404Page";
import RulesPages from "./RulesPages";

const URMPages: React.FunctionComponent = () => {
  return (
    <Switch>
      <Route path="/urm/rules" component={RulesPages} />
      <Route component={Error404Page} />
    </Switch>
  );
};

export default URMPages;
