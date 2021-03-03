import { generateFullAttributeName } from "./typeValidator";

test("generateFullAttributeName returns attribute name for top level attributes", () => {
  expect(generateFullAttributeName("", "thisIsAnAttribute")).toBe(
    "thisIsAnAttribute"
  );
});

test("generateFullAttributeName concatenates attributeRoot and attribute for non top-level attributes", () => {
  expect(generateFullAttributeName("thisIsTheRoot", "thisIsAnAttribute")).toBe(
    "thisIsTheRoot.thisIsAnAttribute"
  );
});
