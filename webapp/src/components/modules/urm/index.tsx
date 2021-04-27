import React from "react";
import { Route, Switch } from "react-router-dom";
import { NotificationsEnabledProps } from "../../../@types/notificationsEnabledProps";
import PermissionSwitchComponent from "../../misc/PermissionSwitchComponent";
import Error404Page from "../../pages/Error404Page";
import RulesPages from "./RulesPages";
import QuestionPages from "./QuestionPages";
import ApplicationPages from "./ApplicationPages";

const URMPages: React.FunctionComponent<NotificationsEnabledProps> = ({
  setNotification,
}) => {
  const organizerRoutes = (
    <Switch>
      <Route path="/urm/rules" component={RulesPages} />
      <Route path="/urm/questions" component={QuestionPages} />
      <Route component={Error404Page} />
    </Switch>
  );

  const publicRoutes = (
    <Switch>
      <Route path="/urm/apply" component={ApplicationPages} />
      <Route component={Error404Page} />
    </Switch>
  );

  return (
    <PermissionSwitchComponent
      organizer={{ accepted: organizerRoutes }}
      public={publicRoutes}
      setNotification={setNotification}
    />
  );
};

export default URMPages;
