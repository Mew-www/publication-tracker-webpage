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
  private gettext: Function;

  constructor(private translatorService: TranslatorService) { }

  ngOnInit() {
    this.gettext = this.translatorService.getTranslation;
  }

  private getRespectivePublificationType = (type_id) => {
    switch(type_id) {

      case PublificationType.MOVIE:
        return this.gettext("a_movie");

      case PublificationType.TVSHOW:
        return this.gettext("a_tvserie");

      default:
        return "Undefined publification type";
    }
  };

}
