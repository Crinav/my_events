import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClient } from "@angular/common/http";
import {UserModel} from '../interface/user';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.sass']
})
export class MemberComponent implements OnInit {
  pseudo: string;
  user: any= [];
  events: any= [];
  count: any;
  participants: any= [];
  infoUser: any;
  my_sort : any=[];
  
  constructor(private apiService: ApiService, private http: HttpClient, private actRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.infoUser  = JSON.parse(localStorage.getItem('currentUser'));
    this.actRoute.paramMap.subscribe(params => {
      this.pseudo = params.get('pseudo');console.log(this.pseudo)
    });

    this.apiService.getUser(this.pseudo).subscribe(data=>{
      this.user = data[0]; console.log(this.user);
      this.getEvent(this.user.id);
      this.getMySorties();
    });

  }

  getEvent(id_org){
    console.log(id_org)
    this.apiService.getEventOrg(id_org).subscribe(data=>{
      this.events = data; console.log(this.events)
    });
    //foreach this.events récup id_events pour request sur les participants
    console.log(this.events.id_event)
    this.apiService.getParticipants(this.events.id_event).subscribe(data=>{
      this.participants = data; console.log(this.participants)
      this.count = this.participants.length;
    });
  }

  getMySorties(){
    console.log(this.user.id);
    this.apiService.getMySort(this.user.id).subscribe(data=>{
      this.my_sort = data;
      console.log(this.my_sort);
    });
    console.log(this.my_sort.id_event)
    this.apiService.getParticipants(this.my_sort.id_event).subscribe(data=>{
      this.participants = data; console.log(this.participants)
      this.count = this.participants.length;
    });
  }

}
