import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';
import { OlympicService } from './core/services/olympic.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$!: Subject<boolean>;
  
  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.destroy$ = new Subject<boolean>();
    this.olympicService.loadInitialData().pipe(take(1), takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
}
}