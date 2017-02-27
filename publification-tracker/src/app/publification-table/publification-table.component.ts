import {Component, OnInit, Input} from '@angular/core';
import {Publification} from "../interfaces/publification";
import {PublificationType} from "../enums/publification-type";
import {TranslatorService} from "../services/translator.service";
import {PreferencesService} from "../services/preferences.service";

@Component({
  selector: 'app-publification-table',
  templateUrl: './publification-table.component.html',
  styleUrls: ['./publification-table.component.scss']
})
export class PublificationTableComponent implements OnInit {

  @Input() publifications: Array<Publification>;
  private current_language: string;
  private gettext: Function;

  constructor(private translatorService: TranslatorService, private preferencesService: PreferencesService) { }

  ngOnInit() {
    this.gettext = this.translatorService.getTranslation;

    this.preferencesService.preferences$
      .subscribe((new_prefs) => {
        this.current_language = new_prefs["language_code"];
      });
  }

  private getRespectivePublificationType = (type_id) => {
    switch(type_id) {

      case PublificationType.MOVIE:
        return this.gettext(this.current_language, "a_movie");

      case PublificationType.TVSHOW:
        return this.gettext(this.current_language, "a_tvserie");

      default:
        return "Undefined publification type";
    }
  };

}
