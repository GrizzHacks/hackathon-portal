import {
  Fab,
  FormControl,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { Clear, Done, Edit, Error } from "@material-ui/icons";
import React, { Fragment } from "react";

declare interface DetailsEditFormProps {
  attributeName: string;
  attributeValue: any;
  allowEmptyString?: boolean;
  attributeTypeIsNumber?: boolean;
  attributeOptions?: { label: string; value: any }[];
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
  const getLabelForOptionValue = (value: any) => {
    if (attributeOptions) {
      for (const item of attributeOptions) {
        if (item.value === value) {
          return item.label;
        }
      }
    }
    return `Error! Somehow, the label was not found for the option value ${getLabelForOptionValue}`;
  };

  const [currentValue, setCurrentValue] = React.useState<any>(attributeValue);
  const [temp, setTemp] = React.useState<any>(attributeValue);
  const [tempDisplay, setTempDisplay] = React.useState<any>(
    attributeOptions && attributeOptions.length > 0
      ? getLabelForOptionValue(attributeValue)
      : attributeValue
  );
  const [errorText, setErrorTest] = React.useState<string>("");
  const [editing, setEditing] = React.useState(createOnly);

  const startEditing = () => {
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setErrorTest("");
    setTemp(currentValue);
    setTempDisplay(
      attributeOptions && attributeOptions.length > 0
        ? getLabelForOptionValue(attributeValue)
        : currentValue
    );
  };

  const saveAttribute = () => {
    setErrorTest("");
    if (
      allowEmptyString ||
      (attributeOptions && attributeOptions.length > 0) ||
      !!temp
    ) {
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
    event: React.ChangeEvent<
      HTMLInputElement | { name?: string | undefined; value: unknown }
    >
  ) => {
    setTemp(event.target.value);
    setTempDisplay(
      attributeOptions && attributeOptions.length > 0
        ? getLabelForOptionValue(attributeValue)
        : event.target.value
    );
  };

  return (
    <ListItem key={attributeName}>
      <ListItemText
        primary={attributeName}
        secondary={
          editing ? (
            !(attributeOptions && attributeOptions.length > 0) ? (
              <TextField
                fullWidth
                multiline
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
              <FormControl variant="outlined" fullWidth>
                <Select value={temp} onChange={handleAttributeValueChange}>
                  {attributeOptions.map((item) => {
                    return <MenuItem value={item.value}>{item.label}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            )
          ) : (
            tempDisplay
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
