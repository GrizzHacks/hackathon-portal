declare interface CreateDetailEditPageAttribute<ParentObject, AttributeType> {
  attributeName: keyof ParentObject;
  attributeLabel: string;
  allowEmptyString?: boolean;
  attributeTypeIsNumber?: boolean;
  attributeOptions?: { label: string; value: AttributeType }[];
  immutable?: boolean;
}
