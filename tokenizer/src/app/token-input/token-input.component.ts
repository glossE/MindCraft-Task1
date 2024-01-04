// token-input.component.ts
import { Component, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AutocompleteService } from '../autocomplete.service';
import { PromptService } from '../prompt.service';

@Component({
  selector: 'app-token-input',
  templateUrl: './token-input.component.html',
  styleUrls: ['./token-input.component.css']
})
export class TokenInputComponent {
  inputValue = '';
  tokens: string[] = [];
  suggestions: string[] = [];

  @Output() tokenAdded = new EventEmitter<string>();
  @Output() tokenRemoved = new EventEmitter<string>();

  constructor(private http: HttpClient, private autocompleteService: AutocompleteService, private promptService: PromptService) {}

  get publicPromptService(): PromptService {
    return this.promptService;
  }

  get promptData(): any {
    return this.promptService.promptData$;
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ',' || event.key === ' ') {
      event.preventDefault();
      this.addToken();
    }
  }

  addToken(): void {
    const trimmedValue = this.inputValue.trim();
    if (trimmedValue && !this.tokens.includes(trimmedValue)) {
      if (this.suggestions.includes(trimmedValue)) {
        this.tokens.push(trimmedValue);
        this.tokenAdded.emit(trimmedValue);
        this.inputValue = '';
      } else {
        // Name does not exist, open prompt for additional data
        this.promptForAdditionalData(trimmedValue);
      }
    }
  }
  
  private promptForAdditionalData(name: string): void {
    if (name.trim() !== '') { // Check if name is not empty
      // Call the prompt service to collect additional data
      this.promptService.openPrompt().subscribe(
        (additionalData) => {
          // Now you can use the PromptService to submit data to the server
          this.promptService.submitData({ name, additionalData }).subscribe(
            () => {
              this.tokens.push(name);
              this.tokenAdded.emit(name);
              this.inputValue = '';
            },
            (error) => {
              console.error('Error adding name to database:', error);
            }
          );
        },
        (error) => {
          console.error('Error collecting additional data:', error);
        }
      );
    }
  }
  

  removeToken(token: string): void {
    const index = this.tokens.indexOf(token);
    if (index !== -1) {
      this.tokens.splice(index, 1);
      this.tokenRemoved.emit(token);
    }
  }
/*
  fetchNames(): Observable<string[]> {
    return this.http.get<string[]>('/api/names');
  }
*/

  

  // Existing code...
  // token-input.component.ts
  submitPrompt(): void {
    const trimmedValue = this.inputValue.trim();  // Trim the input value
    console.log('Trimmed value:', trimmedValue);
    if (!trimmedValue) {
      console.error('Name is required.');  // Log an error if the name is empty
      return;
    }
  
    // Extract additional data from the promptData
    const { lastName, phoneNumber, address, email } = this.promptData;
  
    // Format the data in the way the server expects
    const formattedData = {
      name: trimmedValue,
      lastName,
      phoneNumber,
      address,
      email,
      // Add other properties as needed
    };
    
    

    console.log('Formatted data:', formattedData); // Log the formatted data before submitting
  
    // Now you can send the formatted data to the service
    this.promptService.submitData(formattedData).subscribe(
      (response) => {
        console.log('Data submitted successfully:', response);
        // Handle successful response from the server, if needed
        this.tokens.push(trimmedValue);
        this.tokenAdded.emit(trimmedValue);

        // Clear input value
        this.inputValue = '';

        // Close the prompt
        this.promptService.closePrompt();
      },
      (error) => {
        console.error('Error submitting data:', error);
        // Handle error from the server, if needed
      }
    );
  }
  
  /*
    console.log('Data to submit:', dataToSubmit); // Log the data before submitting
  
    this.promptService.submitData(dataToSubmit).subscribe(
      (response) => {
        console.log('Data submitted successfully:', response);
        // Handle successful response from the server, if needed
      },
      (error) => {
        console.error('Error submitting data:', error);
        // Handle error from the server, if needed
      }
    );
  }
  */

  

  onInput(): void {
    this.autocompleteService.getAutocompleteSuggestions(this.inputValue).subscribe(
      suggestions => {
        this.suggestions = suggestions;
      },
      error => {
        console.error('Error fetching autocomplete suggestions:', error);
      }
    );
  }

  selectSuggestion(suggestion: string): void {
    this.inputValue = suggestion;
    this.addToken();
  }
}
