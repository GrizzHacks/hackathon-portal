import {
  Collapse,
  createStyles,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Theme,
} from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React, { Fragment } from "react";
import { useHistory } from "react-router";

declare interface MenuItemGroupProps {
  groupName: string;
  groupItems: { label: string; route: string }[];
  closeLeftMenu: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    nested: {
      paddingLeft: theme.spacing(4),
    },
  })
);

const MenuItemGroup: React.FunctionComponent<MenuItemGroupProps> = ({
  groupName,
  groupItems,
  closeLeftMenu,
}) => {
  const classes = useStyles();
  const routeHistory = useHistory();

  const [groupOpen, setGroupOpen] = React.useState<boolean>(true);

  return (
    <Fragment>
      <ListItem
        key={`menu_group_${groupName}`}
        button
        onClick={() => {
          setGroupOpen(!groupOpen);
        }}
      >
        <ListItemText primary={groupName} />
        {groupOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={groupOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {groupItems.map((item) => {
            return (
              <ListItem
                key={`menu_group_${groupName}_item_${item.label}`}
                button
                className={classes.nested}
              >
                <ListItemText
                  primary={item.label}
                  onClick={() => {
                    routeHistory.push(item.route);
                    closeLeftMenu();
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    </Fragment>
  );
};

export default MenuItemGroup;
