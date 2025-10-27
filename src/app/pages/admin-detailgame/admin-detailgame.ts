import { Component, OnInit } from '@angular/core';
import { Header } from '../header/header';
import { GamesGetRes } from '../../model/game_get_res';
import { GameService } from '../../services/api/games';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgIf } from '@angular/common';
import { Constants } from '../../config/costants';
import { TranSactionService } from '../../services/api/trans';


@Component({
  selector: 'app-admin-detailgame',
  imports: [Header, MatIconModule,MatMenuModule,MatButtonModule, CommonModule, NgIf],
  templateUrl: './admin-detailgame.html',
  styleUrl: './admin-detailgame.scss'
})
export class AdminDetailgame  implements OnInit{

  games: GamesGetRes | null = null;

  apiUrl?: string;
  gameId: number | null = null;
  deletedGame: any;


  
  constructor(
    private gameService: GameService,
    private activeRoute: ActivatedRoute,
    private constants: Constants,
    private transService: TranSactionService,
    private router:Router
  ) {}

   ngOnInit() {
    this.gameDetail();
  }
  gameDetail() {
    try {
      this.activeRoute.paramMap.subscribe(async (params) => {
        this.gameId = Number(params.get('id'));
        const response = await this.gameService.getGameId(this.gameId);
        this.games = response;
        console.log('gameId: ', this.gameId);
      });
    
      this.apiUrl = this.constants.API_ENDPOINT;
    } catch (error) {}
  }

  onEdit(gameId: number) {
    this.router.navigate(['/admin/edit-game',gameId]);
}

  async onDelete(gameId: number) {
 const response = await this.gameService.deletedGame(gameId);
 this.deletedGame = response;
if(this.deletedGame){
  alert('ลบเกมสำเร็จแล้ว!')
  this.router.navigate(['/admin/edit-game',gameId]);
}else{
  console.error({message:'delete game fail'});
  alert('ลบเกมยังไม่สำเร็จ โปรดลองอีกครั้ง');
  }
}




  async Order() {
    if (this.gameId) {
      try {
        const response = await this.transService.createPayment(this.gameId);
        console.log('game data: ', this.games);
        alert(`ระบบทำการพิ่มเกมลงรถเข็นของท่านเรียบร้อยแล้ว!`);
        this.router.navigate(['/user/home']);
      } catch (er) {
          alert('ไม่สามารถทำรายการได้ กรุณาลองใหม่อีกครั้ง!');
      }
    }
  }
}



