import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

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
        alert(`Une erreur est survenue lors du chargement des données.\nStatus de l'erreur : ${error.status}.\nType de l'erreur : ${error.statusText}.\nVeuillez réessayer plus tard.`);
        return caugth;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }
}
