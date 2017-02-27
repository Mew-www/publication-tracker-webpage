import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { TrackingPageComponent } from './tracking-page/tracking-page.component';
import { SearchPageComponent } from './search-page/search-page.component';

import { RouterModule, Routes } from '@angular/router';
import { TestPageComponent } from './test-page/test-page.component';
import {ThemoviedbService} from "./services/themoviedb.service";
import {PreferencesService} from "./services/preferences.service";
import { KonamiComponent } from './konami/konami.component';
import { PublificationTableComponent } from './publification-table/publification-table.component';
import {TranslatorService} from "./services/translator.service";

const appRoutes: Routes = [
  { path: 'tracking', component: TrackingPageComponent },
  { path: 'search', component: SearchPageComponent },
  { path: 'test', component: TestPageComponent },
  { path: '**', component: TrackingPageComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    TrackingPageComponent,
    SearchPageComponent,
    TestPageComponent,
    KonamiComponent,
    PublificationTableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [ThemoviedbService, PreferencesService, TranslatorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
