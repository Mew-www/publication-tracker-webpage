import { Component, OnInit } from '@angular/core';
import {ThemoviedbService} from "../services/themoviedb.service";

@Component({
  selector: 'app-tracking-page',
  templateUrl: './tracking-page.component.html',
  styleUrls: ['./tracking-page.component.scss']
})
export class TrackingPageComponent implements OnInit {

  constructor(private themoviedbService: ThemoviedbService) { }

  ngOnInit() {
  }

}
