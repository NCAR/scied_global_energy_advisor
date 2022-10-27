import { Injectable } from '@angular/core';
import { ServiceModule } from './service.module';
import { DataService } from './data.service';
import { Source } from './source';

const localUrl = 'assets/data/sources.json';

@Injectable({
  providedIn: ServiceModule
})
export class SharedDataService {

  sources_list:any = [];
  emissions_list:any = {};
  headers;

  constructor(private data: DataService) {
    this.sources_list['baseline'] = {};
    this.sources_list['custom'] = {};
    this.getSources();
  }

  getSources() {
    let source;
    this.data.getSource()
      .subscribe(resp => {
        const keys = resp.headers.keys();
        this.headers = keys.map(key =>
          `${key}: ${resp.headers.get(key)}`);

        for (const d of (resp.body as any)) {
          this.sources_list['baseline'][d.id] = {
            name: d.name,
            energy: d.energy
          };
          this.sources_list['custom'][d.id] = {
            name: d.name,
            energy: d.energy
          };
          this.emissions_list[d.id]= {
            name: d.name,
            emissions: d.emissions
          };
        }
        console.log(this.sources_list);
        console.log(this.sources_list['custom']);
      });
  }
  getSourcesList(type) {
    console.log(this.sources_list[type]);
    return this.sources_list[type];
  }
  getEmissionsList() {
    return this.emissions_list;
  }

  /**
  *
  *
  **/
  public updateCustomValue(key, value) {
    // update custom shared data
    this.sources_list['custom'][key].energy = value;
  }

  /**
  *
  *
  **/
  public retrieveCustomValue(key) {
    // update custom shared data
    return this.sources_list['custom'][key].energy;
  }

}
