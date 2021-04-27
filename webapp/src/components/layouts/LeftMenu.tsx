import {
  createStyles,
  Drawer,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Theme,
} from "@material-ui/core";
import React, { Fragment } from "react";
import { useHistory } from "react-router";
import MenuItemGroup from "../misc/MenuItemGroup";
import { NotificationMessage } from "../misc/Notifications";
import PermissionSwitchComponent from "../misc/PermissionSwitchComponent";

declare interface LeftMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentUserProfile: firebase.default.User | null;
  setNotification: (notification: NotificationMessage) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  })
);

const LeftMenu: React.FunctionComponent<LeftMenuProps> = ({
  open,
  setOpen,
  currentUserProfile,
  setNotification,
}) => {
  const classes = useStyles();
  const routeHistory = useHistory();

  const closeLeftMenu = () => {
    setOpen(false);
  };

  const organizerMenu = (
    <Fragment>
      <MenuItemGroup
        groupName="Sponsor Tiers and Permissions"
        groupItems={[
          { label: "Sponsor Tiers", route: "/stpm/tiers" },
          { label: "Sponsor Companies", route: "/stpm/companies" },
        ]}
        closeLeftMenu={closeLeftMenu}
      />
      <MenuItemGroup
        groupName="Prizes"
        groupItems={[
          { label: "Prize Groups", route: "/pm/groups" },
          { label: "Prize Categories", route: "/pm/categories" },
        ]}
        closeLeftMenu={closeLeftMenu}
      />
      <MenuItemGroup
        groupName="Mini-Events and Workshops"
        groupItems={[
          { label: "Events", route: "/mewm/events" },
          { label: "Time Slots", route: "/mewm/timeslots" },
          { label: "Event Types", route: "/mewm/types" },
        ]}
        closeLeftMenu={closeLeftMenu}
      />
      <MenuItemGroup
        groupName="User Registration Module"
        groupItems={[
          { label: "Application Rules", route: "/urm/rules" },
          { label: "Questions", route: "/urm/questions" },
        ]}
        closeLeftMenu={closeLeftMenu}
      />
      <MenuItemGroup
        groupName="Developer Tools"
        groupItems={[{ label: "API Explorer", route: "/api-explorer" }]}
        closeLeftMenu={closeLeftMenu}
      />
    </Fragment>
  );

  const publicMenu = (
    <MenuItemGroup
      groupName="Apply Now"
      groupItems={[
        { label: "Organizer Application", route: "/urm/apply/organizer" },
        { label: "Sponsor Application", route: "/urm/apply/sponsor" },
        { label: "Mentor Application", route: "/urm/apply/mentor" },
        { label: "Volunteer Application", route: "/urm/apply/volunteer" },
        { label: "Hacker Application", route: "/urm/apply/hacker" },
      ]}
      closeLeftMenu={closeLeftMenu}
    />
  );

  return (
    <Drawer anchor="left" open={open} onClose={closeLeftMenu}>
      <List className={classes.root}>
        <ListItem button key={"menu_item_home"}>
          <ListItemText
            primary="Home"
            onClick={() => {
              routeHistory.push("/");
              closeLeftMenu();
            }}
          />
        </ListItem>
        <PermissionSwitchComponent
          organizer={{
            accepted: organizerMenu,
            pending: <Fragment />,
            rejected: <Fragment />,
          }}
          sponsor={<Fragment />}
          mentor={<Fragment />}
          volunteer={<Fragment />}
          hacker={<Fragment />}
          public={publicMenu}
          setNotification={setNotification}
        />
        {currentUserProfile ? (
          <Fragment>
            <ListItem button key={"menu_item_profile"}>
              <ListItemText
                primary="Profile"
                onClick={() => {
                  routeHistory.push("/profile");
                  closeLeftMenu();
                }}
              />
            </ListItem>
            <ListItem button key={"menu_item_logout"}>
              <ListItemText
                primary="Logout"
                onClick={() => {
                  routeHistory.push("/logout");
                  closeLeftMenu();
                }}
              />
            </ListItem>
          </Fragment>
        ) : (
          <ListItem button key={"menu_item_login"}>
            <ListItemText
              primary="Login"
              onClick={() => {
                routeHistory.push("/login");
                closeLeftMenu();
              }}
            />
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};

export default LeftMenu;
