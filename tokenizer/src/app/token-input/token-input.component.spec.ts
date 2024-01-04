import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenInputComponent } from './token-input.component';

describe('TokenInputComponent', () => {
  let component: TokenInputComponent;
  let fixture: ComponentFixture<TokenInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TokenInputComponent]
    });
    fixture = TestBed.createComponent(TokenInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
