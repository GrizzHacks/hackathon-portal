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

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <List className={classes.root}>
        <ListItem button key={"menu_item_home"}>
          <ListItemText
            primary="Home"
            onClick={() => {
              routeHistory.push("/");
              setOpen(false);
            }}
          />
        </ListItem>
        <MenuItemGroup
          groupName="Developer Tools"
          groupItems={[{ label: "API Explorer", route: "/api-explorer" }]}
          closeLeftMenu={() => {
            setOpen(!open);
          }}
        />
        <ListItem button key={"menu_item_login"}>
          <ListItemText
            primary="Login"
            onClick={() => {
              routeHistory.push("/login");
              setOpen(false);
            }}
          />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default LeftMenu;
