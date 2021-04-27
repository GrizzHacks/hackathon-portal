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
import React, { Fragment, ReactNode } from "react";
import { nanoid } from "nanoid";
import { styles } from "../../styles";

declare interface DetailsEditFormProps<T> {
  attributeLabel: string;
  attributeValue: T;
  allowEmptyString?: boolean;
  attributeTypeIsNumber?: boolean;
  attributeOptions?: { label: string; value: T }[];
  handleUpdate: (newValue: T) => void;
  createOnly?: boolean;
  editing: boolean;
  setEditing: (editing: boolean) => void;
}

const DetailsEditForm /* : React.FunctionComponent<DetailsEditFormProps<T>> */ = <
  T,
>({
  attributeLabel,
  attributeValue,
  allowEmptyString,
  attributeTypeIsNumber,
  attributeOptions,
  handleUpdate,
  createOnly,
  editing,
  setEditing,
}: DetailsEditFormProps<T> & { children?: ReactNode }) => {
  const classes = styles();

  const getIndexForOptionValue = (value: T) => {
    if (attributeOptions) {
      for (let i = 0; i < attributeOptions.length; i++) {
        if (attributeOptions[i].value === value) {
          return i;
        }
      }
    }
    return -1;
  };

  const getOptionsLabelOrAttributeValue = (value: T) => {
    return attributeOptions && attributeOptions.length > 0
      ? getIndexForOptionValue(value) >= 0
        ? attributeOptions[getIndexForOptionValue(value)].label
        : `Error! Somehow, the label was not found for the option value ${value}`
      : value;
  };

  const [currentValue, setCurrentValue] = React.useState<any>(attributeValue);
  const [temp, setTemp] = React.useState<T>(attributeValue);
  const [selectIndex, setSelectIndex] = React.useState<number>(
    getIndexForOptionValue(attributeValue)
  );
  const [errorText, setErrorTest] = React.useState<string>("");

  // Reset form when input value changes
  React.useEffect(() => {
    setCurrentValue(attributeValue);
    setTemp(attributeValue);
    setSelectIndex(getIndexForOptionValue(attributeValue));
  }, [attributeValue]);

  const startEditing = () => {
   setEditing(true);
    
  
  };

  const cancelEditing = () => {
    // setEditing(false);
    // setErrorTest("");
    // setSelectIndex(getIndexForOptionValue(currentValue));
    // setTemp(currentValue);



    if (attributeOptions && attributeOptions.length > 0) {
      setEditing(false);
      setTemp(attributeOptions[selectIndex].value);
      setCurrentValue(attributeOptions[selectIndex].value);
      handleUpdate(attributeOptions[selectIndex].value);
    } else {
      if (allowEmptyString || !!temp) {
        const tempNumber = Number(temp);
        if (!attributeTypeIsNumber || !isNaN(tempNumber)) {
          setEditing(false);
        } else {
          //setErrorTest(`Sorry, ${attributeLabel} must be a number `);
          setSelectIndex(getIndexForOptionValue(currentValue));
           setTemp(currentValue); 
        }
      } else {
        setErrorTest(`Sorry, ${attributeLabel} cannot be empty`);
        setSelectIndex(getIndexForOptionValue(currentValue));
        setTemp(currentValue);
        
      }
    }
  };

  const saveAttribute = () => {
    setErrorTest("");
    if (attributeOptions && attributeOptions.length > 0) {
      setEditing(false);
      setTemp(attributeOptions[selectIndex].value);
      setCurrentValue(attributeOptions[selectIndex].value);
      handleUpdate(attributeOptions[selectIndex].value);
    } else {
      if (allowEmptyString || !!temp) {
        const tempNumber = Number(temp);
        if (!attributeTypeIsNumber || !isNaN(tempNumber)) {
          setEditing(false);
          setCurrentValue(temp);
          handleUpdate((attributeTypeIsNumber ? tempNumber : temp) as any); // Loss of specifity due to text box
        } else {
          setErrorTest(`Sorry, ${attributeLabel} must be a number`);
        }
      } else {
        setErrorTest(`Sorry, ${attributeLabel} cannot be empty`);
      }
    }
  };

  const handleAttributeValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTemp(event.target.value as any); // Loss of specifity due to text box
  };

  const handleSelectValueChange = (
    event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>
  ) => {
    setSelectIndex(event.target.value as number);
  };

  return (
    <ListItem key={`edit_display_${attributeLabel}`}>
      <ListItemText
        primary={attributeLabel}
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
              <FormControl variant="outlined" fullWidth error={selectIndex < 0}>
                <Select
                  value={selectIndex >= 0 ? selectIndex : ""}
                  onChange={handleSelectValueChange}
                >
                  {attributeOptions.map((item, index) => {
                    return <MenuItem value={index}>{item.label}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            )
          ) : (
            getOptionsLabelOrAttributeValue(temp)
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
