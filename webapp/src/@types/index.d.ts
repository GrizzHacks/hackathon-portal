declare interface CreateDetailEditPageAttribute<ParentObject, AttributeType> {
  attributeName: keyof ParentObject;
  attributeLabel: string;
  allowEmptyString?: boolean;
  attributeTypeIsNumber?: boolean;
  attributeOptions?: { label: string; value: AttributeType }[];
  immutable?: boolean;
}

declare interface GenericListItemInfo {
  key: string;
  line1: string;
  line2?: string;
  multiline?: boolean;
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  detailedViewLink: string;
  deleteEndpoint: string;
}
