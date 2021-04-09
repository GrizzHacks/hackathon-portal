import Button from "@material-ui/core/Button";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import { useHistory } from "react-router";
import { apiClient } from "../../helper";

declare interface GenericList {
  itemInfo: GenericListItemInfo;
}

const GenericListItem: React.FunctionComponent<GenericList> = ({
  itemInfo,
}) => {
  const UntypedComponent = itemInfo.icon as any;
  const routeHistory = useHistory();

  const deleteElement = (x: string | undefined) => {
    if (x != undefined) apiClient.delete(x);
  };

  const getElement = (x: string | undefined) => {
    if (x != undefined) routeHistory.push(x);
  };

  if (itemInfo.multiline === false || itemInfo.multiline === undefined) {
    return (
      <ListItem>
        <ListItemIcon>
          <UntypedComponent />
        </ListItemIcon>
        <ListItemText primary={itemInfo.line1} secondary={itemInfo.line2} />
        <ListItemSecondaryAction>
          <Button
            onClick={() => {
              getElement(itemInfo.detailedViewLink);
            }}
            variant="contained"
            color="primary"
          >
            {itemInfo.detailedViewText}
          </Button>
          &nbsp; &nbsp; &nbsp;
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              deleteElement(itemInfo.deleteEndpoint);
            }}
          >
            {itemInfo.deleteText}
          </Button>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }

  return (
    <ListItem>
      <ListItemIcon>
        <UntypedComponent />
      </ListItemIcon>
      <ListItemText primary={itemInfo.line1} secondary={itemInfo.line2} />
      <ListItemSecondaryAction>
        <Button
          onClick={() => {
            getElement(itemInfo.detailedViewLink);
          }}
          variant="contained"
          color="primary"
        >
          {itemInfo.detailedViewText}
        </Button>
        &nbsp; &nbsp; &nbsp;
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            deleteElement(itemInfo.deleteEndpoint);
          }}
        >
          {itemInfo.deleteText}
        </Button>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default GenericListItem;
