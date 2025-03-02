import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs';
import { tap } from 'rxjs';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface LoginResponse {
  token: string;
  // add more fields as needed
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = `${environment.API_BASE_URL}/auth`; 
  
  constructor(private http: HttpClient) { }

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, { email, password });
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { email, password });
  }

  saveToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    console.log(localStorage.getItem('auth_token'))
    return localStorage.getItem('auth_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('auth_token');
  }

  refreshToken(): Observable<string> {
    return this.http.post<{ token: string }>('/api/auth/refresh', {})
      .pipe(
        tap(response => this.saveToken(response.token)),
        switchMap(response => new Observable<string>(observer => {
          observer.next(response.token);
          observer.complete();
        }))
      );
  }
  
  /**
   * Extracts the user ID from the JWT token.
   */
  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
      console.log(payload);
      return payload.userId || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
