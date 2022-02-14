import { ComponentFixture, TestBed } from '@angular/core/testing';
import {FooterDefaultComponent} from "@features/footers/footer-default/footer-default.component";


describe('FooterComponent', () => {
  let component: FooterDefaultComponent;
  let fixture: ComponentFixture<FooterDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterDefaultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
