import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import Divider from "@material-ui/core/Divider";

export interface GenericList {
  key: string;
  line1: string;
  linesunder: string[];
  multiline: boolean | undefined;
  icon: Component | undefined;
  detailedViewLink: string | undefined;
  detailedViewText: string | undefined;
  deleteEndpoint: string | undefined;
  deleteText: string | undefined;
}
const Home: React.FunctionComponent<GenericList> = ({
  key,
  line1,
  linesunder,
  multiline,
  icon,
  detailedViewLink,
  deleteEndpoint,
  detailedViewText,
  deleteText,
}) => {
  const a = linesunder.map((val, index) => {
    return (
      <div key={index}>
        <React.Fragment>
          <Typography
            component="span"
            variant="body2"
            className={val}
            color="textPrimary"
          ></Typography>
          {val}
        </React.Fragment>
      </div>
    );
  });

  if (multiline === false || multiline === undefined) {
    return (
      <div>
        <List className={key}>
          <ListItem alignItems="flex-start">
            <ListItemIcon> {icon}</ListItemIcon>
            <ListItemText primary={line1} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="comments">
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
        <Divider variant="inset" component="li" />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            window.open(detailedViewLink, key);
          }}
        >
          {detailedViewText}
        </Button>
        <Button variant="contained" color="primary">
          {deleteText}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <List className={key}>
        <ListItem alignItems="flex-start">
          <ListItemIcon> {icon}</ListItemIcon>
          <ListItemText primary={line1} secondary={a} />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="comments">
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      <Divider variant="inset" component="li" />
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          window.open(detailedViewLink, key);
        }}
      >
        {detailedViewText}
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          window.open(deleteEndpoint, key);
        }}
      >
        {deleteText}
      </Button>
    </div>
  );
};

export default Home;
