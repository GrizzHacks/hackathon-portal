import React from "react";
import { Route, Switch } from "react-router-dom";
import { NotificationsEnabledProps } from "../../../@types/notificationsEnabledProps";
import PermissionSwitchComponent from "../../misc/PermissionSwitchComponent";
import Error404Page from "../../pages/Error404Page";
import RulesPages from "./RulesPages";
import QuestionPages from "./QuestionPages";

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

  return (
    <PermissionSwitchComponent
      organizer={{ accepted: organizerRoutes }}
      setNotification={setNotification}
    />
  );
};

export default URMPages;
