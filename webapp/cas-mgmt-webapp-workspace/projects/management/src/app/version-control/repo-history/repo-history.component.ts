import {Component, OnInit, ViewChild} from '@angular/core';
import {Commit} from 'domain-lib';
import {PaginatorComponent} from 'shared-lib';
import {RepoHistoryService} from './repo-history.service';
import {MatSnackBar, MatTableDataSource} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {BreakpointObserver} from '@angular/cdk/layout';

@Component({
  selector: 'app-repo-history',
  templateUrl: './repo-history.component.html',
  styleUrls: ['./repo-history.component.css']
})
export class RepoHistoryComponent implements OnInit {

  dataSource: MatTableDataSource<Commit>;
  displayedColumns = ['actions', 'id', 'message', 'time'];
  selectedItem: Commit;

  @ViewChild(PaginatorComponent, { static: true })
  paginator: PaginatorComponent;

  constructor(private service: RepoHistoryService,
              private router: Router,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar,
              public breakObserver: BreakpointObserver) { }

  ngOnInit() {
    this.route.data.subscribe((data: {resp: Commit[]}) => {
      this.dataSource = new MatTableDataSource<Commit>(data.resp);
      this.dataSource.paginator = this.paginator.paginator;
    });
    this.breakObserver.observe(['(max-width: 499px)'])
      .subscribe(r => {
        if (r.matches) {
          this.displayedColumns = ['actions', 'message'];
        } else {
          this.displayedColumns = ['actions', 'id', 'message', 'time'];
        }
      });
  }

  refresh() {
    this.service.commitLogs()
      .subscribe(resp => this.dataSource.data = resp);
  }

  viewChanges(commit?: Commit) {
    if (commit) {
      this.selectedItem = commit;
    }
    this.router.navigate(['version-control/commit-history', this.selectedItem.id]);
  }

  checkout() {
    this.service.checkout(this.selectedItem.id)
      .subscribe(() =>
        this.snackBar
          .open('Commit has been checked out',
            'Dismiss',
            {duration: 5000}
          )
      );
  }
}
