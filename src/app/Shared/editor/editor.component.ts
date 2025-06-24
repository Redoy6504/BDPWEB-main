import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Validators, Editor, Toolbar } from 'ngx-editor';
import { NgxEditorModule } from "ngx-editor";

import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import Doc from '../../Models/Doc';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxEditorModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent  implements OnInit, OnDestroy {
  editordoc = Doc;

  editor: any;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  form = new FormGroup({
    editorContent: new FormControl(
      { value: Doc, disabled: false },
      Validators.required()
    ),
  });

  get doc(): any {
    return this.form.get('editorContent');
  }

  ngOnInit(): void {
    debugger
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}

