import { Button, Container, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import { NotificationsEnabledProps } from "../../@types/notificationsEnabledProps";
import { firebaseApp } from "../../config/firebaseConfig";
import { apiClient } from "../../helper";
import { styles } from "../../styles";
import PermissionSwitchComponent from "../misc/PermissionSwitchComponent";

const Home: React.FunctionComponent<NotificationsEnabledProps> = ({
  setNotification,
}) => {
  const classes = styles();

  const AllUsers: React.FunctionComponent = () => {
    const [object, setObject] = React.useState<any>({});

    const [loaded, setLoaded] = React.useState<boolean>(false);

    const refreshProfileView = (id: string) => {
      apiClient
        .get(`urm/users/${id}`)
        .then((object) => {
          object.json().then((objectJson) => {
            setObject(objectJson as URMUser);
          });
        })
        .catch(() => {});
    };

    // Get the userId of the current user
    const listener = firebaseApp.auth().onAuthStateChanged((user) => {
      if (user) {
        if (!loaded) {
          setLoaded(true);
          refreshProfileView(user.uid);
        }
      }
      // Only make one update at the beginning
      listener();
    });

    return (
      <Fragment>
        <Typography variant="h5">Role:</Typography>
        <Typography variant="body1">{object.role}</Typography>
        <Typography variant="h5">Application Status</Typography>
        <Typography variant="body1">{object.accepted}</Typography>
      </Fragment>
    );
  };

  return (
    <Fragment>
      <Typography variant="h3">Welcome to Hackathon Portal!</Typography>
      <PermissionSwitchComponent
        setNotification={setNotification}
        organizer={<AllUsers />}
        sponsor={<AllUsers />}
        mentor={<AllUsers />}
        volunteer={<AllUsers />}
        hacker={<AllUsers />}
        public={<Fragment />}
      />
    </Fragment>
  );
};

export default Home;
