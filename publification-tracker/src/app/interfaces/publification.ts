import {PublificationType} from "../enums/publification-type";

export interface Publification {
  type: PublificationType;
  name: string;
  release_date: Date;
  genres: Array<string>;

  getReleaseDate(): Date;
  getFullName(): string;
}