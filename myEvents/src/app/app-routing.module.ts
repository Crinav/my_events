import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { HomeComponent } from './home/home.component';
import { OrganizeComponent } from './organize/organize.component';
import { MemberComponent } from './member/member.component';

const routes: Routes = [
  {path: 'home', redirectTo: 'home', pathMatch: 'full'},
  {path:'home', component: HomeComponent},
  {path:'event/:id', component: EventDetailComponent},
  {path:'eventful/:id/:id_event', component: EventDetailComponent},
  {path:'organize/join/:id/:id_org/:event_id', component: OrganizeComponent},
  {path:'member/:pseudo', component: MemberComponent},
  {path:'organize/:id/:insertId', component: OrganizeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
