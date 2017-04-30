import { Component, OnInit } from '@angular/core';
import { HttpService } from "../Shared/http.service";
import { AuthService } from "../Shared/auth.service";
import { EventService } from "../Shared/event.service";
import { Boot } from "../Shared/boot.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { bootStateTrigger } from "../Shared/boot.animations";

@Component({
  selector: 'pdf-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css'],
  animations: [
    bootStateTrigger
  ]
})

export class TerminalComponent implements OnInit {
  //Declaring variables
  myForm: FormGroup;
  bootLoaded: boolean = false;
  query: any;
  id: string;
  brand: string;
  desc: string;
  name: string;
  collection: string;
  imgthumb: string;
  img1src: string;
  img2src: string;
  img3src: string;
  price: string;
  status: string;
  quantity: number = 0;
  boot: Boot;
  
  constructor (
    private http: HttpService,
    private auth: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.myForm = formBuilder.group({
      'quantity': [1, [Validators.required]]
    });
    this.id = this.auth.getBootID();
    console.log('THE ID'+this.id);
    this.query = {
      "_id": this.id
    };
    this.http.fetchBoot(this.query)
      .subscribe(
        (boot) => {
          console.log(boot);
          this.brand = boot.brand;
          this.name = boot.bname;
          this.collection = boot.coll;
          this.price = boot.saleprice;
          this.desc = boot.description;
          for(let i in boot.image) {
            switch( i ){
              case '0' :
                this.imgthumb = boot.image[i].data;
                break;
              case '1' :
                this.img1src = boot.image[i].data;
                break;
              case '2' :
                this.img2src = boot.image[i].data;
                break;
              case '3' :
                this.img3src = boot.image[i].data;
            }
          }
          this.bootLoaded = true;
        }
      );
  }
  
  ngOnInit() {
  }
  
  onSubmit(data: any) {
    this.quantity = data.quantity;
    this.boot = new Boot(
      this.id,
      this.brand,
      this.name,
      this.collection,
      this.imgthumb,
      this.price,
      this.status
    );
    console.log(this.quantity);
    console.log(this.boot);
    this.auth.addToCart(this.boot,this.quantity);
  }
}