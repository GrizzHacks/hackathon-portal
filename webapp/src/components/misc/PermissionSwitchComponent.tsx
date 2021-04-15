import React, { Fragment } from "react";
import { useHistory, useLocation } from "react-router-dom";
import ErrorPage from "../pages/ErrorPage";
import { NotificationMessage } from "../misc/Notifications";
import { firebaseApp } from "../../config/firebaseConfig";

declare interface PermissionSwitchComponentProps
  extends UASPermissionSwitchConfig<JSX.Element> {
  setNotification: (notification: NotificationMessage) => void;
}

const PermissionSwitchComponent: React.FunctionComponent<PermissionSwitchComponentProps> = ({
  organizer: organizerContent,
  sponsor: sponsorContent,
  mentor: mentorContent,
  volunteer: volunteerContent,
  hacker: hackerContent,
  public: publicContent,
  setNotification,
}) => {
  const routeLocation = useLocation();
  const routeHistory = useHistory();

  const [content, setContent] = React.useState<JSX.Element>(<Fragment />);
  const [loaded, setLoaded] = React.useState<boolean>(false);

  const loginRedirect = () => {
    const redirectBackTo = routeLocation.pathname;
    setNotification({
      type: "warning",
      message: "Please login to access this page.",
      open: true,
    });
    routeHistory.replace(`/login?redirect=${redirectBackTo}`);
  };

  const extractRelevantConfiguration = (userPermission: UserPermission) => {
    switch (userPermission.role) {
      case "ORGANIZER":
        return organizerContent;
      case "SPONSOR":
        return sponsorContent;
      case "MENTOR":
        return mentorContent;
      case "VOLUNTEER":
        return volunteerContent;
      case "HACKER":
        return hackerContent;
      default:
        return null;
    }
  };

  if (!loaded) {
    setLoaded(true);
    // Get the user's authorization information
    const listener = firebaseApp.auth().onAuthStateChanged((user) => {
      // Remove loading message once Firebase Auth loads
      if (user) {
        user
          .getIdTokenResult()
          .then((results) => {
            const userPermission = results.claims as UserPermissionCustomClaim;
            const configuration = extractRelevantConfiguration(userPermission);
            if (configuration === null) {
              console.log(
                `Unable to determine the user's role! The current user's role: ${userPermission.role}`
              );
              setContent(
                <ErrorPage
                  errorCode={500}
                  errorMessage={"Something went wrong. Please try again later."}
                />
              );
            } else {
              setContent(
                <DisplayContentOrErrorPage
                  content={extractContent(
                    userPermission.accepted,
                    configuration
                  )}
                />
              );
            }
          })
          .catch((err) => {
            console.log(err);
            setContent(
              <ErrorPage
                errorCode={500}
                errorMessage={"Something went wrong. Please try again later."}
              />
            );
          });
      } else {
        // If there is no user, then it is PUBLIC
        if (publicContent) {
          setContent(publicContent);
        } else {
          loginRedirect();
        }
      }
      // Only make one update at the beginning
      listener();
    });
  }

  return content;
};

const isContentConfig = (
  config?: UASPermissionSwitchCallbackConfig<JSX.Element> | JSX.Element
) => {
  return (
    (config as UASPermissionSwitchCallbackConfig<JSX.Element>).accepted !==
      undefined ||
    (config as UASPermissionSwitchCallbackConfig<JSX.Element>).pending !==
      undefined ||
    (config as UASPermissionSwitchCallbackConfig<JSX.Element>).rejected !==
      undefined
  );
};

const extractContent = (
  userAccpeted?: boolean,
  contentConfig?: JSX.Element | UASPermissionSwitchCallbackConfig<JSX.Element>
) => {
  if (contentConfig && isContentConfig(contentConfig)) {
    return userAccpeted
      ? (contentConfig as UASPermissionSwitchCallbackConfig<JSX.Element>)
          .accepted
      : userAccpeted === undefined
      ? (contentConfig as UASPermissionSwitchCallbackConfig<JSX.Element>)
          .pending
      : (contentConfig as UASPermissionSwitchCallbackConfig<JSX.Element>)
          .rejected;
  } else if (contentConfig) {
    return contentConfig as JSX.Element;
  }
  return undefined;
};

const DisplayContentOrErrorPage: React.FunctionComponent<{
  content?: JSX.Element;
  errorPage?: JSX.Element;
}> = ({ content, errorPage }) => {
  if (content) {
    return content;
  } else {
    if (errorPage) {
      return errorPage;
    } else {
      return (
        <ErrorPage
          errorCode={403}
          errorMessage={"Sorry, you do not have access to this page."}
        />
      );
    }
  }
};

export default PermissionSwitchComponent;
