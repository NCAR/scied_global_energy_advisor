import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface Config {
  petroleum:number,
  coal:number,
  natural_gas:number,
  nuclear:number,
  hydro:number,
  biofuels:number,
  wind:number,
  solar:number,
  geothermal:number
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  configUrl = 'assets/data/emissions.json';

  constructor(private http: HttpClient) { }

  getConfig() {
    return this.http.get<Config>(
      this.configUrl, { observe: 'response' });
  }
}
