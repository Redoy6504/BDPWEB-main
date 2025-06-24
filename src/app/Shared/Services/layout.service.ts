import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  public getLayoutBodyHeight(headerId: string, footerId: string): number {
    
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      return 0; // Or any default value you deem appropriate
    }

    let topHeight = document.getElementById(headerId)?.offsetHeight || 0;
    let footer = document.getElementById(footerId)?.offsetHeight || 0;
    let viewportScreenHeight = window.innerHeight;

    return viewportScreenHeight - topHeight - footer;
  }
}
