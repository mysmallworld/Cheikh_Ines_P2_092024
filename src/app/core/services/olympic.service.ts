import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[] | undefined | null>([]);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caugth) => {
        console.error('Error loading Olympics data:', error);
        this.olympics$.next(null);
        alert(`An error occurred while loading data.\nError status: ${error.status}.\nError type: ${error.statusText}.\nPlease try again later.`);
        return caugth;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
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
        value: olympic.participations.reduce((total, participation) => total + participation.medalsCount, 0)
      })
    );
  }

  /**
   * 
   * @param event 
   * @param olympicsSubscription 
   * @param router 
   * @param countryData 
   */
  getOlympicsByCountry(event: { name: string }, olympicsSubscription: Subscription, olympicsOb: Observable<Olympic[] | undefined | null>, router: Router, countryData: Olympic | null | undefined): void {
    const selectedCountry = event.name;

    olympicsSubscription = olympicsOb.subscribe((olympics) => {
      if (olympics) {
        countryData = olympics.find((olympic: { country: string }) => olympic.country === selectedCountry);

        const idSelectedCountry = countryData?.id;

        if (idSelectedCountry) {
          router.navigate(['/detail'], { queryParams: { id: idSelectedCountry } });
        }
      }
    });
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
    return olympic.participations.reduce((total, participation) => total + participation.medalsCount, 0);
  }

  /**
   * Method to get total number of athletes of country selected
   * @param olympic data of country in Olympics
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
  getMedalsOverTime(olympic: Olympic): { name: string; series: { name: string; value: number }[] }[] {
    return [
      { name: olympic.country,
        series: olympic.participations.map((participation) => ({
          name: participation.year.toString(),
          value: participation.medalsCount,
        }))
      }
    ];
  }

  /**
   *
   * @param event
   * @param olympicSubsciptions
   * @param olympicsOb
   * @param route
   * @param router
   * @param countryData
   */
  onSelectCountry(event: { id: number }, olympicSubsciptions: Subscription, olympicsOb: Observable<Olympic[] | null | undefined>, route: ActivatedRoute, router: Router, countryData: Olympic | null): void {
    const idSelectedCountry = event.id;
    // Data of selected country
    olympicSubsciptions.add(
      olympicsOb.subscribe((olympics: Olympic[] | undefined | null) => {
        countryData =
          olympics?.find((olympic) => olympic.id === idSelectedCountry) || null;

        route.queryParams.subscribe((params) => {
          const idParams = +params['id']; // Conversion en nombre avec le "+" devant params['id']

          if (
            isNaN(idParams) ||
            idParams < 1 ||
            !olympics?.some((olympic) => olympic.id === idParams)
          ) {
            router.navigate(['/unknown-page']);
          }
        });
      })
    );
  }
}
