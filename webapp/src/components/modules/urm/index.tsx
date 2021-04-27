import React from "react";
import { Route, Switch } from "react-router-dom";
import Error404Page from "../../pages/Error404Page";
import RulesPages from "./RulesPages";
import QuestionPages from "./QuestionPages";

const URMPages: React.FunctionComponent = () => {
  return (
    <Switch>
      <Route path="/urm/rules" component={RulesPages} />
      <Route path="/urm/questions" component={QuestionPages} />
      <Route component={Error404Page} />
    </Switch>
  );
};

export default URMPages;
