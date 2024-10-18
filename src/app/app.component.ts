import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, transition, animate, query, stagger } from '@angular/animations';
import { WeatherService } from './services/weather.service';
import { CityCardComponent } from './city-card/city-card.component';
import { CityInputComponent } from './city-input/city-input.component';

interface City {
  city: string;
  temperature: number;
  condition: string;
  forecast?: { date: string, temperature: number, condition: string }[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, CityCardComponent, CityInputComponent],
  animations: [
    trigger('cityListAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-50px)' }),
          stagger('200ms', [
            animate('800ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true }),
        query(':leave', [
          stagger('400ms', [
            animate('800ms ease-in', style({ opacity: 0, transform: 'translateY(50px)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class AppComponent {
  title = 'weatherDashboard';
  cities: City[] = [];
  loading = false;
  isBlackBackground = false;
  isFullscreen = false;

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    const storedCities = localStorage.getItem('cities');
    if (storedCities) {
      this.cities = JSON.parse(storedCities);
    }
  }

  addCity(cityName: string) {
    if (!cityName.trim()) {
      alert('Please enter a city name.');
      return;
    }

    const existingCity = this.cities.find(c => c.city.toLowerCase() === cityName.toLowerCase());
    if (existingCity) {
      const confirmAdd = confirm(`The city "${cityName}" already exists. Do you want to add it again?`);
      if (!confirmAdd) {
        return;
      }
    }

    this.loading = true;
    this.weatherService.getWeather(cityName).subscribe({
      next: (data) => {
        this.weatherService.getForecast(cityName).subscribe({
          next: (forecast) => {
            data.forecast = forecast;
            this.cities.push(data);
            this.loading = false;
            localStorage.setItem('cities', JSON.stringify(this.cities));
          },
          error: (err) => {
            console.error('Error fetching forecast:', err);
            this.loading = false;
            alert('Error fetching forecast data.');
          }
        });
      },
      error: (err) => {
        console.error('Error adding city:', err);
        this.loading = false;
        alert(err);
      }
    });
  }

  removeCity(city: City) {
    this.cities = this.cities.filter(c => c !== city);
    localStorage.setItem('cities', JSON.stringify(this.cities));
  }

  toggleBackgroundAndFullscreen() {
    this.isBlackBackground = !this.isBlackBackground;
    this.isFullscreen = !this.isFullscreen;
  
    if (this.isBlackBackground) {
      document.body.style.backgroundColor = 'black';
      document.body.style.color = 'black';
    } else {
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
    }
  }
  
}