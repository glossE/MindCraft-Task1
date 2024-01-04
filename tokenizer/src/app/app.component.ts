// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  handleTokenAdded(token: string): void {
    console.log('Token added:', token);
    // Implement logic to add the token to the database or perform other actions.
  }

  handleTokenRemoved(token: string): void {
    console.log('Token removed:', token);
    // Implement logic to remove the token from the database or perform other actions.
  }
}
