import { Button, Grid, IconButton, List, Typography } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { nanoid } from "nanoid";
import React, { Fragment } from "react";
import { useHistory, useParams } from "react-router";
import { apiClient } from "../../../helper";
import DetailsEditForm from "../../layouts/DetailsEditForm";

const generalAttributes: CreateDetailEditPageAttribute<URMQuestion, any>[] = [
  { attributeName: "applicationQuestionLabel", attributeLabel: "Question" },
  {
    attributeName: "inOrganizerApplication",
    attributeLabel: "Include on Organizer Application",
    attributeOptions: [
      { label: "Required", value: "required" },
      { label: "Optional", value: "optional" },
      { label: "No", value: "no" },
    ],
  },
  {
    attributeName: "inSponsorApplication",
    attributeLabel: "Include on Sponsor Application",
    attributeOptions: [
      { label: "Required", value: "required" },
      { label: "Optional", value: "optional" },
      { label: "No", value: "no" },
    ],
  },
  {
    attributeName: "inMentorApplication",
    attributeLabel: "Include on Mentor Application",
    attributeOptions: [
      { label: "Required", value: "required" },
      { label: "Optional", value: "optional" },
      { label: "No", value: "no" },
    ],
  },
  {
    attributeName: "inVolunteerApplication",
    attributeLabel: "Include on Volunteer Application",
    attributeOptions: [
      { label: "Required", value: "required" },
      { label: "Optional", value: "optional" },
      { label: "No", value: "no" },
    ],
  },
  {
    attributeName: "inHackerApplication",
    attributeLabel: "Include on Hacker Application",
    attributeOptions: [
      { label: "Required", value: "required" },
      { label: "Optional", value: "optional" },
      { label: "No", value: "no" },
    ],
  },
  {
    attributeName: "type",
    attributeLabel: "Question Type",
    attributeOptions: [
      { label: "Text", value: "string" },
      { label: "Number", value: "number" },
      { label: "Dropdown", value: "enum" },
      { label: "Reference", value: "reference" },
    ],
  },
];

const enumAttributes: CreateDetailEditPageAttribute<URMQuestion, any>[] = [
  {
    attributeName: "enumLabels",
    attributeLabel: "Dropdown Labels (seperated a semicolon)",
  },
  {
    attributeName: "enumValues",
    attributeLabel: "Dropdown Values (seperated a semicolon)",
  },
];

const referenceAttributes: CreateDetailEditPageAttribute<URMQuestion, any>[] = [
  {
    attributeName: "referenceEndpoint",
    attributeLabel:
      "Reference Endpoint (the API list endpoint to get the object to reference)",
  },
  {
    attributeName: "referenceCollection",
    attributeLabel:
      "Reference Collection (the name of the array returned by the endpoint)",
  },
  {
    attributeName: "referenceLabelAttribute",
    attributeLabel: "Reference Label Attribute",
  },
  {
    attributeName: "referenceValueAttribute",
    attributeLabel: "Reference Value Attribute",
  },
];

const QuestionCreateDetailEditPage: React.FunctionComponent = () => {
  const routeParams = useParams() as any;
  const routeHistory = useHistory();
  const id =
    routeParams["questionId"] !== "create" ? routeParams["questionId"] : "";

  const [object, setObject] = React.useState<URMQuestion | undefined>();
  const [
    updateObject,
    setUpdateObject,
  ] = React.useState<URMQuestionUpdateRequest>();
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [editing, setEditing] = React.useState<boolean[]>(
    generalAttributes
      .map(() => {
        return !id;
      })
      .concat([!id, !id, !id, !id]) // TODO: Can this be improved?
  );

  const getQuestionType = () => {
    return { ...object, ...updateObject }.type;
  };

  const getCurrentAttributes = () => {
    const questionType = getQuestionType();
    return generalAttributes.concat(
      questionType === "enum"
        ? enumAttributes
        : questionType === "reference"
        ? referenceAttributes
        : []
    );
  };

  const handleUpdateFactory = (attributeName: keyof URMQuestion) => (
    attributeValue: any
  ) => {
    const newUpdate: URMQuestionUpdateRequest = {};
    newUpdate[attributeName] = attributeValue;
    setUpdateObject({ ...updateObject, ...newUpdate });
  };

  if (!loaded) {
    setLoaded(true);
    if (id) {
      apiClient
        .get(`urm/questions/${id}`)
        .then((object) => {
          object.json().then((objectJson) => {
            setObject(objectJson as URMQuestion);
          });
        })
        .catch((err) => {
          console.log(err);
          alert(err);
        });
    }
  }

  return (
    <Fragment>
      <Typography variant="body2">
        <IconButton
          size="small"
          onClick={() => {
            routeHistory.push("/urm/questions/");
          }}
        >
          <ArrowBack />
        </IconButton>
        Return to Application Question list
      </Typography>
      <Typography variant="h3">
        {!id ? "Create New" : "Update"} Application Question
      </Typography>
      <List>
        {getCurrentAttributes().map((attribute, index) => {
          const merged = {
            ...object,
            ...updateObject,
          } as URMQuestionUpdateRequest;
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
              editing={editing[index]}
              setEditing={(edit: boolean) => {
                const newEditing = editing.concat([]);
                newEditing[index] = edit;
                setEditing(newEditing);
              }}
            />
          );
        })}
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
              disabled={getCurrentAttributes().reduce(
                (reduced, value, index) => {
                  return reduced || editing[index];
                },
                false as boolean
              )}
              onClick={() => {
                if (!id) {
                  apiClient
                    .post("urm/questions/", {
                      body: JSON.stringify({
                        ...updateObject,
                        questionId: nanoid(),
                      }),
                    })
                    .then(() => {
                      routeHistory.push("/urm/questions/");
                    });
                } else {
                  apiClient
                    .patch(`urm/questions/${id}`, {
                      body: JSON.stringify(updateObject),
                    })
                    .then(() => {
                      routeHistory.push("/urm/questions/");
                    });
                }
              }}
            >
              {!id ? "Create" : "Update"}
            </Button>
          </Grid>
        </Grid>
      </List>
    </Fragment>
  );
};

export default QuestionCreateDetailEditPage;
