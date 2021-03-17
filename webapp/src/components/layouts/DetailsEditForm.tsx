import {
  Fab,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";
import EditIcon from "@material-ui/icons/Edit";
import React from "react";

declare interface DetailsEditFormProps {
  attributeName: string;
  attributeValue: any;
  allowEmptyString?: boolean;
  attributeTypeIsNumber?: boolean;
  attributeOptions?: any[];
  handleUpdate: (newValue: any) => void;
  createOnly?: boolean;
  classes: any;
}

const DetailsEditForm: React.FunctionComponent<DetailsEditFormProps> = ({
  attributeName,
  attributeValue,
  allowEmptyString,
  attributeTypeIsNumber,
  attributeOptions,
  handleUpdate,
  createOnly,
  classes,
}) => {
  const [temp, setTemp] = React.useState<any>(attributeValue);
  const [currentValue, setCurrentValue] = React.useState<any>(attributeValue);
  const [editing, setEditing] = React.useState(createOnly);

  const startEditing = () => {
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setTemp(currentValue);
  };

  const saveAttribute = () => {
    setEditing(false);
    setCurrentValue(temp);
    handleUpdate(temp);
  };

  const handleAttributeValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTemp(event.target.value);
  };

  return (
    <ListItem key={attributeName}>
      <ListItemText
        primary={attributeName}
        secondary={
          editing ? (
            <TextField
              fullWidth
              value={temp}
              onChange={handleAttributeValueChange}
              variant="outlined"
            />
          ) : (
            temp
          )
        }
      />
      {editing && (
        <ListItemIcon className={classes.marginLeft}>
          <Fab
            color="primary"
            size="small"
            onClick={() => {
              saveAttribute();
            }}
          >
            <DoneIcon />
          </Fab>
        </ListItemIcon>
      )}

      <ListItemSecondaryAction>
        {editing ? (
          <Fab
            color="primary"
            size="small"
            onClick={() => {
              cancelEditing();
            }}
          >
            <ClearIcon />
          </Fab>
        ) : (
          <Fab
            color="primary"
            size="small"
            onClick={() => {
              startEditing();
            }}
          >
            <EditIcon />
          </Fab>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default DetailsEditForm;
