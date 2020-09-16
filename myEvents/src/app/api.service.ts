import { Injectable } from '@angular/core';
import { HttpClient , HttpParams} from '@angular/common/http';
import { UserModel } from './interface/user';
import { EventsModel } from './interface/events';
import { ParticipantsModel } from './interface/participants';
import {Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  baseurl: string = "http://localhost:3080/api/";

  // USER
  sendPostRequest(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseurl}user/`, data);
  }
  getAllUsers(){
    return this.http.get<UserModel[]>(this.baseurl + 'users');
  }
  getUserByMail(mail: string){
    return this.http.get<UserModel[]>(this.baseurl + 'usermail' + '/' + mail);
  }
  getUserById(id: number){
    return this.http.get<UserModel[]>(this.baseurl + 'userid' + '/' + id);
  }
  getUser(pseudo: string){
    return this.http.get<UserModel[]>(this.baseurl + 'userpseudo' + '/' + pseudo);
  }
  addUser(user: any){
    return this.http.post(this.baseurl + 'new_user', user);
  }
  deleteUser(id: string){
    return this.http.delete(this.baseurl + 'user' + '/' + id);
  }
  updateUser(user: any){
    return this.http.put(this.baseurl + 'update_user' + '/' + user.id, user);
  }

  // EVENT
  getAllEvents(){
    return this.http.get<EventsModel[]>(this.baseurl + 'events');
  }
  getEvent(id_event: string){
    return this.http.get<EventsModel[]>(this.baseurl + 'event' + '/' + id_event);
  }
  getEventful(id_eventful: string){
    return this.http.get<EventsModel[]>(this.baseurl + 'eventful' + '/' + id_eventful);
  }
  getEventPrivate(id_event: string){
    return this.http.get<EventsModel[]>(this.baseurl + 'eventPrivate' + '/' + id_event);
  }
  addEvent(event: any){
    return this.http.post(this.baseurl + 'new_event', event);
  }
  delEvent(event: any){
    return this.http.post(this.baseurl + 'del_event', event);
  }
  updateEvent(event: any){
    return this.http.put(this.baseurl + 'update_event' + '/' + event.id_event, event);
  }
  getEventOrg(id_org: string){
    return this.http.get(this.baseurl + 'events_org' + '/' + id_org);
  }

  //PARTICIPANTS
  addParticipant( part: ParticipantsModel){
    return this.http.post(this.baseurl + 'new_part', part);
  }
  getParticipants(id_event: any){
    return this.http.get(this.baseurl + 'part' + '/' + id_event);
  }

  // EVENT + PARTICIPANTS
  getMySort(id_member: any){
    return this.http.get(this.baseurl + 'myPart' + '/' + id_member);
  }

  // MESSAGES
  getAllMessages(id_event : any){
    return this.http.get(this.baseurl + 'mess' + '/' +id_event);
  }
  sendMess(mess){
    return this.http.post(this.baseurl + 'new_mess', mess);
  }
}
