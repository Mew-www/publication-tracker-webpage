import {Component, OnInit, Input} from '@angular/core';
import {Publification} from "../interfaces/publification";
import {PublificationType} from "../enums/publification-type";
import {TranslatorService} from "../services/translator.service";
import {PreferencesService} from "../services/preferences.service";
import {Movie} from "../models/movie";
import {Tvshow} from "../models/tvshow";

@Component({
  selector: 'app-publification-table',
  templateUrl: './publification-table.component.html',
  styleUrls: ['./publification-table.component.scss']
})
export class PublificationTableComponent implements OnInit {

  @Input() publifications: Array<Publification>;
  private gettext: Function;
  private existing_publification_ids: Array<string>;

  constructor(private translatorService: TranslatorService) { }

  ngOnInit() {
    this.gettext = this.translatorService.getTranslation;
    this.existing_publification_ids = JSON.parse(
      localStorage.getItem("tracked") === null ? "[]" : localStorage.getItem("tracked")
    ).map((pub_json) => {
      return pub_json["uid"];
    });
    console.log(this.existing_publification_ids);
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

  private addToTracked = (publification: Publification) => {
    let tracked = JSON.parse(localStorage.getItem("tracked") === null ? "[]" : localStorage.getItem("tracked"));
    tracked.push(publification.toSimpleObject());
    localStorage.setItem("tracked", JSON.stringify(tracked));
    this.existing_publification_ids.push(publification.uid);
  };

}
