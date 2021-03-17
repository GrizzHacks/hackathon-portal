import React from "react";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import ApiClient from "../../helper/ApiClient";
import { ApiExplorerFirebaseApp } from "../../devTools/apiExplorerFirebaseConfig";
import { GenericListSchema } from "../../../../@types/generics/GenericListSchema";
import { Divider } from "@material-ui/core";

export interface GenericList {
  genericList: GenericListSchema;
  classes: any;
}

const apiClient = new ApiClient(ApiExplorerFirebaseApp);

function deleteElement(x: string | undefined) {
  if (x != undefined) apiClient.delete(x);
}

function getElement(x: string | undefined) {
  if (x != undefined) apiClient.get(x);
}

const GenericList: React.FunctionComponent<GenericList> = ({
  genericList,
  classes,
}) => {
  const UntypedComponent = genericList.icon as any;
  if (genericList.multiline === false || genericList.multiline === undefined) {
    return (
      <div>
        <List className={classes.pageTitle}>
          <ListItem>
            <ListItemIcon>
              <UntypedComponent />
            </ListItemIcon>
            <ListItemText primary={genericList.line1} />
            <ListItemSecondaryAction>
              <Button
                onClick={() => {
                  getElement(genericList.deleteEndpoint);
                }}
                variant="contained"
                color="primary"
              >
                {genericList.detailedViewText}
              </Button>
              &nbsp; &nbsp; &nbsp;
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  deleteElement(genericList.deleteEndpoint);
                }}
              >
                {genericList.deleteText}
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider component="li" variant="inset" />
        </List>
        <Divider light />
      </div>
    );
  }

  return (
    <div>
      <List className={classes.pageTitle}>
        <ListItem>
          <ListItemIcon>
            <UntypedComponent />
          </ListItemIcon>
          <ListItemText
            primary={genericList.line1}
            secondary={genericList.line2}
          />
          <ListItemSecondaryAction>
            <Button
              onClick={() => {
                getElement(genericList.deleteEndpoint);
              }}
              variant="contained"
              color="primary"
            >
              {genericList.detailedViewText}
            </Button>
            &nbsp; &nbsp; &nbsp;
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                deleteElement(genericList.deleteEndpoint);
              }}
            >
              {genericList.deleteText}
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
        <Divider component="li" variant="inset" />
      </List>
    </div>
  );
};

export default GenericList;
