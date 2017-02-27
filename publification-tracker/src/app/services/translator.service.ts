import { Injectable } from '@angular/core';

@Injectable()
export class TranslatorService {

  private translations = {
    'en': {
      "a_movie": "Movie",
      "a_tvserie": "Serie",
      "publication_release_date": "Release date",
      "publication_title": "Title",
      "publication_type": "Type",
      "publication_genres": "Genres",
      "track_new_publication": "Add to tracked"
    },
    'fi': {
      "a_movie": "Elokuva",
      "a_tvserie": "Sarja",
      "publication_release_date": "Julkaisupäivämäärä",
      "publication_title": "Nimi",
      "publication_type": "Tyyppi",
      "publication_genres": "Tyylilajit",
      "track_new_publication": "Lisää seurattaviin"
    }
  };

  constructor() { }

  getTranslation = (language, phrase_id) => {
    if (!this.translations.hasOwnProperty(language)) {
      throw new Error(`Attempted to find translation from non-configured language '${language}'`);
    }
    if (!this.translations[language].hasOwnProperty(phrase_id)) {
      throw new Error(`Attempted to find translation of non-configured phrase '${phrase_id}' from language ${language}`);
    }
    return this.translations[language][phrase_id];
  };
}
