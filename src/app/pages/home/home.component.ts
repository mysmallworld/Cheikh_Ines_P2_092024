import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Color } from '@swimlane/ngx-charts';
import { Country } from 'src/app/core/models/Country';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private olympicsSubscription: Subscription = new Subscription();
  constructor(private olympicService: OlympicService) {}

  olympics$!: Observable<Olympic[] | undefined | null>;
  countryData!: Olympic | undefined | null; 

  // options
  view: [number, number] = [800, 400];
  showLegend: boolean = false;
  showLabels: boolean = true;
  showAnimation: boolean = false;
  isExplodeSlices: boolean = false;
  isDoughnut: boolean = false;
  isGradient: boolean = false;

  // colors
  colorScheme: Color = {
    domain: ['#A66870', '#8B415D', '#90ACE2', '#A48AAC', '#C1E5F4', '#BDD2EB'],
  } as Color;

  ngOnInit(): void {
    // Olympics data
    this.olympics$ = this.olympicService.getOlympics();
  }

  ngOnDestroy(): void {
    this.olympicsSubscription.unsubscribe();
  }

  /**
   * Method to get number of countries.
   * @param olympics data of country in Olympics.
   * @returns number of countries.
   */
  getNumberOfCountries(olympics: Olympic[]): number {
    return this.olympicService.getNumberOfCountries(olympics);
  }

  /**
   * Method to get number of JOs.
   * @param olympics data of country in Olympics.
   * @returns number of JOs.
   */
  getNumberOfJOs(olympics: Olympic[]): number {
    return this.olympicService.getNumberOfJOs(olympics);
  }

  /**
   * Method to get medals per country.
   * @param olympics data of country in Olympics.
   * @returns total medals count per country.
   */
  getMedalsPerCountry(olympics: Olympic[]): Country[] {
    return this.olympicService.getMedalsPerCountry(olympics);
  }

  /**
   * Method to get data of selected country.
   * @param event Country.
   */
  getOlympicsByCountry(event: Country): void {
    return this.olympicService.getOlympicsByCountry(event, this.olympics$, this.countryData);
  }
}
