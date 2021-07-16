import { Component, HostListener, OnInit } from '@angular/core';
import { WeekSpecial } from '../../interfaces/cp-weekspecial';

import SwiperCore,{Pagination} from 'swiper/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { first, map } from 'rxjs/operators';

SwiperCore.use([Pagination])
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  breakPoint:number;
  date=new Date().getFullYear();
  // cupcakesWeekSpecials:WeekSpecial[]=[
  //   {
  //     img:'/assets/lpImages/week_specials/cp1.png',
  //     name:'Ocean Perla',
  //     price:2.5
  //   },
  //   {
  //     img:'/assets/lpImages/week_specials/cp2.png',
  //     name:'Rosa primavera',
  //     price:1.55
  //   },
  //   {
  //     img:'/assets/lpImages/week_specials/cp3.png',
  //     name:'Nube blanca',
  //     price:2
  //   },
  //   {
  //     img:'/assets/lpImages/week_specials/cp4.png',
  //     name:'Explosión de texturas',
  //     price:3.75
  //   },
  //   {
  //     img:'/assets/lpImages/week_specials/cp5.png',
  //     name:"Chocolate's",
  //     price:1.25
  //   },
  //   {
  //     img:'/assets/lpImages/week_specials/cp6.png',
  //     name:"Nieve's purpura",
  //     price:2.25
  //   },
  //   {
  //     img:'/assets/lpImages/week_specials/cp7.png',
  //     name:"Mountain mora",
  //     price:3.5
  //   },
  //   {
  //     img:'/assets/lpImages/week_specials/cp8.png',
  //     name:'Chispitas',
  //     price:1
  //   },
  // ]
  cupcakesWeekSpecials:WeekSpecial[]=[];

  galleryImages:string[]=[
    "https://images.unsplash.com/photo-1519869325930-281384150729?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y3VwY2FrZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y3VwY2FrZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1551893134-55fc5191c037?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDd8fGN1cGNha2VzfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1426869884541-df7117556757?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Y3VwY2FrZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1586985290301-8db40143d525?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8Y3VwY2FrZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1563076429-c04cbe68da3a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fGN1cGNha2VzfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1615837197154-2e801f4bd294?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjF8fGN1cGNha2VzfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1604337153691-65d6e238df68?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fGN1cGNha2VzfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1519869491916-8ca6f615d6bd?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjN8fGN1cGNha2VzfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzF8fGN1cGNha2VzfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  ]

  constructor(private angularFirestore: AngularFirestore) { }

  ngOnInit(): void {
    this.setBreakPoint();
    this.getSpecialsWeek();
  }

  @HostListener('window:resize')
  onResize(){
    this.setBreakPoint();
  }

  get slidePerView(){
    if(this.breakPoint<576){
      return 1.5
    }else if(this.breakPoint<768){
      return 2.5
    }else if(this.breakPoint<992){
      return 3.5
    }
    else{
      return 5.5
    }
  }

  setBreakPoint(){
    this.breakPoint = window.innerWidth;
  }

  getSpecialsWeek(){
    this.angularFirestore.collection('week_specials').valueChanges()
    .pipe(
      map((resp:any)=>resp[0].cupcakes)
    )
    .subscribe((resp:any[])=>{
      const weekSpecials = []
      resp.map(async(cupcakes,index,array)=>{
        const cupcake = await cupcakes.get();
        weekSpecials.push(cupcake.data())
        if(array.length-1 == index){
          this.cupcakesWeekSpecials = weekSpecials;
        }
      });
    });
  }

}
