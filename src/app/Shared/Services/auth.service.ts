import { Injectable } from '@angular/core';
import { CommonHelper } from './CommonHelper';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  public isLogin(): boolean {
    if (this.isLocalStorageAvailable()) {
      let currentUser=CommonHelper.GetUser();
      let token = localStorage.getItem("Token");
      return token == null || !this.isTokenExpired(token)==false  ? false : true;
    }
    return false;
  }

  isTokenExpired(token: any): boolean {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp < Date.now() / 1000;
  }

 public getMenuList(): any [] {
    let token = localStorage.getItem("Token");
    if(token!=null){
      const payload = JSON.parse(atob(token.split('.')[1]));
     return JSON.parse(payload.MenuList);
    }
    return [];
  }

  isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && 'localStorage' in window;
  }

  setItem(key: string, value: string): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(key, value);
    }
  }

  getItem(key: string): string | null {
    if (this.isLocalStorageAvailable()) {
      return localStorage.getItem(key);
    }
    return null;
  }

  removeItem(key: string): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(key);
    }
  }

  clear(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.clear();
    }
  }
}
