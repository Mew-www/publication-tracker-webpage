import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs";
import {Movie} from "../models/movie";
import {Tvshow} from "../models/tvshow";
import {DeferredPromise} from "../helpers/deferred-promise";
import {TMDB_API_KEY} from "../tmdb-api-key";

@Injectable()
export class ThemoviedbService {

  //API properties
  private api_key: string = TMDB_API_KEY;
  private lang_code: string = "en-US"; // TODO: i18n
  // Genremaps
  private movie_genremap: Array<any>;
  private tvshow_genremap: Array<any>;
  public genremaps_ready: boolean = false;
  // Previous result set (and pagination properties) -- bind to these
  public loading_new_results: boolean = false;
  public movie_results: Array<Movie> = [];
  public tvshow_results: Array<Tvshow> = [];
  public movie_pagination_pending: boolean = false;
  public tvshow_pagination_pending: boolean = false;
  private movie_start_page: Number;
  private tvshow_start_page: Number;

  constructor(private http: Http) {
    this.updateGenremaps();
  }

  private updateGenremaps = () => {
    let movie_genremap_request = this.http
      .get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${this.api_key}&language=${this.lang_code}`)
      .map(res => res.json());
    let tvserie_genremap_request = this.http
      .get(`https://api.themoviedb.org/3/genre/tv/list?api_key=${this.api_key}&language=${this.lang_code}`)
      .map(res => res.json());

    Observable.forkJoin([movie_genremap_request, tvserie_genremap_request]) // Works like Promise.all()
      .subscribe(results => {
        this.movie_genremap = results[0];
        this.tvshow_genremap = results[1];
        this.genremaps_ready = true;
      });
  };

  private getMoviesJsonByQuery = (query, page?) => {
    return this.http.get(
      `https://api.themoviedb.org/3/search/movie`
      + `?api_key=${this.api_key}`
      + `&language=${this.lang_code}`
      + `&include_adult=true`
      + `&query=${encodeURIComponent(query)}`
      + (page ? `&page=${page}` : "")
    )
      .map(res => res.json());
  };

  private getTvshowsJsonByQuery = (query, page?) => {
    return this.http.get(
      `https://api.themoviedb.org/3/search/tv`
      + `?api_key=${this.api_key}`
      + `&language=${this.lang_code}`
      + `&query=${encodeURIComponent(query)}`
      + (page ? `&page=${page}` : "")
    )
      .map(res => res.json());
  };

  loadMoviesAndTvseriesByWildcard = (query: string) => {

    let loadMoviesPaginated = function(current_page, prev_results, deferredCompletion: DeferredPromise) {
      this.getMoviesJsonByQuery(query, current_page)
        .subscribe(response => {
          let results_so_far = prev_results.concat(response.results);

          if (current_page > (this.movie_start_page+9)) {
            // If limit of 10 pages exceeded
            this.movie_results = results_so_far.map(movie => { return new Movie(movie, this.movie_genremap); });
            this.movie_pagination_pending = true;
            this.movie_start_page = current_page;
            deferredCompletion.resolve();
          } else if (response.total_pages > current_page) {
            // If we have more total pages
            loadMoviesPaginated((current_page+1), results_so_far, deferredCompletion);
          } else {
            // If we have all results and nothing more to page
            this.movie_results = results_so_far.map(movie => { return new Movie(movie, this.movie_genremap); });
            this.movie_pagination_pending = false;
            deferredCompletion.resolve();
          }
        });
    }.bind(this);
    let loadTvshowsPaginated = function(current_page, prev_results, deferredCompletion: DeferredPromise) {
      this.getTvshowsJsonByQuery(query, current_page)
        .subscribe(response => {
          let results_so_far = prev_results.concat(response.results);

          if (current_page > (this.tvshow_start_page+9)) {
            // If limit of 10 pages exceeded
            this.tvshow_results = results_so_far.map(tvshow => { return new Tvshow(tvshow, this.tvshow_genremap); });
            this.tvshow_pagination_pending = true;
            this.tvshow_start_page = current_page;
            deferredCompletion.resolve();
          } else if (response.total_pages > current_page) {
            // If we have more total pages
            loadTvshowsPaginated((current_page+1), results_so_far, deferredCompletion);
          } else {
            // If we have all results and nothing more to page
            this.tvshow_results = results_so_far.map(tvshow => { return new Tvshow(tvshow, this.tvshow_genremap); });
            this.tvshow_pagination_pending = false;
            deferredCompletion.resolve();
          }
        });
    }.bind(this);

    this.loading_new_results = true;

    this.getMoviesJsonByQuery(query)
      .subscribe(first_results => {
        if (first_results.total_pages === 1) {
          this.movie_results = first_results.results
            .map(movie => {
              return new Movie(movie, this.movie_genremap);
            });
          this.loading_new_results = false;
        } else {
          // Paginate maximum of 10 times and cache
          this.movie_pagination_pending  = true;
          this.tvshow_pagination_pending = true;
          this.movie_start_page  = 1;
          this.tvshow_start_page = 1;
          let deferredMovieLoad = new DeferredPromise();
          let deferredTvshowLoad = new DeferredPromise();
          loadMoviesPaginated(2, [], deferredMovieLoad);
          loadTvshowsPaginated(2, [], deferredTvshowLoad);
          Promise.all([deferredMovieLoad.promise, deferredTvshowLoad.promise])
            .then(() => {
              this.loading_new_results = false;
            });
        }
      });
  };

}
