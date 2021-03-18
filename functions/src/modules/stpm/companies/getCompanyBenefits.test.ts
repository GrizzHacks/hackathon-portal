import { internalFunctionsForTesting as testFunctions } from "./getCompanyBenefits";

// -----------------------------------------------------------------------------
// Declare common tierData
// -----------------------------------------------------------------------------

const tierData: STPMTier = {
  sponsorTierId: "tier1",
  sponsorTierName: "Main Tier",
  sponsorTierOrder: 0,
  logoSize: "m",
  sponsorshipExpo: true,
  techTalk: true,
  officeHours: false,
  prizeBudget: 200,
  attendeeData: "post",
  numberOfMentors: -1,
  numberOfRecruiters: 2,
  distributionOfSwag: true,
  openingSessionTalkLength: 0,
  closingSessionTalkLength: 0,
  otherBenefits: {
    "Judged By": "Hackathon Organizers",
    "Sponsor Meal": "N/A",
  },
};

// -----------------------------------------------------------------------------
// mergeTierBenefitsAndCompanyOverriddenBenefits
// -----------------------------------------------------------------------------

test("mergeTierBenefitsAndCompanyOverriddenBenefits merges with no overrides", () => {
  const overriddenBenefits: STPMTierUpdateRequest = {};

  const expectedBenefits: STPMTier = Object(tierData);

  const mergedBenefits = testFunctions.mergeTierBenefitsAndCompanyOverriddenBenefits(
    tierData,
    overriddenBenefits
  );

  expect(mergedBenefits).toMatchObject(expectedBenefits);
  expect(mergedBenefits.otherBenefits["Judged By"]).toMatch(
    "Hackathon Organizers"
  );
  expect(mergedBenefits.otherBenefits["Sponsor Meal"]).toMatch("N/A");
});

test("mergeTierBenefitsAndCompanyOverriddenBenefits merges with basic overrides", () => {
  const overriddenBenefits: STPMTierUpdateRequest = {
    logoSize: "lg",
    prizeBudget: 400,
    attendeeData: "pre",
  };

  const expectedBenefits: STPMTier = Object(tierData);
  expectedBenefits.logoSize = "lg";
  expectedBenefits.prizeBudget = 400;
  expectedBenefits.attendeeData = "pre";

  const mergedBenefits = testFunctions.mergeTierBenefitsAndCompanyOverriddenBenefits(
    tierData,
    overriddenBenefits
  );

  expect(mergedBenefits).toMatchObject(expectedBenefits);
  expect(mergedBenefits.otherBenefits["Judged By"]).toMatch(
    "Hackathon Organizers"
  );
  expect(mergedBenefits.otherBenefits["Sponsor Meal"]).toMatch("N/A");
});

test("mergeTierBenefitsAndCompanyOverriddenBenefits merges with added benefits", () => {
  const overriddenBenefits: STPMTierUpdateRequest = {
    otherBenefits: {
      "Send Photographer": "true",
    },
  };

  const expectedBenefits: STPMTier = Object(tierData);
  expectedBenefits.otherBenefits = {
    "Judged By": "Hackathon Organizers",
    "Sponsor Meal": "N/A",
    "Send Photographer": "true",
  };

  const mergedBenefits = testFunctions.mergeTierBenefitsAndCompanyOverriddenBenefits(
    tierData,
    overriddenBenefits
  );

  expect(mergedBenefits).toMatchObject(expectedBenefits);
  expect(mergedBenefits.otherBenefits["Judged By"]).toMatch(
    "Hackathon Organizers"
  );
  expect(mergedBenefits.otherBenefits["Sponsor Meal"]).toMatch("N/A");
  expect(mergedBenefits.otherBenefits["Send Photographer"]).toMatch("true");
});

test("mergeTierBenefitsAndCompanyOverriddenBenefits merges with overridden other benefits", () => {
  const overriddenBenefits: STPMTierUpdateRequest = {
    otherBenefits: {
      "Judged By": "Sponsor Reps",
    },
  };

  const expectedBenefits: STPMTier = Object(tierData);
  expectedBenefits.otherBenefits = {
    "Judged By": "Sponsor Reps",
    "Sponsor Meal": "N/A",
  };

  const mergedBenefits = testFunctions.mergeTierBenefitsAndCompanyOverriddenBenefits(
    tierData,
    overriddenBenefits
  );

  expect(mergedBenefits).toMatchObject(expectedBenefits);
  expect(mergedBenefits.otherBenefits["Judged By"]).toMatch("Sponsor Reps");
  expect(mergedBenefits.otherBenefits["Sponsor Meal"]).toMatch("N/A");
});
