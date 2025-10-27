import { Component } from '@angular/core';
import { Header } from "../header/header";
import { UsersGetRes } from '../../model/user_get_res';
import { ProtectedService } from '../../services/api/protectAPI';
import { Router,RouterLink } from '@angular/router';
import { GamesGetRes } from '../../model/game_get_res';
import { GameService } from '../../services/api/games';
import { Constants } from '../../config/costants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-homepage-admin',
  imports: [Header,RouterLink,CommonModule],
  templateUrl: './homepage-admin.html',
  styleUrl: './homepage-admin.scss'
})
export class HomepageAdmin {
isLoggedIn: boolean = true;

person?: UsersGetRes | null;

gamesGet: GamesGetRes[] = [];
apiUrl: string = '';

constructor(private protectedService: ProtectedService,private router:Router,private gameService:GameService,private constants:Constants) {}

 async ngOnInit() {
  this.loadGames();
  this.apiUrl = this.constants.API_ENDPOINT;
  }
  async loadGames() {
    this.gamesGet = await this.gameService.getAllGames();
  }
  public formatImagePath(path: string): string {
  return path.replace(/\\/g, '/'); 
}



}
