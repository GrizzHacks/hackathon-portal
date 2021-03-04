declare interface ValidatorAdvancedTypeRules {
  rules: any;
  type: "array" | "object";
}

declare interface ValidatorObjectRules extends ValidatorAdvancedTypeRules {
  rules: {
    [key: string]: { rules: ValidatorAllowedTypes; required?: boolean };
  };
  type: "object";
}

declare interface ValidatorArrayRules extends ValidatorAdvancedTypeRules {
  rules: ValidatorAllowedTypes;
  type: "array";
}

declare type ValidatorAllowedTypes = (primitive | ValidatorAdvancedTypeRules)[];

declare type primitive =
  | "string"
  | "number"
  | "bigint"
  | "symbol"
  | "null"
  | "undefined"
  | "boolean"
  | "function";
