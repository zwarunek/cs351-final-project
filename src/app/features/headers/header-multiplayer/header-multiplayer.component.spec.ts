import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HeaderMultiplayerComponent} from './header-multiplayer.component';

describe('HeaderMultiplayerComponent', () => {
  let component: HeaderMultiplayerComponent;
  let fixture: ComponentFixture<HeaderMultiplayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderMultiplayerComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderMultiplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
