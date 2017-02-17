import { Component, OnInit } from '@angular/core';
import {ThemoviedbService} from "../services/themoviedb.service";

@Component({
  selector: 'app-tracking-page',
  templateUrl: './tracking-page.component.html',
  styleUrls: ['./tracking-page.component.scss']
})
export class TrackingPageComponent implements OnInit {
  private movies;

  constructor(private themoviedbService: ThemoviedbService) { }

  ngOnInit() {
    localStorage.setItem("tracked", JSON.stringify(
      [{PDate:"19561",Name:"aedfed",Type:"movie",Genre:"Action, Comedy"},
        {PDate:"5219",Name:"sdfrfvs",Type:"movie",Genre:"Drama, Comedy"}]
    ));
    this.movies=JSON.parse(localStorage.getItem("tracked"));
  }
private Onclick =(PDate,Name)=>{
  let Remove = JSON.parse(localStorage.getItem("tracked"));
  for(var i = Remove.length-1; i>=0; i--){
    console.log(PDate,Name);
    if (Remove[i].PDate === PDate && Remove[i].Name === Name) Remove.splice(i, 1);
    console.log(Remove);
  }
  localStorage.setItem("tracked" ,JSON.stringify(Remove));

}
}
