import {Component, OnInit} from '@angular/core';
import {ThemoviedbService} from "../services/themoviedb.service";
import {Publification} from "../interfaces/publification";
import {Observable} from "rxjs";

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {

  private tmdbApiReady: boolean = false;
  private results: Array<Publification> = [];
  private loading: boolean = false;
  private searchEverInitialized = false;

  constructor(private themoviedbService: ThemoviedbService) { }

  private isServicesStandby = () => {
    return this.tmdbApiReady && !this.loading;
  };

  ngOnInit() {

    // Bind var to API(s) being ready
    this.themoviedbService.genremaps_readiness$.subscribe(state => { this.tmdbApiReady=state; });

    // Bind var to API(s) loading
    this.themoviedbService.loading_new_results$.subscribe(state => { this.loading=state; });

    // Bind buffered results
    this.themoviedbService.movie_results$.subscribe(results => { this.results = this.results.concat(results); });
    this.themoviedbService.tvshow_results$.subscribe(results => { this.results = this.results.concat(results); });
  }

  onStartSearch = (search_query_string) => {
    if (this.isServicesStandby() && !this.loading) {

      // Reset previous results, and mark we're starting to load
      this.results = [];
      this.loading = true;

      // Execute searches
      this.themoviedbService.loadMoviesAndTvseriesByWildcard(search_query_string);

      // Mark we've initialized the searches (so "empty resultset" means "no results found" instead)
      if (!this.searchEverInitialized) {
        this.searchEverInitialized = true;
      }
    }
  };

}
