import { Component, OnInit } from '@angular/core';
import {ThemoviedbService} from "../services/themoviedb.service";

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.scss']
})
export class TestPageComponent implements OnInit {

  constructor(private themoviedbService: ThemoviedbService) { }

  ngOnInit() {
  }

}
