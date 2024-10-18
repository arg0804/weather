import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { WeatherService } from './services/weather.service';
import { CityCardComponent } from './city-card/city-card.component';
import { CityInputComponent } from './city-input/city-input.component';
import { of } from 'rxjs';

class MockWeatherService {
  getWeather(city: string) {
    return of({ city, temperature: 25, condition: 'Sunny' });
  }

  getForecast(city: string) {
    return of([{ date: '2024-01-01', temperature: 24, condition: 'Cloudy' }]);
  }
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let weatherService: WeatherService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent, CityCardComponent, CityInputComponent],
      providers: [{ provide: WeatherService, useClass: MockWeatherService }]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    weatherService = TestBed.inject(WeatherService);
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with no cities', () => {
    expect(component.cities.length).toBe(0);
  });

  it('should add a city', () => {
    component.addCity('New York');
    expect(component.cities.length).toBe(1);
    expect(component.cities[0].city).toBe('New York');
  });

  it('should not add a city if name is empty', () => {
    spyOn(window, 'alert');
    component.addCity('');
    expect(component.cities.length).toBe(0);
    expect(window.alert).toHaveBeenCalledWith('Please enter a city name.');
  });

  it('should remove a city', () => {
    component.addCity('Los Angeles');
    expect(component.cities.length).toBe(1);
    component.removeCity(component.cities[0]);
    expect(component.cities.length).toBe(0);
  });

  it('should toggle background color and fullscreen', () => {
    component.toggleBackgroundAndFullscreen();
    expect(component.isBlackBackground).toBeTrue();
    expect(document.body.style.backgroundColor).toBe('black');

    component.toggleBackgroundAndFullscreen();
    expect(component.isBlackBackground).toBeFalse();
    expect(document.body.style.backgroundColor).toBe('white');
  });

  it('should load stored cities from localStorage on init', () => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([{ city: 'Chicago', temperature: 20, condition: 'Rainy' }]));
    component.ngOnInit();
    expect(component.cities.length).toBe(1);
    expect(component.cities[0].city).toBe('Chicago');
  });
});