import { Component } from "react";

declare interface GenericListSchema {
  key: string;
  line1: string;
  line2: string | undefined;
  multiline: boolean | undefined;
  icon: React.Component | undefined;
  detailedViewLink: string | undefined;
  detailedViewText: string | undefined;
  deleteEndpoint: string | undefined;
  deleteText: string | undefined;
}
