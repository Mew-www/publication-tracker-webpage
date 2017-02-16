import { Component, OnInit } from '@angular/core';
import {ThemoviedbService} from "../services/themoviedb.service";

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {

  constructor(private themoviedbService: ThemoviedbService) { }

  ngOnInit() {
  }

}
