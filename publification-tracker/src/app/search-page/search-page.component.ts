import {Component, OnInit, HostListener} from '@angular/core';
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
    window['trythis'] = this.isServicesStandby;

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

  private konamiqueue: string[] = [];
  @HostListener('document:keyup', ['$event'])
  onGlobalKeypress(event) {
    const zettai_sequence = [
      ['ArrowUp'], // #1
      ['ArrowUp'], // #2
      ['ArrowDown'], // #3
      ['ArrowDown'], // #4
      ['ArrowLeft'], // #5
      ['ArrowRight'], // #6
      ['ArrowLeft'], // #7
      ['ArrowRight'], // #8
      ['b', 'B'], // #9
      ['a', 'A']  // #10!
    ];
    this.konamiqueue.push(event.key);
    if (this.konamiqueue.length < zettai_sequence.length)
      return;
    if (this.konamiqueue.length > zettai_sequence.length)
      this.konamiqueue.shift();
    for (let i in this.konamiqueue) {
      if (zettai_sequence[i].indexOf(this.konamiqueue[i]) === -1)
        return;
    }
    let q = window.confirm(`
         (\\_/)\u00A0\u00A0\u00A0 \u00A0 \u00A0(\\__/)\u00A0\u00A0\u00A0\u00A0 (\\_/)
       =(^.^)=\u00A0\u00A0\u00A0 (>'.'<)\u00A0\u00A0\u00A0 (o.o)
       (")_(")\u00A0\u00A0\u00A0 \u00A0(¨)_(¨)\u00A0\u00A0\u00A0 (¨)(¨)*
       
\u2610\u2610\u2610
    `);
    if (q)
      alert(`
        /|ˎ
      (˚◟ₒ 7
        | \u00A0 \u00A0~
        |ˎ \u00A0 \u00A0 \u00A0ヽ
        じしf_,)ノ
      `);
  };

}
