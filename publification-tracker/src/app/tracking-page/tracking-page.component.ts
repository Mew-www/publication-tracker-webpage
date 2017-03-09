import { Component, OnInit } from '@angular/core';
import {ThemoviedbService} from "../services/themoviedb.service";
import {Publification} from "../interfaces/publification";
import {PublificationType} from "../enums/publification-type";
import {TranslatorService} from "../services/translator.service";

@Component({
  selector: 'app-tracking-page',
  templateUrl: './tracking-page.component.html',
  styleUrls: ['./tracking-page.component.scss']
})
export class TrackingPageComponent implements OnInit {
  private movies:Array<Publification>;
  private originalmovies:Array<Publification>;
  private diplayedtypes:Array<PublificationType>=[];
  private movietype=PublificationType.MOVIE;
  private serietype=PublificationType.TVSHOW;
  private getText:Function;

  constructor(private themoviedbService: ThemoviedbService, private translate: TranslatorService) { }

  ngOnInit() {
    this.getText=this.translate.getTranslation;

   var movies=JSON.parse(localStorage.getItem("tracked"))
     .sort(function (a:Publification, b:Publification) {
     if (a.release_date<b.release_date) {
       return -1;
     }
     if (a.release_date>b.release_date) {
       return 1;
     }
     return 0;
   });
    this.movies=movies;
    this.originalmovies=movies;
  }

  private Onclick =(PDate,Name)=>{
    let Remove:Array<Publification> = JSON.parse(localStorage.getItem("tracked"));
    for(var i = Remove.length-1; i>=0; i--){
      console.log(PDate,Name);
      if (Remove[i].release_date === PDate && Remove[i].name === Name) Remove.splice(i, 1);
    }
    localStorage.setItem("tracked" ,JSON.stringify(Remove));
    location.reload();
  }
  private changeDate =(releaseDate)=>{
    if (releaseDate!= null){
    var d = new Date (JSON.parse(releaseDate));
    var cangeddate: string = d.getDate()+"."+d.getMonth()+"."+d.getFullYear();
    return cangeddate;
    }else {return this.getText("no_date");}
  }
  private checkboxChange = (type, check) =>{
    if (check){
      this.diplayedtypes.push(type)
    }else {
      this.diplayedtypes=this.diplayedtypes.filter(function (filttype) {
        return filttype!=type
      })
    }
    this.movies = this.originalmovies.filter((movie) => {
      if (movie.type in this.diplayedtypes) {
        return true;
      }
      return false;
    })

  }
}
