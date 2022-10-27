import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../google-chart/service/shared-data.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {


  constructor(public sharedData : SharedDataService) {


   }
  ngOnInit(): void {
  }
  
}
