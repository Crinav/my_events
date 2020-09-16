import { Component, PipeTransform, Pipe, OnInit} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { UserModel } from '../interface/user';
import { ParticipantsModel } from '../interface/participants';
import { ApiService } from '../api.service';
import { DatePipe } from '@angular/common';
import { ITS_JUST_ANGULAR } from '@angular/core/src/r3_symbols';


@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
  selector: 'app-organize',
  templateUrl: './organize.component.html',
  styleUrls: ['./organize.component.sass'],
})
export class OrganizeComponent implements OnInit {
  infoUser: any;
  insertId: any = {};
  events: any = [];
  event_id: string;
  title: string;
  friends: any = [];
  genre: string;
  gps: string;
  long: any;
  user: UserModel;
  error: string = '';
  part: any;
  invitation: any = '';
  data: any;
  pseudo: string = '';
  messages: any = [];
  id_org: any;
  sendChat: string;
  date:any;
  count: any;

  constructor(private http: HttpClient,
    private actRoute: ActivatedRoute,
    private apiService: ApiService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.infoUser = JSON.parse(localStorage.getItem('currentUser'));
    this.actRoute.paramMap.subscribe(params => {
      this.event_id = params.get('id'); console.log(params)
      if (params.get('insertId')) {
        this.insertId = params.get('insertId');
      }
      else {
        this.insertId = params.get('event_id');
      }

      if (params.get('id_org')) {
        this.id_org = params.get('id_org');
      } else {
        this.id_org = this.infoUser.id
      }
      console.log(this.friends)
    });

    console.log('id_org = ', this.id_org)
    console.log('infoUser.id = ', this.infoUser.id)

    let url: string = '';
    url = 'http://api.eventful.com/json/events/get?app_key=M95mQqmTbktTWS9b&id=' + this.event_id;
    this.http.get(url).subscribe((res) => {
      this.events = res;
      console.log(this.events);
      let lat = this.events.latitude;
      let long = this.events.longitude;
      console.log(lat);
      this.gps = "https://maps.google.com/maps?width=800&height=300&hl=en&q=" + lat + "," + long + "+(Titre)&ie=UTF8&t=&z=15&iwloc=B&output=embed"
      console.log(this.gps)
    })

    this.getAllMess();
    this.apiService.getParticipants(this.insertId).subscribe(data => {
      console.log(data);
      let arrayIdPart = [];
      Object.keys(data).map(function (key, index) {
        arrayIdPart.push(data[key].id_member);
      }); console.log(arrayIdPart);
      arrayIdPart.forEach(element => {
        this.apiService.getUserById(element).subscribe(data => {
          this.friends.push({'pseudo': data[0].pseudo, 'avatar': data[0].avatar});
          this.count = this.friends.length;
        });
      });
    });console.log(this.friends)
  }

  sendMess(id_event, id_user ){
    console.log(this.sendChat)
    let mess = {id_event: id_event, id_member: id_user, message: this.sendChat}
    if(mess.message !== ''){
      this.sendChat = '';
      this.apiService.sendMess(mess).subscribe(data => {
          console.log(data);
          let formatDate = (date) =>{
            let new_date =this.datePipe.transform(date, 'yyyy-MM-dd');
            console.log(new_date);
            return new_date;
          }
          this.apiService.getAllMessages(this.insertId).subscribe(data => {
            Object.keys(data).map(function(key, index) {
              console.log(data[key].date)
              if(data[key].date){console.log('entré')
              data[key].date = formatDate(data[key].date);
              }
            });
            this.messages = data; console.log(data)
          });
      });
    };

  }



  getAllMess(){
    let formatDate = (date) =>{
      let new_date =this.datePipe.transform(date, 'yyyy-MM-dd');
      return new_date;
    }
    this.apiService.getAllMessages(this.insertId).subscribe(data => {
      Object.keys(data).map(function(key, index) {
        if(data[key].date){
        data[key].date = formatDate(data[key].date);
        }
      });
      this.messages = data; console.log(data)
    });

  }

  // getAllUsers() {
  //   this.apiService.getAllUsers().subscribe(data => {
  //     console.log('AllUsers:'); console.log(data)
  //   });
  // };

  getUser(pseudo) {
    this.apiService.getUser(pseudo).subscribe(data => {
      this.invitation = data[0]; console.log(this.invitation);
      if (this.invitation == undefined) {
        this.error = 'Ce pseudo n\'existe pas !';
        return false;
      } else {console.log(this.invitation)
        this.friends.push({'pseudo':data[0].pseudo, 'avatar':data[0].avatar})
      console.log(this.friends)
      }
      let datas = { id_member: this.invitation.id, id_event: this.insertId, id_org: this.infoUser.id }
      this.pseudo = ''
      this.apiService.addParticipant(datas).subscribe(data => {
        console.log(data);
      });
    });
  }

  templateForm(value: any) {
    this.genre = value.genre;
  }
  changeGenre(event) {
    this.genre = event.target.value;
    let data = {
      id_event: this.insertId,
      id_org: this.infoUser.id,
      visibility: this.genre == 'private' ? 1 : 0
    };
    console.log(data)
    this.apiService.updateEvent(data).subscribe(data => {
    })
  }
  addFriendsForm(value: any) {
    this.error = '';
    this.getUser(value.pseudo);
  }

  updateEvent() {
    console.log(this.events)
    let datas = {
      id_event: this.insertId,
      id_org: this.infoUser.id,
      visibility: this.genre == 'private' ? 1 : 0
    }
    console.log(datas)
    this.apiService.updateEvent(datas).subscribe(data => {
    })
    this.title = '';
  }



}
