import { Button, Grid, List, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import { NotificationsEnabledProps } from "../../@types/notificationsEnabledProps";
import { firebaseApp } from "../../config/firebaseConfig";
import { apiClient } from "../../helper";
import DetailsEditForm from "../layouts/DetailsEditForm";
import PasswordEditForm from "../misc/PasswordEditForm";

const attributes: CreateDetailEditPageAttribute<URMUser, any>[] = [
  { attributeName: "firstName", attributeLabel: "First Name" },
  { attributeName: "lastName", attributeLabel: "Last Name" },
  { attributeName: "email", attributeLabel: "Email" },
  {
    attributeName: "phoneNumber",
    attributeLabel: "Phone Number",
    allowEmptyString: true,
  },
  {
    attributeName: "photoUrl",
    attributeLabel: "Profile Picture Url",
    allowEmptyString: true,
  },
];

const ProfilePage: React.FunctionComponent<NotificationsEnabledProps> = ({
  setNotification,
}) => {
  const [object, setObject] = React.useState<URMUser | undefined>();
  const [
    updateObject,
    setUpdateObject,
  ] = React.useState<URMUserUpdateRequest>();
  const [userId, setUserId] = React.useState<string>("");
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [editing, setEditing] = React.useState<boolean[]>(
    attributes
      .map(() => {
        return false;
      })
      .concat([false])
  );

  const handleUpdateFactory = (attributeName: keyof URMUser) => (
    attributeValue: any
  ) => {
    const newUpdate: Partial<URMUser> = {};
    newUpdate[attributeName] = attributeValue;
    setUpdateObject({ ...updateObject, ...newUpdate });
  };

  const handleUpdatePassword = (password: string, confirmPassword: string) => {
    setUpdateObject({ ...updateObject, password, confirmPassword });
  };

  const refreshProfileView = (id: string) => {
    apiClient
      .get(`urm/users/${id}`)
      .then((object) => {
        object.json().then((objectJson) => {
          setObject(objectJson as URMUser);
        });
      })
      .catch(() => {});
  };

  // Get the userId of the current user
  const listener = firebaseApp.auth().onAuthStateChanged((user) => {
    if (user) {
      setUserId(user.uid);
      if (!loaded) {
        setLoaded(true);
        refreshProfileView(user.uid);
      }
    }
    // Only make one update at the beginning
    listener();
  });

  return (
    <Fragment>
      <Typography variant="h3">Profile</Typography>
      <List>
        {attributes.map((attribute, index) => {
          const merged = { ...object, ...updateObject } as URMUser;
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
              createOnly={!userId}
              editing={editing[index]}
              setEditing={(edit: boolean) => {
                const newEditing = editing.concat([]);
                newEditing[index] = edit;
                setEditing(newEditing);
              }}
            />
          );
        })}
        <PasswordEditForm
          key={`form_field_password`}
          handleUpdate={handleUpdatePassword}
          createOnly={!userId}
          editing={editing[attributes.length]}
          setEditing={(edit: boolean) => {
            const newEditing = editing.concat([]);
            newEditing[attributes.length] = edit;
            setEditing(newEditing);
          }}
        />
      </List>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button
            variant="outlined"
            fullWidth
            color="primary"
            onClick={() => {
              setUpdateObject({});
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
            disabled={editing.reduce((reduced, value) => {
              return reduced || value;
            })}
            onClick={() => {
              apiClient
                .patch(`urm/users/${userId}`, {
                  body: JSON.stringify(updateObject),
                })
                .then(() => {
                  setUpdateObject({});
                  refreshProfileView(userId);
                });
            }}
          >
            Update
          </Button>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default ProfilePage;
