import { Component, OnInit } from '@angular/core';
import { Header } from '../header/header';
import { GamesGetRes } from '../../model/game_get_res';
import { GameService } from '../../services/api/games';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, NgIf } from '@angular/common';
import { Constants } from '../../config/costants';
import { TranSactionService } from '../../services/api/trans';
import { OrdersService } from '../../services/api/orders';
import { AuthService } from '../../services/api/auth';

@Component({
  selector: 'app-detail-gamepage',
  imports: [Header, MatIconModule, CommonModule,NgIf],
  templateUrl: './detail-gamepage.html',
  styleUrl: './detail-gamepage.scss',
})
export class DetailGamepage implements OnInit {
  games: GamesGetRes | null = null;

  apiUrl?: string;
  gameId: number |null = null;
  userId: number |null=null;;

  constructor(
    private gameService: GameService,
    private activeRoute: ActivatedRoute,
    private constants: Constants,
    private orderService: OrdersService,
    private router:Router,
    private authService:AuthService
  ) {}

  ngOnInit() {
    this.gameDetail();
  }
  gameDetail() {
    try {
      const idFromUrl = this.authService.getCurrentUserId();
      if (idFromUrl) {
        this.userId = Number(idFromUrl);

      }
      this.activeRoute.paramMap.subscribe(async (params) => {
        this.gameId = Number(params.get('id'));
        const response = await this.gameService.getGameId(this.gameId);
        this.games = response;
      

      });
      console.log(`userId:${this.userId}`);
      console.log(`gameId:${this.gameId}`);

     
      this.apiUrl = this.constants.API_ENDPOINT;
    } catch (error) {}
  }

  async Order() {
  
      try {
          if (this.gameId && this.userId) {
      if(this.userId !=1){
          await this.orderService.getAddCart(this.gameId);
        console.log('game data: ', this.games);
        alert(`ระบบทำการพิ่มเกมลงรถเข็นของท่านเรียบร้อยแล้ว!`);
        this.router.navigate(['user/home']);
      }
    }
      
      } catch (er) {
          alert('ไม่สามารถทำรายการได้ กรุณาลองใหม่อีกครั้ง!');
      }
    
  }
}