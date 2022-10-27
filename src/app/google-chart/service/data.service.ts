import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse  } from '@angular/common/http';
import { Source } from './source';
import { Observable } from 'rxjs';

const localUrl = 'assets/data/sources.json';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  configUrl = 'assets/data/emissions.json';
  default_source_structure = {
    "petroleum": {
      "name": "",
      "energy": 0
    },
    "coal": {
      "name": "",
      "energy": 0
    },
    "natural_gas": {
      "name": "",
      "energy": 0
    },
    "nuclear": {
      "name": "",
      "energy": 0
    },
    "hydro": {
      "name": "",
      "energy": 0
    },
    "biofuels": {
      "name": "",
      "energy": 0
    },
    "wind": {
      "name": "",
      "energy": 0
    },
    "solar": {
      "name": "",
      "energy": 0
    },
    "geothermal": {
      "name": "",
      "energy": 0
    },
  };

  constructor(private http: HttpClient) { }

  getSource(): Observable<HttpResponse<Source[]>> {
    return this.http.get<Source[]>(
    localUrl, { observe: 'response' });
  }
}
