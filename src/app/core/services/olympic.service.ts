import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { ActivatedRoute, Router } from '@angular/router';
import { Country } from '../models/Country';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[] | undefined | null>([]);

  constructor(private http: HttpClient, private router: Router) {}

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

  /**
   * Creates a new Observable with olympic as the source.
   * @returns new Observable.
   */
  getOlympics(): Observable<Olympic[] | null | undefined> {
    return this.olympics$.asObservable();
  }

  /**
   * Method to get number of countries.
   * @param olympics data of country in Olympics.
   * @returns number of countries.
   */
  getNumberOfCountries(olympics: Olympic[]): number {
    return olympics.length;
  }

  /**
   * Method to get number of JOs.
   * @param olympics data of country in Olympics.
   * @returns number of JOs.
   */
  getNumberOfJOs(olympics: Olympic[]): number {
    return olympics.length > 0 ? olympics[0].participations.length : 0;
  }

  /**
   * Method to get medals per country.
   * @param olympics data of country in Olympics.
   * @returns total medals count per country.
   */
  getMedalsPerCountry(olympics: Olympic[]): Country[] {
    return olympics.map((olympic) => ({
        name: olympic.country,
        value: olympic.participations.reduce((total, participation) => total + participation.medalsCount, 0)
      })
    );
  }

  /**
   * Method to get data of selected country.
   * @param event Country data.
   * @param olympicsOb Olympic Observable.
   * @param countryData Olympic data.
   */
  getOlympicsByCountry(event: Country, olympicsOb: Observable<Olympic[] | undefined | null>, countryData: Olympic | null | undefined): void {
    const selectedCountry = event.name;
    olympicsOb.subscribe((olympics) => {
      if (olympics) {
        countryData = olympics.find((olympic: { country: string }) => olympic.country === selectedCountry);
        const idSelectedCountry = countryData?.id;
        if (idSelectedCountry) {
          this.router.navigate(['/detail', idSelectedCountry]);
        }   
      }
    });
  }

  /**
   * Method to get total number of entries of country selected.
   * @param olympic data of country in Olympics.
   * @returns total number of entries.
   */
  getNumberOfEntries(olympic: Olympic): number {
    return olympic.participations.length;
  }

  /**
   * Method to get total number of medals of country selected.
   * @param olympic data of country in Olympics.
   * @returns total number of medals.
   */
  getNumberOfMedals(olympic: Olympic): number {
    return olympic.participations.reduce((total, participation) => total + participation.medalsCount, 0);
  }

  /**
   * Method to get total number of athletes of country selected.
   * @param olympic data of country in Olympics.
   * @returns total number of athletes.
   */
  getNumberOfAthletes(olympic: Olympic): number {
    return olympic.participations.reduce((total, participation) => total + participation.athleteCount, 0);
  }

  /**
   * Method to get number medals by year.
   * @param olympic data of country in Olympics.
   * @returns number of medals by year.
   */
  getMedalsOverTime(olympic: Olympic): Country[] {
    return [
      { name: olympic.country,
        series: olympic.participations.map((participation) => ({
          name: participation.year.toString(),
          value: participation.medalsCount,
        }))
      }
    ];
  }
}
