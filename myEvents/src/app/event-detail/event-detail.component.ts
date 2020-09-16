import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { identifierModuleUrl } from '@angular/compiler';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.sass'],
})
export class EventDetailComponent implements OnInit {
  infoUser: any;
  events: any = [];
  event_id: any;
  id_event : any;
  insertId: any = {};
  image: any = [];
  sorties: any = [];
  sortiesPrivate: any = [];
  rep: any;
  count: any;
  countPrivate: any;
  arrayPartByEvent: any = [];
  arrayPartByEventPrivate: any = [];

  constructor(private http: HttpClient,
    private actRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
    this.infoUser = JSON.parse(localStorage.getItem('currentUser'));
    this.actRoute.paramMap.subscribe(params => {
      this.event_id = params.get('id');
      this.id_event = params.get('id_event');
    });
    let url: string = '';
    url = 'http://api.eventful.com/json/events/get?app_key=M95mQqmTbktTWS9b&id=' + this.event_id;
    this.http.get(url).subscribe((res) => {
      this.events = res;

      console.log(this.infoUser);
      console.log('event_id = ', this.event_id);
      console.log('id_event = ', this.id_event);
      console.log('id_eventful = ', this.event_id);
      this.getSorties(this.id_event);
      this.getSortiesPrivate(this.id_event);
      this.apiService.getEventful(this.events.id).subscribe(data => {
        this.rep = data; console.log(this.rep);
      })
      this.image = this.events.images.image[0];
    })

  }

  createEvent() {
    let datas = {
      id_eventful: this.event_id,
      id_org: this.infoUser.id,
      name: this.events.title,
      visibility: 0,
      date: this.events.start_time,
    }
    console.log(datas)
    this.apiService.addEvent(datas).subscribe(data => {
      this.insertId = data['insertId'];
      console.log(this.insertId)
      let org_data = {
        id_member: this.infoUser.id,
        id_event: this.insertId,
        id_org: this.infoUser.id
      }
      this.apiService.addParticipant(org_data).subscribe(data => {
        console.log(data);
      });
      this.router.navigate(['/organize/', this.events.id, this.insertId]);
    })

  }

  delEvent(id_event: number, id_org: number) {
    console.log(id_event);
    let datas = { id_event: id_event, id_org: id_org };
    this.apiService.delEvent(datas).subscribe(data => {
      console.log(data);
    });
  }

  getSorties(id_event) {
    console.log(id_event)
    let getPart = (item, index) => {console.log(item)
      this.arrayPartByEvent[item.id_event] = [];console.log(this.arrayPartByEvent)
      this.apiService.getParticipants(item.id_event).subscribe(data => {
        for (const key in data) {
          console.log(`${key}: ${data[key].id_member}`);
          if(data[key].id_member){
            this.arrayPartByEvent[item.id_event].push(data[key].id_member);
          }
        }
      });
    }
    this.apiService.getEvent(id_event).subscribe(data => {
      this.sorties = data; console.log(this.sorties)
      data.forEach(getPart)
      this.count = this.sorties.length;
    });console.log(this.sorties)
    console.log(this.arrayPartByEvent)
  }

  getSortiesPrivate(id_event) {
    console.log(id_event)
    let getPart = (item, index) => {console.log(item)
      this.arrayPartByEventPrivate[item.id_event] = [];console.log(this.arrayPartByEventPrivate)
      this.apiService.getParticipants(item.id_event).subscribe(data => {
        for (const key in data) {
          console.log(`${key}: ${data[key].id_member}`);
          if(data[key].id_member){
            this.arrayPartByEventPrivate[item.id_event].push(data[key].id_member);
          }
        }
        console.log(this.arrayPartByEventPrivate)
      });
    }
    this.apiService.getEventPrivate(id_event).subscribe(data => {
      this.sortiesPrivate = data; console.log(this.sortiesPrivate)
      data.forEach(getPart)
      this.countPrivate = this.sortiesPrivate.length;
    });console.log(this.sorties)
  }

  joinEvent(event_id, org_id) {
    console.log(this.events)
    let datas = {
      id_member: this.infoUser.id,
      id_event: event_id,
      id_org: org_id,
    }
    console.log(datas)
    this.apiService.addParticipant(datas).subscribe(data => {
      this.rep = data; console.log(this.rep)
      this.router.navigate(['/organize/join/', this.event_id, org_id, event_id]);
    });
  }

  voirEvent(id_event, id_eventful){
    console.log(id_eventful)
    console.log(id_event)
    this.router.navigate(['/organize/', id_eventful, id_event]);
  }
}
