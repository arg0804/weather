import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CityInputComponent } from './city-input.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('CityInputComponent', () => {
  let component: CityInputComponent;
  let fixture: ComponentFixture<CityInputComponent>;
  let inputElement: HTMLInputElement;
  let buttonElement: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [CityInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CityInputComponent);
    component = fixture.componentInstance;

    inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit city name when add button is clicked with valid input', () => {
    spyOn(component.cityAdded, 'emit');

    component.city = 'New York';
    buttonElement.click();

    expect(component.cityAdded.emit).toHaveBeenCalledWith('New York');
    expect(component.city).toBe('');
  });

  it('should not emit city name when input is empty', () => {
    spyOn(window, 'alert');
    component.city = '';

    buttonElement.click();

    expect(component.cityAdded.emit).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Please enter a city name.');
  });

  it('should clear input after emitting', () => {
    component.city = 'London';
    buttonElement.click();

    expect(component.city).toBe('');
  });
});