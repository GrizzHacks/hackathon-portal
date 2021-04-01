import React from "react";
import { Route, Switch } from "react-router-dom";
import Error404Page from "../../pages/Error404Page";
import EventsPages from "./EventsPages";
import TimeslotsPages from "./TimeslotsPages";
import TypesPages from "./TypesPages";

const MEWMPages: React.FunctionComponent = () => {
  return (
    <Switch>
      <Route path="/mewm/events" component={EventsPages} />
      <Route path="/mewm/timeslots" component={TimeslotsPages} />
      <Route path="/mewm/types" component={TypesPages} />
      <Route component={Error404Page} />
    </Switch>
  );
};

export default MEWMPages;
