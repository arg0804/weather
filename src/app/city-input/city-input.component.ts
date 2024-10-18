import { Component, EventEmitter, Output } from '@angular/core';
import {FormsModule} from '@angular/forms'

@Component({
    selector: 'app-city-input',
    standalone: true,
    templateUrl: './city-input.component.html',
    styleUrls: ['./city-input.component.scss'],
    imports: [FormsModule]
})
export class CityInputComponent {
    city: string = '';
    @Output() cityAdded = new EventEmitter<string>();

    onAddCity() {
        if (this.city.trim()) {
            this.cityAdded.emit(this.city.trim());
            this.city = '';
        } else {
            alert('Please enter a city name.');
        }
    }
}