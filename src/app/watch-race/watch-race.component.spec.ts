import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchRaceComponent } from './watch-race.component';

describe('WatchRaceComponent', () => {
  let component: WatchRaceComponent;
  let fixture: ComponentFixture<WatchRaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchRaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WatchRaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
