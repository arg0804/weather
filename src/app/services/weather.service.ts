import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environmets/enviroment';

interface WeatherResponse {
    main: { temp: number };
    weather: [{ description: string }];
    name: string;
}

interface ForecastResponse {
    list: { dt_txt: string, main: { temp: number }, weather: [{ description: string }] }[];
}

@Injectable({
    providedIn: 'root'
})
export class WeatherService {
    private apiKey = environment.weatherApiKey;
    private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
    private forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

    constructor(private http: HttpClient) {}

    getWeather(city: string): Observable<any> {
        return this.http.get<WeatherResponse>(`${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`).pipe(
            map(response => ({
                city: response.name,
                temperature: response.main.temp,
                condition: response.weather[0].description,
            })),
            catchError(error => this.handleError(error))
        );
    }

    getForecast(city: string): Observable<any> {
        return this.http.get<ForecastResponse>(`${this.forecastUrl}?q=${city}&appid=${this.apiKey}&units=metric`).pipe(
            map(response => this.filterForecast(response.list)),
            catchError(error => this.handleError(error))
        );
    }

    
    private filterForecast(forecastList: { dt_txt: string, main: { temp: number }, weather: [{ description: string }] }[]): any[] {
        const uniqueDays = new Set<string>()
        const threeDayForecast: any[] = [];

        for (let i = 0; i < forecastList.length; i++) {
            const forecast = forecastList[i];
            const forecastDate = forecast.dt_txt.split(' ')[0];

            if (!uniqueDays.has(forecastDate)) {
                uniqueDays.add(forecastDate);

                const forecastDay = new Date(forecastDate);
                const today = new Date();
                const daysDifference = Math.floor((forecastDay.getTime() - today.getTime()) / (1000 * 3600 * 24));

                if (daysDifference >= 0 && daysDifference < 3) {
                    threeDayForecast.push({
                        date: forecastDate,
                        temperature: forecast.main.temp,
                        condition: forecast.weather[0].description
                    });
                }
            }
        }

        return threeDayForecast;
    }

    private handleError(error: any) {
        console.error('WeatherService Error:', error);
        if (error.status === 401) {
            return throwError('Unauthorized: Invalid API key.');
        } else if (error.status === 404) {
            return throwError('City not found. Please check the name and try again.');
        }
        return throwError('An unknown error occurred.');
    }
}