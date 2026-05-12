import type { WaliSantriCategory } from "../../../../generated/index.js";

export interface ICreateWaliRelation {
  waliId: string;
  santriId: string;
  category: WaliSantriCategory;
}

export interface IUpdateWaliRelation {
  category: WaliSantriCategory;
}
