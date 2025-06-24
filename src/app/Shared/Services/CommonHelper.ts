import { Injectable } from '@angular/core';
import { UserResponseDto } from '../../Models/ResponseDto/UserResponseDto';
import { Toolbar } from 'ngx-editor';

@Injectable()

export class CommonHelper {

  constructor() { }
  public static CommonButtonClick(elementId: string) {
    document.getElementById(elementId)?.click();
  }
  // Pagination Number generated 
  public static generateNumbers(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  public static isValidNumber(input: string): boolean {
    const regex = /^\d{11}$/; // Matches exactly 11 digits
    return regex.test(input);
  }

  public static booleanConvert(booleanValue: any): boolean {
    if (booleanValue == "true") {
      return true
    }
    else if (booleanValue == "false") {
      return false
    } else if (booleanValue == true) {
      return true
    }
    else if (booleanValue == false) {
      return false
    } else {
      return true;
    }
  }

  public static GetUser(): UserResponseDto | null {
    let oUserResponseDto = new UserResponseDto();
    var user = localStorage.getItem("UserResponseDto");
    if (user != null) {
      oUserResponseDto = JSON.parse(user);
    }
    return oUserResponseDto;
  }

  public static GetToolBar(): Toolbar {
    let toolbar: Toolbar = [
      ['bold', 'italic'],
      ['underline', 'strike'],
      ['code', 'blockquote'],
      ['ordered_list', 'bullet_list'],
      [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
      ['link', 'image'],
      ['text_color', 'background_color'],
      ['align_left', 'align_center', 'align_right', 'align_justify'],
    ];
    return toolbar;
  }

}