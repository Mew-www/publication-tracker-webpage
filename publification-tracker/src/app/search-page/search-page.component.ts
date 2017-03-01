import {Component, OnInit} from '@angular/core';
import {ThemoviedbService} from "../services/themoviedb.service";
import {Publification} from "../interfaces/publification";
import {PublificationType} from "../enums/publification-type";
import {TranslatorService} from "../services/translator.service";

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {

  private tmdbApiReady: boolean = false;
  private results: Array<Publification> = [];
  private loading: boolean = false;

  private gettext: Function;

  constructor(private themoviedbService: ThemoviedbService, private translatorService: TranslatorService) { }

  private isServicesStandby = () => {
    return this.tmdbApiReady && !this.loading;
  };

  ngOnInit() {
    this.gettext = this.translatorService.getTranslation;

    // Bind var to API(s) being ready
    this.themoviedbService.genremaps_readiness$.subscribe(state => { this.tmdbApiReady=state; });

    // Bind var to API(s) loading
    this.themoviedbService.loading_new_results$.subscribe(state => { this.loading=state; });

    // Bind buffered results
    this.themoviedbService.movie_results$.subscribe(results => { this.results = results; });
    this.themoviedbService.tvshow_results$.subscribe(results => { this.results = results; });
  }

  startSearch = (search_query_string) => {
    if (this.isServicesStandby()) {

      // Reset previous results, and mark we're starting to load
      this.results = [];
      this.loading = true;

      // Execute searches
      this.themoviedbService.loadMoviesAndTvseriesByWildcard(search_query_string);
    }
  };

  loadMore = () => {
    if (this.isServicesStandby()) {
      this.themoviedbService.continueLoadingPaginated();
    }
  };

}
