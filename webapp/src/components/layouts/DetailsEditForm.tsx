import {
  Fab,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
} from "@material-ui/core";
import { Clear, Done, Edit, Error } from "@material-ui/icons";
import React, { Fragment } from "react";

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
  const [errorText, setErrorTest] = React.useState<string>("");
  const [editing, setEditing] = React.useState(createOnly);

  const startEditing = () => {
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setErrorTest("");
    setTemp(currentValue);
  };

  const saveAttribute = () => {
    setErrorTest("");
    if (allowEmptyString || !!temp) {
      const tempNumber = Number(temp);
      if (!attributeTypeIsNumber || !isNaN(tempNumber)) {
        setEditing(false);
        setCurrentValue(temp);
        handleUpdate(attributeTypeIsNumber ? tempNumber : temp);
      } else {
        setErrorTest(`Sorry, ${attributeName} must be a number`);
      }
    } else {
      setErrorTest(`Sorry, ${attributeName} cannot be empty`);
    }
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
              error={!!errorText}
              value={temp}
              onChange={handleAttributeValueChange}
              variant="outlined"
              helperText={
                errorText && (
                  <Fragment>
                    <Error fontSize="inherit" />
                    {" " + errorText}
                  </Fragment>
                )
              }
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
            <Done />
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
            <Clear />
          </Fab>
        ) : (
          <Fab
            color="primary"
            size="small"
            onClick={() => {
              startEditing();
            }}
          >
            <Edit />
          </Fab>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default DetailsEditForm;
