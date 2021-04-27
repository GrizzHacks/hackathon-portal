import { Button, Grid, List, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import { useHistory } from "react-router";
import { apiClient } from "../../../helper";
import DetailsEditForm from "../../layouts/DetailsEditForm";
import PasswordEditForm from "../../misc/PasswordEditForm";
import { firebaseApp as FirebaseAppGlobal } from "../../../config/firebaseConfig";

const profileAttributes: CreateDetailEditPageAttribute<
  URMUserUpdateRequest,
  any
>[] = [
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

const ApplicationPage: React.FunctionComponent<{
  role: string;
  roleName: string;
  firebaseApp?: firebase.default.app.App;
}> = ({ role, roleName, firebaseApp }) => {
  const routeHistory = useHistory();
  const firebaseAppLocal = firebaseApp ? firebaseApp : FirebaseAppGlobal;

  const [
    createUserObject,
    setCreateUserObject,
  ] = React.useState<URMUserUpdateRequest>({});
  const [createApplicationObject, setCreateApplicationObject] = React.useState<{
    [key: string]: string;
  }>({});
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [editingUserProfile, setEditingUserProfile] = React.useState<boolean[]>(
    profileAttributes.map(() => {
      return true;
    })
  );
  const [editingPassword, setEditingPassword] = React.useState<boolean>(true);
  const [applicationAttributes, setApplicationAttributes] = React.useState<
    CreateDetailEditPageAttribute<any, any>[]
  >([]);
  const [
    editingApplicationQuestions,
    setEditingApplicationQuestions,
  ] = React.useState<boolean[]>([]);

  const handleUserUpdateFactory = (
    attributeName: keyof URMUserUpdateRequest
  ) => (attributeValue: any) => {
    const newUpdate: URMUserUpdateRequest = {};
    newUpdate[attributeName] = attributeValue;
    setCreateUserObject({ ...createUserObject, ...newUpdate });
  };

  const handleUpdatePassword = (password: string, confirmPassword: string) => {
    setCreateUserObject({ ...createUserObject, password, confirmPassword });
  };

  const handleApplicationUpdateFactory = (attributeName: string) => (
    attributeValue: any
  ) => {
    const newUpdate: { [key: string]: string } = {};
    newUpdate[attributeName] = attributeValue;
    setCreateApplicationObject({ ...createApplicationObject, ...newUpdate });
  };

  const extractQuestionAttributes = async (
    question: URMQuestion,
    optional: boolean
  ) => {
    const attributeLabel = `${question.applicationQuestionLabel}${
      optional ? " (Optional)" : ""
    }`;

    const attributeInfo: CreateDetailEditPageAttribute<any, any> = {
      attributeName: question.questionId,
      attributeLabel: attributeLabel,
      allowEmptyString: optional,
      attributeTypeIsNumber: question.type === "number",
    };

    if (question.type === "enum") {
      const labelsTyped = question.enumLabels as string;
      const valuesTyped = question.enumValues as string;
      const labels = labelsTyped.split(";").map((label) => {
        return label.trim();
      });
      const values = valuesTyped.split(";").map((label) => {
        return label.trim();
      });
      attributeInfo.attributeOptions = labels.map((label, index) => {
        return { label, value: values[index] };
      });
    } else if (question.type === "reference") {
      const referenceEndpoint = question.referenceEndpoint as string;
      const referenceCollection = question.referenceCollection as string;
      const referenceLabelAttribute = question.referenceLabelAttribute as string;
      const referenceValueAttribute = question.referenceValueAttribute as string;
      return apiClient
        .get(referenceEndpoint)
        .then((response) => {
          return response
            .json()
            .then((json) => {
              attributeInfo.attributeOptions = json[referenceCollection].map(
                (object: { [key: string]: string }) => {
                  return {
                    label: object[referenceLabelAttribute],
                    value: object[referenceValueAttribute],
                  };
                }
              );
              return attributeInfo;
            })
            .catch((err) => {
              console.log(err);
              alert(err);
              return attributeInfo;
            });
        })
        .catch((err) => {
          console.log(err);
          alert(err);
          return attributeInfo;
        });
    }

    return attributeInfo;
  };

  if (!loaded) {
    setLoaded(true);
    apiClient
      .get(`urm/questions/`)
      .then((object) => {
        object.json().then((objectJson) => {
          const questions = (objectJson as URMQuestionsList).questions;
          const questionsPromises = questions.reduce((reduced, question) => {
            if (
              role === "organizer" &&
              question.inOrganizerApplication !== "no"
            ) {
              reduced.push(
                extractQuestionAttributes(
                  question,
                  question.inOrganizerApplication === "optional"
                )
              );
            }
            if (role === "sponsor" && question.inSponsorApplication !== "no") {
              reduced.push(
                extractQuestionAttributes(
                  question,
                  question.inSponsorApplication === "optional"
                )
              );
            }
            if (role === "mentor" && question.inMentorApplication !== "no") {
              reduced.push(
                extractQuestionAttributes(
                  question,
                  question.inMentorApplication === "optional"
                )
              );
            }
            if (
              role === "volunteer" &&
              question.inVolunteerApplication !== "no"
            ) {
              reduced.push(
                extractQuestionAttributes(
                  question,
                  question.inHackerApplication === "optional"
                )
              );
            }
            if (role === "hacker" && question.inHackerApplication !== "no") {
              reduced.push(
                extractQuestionAttributes(
                  question,
                  question.inHackerApplication === "optional"
                )
              );
            }
            return reduced;
          }, [] as Promise<CreateDetailEditPageAttribute<any, any>>[]);

          Promise.all(questionsPromises)
            .then((questionAttributes) => {
              setApplicationAttributes(questionAttributes);
              setEditingApplicationQuestions(
                questionAttributes.map(() => {
                  return true;
                })
              );
            })
            .catch((err) => {
              console.log(err);
              alert(err);
            });
        });
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
  }

  return (
    <Fragment>
      <Typography variant="h3">{roleName} Application</Typography>
      <List>
        {profileAttributes.map((attribute, index) => {
          return (
            <DetailsEditForm
              key={`user_form_field_${index}`}
              attributeLabel={attribute.attributeLabel}
              attributeValue={createUserObject[attribute.attributeName]}
              allowEmptyString={attribute.allowEmptyString}
              attributeTypeIsNumber={attribute.attributeTypeIsNumber}
              attributeOptions={attribute.attributeOptions}
              handleUpdate={handleUserUpdateFactory(attribute.attributeName)}
              createOnly={true}
              editing={editingUserProfile[index]}
              setEditing={(edit: boolean) => {
                const newEditing = editingUserProfile.concat([]);
                newEditing[index] = edit;
                setEditingUserProfile(newEditing);
              }}
            />
          );
        })}
        <PasswordEditForm
          key={`form_field_password`}
          handleUpdate={handleUpdatePassword}
          createOnly={true}
          editing={editingPassword}
          setEditing={setEditingPassword}
        />
        {applicationAttributes.map((attribute, index) => {
          return (
            <DetailsEditForm
              key={`application_form_field_${index}`}
              attributeLabel={attribute.attributeLabel}
              attributeValue={
                createApplicationObject[attribute.attributeName as string]
              }
              allowEmptyString={attribute.allowEmptyString}
              attributeTypeIsNumber={attribute.attributeTypeIsNumber}
              attributeOptions={attribute.attributeOptions}
              handleUpdate={handleApplicationUpdateFactory(
                attribute.attributeName as string
              )}
              createOnly={true}
              editing={editingApplicationQuestions[index]}
              setEditing={(edit: boolean) => {
                const newEditing = editingApplicationQuestions.concat([]);
                newEditing[index] = edit;
                setEditingApplicationQuestions(newEditing);
              }}
            />
          );
        })}
      </List>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button
            variant="outlined"
            fullWidth
            id="setEditing"
            color="primary"
            onClick={() => {
              routeHistory.push("/urm/questions/");
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
            disabled={
              profileAttributes.reduce((reduced, value, index) => {
                return reduced || editingUserProfile[index];
              }, false as boolean) ||
              editingPassword ||
              applicationAttributes.reduce((reduced, value, index) => {
                return reduced || editingApplicationQuestions[index];
              }, false as boolean)
            }
            onClick={() => {
              if (true) {
                apiClient
                  .post("urm/users/", {
                    body: JSON.stringify(createUserObject),
                  })
                  .then(() => {
                    const email = createUserObject.email as string;
                    const password = createUserObject.password as string;
                    firebaseAppLocal
                      .auth()
                      .signInWithEmailAndPassword(email, password)
                      .then((userCredential) => {
                        const user = userCredential.user;
                        if (user) {
                          apiClient
                            .post(`urm/users/${user.uid}/applications`, {
                              body: JSON.stringify({
                                role,
                                otherQuestions: createApplicationObject,
                              }),
                            })
                            .then(() => {
                              firebaseAppLocal
                                .auth()
                                .signOut()
                                .then(() =>
                                  firebaseAppLocal
                                    .auth()
                                    .signInWithEmailAndPassword(email, password)
                                    .then(() => {
                                      routeHistory.push("/");
                                    })
                                    .catch((err) => {
                                      console.log(err);
                                      alert(err);
                                    })
                                );
                            })

                            .catch((err) => {
                              console.log(err);
                              alert(err);
                            });
                        } else {
                          console.log("Something went wrong!");
                          alert("Something went wrong!");
                        }
                      })
                      .catch((err) => {
                        console.log(err);
                        alert(err);
                      });
                  });
              } else {
                // TODO: Allow Updates in the Future
                {
                  /* apiClient
                    .patch(`urm/questions/${id}`, {
                      body: JSON.stringify(updateObject),
                    })
                    .then(() => {
                      routeHistory.push("/urm/questions/");
                    }); */
                }
              }
            }}
          >
            Apply Now!
          </Button>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default ApplicationPage;
