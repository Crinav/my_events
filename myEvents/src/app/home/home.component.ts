import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClient } from "@angular/common/http";
import { UserModel } from '../interface/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
})
export class HomeComponent implements OnInit {
  infoUser: any;
  queryT: string;
  queryK: string;
  queryD: string;
  events: any = [];
  img: any = [];
  count: any;
  selectedEvent;
  config: any;
  error: string = '';
  collection = { count: 0, data: [] };
  user: UserModel[];
  users: any = [];
  info: string;
  my_events: any = [];
  msg: boolean;

  constructor(private apiService: ApiService,
     private http: HttpClient,
     )
     {
    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.collection.count
    };
  }

  ngOnInit(): void {
    this.infoUser  = JSON.parse(localStorage.getItem('currentUser'));
    console.log('infoUser = ', this.infoUser)
    let url: string = '';
    url = 'http://api.eventful.com/json/events/search?app_key=M95mQqmTbktTWS9b&location=Marseille&date=Future&page_size=20&sort_order=date'
    this.http.get(url).subscribe((res) => {
      this.events = res['events']['event'];
      console.log(this.events);
      this.count = this.events.length;
      this.initiatePagination();
    })

  }

  initiatePagination(){
    this.collection.data = [];
    this.collection.count = this.count;
    for (var i = 0; i < this.collection.count; i++) {
      this.collection.data.push(
        {
          id: i + 1,
          event: this.events[i]
        }
      );
    }
    console.log(this.collection.data)
  }

  getData(){
    this.collection.count = 0;
    let url: string = '';
    // ville
    if (this.queryT !== undefined && this.queryK == undefined && this.queryD == undefined) {
      url = 'http://api.eventful.com/json/events/search?app_key=M95mQqmTbktTWS9b&page_size=20&date=Future&sort_order=date&location=' + this.queryT;
      console.log('ville')
    }
    // mot-clés
    else if (this.queryK !== undefined && this.queryT == undefined && this.queryD == undefined) {
      url = 'http://api.eventful.com/json/events/search?app_key=M95mQqmTbktTWS9b&location=Marseille&date=Future&page_size=20&sort_order=date&keywords=' + this.queryK;
      console.log('mot')
    }
    // date
    else if (this.queryD !== undefined && this.queryK == undefined && this.queryT == undefined) {
      url = 'http://api.eventful.com/json/events/search?app_key=M95mQqmTbktTWS9b&page_size=20&date=' + this.queryD;
      console.log(this.queryD)
      console.log('date')
    }
    // ville + mot-clés
    else if (this.queryT !== undefined && this.queryK !== undefined && this.queryD == undefined) {
      url = 'http://api.eventful.com/json/events/search?app_key=M95mQqmTbktTWS9b&date=Future&page_size=20&sort_order=date&keywords=' + this.queryK+'&location=' + this.queryT;
      console.log('ville + mot')
    }
    // ville + date
    else if (this.queryT !== undefined && this.queryD !== undefined && this.queryK == undefined) {
      url = 'http://api.eventful.com/json/events/search?app_key=M95mQqmTbktTWS9b&page_size=20&keywords=&location=' + this.queryT+ '&date=' + this.queryD;
      console.log(this.queryD)
      console.log('ville + date')
    }
    // mot-clés + date
    else if (this.queryK !== undefined && this.queryD !== undefined && this.queryT == undefined) {
      url = 'http://api.eventful.com/json/events/search?app_key=M95mQqmTbktTWS9b&location=Marseille&page_size=20&sort_order=date&keywords=' + this.queryK+'&date=' + this.queryD;
      console.log('mot + date')
    }
    // ville + mot-clés + date
    else if (this.queryT !== undefined && this.queryK !== undefined && this.queryD !== undefined) {
      url = 'http://api.eventful.com/json/events/search?app_key=M95mQqmTbktTWS9b&page_size=20&sort_order=date&location=' + this.queryT + '&keywords=' + this.queryK+'&date=' + this.queryD;
      console.log('3 filtres')
    }


    this.http.get(url).subscribe((res) => {
      this.selectedEvent = false;
      if(res['events'] === null){
        console.log('resultat null')
        this.msg = false;
      }
      else{
        this.events = res['events']['event'];
        this.count = this.events.length;
        this.initiatePagination();
        console.log(this.collection.data)
        this.msg = true;
      }

    })

  }

  selectEvent(event)
  {
    this.selectedEvent = event.value;
    console.log(this.selectedEvent);
  }

  pageChanged(event){
    this.config.currentPage = event;
    console.log(event)
  }

  getUser(pseudo): void {
    this.apiService.getUser(pseudo).subscribe(data=>{
      this.user = data; console.log(this.user)
    });
  };

  checkPseudo(value: any) {
    this.error = '';
    this.getUser(value.pseudo);
    (this.user == undefined ? this.error = 'Ce pseudo n\'existe pas !': this.user// action a faire
    )
  }

  getAllUsers(){
    this.apiService.getAllUsers().subscribe(data=>{
      this.users = data;
      console.log(this.users)
      this.info ="ready"
    });
  }

  btnMembre(){
    this.infoUser  = JSON.parse(localStorage.getItem('currentUser'));
    console.log(this.infoUser)
    if(this.infoUser !== null){
      this.getAllUsers();
      this.getMySorties();
    }
  }

  getMySorties(){
    console.log(this.infoUser.id);
    this.apiService.getMySort(this.infoUser.id).subscribe(data=>{
      this.my_events = data;
      console.log(this.my_events);
    })
  }
}
