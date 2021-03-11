import { internalFunctionsForTesting as testFunctions } from "./typeValidator";

// -----------------------------------------------------------------------------
// Declare common checkRules
// -----------------------------------------------------------------------------

const checkArrayRule1: ValidatorArrayRules = {
  type: "array",
  rules: ["string", "number"],
};
const checkArrayRule2: ValidatorArrayRules = {
  type: "array",
  rules: ["boolean"],
};
const checkObjectRule: ValidatorObjectRules = {
  type: "object",
  rules: {
    test: { rules: ["string"], required: false },
    test2: { rules: ["number"], required: true },
  },
};
const primitiveCheckRules: ValidatorAllowedTypes = [
  "undefined",
  "null",
  "string",
  "number",
  "boolean",
];
const checkRules = primitiveCheckRules.concat(
  checkArrayRule1,
  checkArrayRule2,
  checkObjectRule
);

// -----------------------------------------------------------------------------
// validateObject
// -----------------------------------------------------------------------------

test("validateObject matches with all attributes", () => {
  const expectedButMissing: string[] = [];
  const typeMismatch: string[] = [];
  const unexpectedAttribute: string[] = [];

  testFunctions.validateObject(
    "testAttribute",
    { test: "Hello World!", test2: 42 },
    checkObjectRule,
    expectedButMissing,
    typeMismatch,
    unexpectedAttribute
  );

  expect(expectedButMissing).toStrictEqual([]);
  expect(typeMismatch).toStrictEqual([]);
  expect(unexpectedAttribute).toStrictEqual([]);
});

test("validateObject matches with optional attributes", () => {
  const expectedButMissing: string[] = [];
  const typeMismatch: string[] = [];
  const unexpectedAttribute: string[] = [];

  testFunctions.validateObject(
    "testAttribute",
    { test2: 42 },
    checkObjectRule,
    expectedButMissing,
    typeMismatch,
    unexpectedAttribute
  );

  expect(expectedButMissing).toStrictEqual([]);
  expect(typeMismatch).toStrictEqual([]);
  expect(unexpectedAttribute).toStrictEqual([]);
});

test("validateObject fails on missing required attribute", () => {
  const expectedButMissing: string[] = [];
  const typeMismatch: string[] = [];
  const unexpectedAttribute: string[] = [];

  testFunctions.validateObject(
    "testAttribute",
    { test: "Hello World!" },
    checkObjectRule,
    expectedButMissing,
    typeMismatch,
    unexpectedAttribute
  );

  expect(typeMismatch).toStrictEqual([]);
  expect(unexpectedAttribute).toStrictEqual([]);
  expect(expectedButMissing.length).toBe(1);
  expect(expectedButMissing).toContain("testAttribute.test2");
});

test("validateObject fails on extra attribute", () => {
  const expectedButMissing: string[] = [];
  const typeMismatch: string[] = [];
  const unexpectedAttribute: string[] = [];

  testFunctions.validateObject(
    "testAttribute",
    { test: "Hello World!", test2: 3, test3: "Howdy!" },
    checkObjectRule,
    expectedButMissing,
    typeMismatch,
    unexpectedAttribute
  );

  expect(expectedButMissing).toStrictEqual([]);
  expect(typeMismatch).toStrictEqual([]);
  expect(unexpectedAttribute.length).toBe(1);
  expect(unexpectedAttribute).toContain("testAttribute.test3");
});

// -----------------------------------------------------------------------------
// validateArray
// -----------------------------------------------------------------------------

test("validateArray matches empty array", () => {
  const expectedButMissing: string[] = [];
  const typeMismatch: string[] = [];
  const unexpectedAttribute: string[] = [];

  testFunctions.validateArray(
    "testAttribute",
    [],
    checkArrayRule1.rules,
    expectedButMissing,
    typeMismatch,
    unexpectedAttribute
  );

  expect(expectedButMissing).toStrictEqual([]);
  expect(typeMismatch).toStrictEqual([]);
  expect(unexpectedAttribute).toStrictEqual([]);
});

test("validateArray matches if all match", () => {
  const expectedButMissing: string[] = [];
  const typeMismatch: string[] = [];
  const unexpectedAttribute: string[] = [];

  testFunctions.validateArray(
    "testAttribute",
    ["test", 0, "anotherTest", 1],
    checkArrayRule1.rules,
    expectedButMissing,
    typeMismatch,
    unexpectedAttribute
  );

  expect(expectedButMissing).toStrictEqual([]);
  expect(typeMismatch).toStrictEqual([]);
  expect(unexpectedAttribute).toStrictEqual([]);
});

test("validateArray fails to match on partial mismatch", () => {
  const expectedButMissing: string[] = [];
  const typeMismatch: string[] = [];
  const unexpectedAttribute: string[] = [];

  testFunctions.validateArray(
    "testAttribute",
    ["test", 0, false, "anotherTest", 1, undefined],
    checkArrayRule1.rules,
    expectedButMissing,
    typeMismatch,
    unexpectedAttribute
  );

  expect(expectedButMissing).toStrictEqual([]);
  expect(unexpectedAttribute).toStrictEqual([]);
  expect(typeMismatch.length).toBe(2);
  expect(typeMismatch[0].includes("testAttribute[2]")).toBe(true);
  expect(typeMismatch[0].includes("[string, number]")).toBe(true);
  expect(typeMismatch[0].includes("was boolean")).toBe(true);
  expect(typeMismatch[1].includes("testAttribute[5]")).toBe(true);
  expect(typeMismatch[1].includes("[string, number]")).toBe(true);
  expect(typeMismatch[1].includes("was undefined")).toBe(true);
});

// -----------------------------------------------------------------------------
// validateAttribute
// -----------------------------------------------------------------------------

test("validateAttribute matches single primitive rule", () => {
  const expectedButMissing: string[] = [];
  const typeMismatch: string[] = [];
  const unexpectedAttribute: string[] = [];

  testFunctions.validateAttribute(
    "testAttribute",
    0,
    ["number"],
    expectedButMissing,
    typeMismatch,
    unexpectedAttribute
  );

  expect(expectedButMissing).toStrictEqual([]);
  expect(typeMismatch).toStrictEqual([]);
  expect(unexpectedAttribute).toStrictEqual([]);
});

test("validateAttribute matches multiple primitive rule", () => {
  const expectedButMissing: string[] = [];
  const typeMismatch: string[] = [];
  const unexpectedAttribute: string[] = [];

  testFunctions.validateAttribute(
    "testAttribute",
    undefined,
    ["string", "undefined"],
    expectedButMissing,
    typeMismatch,
    unexpectedAttribute
  );

  expect(expectedButMissing).toStrictEqual([]);
  expect(typeMismatch).toStrictEqual([]);
  expect(unexpectedAttribute).toStrictEqual([]);
});

test("validateAttribute fails to match on single primitive rule", () => {
  const expectedButMissing: string[] = [];
  const typeMismatch: string[] = [];
  const unexpectedAttribute: string[] = [];

  testFunctions.validateAttribute(
    "testAttribute",
    null,
    ["string"],
    expectedButMissing,
    typeMismatch,
    unexpectedAttribute
  );

  expect(expectedButMissing).toStrictEqual([]);
  expect(unexpectedAttribute).toStrictEqual([]);
  expect(typeMismatch.length).toBe(1);
  expect(typeMismatch[0].includes("testAttribute")).toBe(true);
  expect(typeMismatch[0].includes("[string]")).toBe(true);
  expect(typeMismatch[0].includes("was null")).toBe(true);
});

test("validateAttribute fails to match on multiple primitive rule", () => {
  const expectedButMissing: string[] = [];
  const typeMismatch: string[] = [];
  const unexpectedAttribute: string[] = [];

  testFunctions.validateAttribute(
    "testAttribute",
    false,
    ["string", "undefined"],
    expectedButMissing,
    typeMismatch,
    unexpectedAttribute
  );

  expect(expectedButMissing).toStrictEqual([]);
  expect(unexpectedAttribute).toStrictEqual([]);
  expect(typeMismatch.length).toBe(1);
  expect(typeMismatch[0].includes("testAttribute")).toBe(true);
  expect(typeMismatch[0].includes("[string, undefined]")).toBe(true);
  expect(typeMismatch[0].includes("was boolean")).toBe(true);
});

test("validateAttribute fails to match on no primitive rule", () => {
  const expectedButMissing: string[] = [];
  const typeMismatch: string[] = [];
  const unexpectedAttribute: string[] = [];

  testFunctions.validateAttribute(
    "testAttribute",
    0,
    [checkArrayRule1, checkArrayRule2, checkObjectRule],
    expectedButMissing,
    typeMismatch,
    unexpectedAttribute
  );

  expect(expectedButMissing).toStrictEqual([]);
  expect(unexpectedAttribute).toStrictEqual([]);
  expect(typeMismatch.length).toBe(1);
  expect(typeMismatch[0].includes("testAttribute")).toBe(true);
  expect(typeMismatch[0].includes("[array, object]")).toBe(true);
  expect(typeMismatch[0].includes("was number")).toBe(true);
});

test("validateAttribute passes to validateArray on single array handler", () => {
  const expectedButMissing: string[] = [];
  const typeMismatch: string[] = [];
  const unexpectedAttribute: string[] = [];

  testFunctions.validateAttribute(
    "testAttribute",
    ["test", 0],
    [checkArrayRule1],
    expectedButMissing,
    typeMismatch,
    unexpectedAttribute
  );

  expect(expectedButMissing).toStrictEqual([]);
  expect(typeMismatch).toStrictEqual([]);
  expect(unexpectedAttribute).toStrictEqual([]);
});

test("validateAttribute throws error on multiple array handlers", () => {
  const expectedButMissing: string[] = [];
  const typeMismatch: string[] = [];
  const unexpectedAttribute: string[] = [];

  const thisShouldError = () => {
    testFunctions.validateAttribute(
      "testAttribute",
      ["test", 0],
      [checkArrayRule1, checkArrayRule2],
      expectedButMissing,
      typeMismatch,
      unexpectedAttribute
    );
  };

  expect(thisShouldError).toThrow();
});

test("validateAttribute fails to match on no array handlers", () => {
  const expectedButMissing: string[] = [];
  const typeMismatch: string[] = [];
  const unexpectedAttribute: string[] = [];

  testFunctions.validateAttribute(
    "testAttribute",
    ["test", 0],
    ["string"],
    expectedButMissing,
    typeMismatch,
    unexpectedAttribute
  );

  expect(expectedButMissing).toStrictEqual([]);
  expect(unexpectedAttribute).toStrictEqual([]);
  expect(typeMismatch.length).toBe(1);
  expect(typeMismatch[0].includes("testAttribute")).toBe(true);
  expect(typeMismatch[0].includes("[string]")).toBe(true);
  expect(typeMismatch[0].includes("was array")).toBe(true);
});

test("validateAttribute passes to validateObject on single object handler", () => {
  const expectedButMissing: string[] = [];
  const typeMismatch: string[] = [];
  const unexpectedAttribute: string[] = [];

  testFunctions.validateAttribute(
    "testAttribute",
    { test: "Hello World", test2: 0 },
    [checkObjectRule],
    expectedButMissing,
    typeMismatch,
    unexpectedAttribute
  );

  expect(expectedButMissing).toStrictEqual([]);
  expect(typeMismatch).toStrictEqual([]);
  expect(unexpectedAttribute).toStrictEqual([]);
});

test("validateAttribute throws error on multiple object handlers", () => {
  const expectedButMissing: string[] = [];
  const typeMismatch: string[] = [];
  const unexpectedAttribute: string[] = [];

  const thisShouldError = () => {
    testFunctions.validateAttribute(
      "testAttribute",
      { test: "Hello World", test2: 0 },
      [checkObjectRule, checkObjectRule],
      expectedButMissing,
      typeMismatch,
      unexpectedAttribute
    );
  };

  expect(thisShouldError).toThrow();
});

test("validateAttribute fails to match on no object handlers", () => {
  const expectedButMissing: string[] = [];
  const typeMismatch: string[] = [];
  const unexpectedAttribute: string[] = [];

  testFunctions.validateAttribute(
    "testAttribute",
    { test: "Hello World", test2: 0 },
    ["string"],
    expectedButMissing,
    typeMismatch,
    unexpectedAttribute
  );

  expect(expectedButMissing).toStrictEqual([]);
  expect(unexpectedAttribute).toStrictEqual([]);
  expect(typeMismatch.length).toBe(1);
  expect(typeMismatch[0].includes("testAttribute")).toBe(true);
  expect(typeMismatch[0].includes("[string]")).toBe(true);
  expect(typeMismatch[0].includes("was object")).toBe(true);
});

test("validateAttribute matches empty string when allowed", () => {
  const expectedButMissing: string[] = [];
  const typeMismatch: string[] = [];
  const unexpectedAttribute: string[] = [];

  testFunctions.validateAttribute(
    "testAttribute",
    "",
    ["string", "emptystring"],
    expectedButMissing,
    typeMismatch,
    unexpectedAttribute
  );

  expect(expectedButMissing).toStrictEqual([]);
  expect(typeMismatch).toStrictEqual([]);
  expect(unexpectedAttribute).toStrictEqual([]);
});

test("validateAttribute fails on empty string when now allowed", () => {
  const expectedButMissing: string[] = [];
  const typeMismatch: string[] = [];
  const unexpectedAttribute: string[] = [];

  testFunctions.validateAttribute(
    "testAttribute",
    "",
    ["string"],
    expectedButMissing,
    typeMismatch,
    unexpectedAttribute
  );

  expect(expectedButMissing).toStrictEqual([]);
  expect(unexpectedAttribute).toStrictEqual([]);
  expect(typeMismatch.length).toBe(1);
  expect(typeMismatch[0].includes("testAttribute")).toBe(true);
  expect(typeMismatch[0].includes("[string]")).toBe(true);
  expect(typeMismatch[0].includes("was emptystring")).toBe(true);
});

// -----------------------------------------------------------------------------
// getAdvancedTypeHandlers
// -----------------------------------------------------------------------------

test("getAdvancedTypeHandlers gets array handlers", () => {
  expect(
    testFunctions.getAdvancedTypeHandlers(checkRules, "array")
  ).toStrictEqual([checkArrayRule1, checkArrayRule2]);
});

test("getAdvancedTypeHandlers gets object handlers", () => {
  expect(
    testFunctions.getAdvancedTypeHandlers(checkRules, "object")
  ).toStrictEqual([checkObjectRule]);
});

test("getAdvancedTypeHandlers gets handles no advanced types", () => {
  expect(
    testFunctions.getAdvancedTypeHandlers(primitiveCheckRules, "object")
  ).toStrictEqual([]);
});

// -----------------------------------------------------------------------------
// getTypesForErrorMessage
// -----------------------------------------------------------------------------

test("getTypesForErrorMessage returns user-friendly data types", () => {
  const expectedArray = [
    "undefined",
    "null",
    "string",
    "number",
    "boolean",
    "array",
    "object",
  ];

  expect(testFunctions.getTypesForErrorMessage(checkRules)).toBe(
    `[${expectedArray.join(", ")}]`
  );
});

// -----------------------------------------------------------------------------
// pushIfArrayDoesNotAlreadyInclude
// -----------------------------------------------------------------------------

const pushIfArrayDoesNotAlreadyIncludeInputArray = [
  "itemA",
  "itemB",
  "itemC",
  null,
  undefined,
  0,
  1,
  ["test"],
  { test: "test" },
  true,
  false,
];

test("pushIfArrayDoesNotAlreadyInclude includes all elements if there are no duplicates", () => {
  const outputArray: any[] = [];
  for (const item of pushIfArrayDoesNotAlreadyIncludeInputArray) {
    testFunctions.pushIfArrayDoesNotAlreadyInclude(outputArray, item);
  }
  expect(outputArray).toStrictEqual(pushIfArrayDoesNotAlreadyIncludeInputArray);
});

test("pushIfArrayDoesNotAlreadyInclude filters out duplicates", () => {
  const addedExtraItems = ([] as any[]).concat(
    pushIfArrayDoesNotAlreadyIncludeInputArray
  );
  addedExtraItems.concat(pushIfArrayDoesNotAlreadyIncludeInputArray);

  const outputArray: any[] = [];
  for (const item of addedExtraItems) {
    testFunctions.pushIfArrayDoesNotAlreadyInclude(outputArray, item);
  }
  expect(outputArray).toStrictEqual(pushIfArrayDoesNotAlreadyIncludeInputArray);
});

// -----------------------------------------------------------------------------
// generateFullAttributeName
// -----------------------------------------------------------------------------

test("generateFullAttributeName returns attribute name for top level attributes", () => {
  expect(testFunctions.generateFullAttributeName("", "thisIsAnAttribute")).toBe(
    "thisIsAnAttribute"
  );
});

test("generateFullAttributeName concatenates attributeRoot and attribute for non top-level attributes", () => {
  expect(
    testFunctions.generateFullAttributeName(
      "thisIsTheRoot",
      "thisIsAnAttribute"
    )
  ).toBe("thisIsTheRoot.thisIsAnAttribute");
});
