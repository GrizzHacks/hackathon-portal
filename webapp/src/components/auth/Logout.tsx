import firebase from "firebase";
import qs from "qs";
import React, { Fragment } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { firebaseApp as FirebaseAppGlobal } from "../../config/firebaseConfig";
import { NotificationMessage } from "../misc/Notifications";

declare interface LoginBoxProps {
  firebaseApp?: firebase.app.App;
  setNotification: (notification: NotificationMessage) => void;
}

const Logout: React.FunctionComponent<LoginBoxProps> = ({
  firebaseApp,
  setNotification,
}) => {
  const firebaseAppLocal = firebaseApp ? firebaseApp : FirebaseAppGlobal;
  const routeLocation = useLocation();
  const routeHistory = useHistory();

  const getRedirectUrl = () => {
    const redirect = qs.parse(routeLocation.search.substr(1)).redirect;
    return typeof redirect === "string" ? redirect : "/";
  };

  firebaseAppLocal
    .auth()
    .signOut()
    .then(() => {
      // If the user is already logged in, redirect them to the correct page.
      setNotification({
        type: "success",
        message: "Sign Out Successful!",
        open: true,
      });
      routeHistory.replace(getRedirectUrl());
    });

  return <Fragment />;
};

export default Logout;
