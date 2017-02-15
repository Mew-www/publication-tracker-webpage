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

  constructor(tmdb_result_object, movie_genremap: Array<any>) {
    this.themoviedb_id     = tmdb_result_object.id;
    this.name              = tmdb_result_object.title;
    this.original_title    = tmdb_result_object.original_title;
    this.original_language = tmdb_result_object.original_language;
    this.release_date      = new Date(tmdb_result_object.release_date);
    this.genres            = tmdb_result_object.genre_ids.map(genre_id => {
      let genre = movie_genremap.find(x => x.id === genre_id);
      return genre ? genre.name : "Unknown genre #"+genre_id;
    });
    this.overview          = tmdb_result_object.overview;
  }

  public getFullName = () => {
    return this.name + (this.original_title && this.name !== this.original_title ? ` (${this.original_title})` : "");
  };
}