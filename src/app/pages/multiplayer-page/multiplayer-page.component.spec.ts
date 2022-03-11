import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiplayerPageComponent } from './multiplayer-page.component';

describe('MultiplayerPageComponent', () => {
  let component: MultiplayerPageComponent;
  let fixture: ComponentFixture<MultiplayerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiplayerPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiplayerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
