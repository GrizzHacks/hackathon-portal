import React from "react";
import { Route, Switch } from "react-router-dom";
import { NotificationsEnabledProps } from "../../../@types/notificationsEnabledProps";
import PermissionSwitchComponent from "../../misc/PermissionSwitchComponent";
import Error404Page from "../../pages/Error404Page";
import EventsPages from "./EventsPages";
import TimeslotsPages from "./TimeslotsPages";
import TypesPages from "./TypesPages";

const MEWMPages: React.FunctionComponent<NotificationsEnabledProps> = ({
  setNotification,
}) => {
  const organizerRoutes = (
    <Switch>
      <Route path="/mewm/events" component={EventsPages} />
      <Route path="/mewm/timeslots" component={TimeslotsPages} />
      <Route path="/mewm/types" component={TypesPages} />
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

export default MEWMPages;
