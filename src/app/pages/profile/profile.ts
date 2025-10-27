import { Component, OnInit } from '@angular/core';
import { Header } from '../header/header';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { UsersGetRes } from '../../model/user_get_res';
import { UsersService } from '../../services/api/users';
import { NgIf, CommonModule } from '@angular/common';
import { AuthService } from '../../services/api/auth';
import { MatIconModule } from '@angular/material/icon'; //add htm
import { GameService } from '../../services/api/games';
import { GamesGetRes } from '../../model/game_get_res';
import { Constants } from '../../config/costants';

@Component({
  selector: 'app-profile',
  imports: [Header, RouterLink, NgIf, CommonModule, MatIconModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  isLoading: boolean = true;
  errorMessage = '';
  userId?:number;
  userGetRes?: UsersGetRes;
  games?: GamesGetRes[];
  apiUrl: string = '';
  constructor(
    private activeRoute: ActivatedRoute,
    private userService: UsersService,
    private router: Router,
    private authService: AuthService,
    private gameService: GameService,
    private constants:Constants
  ) {
    this.apiUrl = this.constants.API_ENDPOINT;
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadMyGame();
  }

  async loadUserProfile(): Promise<void> {
    try {
      const idFromUrl = this.activeRoute.snapshot.paramMap.get('id');
      if (idFromUrl) {
        this.userId = Number(idFromUrl);
        console.error('user Id: ', this.userId);
        const response = await this.userService.getProfile(this.userId);
        if(response){
           this.userGetRes = response;
        }

      } else {
        console.error('user id not found in url.');
      }
    } catch (error) {
      console.error('failed to load user profile: ', error);
      this.errorMessage = 'ไม่สามารถโหลดข้อมูลโปรไฟล์ได้';
    } finally {
      this.isLoading = false;
    }

  }

  async loadMyGame() {
    try {
      if(this.userId){
          const response = await this.gameService.getMyGame(this.userId);
        this.games = response.games; 
        console.log('myGame data: ',this.games);
      }
    } catch (error) {
      console.error('not fond you game data:',error);
    }
   
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/loginpage']);
  }
}
