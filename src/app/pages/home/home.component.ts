import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<any> = of(null);

  // options
  view: [number, number] = [800, 400];
  showLegend: boolean = false;
  showLabels: boolean = true;
  showAnimation: boolean = false;
  isExplodeSlices: boolean = false;
  isDoughnut: boolean = false;
  isGradient: boolean = false;

  // colors
  public colorScheme: any = {
    domain: ['#A66870', '#8B415D', '#90ACE2', '#A48AAC', '#C1E5F4', '#BDD2EB' ]
  };

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    // data
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
  getMedalsPerCountry(olympics: Olympic[]): { name: string; value: number; }[] {
    return olympics.map(olympic => ({
      name: olympic.country,
      value: olympic.participations.reduce((total, participation) => total + participation.medalsCount, 0)
    }));
  }
}
