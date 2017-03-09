import {PublificationType} from "../enums/publification-type";

export interface Publification {
  type: PublificationType;
  name: string;
  release_date: Date;
  genres: Array<string>;

  uid: string;

  getFullName(): string;
  getReleaseDateAsString(): string;
  toSimpleObject(): Object; // Could we "toJSON" but ... for <reasons> it's not
}