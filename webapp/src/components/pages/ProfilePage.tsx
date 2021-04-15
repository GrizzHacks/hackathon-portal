import { Button, Grid, List, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import { NotificationsEnabledProps } from "../../@types/notificationsEnabledProps";
import { firebaseApp } from "../../config/firebaseConfig";
import { apiClient } from "../../helper";
import DetailsEditForm from "../layouts/DetailsEditForm";

const attributes: CreateDetailEditPageAttribute<URMProfile, any>[] = [
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
  const [object, setObject] = React.useState<URMProfile | undefined>();
  const [updateObject, setUpdateObject] = React.useState<Partial<URMProfile>>();
  const [profileId, setProfileId] = React.useState<string>("");
  const [loaded, setLoaded] = React.useState<boolean>(false);

  const handleUpdateFactory = (attributeName: keyof URMProfile) => (
    attributeValue: any
  ) => {
    const newUpdate: Partial<URMProfile> = {};
    newUpdate[attributeName] = attributeValue;
    setUpdateObject({ ...updateObject, ...newUpdate });
  };

  const refreshProfileView = (id: string) => {
    apiClient
      .get(`urm/profiles/${id}`)
      .then((object) => {
        object.json().then((objectJson) => {
          setObject(objectJson as URMProfile);
        });
      })
      .catch(() => {});
  };

  if (!loaded) {
    setLoaded(true);
    refreshProfileView("Olx0EXsq6EkbeRGe5qrkKjfIO8zu");
  }

  // Get the userId of the current user
  const listener = firebaseApp.auth().onAuthStateChanged((user) => {
    if (user) {
      setProfileId(user.uid);
      /* if (!loaded) {
        setLoaded(true);
        refreshProfileView(user.uid);
      } */
    }
    // Only make one update at the beginning
    listener();
  });

  return (
    <Fragment>
      <Typography variant="h3">Profile</Typography>
      <List>
        {attributes.map((attribute, index) => {
          const merged = { ...object, ...updateObject } as URMProfile;
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
              createOnly={!profileId}
            />
          );
        })}
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
              onClick={() => {
                apiClient
                  .patch(`urm/profiles/${profileId}`, {
                    body: JSON.stringify(updateObject),
                  })
                  .then(() => {
                    setUpdateObject({});
                    refreshProfileView(profileId);
                  });
              }}
            >
              Update
            </Button>
          </Grid>
        </Grid>
      </List>
    </Fragment>
  );
};

export default ProfilePage;
