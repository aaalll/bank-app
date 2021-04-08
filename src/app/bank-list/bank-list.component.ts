import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { IBank } from "../ibank";
import { BankService } from "../bank.service";
import { MediaService } from "../media.service";

@Component({
  selector: 'app-bank-list',
  templateUrl: './bank-list.component.html',
  styleUrls: ['./bank-list.component.scss']
})

export class BankListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['bankCode', 'bankName', 'createdDate', 'modifiedDate', 'more'];
  mobileColumns: string[] = ['line'];
  filteredAndPagedIssues: Observable<GithubIssue[]>;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  banks: IBank[] = [];
  isDesktop: boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  private mediaService = new MediaService('(min-width: 768px)')

  constructor(private bankService: BankService) { }
  ngOnInit(): void {
    this.mediaService.match$.subscribe(value => this.isDesktop = value);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {

      this.filteredAndPagedIssues = merge(this.paginator.page)
        .pipe(
          startWith({}),
          switchMap(() => {
            this.isLoadingResults = true;
            return this.bankService!.getBankList(this.paginator.pageIndex);
          }),
          map(data => {
            this.isLoadingResults = false;
            this.isRateLimitReached = false;
            let totalCount = (this.paginator.pageIndex) * this.paginator.pageSize + data['banks'].length
            this.resultsLength = totalCount;

            return data['banks'];
          }),
          catchError(() => {
            this.isLoadingResults = false;
            this.isRateLimitReached = true;
            return observableOf([]);
          })
        );
    });

  }

  resetPaging(): void {
    this.paginator.pageIndex = 0;
  }
}

export interface GithubIssue {
  created_at: string;
  number: string;
  state: string;
  title: string;
}