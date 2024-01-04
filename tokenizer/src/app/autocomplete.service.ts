// autocomplete.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AutocompleteService {
  private apiUrl = 'http://localhost:3000'; // Replace with your backend API URL

  constructor(private http: HttpClient) {}

  getAutocompleteSuggestions(query: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/autocomplete?q=${query}`);
  }

  addName(name: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/names`, { name });
  }

}
