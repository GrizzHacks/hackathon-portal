import { Button, Grid, List, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import { useParams } from "react-router";
import { apiClient } from "../../../helper";
import { styles } from "../../../styles";
import DetailsEditForm from "../../layouts/DetailsEditForm";

declare interface CompanyBenefitsProps {}

const attributes: CreateDetailEditPageAttribute<STPMTier, any>[] = [
  {
    attributeName: "logoSize",
    attributeLabel: "Sponsor Logo Size",
    attributeOptions: [
      { label: "Extra Small", value: "xs" },
      { label: "Small", value: "sm" },
      { label: "Medium", value: "m" },
      { label: "Large", value: "lg" },
      { label: "Extra Large", value: "xl" },
    ],
  },
  {
    attributeName: "sponsorshipExpo",
    attributeLabel: "Attend Sponsorship Expo?",
    attributeOptions: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
  },
  {
    attributeName: "techTalk",
    attributeLabel: "Present a Tech Talk?",
    attributeOptions: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
  },
  {
    attributeName: "officeHours",
    attributeLabel: "Has Office Hours?",
    attributeOptions: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
  },
  {
    attributeName: "prizeBudget",
    attributeLabel: "Prize Budget (USD)",
    attributeTypeIsNumber: true,
  },
  {
    attributeName: "attendeeData",
    attributeLabel: "Can View Attendee Data",
    attributeOptions: [
      { label: "No", value: "none" },
      { label: "Yes, Pre-Event", value: "pre" },
      { label: "Yest, Post-Event", value: "post" },
    ],
  },
  {
    attributeName: "numberOfMentors",
    attributeLabel: "Max Number of Mentors",
    attributeTypeIsNumber: true,
  },
  {
    attributeName: "numberOfRecruiters",
    attributeLabel: "Max Number of Recruiters",
    attributeTypeIsNumber: true,
  },
  {
    attributeName: "distributionOfSwag",
    attributeLabel: "Can Distribute Swag?",
    attributeOptions: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
  },
  {
    attributeName: "openingSessionTalkLength",
    attributeLabel: "Opening Session Talk Length (mins)",
    attributeTypeIsNumber: true,
  },
  {
    attributeName: "closingSessionTalkLength",
    attributeLabel: "Closing Session Talk Length (mins)",
    attributeTypeIsNumber: true,
  },
];

const CompanyBenefits: React.FunctionComponent<CompanyBenefitsProps> = () => {
  const classes = styles();
  const routeParams = useParams() as any;
  const id = routeParams.companyId;

  const [allBenefits, setAllBenefits] = React.useState<STPMTier | undefined>();
  const [overriddenBenefits, setOverriddenBenefits] = React.useState<
    STPMTier | undefined
  >();
  const [updateObject, setUpdateObject] = React.useState<Partial<STPMTier>>();
  const [loaded, setLoaded] = React.useState<boolean>(false);

  const handleUpdateFactory = (attributeName: keyof STPMTier) => (
    attributeValue: any
  ) => {
    const newUpdate: Partial<STPMTier> = {};
    newUpdate[attributeName] = attributeValue;
    setUpdateObject({ ...updateObject, ...newUpdate });
  };

  const updateBenefitsListed = () => {
    apiClient
      .get(`stpm/companies/${id}/benefits`)
      .then((object) => {
        object.json().then((objectJson) => {
          setAllBenefits(objectJson as STPMTier);
        });
      })
      .catch(() => {});
    apiClient
      .get(`stpm/companies/${id}`)
      .then((object) => {
        object.json().then((objectJson) => {
          setOverriddenBenefits(objectJson.overriddenBenefits as STPMTier);
        });
      })
      .catch(() => {});
  };

  if (!loaded) {
    setLoaded(true);
    updateBenefitsListed();
  }

  return (
    <Fragment>
      <Typography variant="h4" className={classes.pageTitle}>
        Sponsor Benefits
      </Typography>
      <List>
        {attributes.map((attribute, index) => {
          const merged = { ...allBenefits, ...updateObject } as STPMTier;
          const attributeValue = merged[attribute.attributeName];
          return (
            <div
              key={`form_field_${index}`}
              className={
                overriddenBenefits &&
                overriddenBenefits[attribute.attributeName] !== undefined
                  ? classes.outlined
                  : ""
              }
            >
              <DetailsEditForm
                attributeLabel={attribute.attributeLabel}
                attributeValue={attributeValue}
                allowEmptyString={attribute.allowEmptyString}
                attributeTypeIsNumber={attribute.attributeTypeIsNumber}
                attributeOptions={attribute.attributeOptions}
                handleUpdate={handleUpdateFactory(attribute.attributeName)}
                createOnly={!id}
              />
            </div>
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
                  .patch(`stpm/companies/${id}`, {
                    body: JSON.stringify({ overriddenBenefits: updateObject }),
                  })
                  .then(() => {
                    setUpdateObject({});
                    updateBenefitsListed();
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

export default CompanyBenefits;
