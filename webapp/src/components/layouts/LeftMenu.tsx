import {
  createStyles,
  Drawer,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Theme,
} from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router";
import MenuItemGroup from "../misc/MenuItemGroup";

declare interface LeftMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
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
}) => {
  const classes = useStyles();
  const routeHistory = useHistory();

  const closeLeftMenu = () => {
    setOpen(false);
  };

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
          groupName="Universal Registration Module"
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
        <ListItem button key={"menu_item_login"}>
          <ListItemText
            primary="Login"
            onClick={() => {
              routeHistory.push("/login");
              closeLeftMenu();
            }}
          />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default LeftMenu;
