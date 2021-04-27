import React from "react";
import { Route, Switch } from "react-router-dom";
import Error404Page from "../../pages/Error404Page";
import ApplicationPage from "./ApplicationPage";

const ApplicationPages: React.FunctionComponent = () => {
  return (
    <Switch>
      <Route path="/urm/apply/organizer">
        <ApplicationPage role="organizer" roleName="Organizer" />
      </Route>
      <Route path="/urm/apply/sponsor">
        <ApplicationPage role="sponsor" roleName="Sponsor" />
      </Route>
      <Route path="/urm/apply/mentor">
        <ApplicationPage role="mentor" roleName="Mentor" />
      </Route>
      <Route path="/urm/apply/volunteer">
        <ApplicationPage role="volunteer" roleName="Volunteer" />
      </Route>
      <Route path="/urm/apply/hacker">
        <ApplicationPage role="hacker" roleName="Hacker" />
      </Route>

      <Route component={Error404Page} />
    </Switch>
  );
};

export default ApplicationPages;
