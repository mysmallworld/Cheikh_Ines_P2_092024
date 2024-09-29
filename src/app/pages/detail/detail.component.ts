import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Color, NgxChartsModule } from '@swimlane/ngx-charts';
import { Observable, Subscription } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { CountComponent } from '../count/count.component';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [NgxChartsModule, RouterModule, CountComponent],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {
  private Olympicsubscriptions: Subscription = new Subscription();
  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  olympics$!: Observable<Olympic[] | undefined | null>;
  countryData: Olympic | null = null;

  // Options
  view: [number, number] = [500, 300];
  xAxis: boolean = true;
  yAxis: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Dates';
  yAxisLabel: string = 'Medals';
  isAutoScale: boolean = true;
  isAnimations: boolean = false;

  // Colors
  colorScheme: Color = {
    domain: ['#008591']
  } as Color;

  ngOnInit(): void {
    // Olympics data
    this.olympics$ = this.olympicService.getOlympics();
  
    this.Olympicsubscriptions.add(
      this.route.queryParams.subscribe((params) => {
        const idSelectedCountry = +params['id'];
  
        this.olympics$.subscribe((olympics) => {
          if (isNaN(idSelectedCountry) || idSelectedCountry < 1 || !olympics?.some(olympic => olympic.id === idSelectedCountry)) {
            this.router.navigate(['/unknown-page']);
          } else {
            this.countryData = olympics?.find(
              (olympic: { id: number }) => olympic.id === idSelectedCountry
            ) || null;
          }
        });
      })
    );
  }
  
  ngOnDestroy(): void {
    this.Olympicsubscriptions.unsubscribe();
  }

  /**
   * Method to get total number of entries of country selected
   * @param olympic data of country in Olympics
   * @returns total number of entries
   */
  getNumberOfEntries(olympic: Olympic): number {
    return olympic.participations.length;
  }

  /**
   * Method to get total number of medals of country selected
   * @param olympic data of country in Olympics
   * @returns total number of medals
   */
  getNumberOfMedals(olympic: Olympic): number {
    return olympic.participations.reduce(
      (total, participation) => total + participation.medalsCount,
      0
    );
  }

  /**
   * Method to get total number of athletes of country selected
   * @param olympic data of country in Olympics
   * @returns total number of athletes
   */
  getNumberOfAthletes(olympic: Olympic): number {
    return olympic.participations.reduce(
      (total, participation) => total + participation.athleteCount,
      0
    );
  }

  /**
   * Method to get number medals by year
   * @param olympic data of country in Olympics
   * @returns number of medals by year
   */
  getMedalsOverTime(
    olympic: Olympic
  ): { name: string; series: { name: string; value: number }[] }[] {
    return [
      {
        name: olympic.country,
        series: olympic.participations.map((participation) => ({
          name: participation.year.toString(),
          value: participation.medalsCount,
        })),
      },
    ];
  }

  /**
 * Method to get selected country
 * @param event
 */
onSelectCountry(event: { id: number }): void {
  const idSelectedCountry = event.id;
  // Data of selected country
  this.Olympicsubscriptions.add(
    this.olympics$.subscribe((olympics: Olympic[] | undefined | null) => {
      this.countryData =
        olympics?.find((olympic) => olympic.id === idSelectedCountry) || null;

      this.route.queryParams.subscribe((params) => {
        const idParams = +params['id'];  // Conversion en nombre avec le "+" devant params['id']

        if (isNaN(idParams) || idParams < 1 || !olympics?.some(olympic => olympic.id === idParams)) {
          this.router.navigate(['/unknown-page']);
        }
      });
    })
  );
}

}