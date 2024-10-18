import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WeatherService } from './weather.service';
import { environment } from '../../environmets/enviroment';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherService],
    });

    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getWeather', () => {
    it('should return weather data for a valid city', () => {
      const mockWeatherResponse = {
        main: { temp: 25 },
        weather: [{ description: 'Clear sky' }],
        name: 'Test City'
      };

      service.getWeather('Test City').subscribe(data => {
        expect(data.city).toEqual('Test City');
        expect(data.temperature).toEqual(25);
        expect(data.condition).toEqual('Clear sky');
      });

      const req = httpMock.expectOne(`${service['apiUrl']}?q=Test City&appid=${environment.weatherApiKey}&units=metric`);
      expect(req.request.method).toBe('GET');
      req.flush(mockWeatherResponse);
    });

    it('should handle error for unauthorized requests', () => {
      service.getWeather('Test City').subscribe(
        () => fail('expected an error, not weather data'),
        (error) => expect(error).toMatch('Unauthorized: Invalid API key.')
      );

      const req = httpMock.expectOne(`${service['apiUrl']}?q=Test City&appid=${environment.weatherApiKey}&units=metric`);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });

    it('should handle error for city not found', () => {
      service.getWeather('Invalid City').subscribe(
        () => fail('expected an error, not weather data'),
        (error) => expect(error).toMatch('City not found. Please check the name and try again.')
      );

      const req = httpMock.expectOne(`${service['apiUrl']}?q=Invalid City&appid=${environment.weatherApiKey}&units=metric`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getForecast', () => {
    it('should return forecast data for a valid city', () => {
      const mockForecastResponse = {
        list: [
          { dt_txt: '2024-01-01 12:00:00', main: { temp: 20 }, weather: [{ description: 'Clear' }] },
          { dt_txt: '2024-01-02 12:00:00', main: { temp: 22 }, weather: [{ description: 'Partly cloudy' }] },
          { dt_txt: '2024-01-03 12:00:00', main: { temp: 24 }, weather: [{ description: 'Sunny' }] }
        ]
      };

      service.getForecast('Test City').subscribe(data => {
        expect(data.length).toBe(3);
        expect(data[0].date).toEqual('2024-01-01');
        expect(data[1].temperature).toEqual(22);
        expect(data[2].condition).toEqual('Sunny');
      });

      const req = httpMock.expectOne(`${service['forecastUrl']}?q=Test City&appid=${environment.weatherApiKey}&units=metric`);
      expect(req.request.method).toBe('GET');
      req.flush(mockForecastResponse);
    });

    it('should handle errors in getForecast', () => {
      service.getForecast('Invalid City').subscribe(
        () => fail('expected an error, not forecast data'),
        (error) => expect(error).toMatch('City not found. Please check the name and try again.')
      );

      const req = httpMock.expectOne(`${service['forecastUrl']}?q=Invalid City&appid=${environment.weatherApiKey}&units=metric`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });
});