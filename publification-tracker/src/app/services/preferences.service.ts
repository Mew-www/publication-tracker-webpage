import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable()
export class PreferencesService {

  private preferences_source = new BehaviorSubject<Object>({
    language_code: 'en'
  });
  public preferences$ = this.preferences_source.asObservable();

  constructor() {
    setInterval(() => {
      if (window.hasOwnProperty("preferred_lang")) {
        this.preferences_source.next({
          language_code: window["preferred_lang"]
        });
      }
    }, 5000);
  }

}
