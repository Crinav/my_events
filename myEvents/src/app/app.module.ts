import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common'
import { HomeComponent } from './home/home.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { OrganizeComponent, SafePipe } from './organize/organize.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ApiService } from './api.service';
import { MemberComponent } from './member/member.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EventDetailComponent,
    OrganizeComponent,
    SafePipe,
    MemberComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
  ],
  providers: [
    ApiService,
    DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
