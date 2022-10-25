import { Injectable } from '@angular/core';
import { ServiceModule } from './service.module';
import { ISources } from '../../sources';

@Injectable({
  providedIn: ServiceModule
})
export class SharedDataService {

  sources_list = {};
  emissions_list = {};

  constructor() {

    this.sources_list['baseline'] = this.setBaselineSources();
    this.sources_list['custom'] = this.setBaselineSources();
    this.setEmissions();
  }

  getSourcesList() {
    return this.sources_list;
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
    this.sources_list['custom'][key].amount = value;
  }

  /**
  *
  *
  **/
  public retrieveCustomValue(key) {
    // update custom shared data
    return this.sources_list['custom'][key].amount;
  }

  setEmissions() {
    // kg of CO2 emissions per MWh
    this.emissions_list['petroleum'] = 250;
    this.emissions_list['coal'] = 350;
    this.emissions_list['natural_gas'] = 180;
    this.emissions_list['nuclear'] = 0;
    this.emissions_list['hydro'] = 0;
    this.emissions_list['biofuels'] = 200;
    this.emissions_list['wind'] = 0;
    this.emissions_list['solar'] = 0;
    this.emissions_list['geothermal'] = 30;

  }
  /**
   *
   *
  **/
  setBaselineSources() {
    let baseline_sources: ISources[] = [];

    baseline_sources['petroleum'] = {
      name: 'Petroleum',
      amount: 50
    };
    baseline_sources['coal'] = {
      name: 'Coal',
      amount: 40
    };
    baseline_sources['natural_gas'] = {
      name: 'Natural Gas',
      amount: 30
    };
    baseline_sources['nuclear'] = {
      name: 'Nuclear',
      amount: 10
    };
    baseline_sources['hydro'] = {
      name: 'Hydro',
      amount: 10
    };
    baseline_sources['biofuels'] = {
      name: 'Biofuels',
      amount: 10
    };
    baseline_sources['wind'] = {
      name: 'Wind',
      amount: 10
    };
    baseline_sources['solar'] = {
      name: 'Solar',
      amount: 10
    };
    baseline_sources['geothermal'] = {
      name: 'Geothermal',
      amount: 5
    };

    return baseline_sources;
  }
}
