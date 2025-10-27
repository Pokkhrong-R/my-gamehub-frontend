import { Component, OnInit } from '@angular/core';
import { Header } from "../header/header";
import { Footer } from "../footer/footer";
import { GamesGetRes } from '../../model/game_get_res';
import { GameService } from '../../services/api/games';
import { CommonModule,NgFor } from "@angular/common";
import { RouterLink } from '@angular/router';
import { Constants } from '../../config/costants';

@Component({
  selector: 'app-homepage',
  imports: [Header, Footer, CommonModule,NgFor,RouterLink],
  templateUrl: './homepage.html',
  styleUrl: './homepage.scss'
})
export class Homepage  implements OnInit{
  games: GamesGetRes[] =[];
  apiUrl: string = '';
  constructor(private gameService:GameService,private constants:Constants){
    this.apiUrl = this.constants.API_ENDPOINT;
    console.log(this.apiUrl);
  }
  
  
  
  
 async ngOnInit(){
   this.loadGameHub();
   
  }
  async loadGameHub() {
    this.games = await this.gameService.getAllGames();
    console.log(this.games);
  }
public formatImagePath(path: string): string {
  return path.replace(/\\/g, '/'); 
}
  

}
