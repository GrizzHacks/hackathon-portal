import React from "react";
import { Route, Switch } from "react-router-dom";
import Error404Page from "../../pages/Error404Page";
import CategoriesPages from "./CategoriesPages";
import GroupsPages from "./GroupsPages";

const PMPages: React.FunctionComponent = () => {
  return (
    <Switch>
      <Route path="/pm/categories" component={CategoriesPages} />
      <Route path="/pm/groups" component={GroupsPages} />
      <Route component={Error404Page} />
    </Switch>
  );
};

export default PMPages;
