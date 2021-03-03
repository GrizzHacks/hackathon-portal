import { ExpressFunction } from "../@types";
import { expressErrorHandlerFactory } from ".";

export const parseJsonBodyAndValidateTypeFactory: ExpressFunction<
  (checkRules: ValidatorObjectRules, callback: ExpressFunction) => void
> = (req, res, next) => (checkRules, callback) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  try {
    const expectedButMissing: string[] = [];
    const typeMismatch: string[] = [];
    const unexpectedAttribute: string[] = [];

    const jsonObject = JSON.parse(req.body);

    validateObject(
      "",
      jsonObject,
      checkRules,
      expectedButMissing,
      typeMismatch,
      unexpectedAttribute
    );

    if (
      expectedButMissing.length === 0 &&
      typeMismatch.length === 0 &&
      unexpectedAttribute.length === 0
    ) {
      res.locals.parsedBody;
    } else {
      const allErrorMessages = [];
      if (expectedButMissing.length > 0) {
        allErrorMessages.push(`Expected ${expectedButMissing.join(", ")}`);
      }
      if (unexpectedAttribute.length > 0) {
        allErrorMessages.push(
          `Did not expect ${unexpectedAttribute.join(", ")}`
        );
      }
      allErrorMessages.push(typeMismatch);
      const message = `Error parsing request body: ${allErrorMessages.join(
        "; "
      )}`;
      errorHandler(message, 400, message);
    }
  } catch (err) {
    const error = err as Error;
    const error501 = error.message.includes("Branching validation");
    errorHandler(
      err,
      error501 ? 501 : 400,
      `Error parsing request body: ${error.message}`,
      error501 ? "ERROR" : "WARN"
    );
  }
};

const validateObject = (
  attributeRoot: string,
  object: { [key: string]: any },
  checkRulesObject: ValidatorObjectRules,
  expectedButMissing: string[],
  typeMismatch: string[],
  unexpectedAttribute: string[]
) => {
  const checkRules = checkRulesObject.rules;

  // Determine all required attributes
  for (const attribute in checkRules) {
    if (checkRules[attribute].required) {
      expectedButMissing.push(
        generateFullAttributeName(attributeRoot, attribute)
      ); // Log attribute as required
    } else {
      checkRules[attribute].rules.push("undefined"); // Allow "undefined" as valid input for optional attributes
    }
  }

  for (const attribute in object) {
    const fullAttribute = generateFullAttributeName(attributeRoot, attribute);
    if (checkRules[attribute] !== undefined) {
      expectedButMissing.splice(expectedButMissing.indexOf(fullAttribute), 1); // Remove from missing list
      // Validate the attribute
      validateAttribute(
        fullAttribute,
        object[attribute],
        checkRules[attribute].rules,
        expectedButMissing,
        typeMismatch,
        unexpectedAttribute
      );
    } else {
      unexpectedAttribute.push(fullAttribute); // Add to unexpected list
    }
  }
};

const validateArray = (
  attributeRoot: string,
  array: any,
  checkRules: ValidatorAllowedTypes,
  expectedButMissing: string[],
  typeMismatch: string[],
  unexpectedAttribute: string[]
) => {
  if (Array.isArray(array)) {
    for (let i = 0; i < array.length; i++) {
      // Validate each item in the array
      validateAttribute(
        `${attributeRoot}[${i}]`,
        array[i],
        checkRules,
        expectedButMissing,
        typeMismatch,
        unexpectedAttribute
      );
    }
  } else {
    // Not an array!
    typeMismatch.push(
      `Expected ${attributeRoot} to be an array; was ${typeof attributeRoot}`
    );
  }
};

const validateAttribute = (
  attributeRoot: string,
  attributeValue: any,
  checkRules: ValidatorAllowedTypes,
  expectedButMissing: string[],
  typeMismatch: string[],
  unexpectedAttribute: string[]
) => {
  const attributeType =
    attributeValue === null
      ? "null"
      : Array.isArray(attributeValue)
      ? "array"
      : typeof attributeRoot;

  const arrayHandlers = getAdvancedTypeHandlers(
    checkRules,
    "array"
  ) as ValidatorArrayRules[];
  const objectHandlers = getAdvancedTypeHandlers(
    checkRules,
    "object"
  ) as ValidatorObjectRules[];

  if (attributeType === "array" && arrayHandlers.length > 0) {
    // Handle attribute as array
    if (arrayHandlers.length === 1) {
      // No branching required; directly pass up any errors
      validateArray(
        attributeRoot,
        attributeValue,
        arrayHandlers[0].rules,
        expectedButMissing,
        typeMismatch,
        unexpectedAttribute
      );
    } else {
      // Branching required; multiple object types are possible
      // TODO: Implement type branching for objects
      throw new Error(
        "Branching validation to handle multiple acceptable objects is not yet implemented."
      );
    }
  } else if (attributeType === "object" && objectHandlers.length > 0) {
    // Handle attribute as object
    if (arrayHandlers.length === 1) {
      // No branching required; directly pass up any errors
      validateObject(
        attributeRoot,
        attributeValue,
        objectHandlers[0],
        expectedButMissing,
        typeMismatch,
        unexpectedAttribute
      );
    } else {
      // Branching required; multiple object types are possible
      // TODO: Implement type branching for objects
      throw new Error(
        "Branching validation to handle multiple acceptable objects is not yet implemented."
      );
    }
  } else if (
    attributeType !== "array" &&
    attributeType !== "object" &&
    checkRules.includes(attributeType)
  ) {
    // Handle attribute as primiative
  } else {
    // Mismatched Data Type
    const allowedTypes = getTypesForErrorMessage(checkRules);
    typeMismatch.push(
      `Expected ${attributeRoot} to be one of the following types: ${allowedTypes}, but was ${typeof attributeRoot}`
    );
  }
};

const getAdvancedTypeHandlers = (
  checkRules: ValidatorAllowedTypes,
  handlerType: "array" | "object"
) => {
  const handlers = [];
  for (const allowedType of checkRules) {
    if (typeof allowedType !== "string" && handlerType === allowedType.type) {
      handlers.push(allowedType);
    }
  }

  return handlers;
};

const getTypesForErrorMessage = (checkRules: ValidatorAllowedTypes) => {
  const allowedTypes: string[] = [];
  for (const allowedType of checkRules) {
    if (typeof allowedType === "string") {
      pushIfArrayDoesNotAlreadyInclude<string>(allowedTypes, allowedType);
    } else {
      if (allowedType.type === "array") {
        pushIfArrayDoesNotAlreadyInclude<string>(allowedTypes, "array");
      } else {
        pushIfArrayDoesNotAlreadyInclude<string>(allowedTypes, "object");
      }
    }
  }
  return `[${allowedTypes.join(", ")}]`;
};

const pushIfArrayDoesNotAlreadyInclude = <T>(array: T[], item: T) => {
  if (!array.includes(item)) {
    array.push(item);
  }
};

export const generateFullAttributeName = (
  attributeRoot: string,
  attribute: string
) => {
  return attributeRoot ? `${attributeRoot}.${attribute}` : attribute;
};
