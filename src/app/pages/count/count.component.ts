import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-count',
  standalone: true,
  imports: [],
  templateUrl: './count.component.html',
  styleUrl: './count.component.scss'
})
export class CountComponent {
  @Input() title!: string;
  @Input() value!: number;
}