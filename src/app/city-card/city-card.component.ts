import { DatePipe } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface Forecast {
  date: string;
  temperature: number;
  condition: string;
}

export interface City {
  city: string;
  temperature: number;
  condition: string;
  forecast?: Forecast[];
}

@Component({
  selector: 'app-city-card',
  standalone: true,
  templateUrl: './city-card.component.html',
  styleUrls: ['./city-card.component.scss'],
  imports: [DatePipe]
})

export class CityCardComponent {
  @Input() city: City | undefined;
  @Output() remove = new EventEmitter<void>();

  removeCity() {
    this.remove.emit();
  }
}