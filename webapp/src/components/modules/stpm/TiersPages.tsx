import { List as ListIcon } from "@material-ui/icons";
import React from "react";
import { Route, Switch } from "react-router-dom";
import ListPage from "../../pages/ListPage";
import CreateDetailEditPage from "../../pages/CreateDetailsEditPage";
import Error404Page from "../../pages/Error404Page";

const TiersPages: React.FunctionComponent = () => {
  const listMapFunction = (
    setListItems: (listItems: GenericListItemInfo[]) => void
  ) => (schemas: any) => {
    const schemasTyped = schemas as STPMTierList;
    setListItems(
      schemasTyped.sponsorTiers.map((value) => {
        return {
          line1: value.sponsorTierName,
          deleteEndpoint: `stpm/tiers/${value.sponsorTierId}`,
          deleteText: "Delete Tier",
          detailedViewLink: `/stpm/tiers/tier/${value.sponsorTierId}`,
          detailedViewText: "Tier Details",
          icon: ListIcon,
          key: `${value.sponsorTierId}`,
        };
      })
    );
  };

  const TierCreateEditDetailsPageComponent = (
    <CreateDetailEditPage<STPMTier>
      objectTypeName={"Sponsor Tier"}
      listEndpoint="/stpm/tiers"
      apiEndpoint={"stpm/tiers"}
      idAttribute="sponsorTierId"
      attributes={[
        {
          attributeName: "sponsorTierName",
          attributeLabel: "Sponsor Tier Name",
        },
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
      ]}
    />
  );

  return (
    <Switch>
      <Route exact path="/stpm/tiers">
        <ListPage
          pageTitle="Sponsor Tiers"
          objectTypeName="Sponsor Tier"
          apiEndpoint="stpm/tiers"
          createNewLink="/stpm/tiers/create"
          listMapFunction={listMapFunction}
        />
      </Route>
      <Route path="/stpm/tiers/create">
        {TierCreateEditDetailsPageComponent}
      </Route>
      <Route path="/stpm/tiers/tier/:sponsorTierId">
        {TierCreateEditDetailsPageComponent}
      </Route>
      <Route component={Error404Page} />
    </Switch>
  );
};

export default TiersPages;
