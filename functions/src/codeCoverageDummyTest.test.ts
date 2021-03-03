import { codeCoverageDummyTestFunction } from ".";

test("Dummy test to generate complete code coverage report", () => {
  expect(codeCoverageDummyTestFunction()).toBe(true);
});
