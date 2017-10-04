import { Component } from '@angular/core';import { FormBuilder, Validators } from '@angular/forms';import { NavController } from 'ionic-angular';import { Wakanda } from '../../app/wakanda.service';import { HomePage } from '../_home/home';@Component({  selector: 'page-login-background-slider',  templateUrl: 'login-background-slider.html',   providers:[Wakanda]})export class LoginBackgroundSliderPage {  public wakandaClientVersion: string;  backgrounds = [    "assets/img/background/background-1.jpg",    "assets/img/background/background-2.jpg",    "assets/img/background/background-3.jpg",    "assets/img/background/background-4.jpg"  ]  public loginForm: any;  private storedUser: any;    constructor(public navCtrl: NavController, public wakanda: Wakanda, public formBuilder: FormBuilder) {	this.wakandaClientVersion = this.wakanda.wakandaClientVersion;       // this.loginForm = formBuilder.group({   //   email: ['', Validators.required],   //   password: ['', Validators.compose([Validators.minLength(2),   //   Validators.required])]   // });        this.loginForm = formBuilder.group({      email: [''],      password: ['']    });        this.directLogin();       }    directLogin(){   let storedUser = localStorage.getItem('user');    let that = this;    if (storedUser) {		this.wakanda.getCatalog().then(function (ds) {						ds['User'].query( { filter: "ID = :1" , params: [storedUser]}).then(res => {		    			    		if (res.entities[0]) { 						that.navCtrl.setRoot(HomePage);			    	}	    	});			    			});	     }		  }    ionViewDidLoad() {    console.log('Hello LoginBackgroundSlider Page');  }  openResetPassword() {  }  doLogin() {  	   	  //	this.navCtrl.setRoot(HomePage);		 		    if (!this.loginForm.valid) {      console.log("Invalid or empty data");    } else {    	    	let userEmail = this.loginForm.value.email;    	let userPassword = this.loginForm.value.password;		this.wakanda.directory.login(userEmail, userPassword)	    .then((result) => {	    			    this.wakanda.getCatalog().then(function (ds) {							ds['User'].query( { filter: "email = :1" , params: [userEmail]}).then(res => {		    				    		localStorage.setItem("user", res.entities[0].ID);		 		    				    	});			    				});	 			this.navCtrl.setRoot(HomePage);		    })	    .catch((e) => {	    	alert('Incorrect Login or Password !')	    });    }     }}