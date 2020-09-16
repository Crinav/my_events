import { Component , Input} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ApiService } from './api.service';
import { UserModel } from './interface/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})

export class AppComponent {
  @Input('infoUser') id_User: string;
  userFb: any;
  id_fb: string;
  status: string;
  user_exist: string;
  error: string = '';
  user: UserModel[];
  pseudo: string;
  description: string = '';
  email: string;
  avatar: string;
  url_avatar: string;
  rep: any=[];
  infoUser: any=[];
  idUser: string;

  constructor(private http: HttpClient,
     private apiService: ApiService,

    ) {
  }

  ngOnInit() {
    this.fbLibrary();
  }

  // facebook connect //
  fbLibrary() {
    (window as any).fbAsyncInit = function () {
      window['FB'].init({
        appId: '989184984858735',
        cookie: true,
        xfbml: true,
        version: 'v8.0'
      });
      window['FB'].AppEvents.logPageView();
    };
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  login() {
    window['FB'].login((response) => {
        console.log('login response',response);
        if (response.authResponse) {
          this.status = response.status;
          window['FB'].api('/me', {
            fields: 'last_name, first_name, email'
          }, (userInfo) => {
            this.userFb = userInfo;
            console.log(this.userFb);
            this.checkMailExist(this.userFb.email)
          });
        } else {
          console.log('User login failed');
        }
    }, {scope: 'email'});
  }

  checkMailExist(mail): void {
    this.apiService.getUserByMail(mail).subscribe(data=>{
      this.user = data;
      console.log(this.user);
      if(this.user.length > 0 ){
        this.user_exist = 'user exist'
        console.log(this.user_exist)
        //récup info user pour afficher
        this.get_user(this.user[0].pseudo);
      }
      else{
        console.log('new user: entré en bdd')
      }
    });
  };

  add_user(){
    if(this.pseudo !== undefined ){
      this.apiService.getUser(this.pseudo).subscribe(data=>{
        this.infoUser = data;
        // si résultat alors pseudo exist
        if(this.infoUser.length > 0 ){
          console.log("erreur: new user pas enrgistré en bdd")
          this.error = "pseudo_exist";
          // if(this.url_avatar === undefined){
          //   this.url_avatar = "https://www.shareicon.net/data/2016/09/01/822711_user_512x512.png"
          // }

        }

        let datas = {
          id_fb : this.userFb.id,
          pseudo: this.pseudo,
          mail: this.userFb.email,
          avatar: this.url_avatar,
          description: this.description,
        };

        console.log(datas)
        this.apiService.addUser(datas).subscribe(data=>{
          this.rep = data;
          console.log(this.rep)
          if(this.rep.status == "ok"){
            this.get_user(this.pseudo)
            this.user_exist = 'user exist'
            console.log('new user entré en bdd')
          }
          else{
            console.log("erreur: new user pas enrgistré en bdd")
            this.error = "pseudo_exist";
          }
        })
      })
    }
  }

  get_user(pseudo){
    this.apiService.getUser(pseudo).subscribe(data=>{
      this.infoUser = data[0];
      console.log(this.infoUser);
      localStorage.setItem('currentUser', JSON.stringify(data[0]));
    })
  }

  editBtn() {
    this.user_exist = "editer";
  }
  editProfil(){
    let datas = {
      pseudo : this.pseudo,
      avatar: this.avatar,
      description: this.description,
      id: this.infoUser.id,
    }
    console.log(datas)
    this.apiService.updateUser(datas).subscribe(data=>{
      this.rep = data;
      console.log(this.rep);
      this.get_user(this.pseudo)
      this.user_exist = "user exist"
    })
  }

  disconnect(){
    this.status = "disconnect";
    this.infoUser= null;
    localStorage.clear();
    console.log('disconnect')
  }

  deleteProfil(){
    this.apiService.deleteUser(this.infoUser.id).subscribe(data=>{
      this.rep = data;console.log(this.rep);
    })
  }
}

