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

  // Config
  private static maximum_pages_per_query: Number = 10;

  // BIND TO THESE: Genremap status, previous result set, and pagination properties
  public genremaps_ready: boolean           = false;
  public loading_new_results: boolean       = false;
  public movie_results: Array<Movie>        = [];
  public tvshow_results: Array<Tvshow>      = [];
  public movie_pagination_pending: boolean  = false;
  public tvshow_pagination_pending: boolean = false;

  // API properties
  private api_key: string = TMDB_API_KEY; // TODO: Optional setter in the GUI, Oppa BYOB style .\../
  private lang_code: string = "en-US"; // TODO: i18n
  // Genremaps
  private movie_genremap: Array<any>;
  private tvshow_genremap: Array<any>;
  // Pagination
  private paginated_query: string;
  private movie_pages_prev_stop: Number;
  private tvshow_pages_prev_stop: Number;

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
        this.movie_genremap = results[0].genres;
        this.tvshow_genremap = results[1].genres;
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

  // TODO: API error handling (specificly rate limiting...)
  public loadMoviesAndTvseriesByWildcard = (query: string) => {

    // Helper functions to recursively request new pages (and .resolve() after EITHER done OR limit reached)
    let loadMoviesPaginated  = function(current_page, prev_results, deferredCompletion: DeferredPromise) {
      this.getMoviesJsonByQuery(query, current_page)
        .subscribe(response => {
          let results_so_far = prev_results.concat(
            response.results.map(movieJson => { return new Movie(movieJson, this.movie_genremap); })
          );

          if (current_page > (this.movie_pages_prev_stop+this.maximum_pages_per_query)) {
            // If limit reached
            this.movie_pagination_pending = true;
            this.movie_pages_prev_stop    = current_page;
            this.paginated_query          = query;
            this.movie_results            = results_so_far;
            deferredCompletion.resolve();
          } else if (response.total_pages > current_page) {
            // If we have more total pages
            loadMoviesPaginated((current_page+1), results_so_far, deferredCompletion);
          } else {
            // If we have all results and nothing more to page
            this.movie_pagination_pending = false;
            this.movie_results            = results_so_far;
            deferredCompletion.resolve();
          }
        });
    }.bind(this);
    let loadTvshowsPaginated = function(current_page, prev_results, deferredCompletion: DeferredPromise) {
      this.getTvshowsJsonByQuery(query, current_page)
        .subscribe(response => {
          let results_so_far = prev_results.concat(
            response.results.map(tvshowJson => { return new Tvshow(tvshowJson, this.tvshow_genremap); })
          );

          if (current_page > (this.tvshow_pages_prev_stop+this.maximum_pages_per_query)) {
            // If limit of 10 pages reached
            this.tvshow_pagination_pending = true;
            this.tvshow_pages_prev_stop    = current_page;
            this.paginated_query           = query;
            this.tvshow_results            = results_so_far;
            deferredCompletion.resolve();
          } else if (response.total_pages > current_page) {
            // If we have more total pages
            loadTvshowsPaginated((current_page+1), results_so_far, deferredCompletion);
          } else {
            // If we have all results and nothing more to page
            this.tvshow_pagination_pending = false;
            this.tvshow_results            = results_so_far;
            deferredCompletion.resolve();
          }
        });
    }.bind(this);

    this.movie_results             = [];
    this.tvshow_results            = [];
    this.movie_pagination_pending  = false;
    this.tvshow_pagination_pending = false;
    this.loading_new_results       = true;

    // Request (maximum 10 pages) movies, and keep track of progress in deferred
    let deferredMovieLoad = new DeferredPromise();
    this.getMoviesJsonByQuery(query)
      .subscribe(first_results => {
        if (first_results.total_pages === 1) {
          this.movie_results = first_results.results.map(movieJson => new Movie(movieJson, this.movie_genremap));
          deferredMovieLoad.resolve();
        } else {
          // Paginate maximum of 10 times, cache results, and resolve the promise when done
          this.movie_pages_prev_stop = 0;
          loadMoviesPaginated(2, [], deferredMovieLoad);
        }
      });

    // Request (maximum 10 pages) tvseries, and keep track of progress in deferred
    let deferredTvshowLoad = new DeferredPromise();
    this.getTvshowsJsonByQuery(query)
      .subscribe(first_results => {
        if (first_results.total_pages === 1) {
          this.tvshow_results = first_results.results.map(tvshowJson => new Tvshow(tvshowJson, this.tvshow_genremap));
          deferredTvshowLoad.resolve();
        } else {
          // Paginate maximum of 10 times, cache results, and resolve the promise when done
          this.tvshow_pages_prev_stop = 0;
          loadTvshowsPaginated(2, [], deferredTvshowLoad);
        }
      });

    // After both requests (or chains of requests) are done, set "loading -state" false
    Promise.all([deferredMovieLoad.promise, deferredTvshowLoad.promise])
      .then(() => {
        this.loading_new_results = false;
      });
  };

  // TODO: API error handling (specificly rate limiting...)
  public continueLoadingPaginated = () => {
    // Prevent use if there is nothing to paginate
    if (!this.movie_pagination_pending && !this.tvshow_pagination_pending)
      return;

    let query = this.paginated_query;
    // Helper functions to recursively request new pages (and .resolve() after EITHER done OR limit reached)
    let loadMoviesPaginated  = function(current_page, prev_results, deferredCompletion: DeferredPromise) {
      this.getMoviesJsonByQuery(query, current_page)
        .subscribe(response => {
          let results_so_far = prev_results.concat(
            response.results.map(movieJson => { return new Movie(movieJson, this.movie_genremap); })
          );

          if (current_page > (this.movie_pages_prev_stop+this.maximum_pages_per_query)) {
            // If limit reached
            this.movie_pagination_pending = true;
            this.movie_pages_prev_stop    = current_page;
            this.paginated_query          = query;
            this.movie_results            = results_so_far;
            deferredCompletion.resolve();
          } else if (response.total_pages > current_page) {
            // If we have more total pages
            loadMoviesPaginated((current_page+1), results_so_far, deferredCompletion);
          } else {
            // If we have all results and nothing more to page
            this.movie_pagination_pending = false;
            this.movie_results            = results_so_far;
            deferredCompletion.resolve();
          }
        });
    }.bind(this);
    let loadTvshowsPaginated = function(current_page, prev_results, deferredCompletion: DeferredPromise) {
      this.getTvshowsJsonByQuery(query, current_page)
        .subscribe(response => {
          let results_so_far = prev_results.concat(
            response.results.map(tvshowJson => { return new Tvshow(tvshowJson, this.tvshow_genremap); })
          );

          if (current_page > (this.tvshow_pages_prev_stop+this.maximum_pages_per_query)) {
            // If limit of 10 pages reached
            this.tvshow_pagination_pending = true;
            this.tvshow_pages_prev_stop    = current_page;
            this.paginated_query           = query;
            this.tvshow_results            = results_so_far;
            deferredCompletion.resolve();
          } else if (response.total_pages > current_page) {
            // If we have more total pages
            loadTvshowsPaginated((current_page+1), results_so_far, deferredCompletion);
          } else {
            // If we have all results and nothing more to page
            this.tvshow_pagination_pending = false;
            this.tvshow_results            = results_so_far;
            deferredCompletion.resolve();
          }
        });
    }.bind(this);

    this.loading_new_results = true;

    // Request (maximum 10 pages) movies, and keep track of progress in deferred
    let deferredMovieLoad = new DeferredPromise();
    loadMoviesPaginated(this.movie_pages_prev_stop, this.movie_results, deferredMovieLoad);

    // Request (maximum 10 pages) tvseries, and keep track of progress in deferred
    let deferredTvshowLoad = new DeferredPromise();
    loadTvshowsPaginated(this.tvshow_pages_prev_stop, this.tvshow_results, deferredTvshowLoad);

    // After both requests (or chains of requests) are done, set "loading -state" false
    Promise.all([deferredMovieLoad.promise, deferredTvshowLoad.promise])
      .then(() => {
        this.loading_new_results = false;
      });
  };

}
