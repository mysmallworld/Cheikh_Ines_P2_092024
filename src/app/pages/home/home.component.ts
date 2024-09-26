import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { Router } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Color } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private olympicService: OlympicService, 
    private router: Router
  ) {}

  olympics$!: Observable<Olympic[] | undefined | null>;
  selectedCountryData!: Olympic | undefined | null;

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
    domain: ['#A66870', '#8B415D', '#90ACE2', '#A48AAC', '#C1E5F4', '#BDD2EB']
  } as Color;


  ngOnInit(): void {
    // Olympics data
    this.olympics$ = this.olympicService.getOlympics();
  }

  /**
   * Method to get number of countries
   * @param olympics data of country in Olympics
   * @returns number of countries
   */
  getNumberOfCountries(olympics: Olympic[]): number {
    return olympics.length;
  }

  /**
   * Method to get number of JOs
   * @param olympics data of country in Olympics
   * @returns number of JOs
   */
  getNumberOfJOs(olympics: Olympic[]): number {
    return olympics.length > 0 ? olympics[0].participations.length : 0;
  }

  /**
   * Method to get medals per country
   * @param olympics data of country in Olympics
   * @returns total medals count per country
   */
  getMedalsPerCountry(olympics: Olympic[]): { name: string; value: number }[] {
    return olympics.map((olympic) => ({
      name: olympic.country,
      value: olympic.participations.reduce(
        (total, participation) => total + participation.medalsCount,
        0
      ),
    }));
  }

  /**
   * Method to get data of selected country
   * @param event 
   */
  getOlympicsByCountry(event: { name: string }): void {
    const selectedCountry = event.name;

    this.olympics$.subscribe((olympics) => {
      if (olympics) {
        this.selectedCountryData = olympics.find(
          (olympic: { country: string }) => olympic.country === selectedCountry
        );

        const idSelectedCountry = this.selectedCountryData?.id;

        if (idSelectedCountry) {
          this.router.navigate(['/detail'], { queryParams: { id: idSelectedCountry } });
        }
      }
    });
  }

}
