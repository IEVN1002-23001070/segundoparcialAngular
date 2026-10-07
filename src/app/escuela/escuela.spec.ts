import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Escuela } from './escuela';

describe('Escuela', () => {
  let component: Escuela;
  let fixture: ComponentFixture<Escuela>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Escuela],
    }).compileComponents();

    fixture = TestBed.createComponent(Escuela);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
