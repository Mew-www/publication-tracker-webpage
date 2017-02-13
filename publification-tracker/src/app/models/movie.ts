import {Publification} from "../interfaces/publification";
import {PublificationType} from "../enums/publification-type";

export class Movie implements Publification {
  public type: PublificationType = PublificationType.MOVIE;
  public name: string;
  public release_date: Date;
  public genres: Array<string>;

  public getReleaseDate = () => {
    // TODO: Actual implementation
    return new Date();
  };
  public getFullName = () => {
    // TODO: Actual implementation
    return "";
  };
}