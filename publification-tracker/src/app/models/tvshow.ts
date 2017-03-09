import {Publification} from "../interfaces/publification";
import {PublificationType} from "../enums/publification-type";

export class Tvshow implements Publification {
  //Generic publification properties
  public type: PublificationType = PublificationType.TVSHOW;
  public name: string;
  public release_date: Date;
  public genres: Array<string>;
  public uid: string;
  //Tvshow (TMDB API) specific properties
  private themoviedb_id: Number;
  private original_title: string;
  private original_language: string;
  private overview: string;

  constructor(tmdb_result_object, tvshow_genremap: Array<any>, alternative_json_constructor?) {
    if (alternative_json_constructor) {
      let old_object = JSON.parse(alternative_json_constructor);
      this.themoviedb_id     = old_object.themoviedb_id;
      this.name              = old_object.name;
      this.original_title    = old_object.original_title;
      this.original_language = old_object.original_language;
      this.release_date      = new Date(old_object.release_date);
      this.genres            = old_object.genres;
      this.overview          = old_object.overview;
      this.uid               = old_object.uid;
      return;
    }

    this.uid               = "TVSHOW#" + tmdb_result_object.id;
    this.themoviedb_id     = tmdb_result_object.id;
    this.name              = tmdb_result_object.name;
    this.original_title    = tmdb_result_object.original_name;
    this.original_language = tmdb_result_object.original_language;
    this.release_date      = tmdb_result_object.first_air_date ? new Date(tmdb_result_object.first_air_date) : undefined;
    this.genres            = tmdb_result_object.genre_ids.map(genre_id => {
      let genre = tvshow_genremap.find(x => x.id === genre_id);
      return genre ? genre.name : "Unknown genre #"+genre_id;
    });
    this.overview          = tmdb_result_object.overview;
  }

  public getFullName = () => {
    return this.name + (this.original_title && this.name !== this.original_title ? ` (${this.original_title})` : "");
  };

  public getReleaseDateAsString = () => {
    if (this.release_date)
      return this.release_date.getUTCDate() + ". "
        + (this.release_date.getUTCMonth()+1).toString() + ". "
        + this.release_date.getUTCFullYear();
    else
      return "Unknown release date";
  };

  public toSimpleObject = () => {
    return {
      "type":              "TVSHOW", // Use strings instead of ENUM if the ENUM was to change between versions

      "uid":               this.uid,
      "themoviedb_id":     this.themoviedb_id, // Number
      "name":              this.name,
      "original_title":    this.original_title,
      "original_language": this.original_language,
      "release_date":      JSON.stringify(this.release_date), // Date -> gets converted to epoch by JSON.stringify
      "genres":            this.genres, // Array
      "overview":          this.overview
    };
  };

}