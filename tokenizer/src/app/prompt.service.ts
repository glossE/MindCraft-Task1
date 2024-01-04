import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PromptService {
  private apiUrl = 'http://localhost:3000'; // Replace with your backend API URL

  private promptOpenSubject = new BehaviorSubject<boolean>(false);
  promptOpen$: Observable<boolean> = this.promptOpenSubject.asObservable();

  private promptDataSubject = new BehaviorSubject<any>(null);
  promptData$: Observable<any> = this.promptDataSubject.asObservable();

  constructor(private http: HttpClient) {}

  openPrompt(): Observable<any> {
    this.promptOpenSubject.next(true);

    // Return an observable that the component can subscribe to
    return new Observable((observer) => {
      const subscription = this.promptData$.subscribe((data) => {
        if (data !== null) {
          observer.next(data);
          observer.complete();
          this.closePrompt(); // Automatically close the prompt after data is retrieved
        }
      });

      return () => subscription.unsubscribe();
    });
  }

  closePrompt(): void {
    this.promptDataSubject.next(null);
    this.promptOpenSubject.next(false);
  }

  submitData(data: any): Observable<any> {
    console.log('Data to submit:', data);
    const url = 'http://localhost:3000/submitData';
    return this.http.post(url, data);
  }
  
}
