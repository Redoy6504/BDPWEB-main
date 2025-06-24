import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { CurrentUseerResponseDto } from '../../Models/ResponseDto/CurrentUseerResponseDto';

@Injectable({
  providedIn: 'root'
})
export class HttpHelperService {

  appUrl = "https://localhost:5001/v1/";
  // appUrl = "http://103.192.159.61:8021/v1/";

  constructor(private http: HttpClient) { }

  Get(URL: string, hashKey?: string): Observable<any[]> {
    var token = localStorage.getItem('Token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    // If hashKey is provided, generate the x-hash header
    if (hashKey) {
      // Add the x-hash header
      headers = headers.set('x-hash', hashKey);
    }
    return this.http.get<any>(this.appUrl + URL, { headers });
  }


  Post(URL: string, object: any, hashKey?: string): Observable<any[]> {
    var token = localStorage.getItem('Token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    // If hashKey is provided, generate the x-hash header
    if (hashKey) {
      // Add the x-hash header
      headers = headers.set('x-hash', hashKey);
    }

    return this.http.post<any>(this.appUrl + URL, object, { headers });
  }

  Login(URL: string, object: any, hashKey?: string): Observable<any[]> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    // If hashKey is provided, generate the x-hash header
    if (hashKey) {
      // Add the x-hash header
      headers = headers.set('x-hash', hashKey);
    }
    // Make the HTTP POST request with headers
    return this.http.post<any>(this.appUrl + URL, object, { headers });
  }

  UploadFile(URL: string, file: File): Observable<any> {
    const token = localStorage.getItem('Token');
    const formData = new FormData();
    formData.append('imageFile', file);
    return this.http.post(this.appUrl + URL, formData, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`, 'Show-Loader': 'true'
      })
    });
  }

  // Helper Service
  // Convert text to ArrayBuffer
  private toArrayBuffer(text: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    return Promise.resolve(encoder.encode(text));
  }

  public GetCurrentUser() {
    let oCurrentUseerResponseDto = new CurrentUseerResponseDto();
    var data = localStorage.getItem("CurrentUser");
    if (data != null) {
      oCurrentUseerResponseDto = data as unknown as CurrentUseerResponseDto;
      return oCurrentUseerResponseDto;
    }
    return oCurrentUseerResponseDto;
  }
}
