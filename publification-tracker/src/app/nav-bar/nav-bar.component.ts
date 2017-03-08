import { Component, OnInit } from '@angular/core';
import {TranslatorService} from "../services/translator.service";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  constructor(private translatorService: TranslatorService) { }

  ngOnInit() {
  }

  changeLanguage = (next_lang) => {
    this.translatorService.changeLanguage(next_lang)
  };
}
