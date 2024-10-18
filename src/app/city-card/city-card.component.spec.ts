import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CityCardComponent } from './city-card.component';
import { By } from '@angular/platform-browser';

describe('CityCardComponent', () => {
  let component: CityCardComponent;
  let fixture: ComponentFixture<CityCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CityCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CityCardComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display city information', () => {
    component.city = {
      city: 'London',
      temperature: 20,
      condition: 'Clear',
      forecast: []
    };
    fixture.detectChanges();

    const cityElement = fixture.debugElement.query(By.css('.city-name')).nativeElement;
    const temperatureElement = fixture.debugElement.query(By.css('.city-temperature')).nativeElement;
    const conditionElement = fixture.debugElement.query(By.css('.city-condition')).nativeElement;

    expect(cityElement.textContent).toContain('London');
    expect(temperatureElement.textContent).toContain('20');
    expect(conditionElement.textContent).toContain('Clear');
  });

  it('should emit remove event when remove button is clicked', () => {
    spyOn(component.remove, 'emit');

    component.removeCity();
    expect(component.remove.emit).toHaveBeenCalled();
  });
});