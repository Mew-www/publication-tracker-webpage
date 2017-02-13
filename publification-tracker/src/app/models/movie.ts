import {Publification} from "../interfaces/publification";
import {PublificationType} from "../enums/publification-type";

export class Movie implements Publification {
  //Generic publification properties
  public type: PublificationType = PublificationType.MOVIE;
  public name: string;
  public release_date: Date;
  public genres: Array<string>;
  //Movie (TMDB API) specific properties
  private themoviedb_id: Number;
  private original_title: string;
  private original_language: string;
  private overview: string;

  public getFullName = () => {
    return this.name + (this.original_title && this.name !== this.original_title ? ` (${this.original_title})` : "");
  };
}