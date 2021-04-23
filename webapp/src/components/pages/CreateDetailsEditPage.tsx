import { Button, Grid, IconButton, List, Typography } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { nanoid } from "nanoid";
import React, { Fragment, ReactNode } from "react";
import { useHistory, useParams } from "react-router";
import { apiClient } from "../../helper";
import DetailsEditForm from "../layouts/DetailsEditForm";

declare interface CreateDetailEditPageProps<ObjectType> {
  objectTypeName: string;
  listEndpoint: string;
  apiEndpoint: string;
  idAttribute: keyof ObjectType;
  attributes: CreateDetailEditPageAttribute<ObjectType, any>[];
}

const CreateDetailEditPage /*: React.FunctionComponent<CreateDetailEditPageProps<T>> */ = <
  ObjectType,
>({
  objectTypeName,
  listEndpoint,
  apiEndpoint,
  idAttribute,
  attributes,
  children,
}: CreateDetailEditPageProps<ObjectType> & { children?: ReactNode }) => {
  const routeParams = useParams() as any;
  const routeHistory = useHistory();
  const id =
    routeParams[idAttribute] !== "create" ? routeParams[idAttribute] : "";

  const [object, setObject] = React.useState<ObjectType | undefined>();
  const [updateObject, setUpdateObject] = React.useState<Partial<ObjectType>>();
  const [loaded, setLoaded] = React.useState<boolean>(false);

  const handleUpdateFactory = (attributeName: keyof ObjectType) => (
    attributeValue: any
  ) => {
    const newUpdate: Partial<ObjectType> = {};
    newUpdate[attributeName] = attributeValue;
    setUpdateObject({ ...updateObject, ...newUpdate });
  };

  if (!loaded) {
    setLoaded(true);
    if (id) {
      apiClient
        .get(`${apiEndpoint}/${id}`)
        .then((object) => {
          object.json().then((objectJson) => {
            setObject(objectJson as ObjectType);
          });
        })
        .catch(() => {});
    }
  }

  return (
    <Fragment>
      <Typography variant="body2">
        <IconButton
          size="small"
          onClick={() => {
            routeHistory.push(listEndpoint);
          }}
        >
          <ArrowBack />
        </IconButton>
        Return to {objectTypeName} list
      </Typography>
      <Typography variant="h3">
        {!id ? "Create New" : "Update"} {objectTypeName}
      </Typography>
      <List>
        {attributes.map((attribute, index) => {
          const merged = { ...object, ...updateObject } as ObjectType;
          const attributeValue = merged[attribute.attributeName];
          return (
            <DetailsEditForm
              key={`form_field_${index}`}
              attributeLabel={attribute.attributeLabel}
              attributeValue={attributeValue}
              allowEmptyString={attribute.allowEmptyString}
              attributeTypeIsNumber={attribute.attributeTypeIsNumber}
              attributeOptions={attribute.attributeOptions}
              handleUpdate={handleUpdateFactory(attribute.attributeName)}
              createOnly={!id}
              editing = {}
              setEditing ={ {editing: boolean} => {
                edit = editing[index];
                setEditing(edit);
              };}
            />
          );
        })}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              fullWidth
              //disabled={setEditing(editing)}
              id="setEditing"
              color="primary"
              onClick={() => {
                routeHistory.push(listEndpoint);
              }}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              fullWidth
              color="primary"
              onClick={() => {
                if (!id) {
                  const idObject: Partial<ObjectType> = {};
                  idObject[idAttribute] = nanoid() as any;
                  apiClient
                    .post(apiEndpoint, {
                      body: JSON.stringify({ ...updateObject, ...idObject }),
                    })
                    .then(() => {
                      routeHistory.push(listEndpoint);
                    });
                } else {
                  apiClient
                    .patch(`${apiEndpoint}/${id}`, {
                      body: JSON.stringify(updateObject),
                    })
                    .then(() => {
                      routeHistory.push(listEndpoint);
                    });
                }
              }}
            >
              {!id ? "Create" : "Update"}
            </Button>
          </Grid>
        </Grid>
      </List>
      {children && children}
    </Fragment>
  );
};

export default CreateDetailEditPage;
