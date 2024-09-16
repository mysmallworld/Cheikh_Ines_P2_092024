import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Color, NgxChartsModule } from '@swimlane/ngx-charts';
import { Observable, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [NgxChartsModule, RouterModule],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute
  ) {}

  olympics$: Observable<any> = of([]);
  selectedCountryData: Olympic | null = null;

  // Options
  view: [number, number] = [700, 300];
  xAxis: boolean = true;
  yAxis: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Medals';
  isAutoScale: boolean = true;
  isAnimations:boolean = false;

  // Colors
  colorScheme: Color = {
    domain: ['#00919B']
  } as Color;

  ngOnInit(): void {
    // Olympics data
    this.olympics$ = this.olympicService.getOlympics();

    // Data of country selected
    this.route.queryParams.subscribe(params => {
      const selectedCountry = params['country'];
      if (selectedCountry) {
        this.olympics$.subscribe((olympics) => {
          this.selectedCountryData = olympics.find((olympic: { country: string; }) => olympic.country === selectedCountry) || null;
        });
      }
    });
  }

  /**
   * Method to get total number of entries of country selected
   * @param olympics data of country in Olympics
   * @returns total number of entries
   */
  getNumberOfEntries(olympic: Olympic): number {
    return olympic.participations.length;
  }

  /**
   * Method to get total number of medals of country selected
   * @param olympics data of country in Olympics
   * @returns total number of medals
   */
  getNumberOfMedals(olympic: Olympic): number {
    return olympic.participations.reduce((total, participation) => total + participation.medalsCount, 0);
  }

  /**
   * Method to get total number of athletes of country selected
   * @param olympics data of country in Olympics
   * @returns total number of athletes
   */
  getNumberOfAthletes(olympic: Olympic): number {
    return olympic.participations.reduce((total, participation) => total + participation.athleteCount, 0);
  }

  /**
   * Method to get number medals by year
   * @param olympic data of country in Olympics
   * @returns number of medals by year
   */
  getMedalsOverTime(olympic: Olympic): { name: string, series: { name: string, value: number }[] }[] {
    return [{
      name: olympic.country,
      series: olympic.participations.map(participation => ({
        name: participation.year.toString(),
        value: participation.medalsCount
      }))
    }];
  }

  /**
   * Method to get selected country
   */
  onSelectCountry(event: {name: string} ): void {
    const selectedCountry = event.name;
    // Data of selected country
    this.olympics$.subscribe((olympics: Olympic[]) => {
      this.selectedCountryData = olympics.find(olympic => olympic.country === selectedCountry) || null;
    });
  }
}
