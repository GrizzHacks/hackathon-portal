import React from "react";
import { Route, Switch } from "react-router-dom";
import { NotificationsEnabledProps } from "../../../@types/notificationsEnabledProps";
import PermissionSwitchComponent from "../../misc/PermissionSwitchComponent";
import Error404Page from "../../pages/Error404Page";
import CategoriesPages from "./CategoriesPages";
import GroupsPages from "./GroupsPages";

const PMPages: React.FunctionComponent<NotificationsEnabledProps> = ({
  setNotification,
}) => {
  const organizerRoutes = (
    <Switch>
      <Route path="/pm/categories" component={CategoriesPages} />
      <Route path="/pm/groups" component={GroupsPages} />
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

export default PMPages;
