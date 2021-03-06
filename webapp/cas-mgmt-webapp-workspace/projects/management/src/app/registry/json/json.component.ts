import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import { Location } from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {ServiceViewService} from '../services/service.service';
import {MatSnackBar} from '@angular/material';
import {HttpErrorResponse} from '@angular/common/http';
import {EditorComponent} from 'shared-lib';

@Component({
  selector: 'app-json',
  templateUrl: './json.component.html',
  styleUrls: ['./json.component.css']
})
export class JSONComponent implements AfterViewInit, OnInit {

  file: string;

  changed = false;

  @ViewChild('editor', { static: true })
  editor: EditorComponent;

  constructor(private service: ServiceViewService,
              private location: Location,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.route.data
        .subscribe((data: { resp: string }) => {
          this.file = data.resp;
       });
    }, 100);
  }

  save() {
    this.service.saveJson(this.route.snapshot.params.id, this.editor.getFile())
      .subscribe(() => this.handleSuccess(), error => this.handleError(error));
  }

  handleSuccess() {
    this.snackBar.open(
      'Service successfully saved',
      'Dismiss',
      { duration: 5000 }
    );
    this.location.back();
  }

  handleError(error: HttpErrorResponse) {
    this.snackBar.open(
      error.error.message,
      'Dismiss',
      { duration: 5000 }
    );
  }

  change() {
    this.changed = true;
  }

  reset() {
    this.changed = false;
    this.editor.file = this.file;
  }

}
