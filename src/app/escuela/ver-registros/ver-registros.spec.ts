import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerRegistros } from './ver-registros';

describe('VerRegistros', () => {
  let component: VerRegistros;
  let fixture: ComponentFixture<VerRegistros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerRegistros],
    }).compileComponents();

    fixture = TestBed.createComponent(VerRegistros);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
