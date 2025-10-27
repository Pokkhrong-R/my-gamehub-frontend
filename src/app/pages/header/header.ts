import { Component, Injectable, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {  ActivatedRoute, Router,RouterLink} from '@angular/router';
import { NgIf ,CommonModule,NgFor} from '@angular/common';
import { AuthService} from '../../services/api/auth';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { Constants } from '../../config/costants';
import { UsersGetRes } from '../../model/user_get_res';
import { UsersService } from '../../services/api/users';
import { GameService } from '../../services/api/games';
import { GamesGetRes } from '../../model/game_get_res';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatToolbarModule,RouterLink,NgIf,CommonModule,NgFor,MatFormFieldModule, MatInputModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})


export class Header implements OnInit{
  



 profileImage: string = "assets/images/default-pfp.jpg";
 id: number =0;
 apiUrl : string = '';
 user?: UsersGetRes|null = null;

 filteredGames: GamesGetRes[] = [];
 allGames: GamesGetRes[] = [];
 showPopup = false;
 hideTimeout: any;

  constructor(public authService: AuthService,public router:Router,private constans:Constants,private userService:UsersService,private activeRoute:ActivatedRoute,private gameService:GameService){
    this.apiUrl = this.constans.API_ENDPOINT;
  }
 async ngOnInit(): Promise<void> {
  this.authService.currentUser$.subscribe(u => {
    if(u){
      this.id = u.userId;
      this.userService.getProfile(this.id).then(profile => this.user = profile);
      this.profileImage = u.profile_image ? this.apiUrl + '/uploads/' + u.profile_image : 'assets/images/default-pfp.jpg';
    } else {
      this.user = null;
      this.profileImage = 'assets/images/default-pfp.jpg';
    }
  });
  this.allGames = await this.gameService.getAllGames();
  this.filteredGames = this.allGames;
}




 hidePopupWithDelay() {
    this.hideTimeout = setTimeout(() => (this.showPopup = false), 200);
  }

    goToGame(gameId: number) {
    clearTimeout(this.hideTimeout);
    this.showPopup = false;
   if(this.user?.user_id == 1){
     this.router.navigate(['/admin/detail-game', gameId]);
   }else{
    this.router.navigate(['/user/detail-game',gameId]);
   }
  }

  search(keyword: string) {
  if (!keyword.trim()) {
    this.filteredGames = this.allGames;
    return;
  }

  this.filteredGames = this.allGames.filter(g =>
    g.name.toLowerCase().includes(keyword.toLowerCase())
  );

  this.showPopup = true;
}

  logout(){
   this.authService.logout();
   this.router.navigate(['/homepage']);
  }
}
