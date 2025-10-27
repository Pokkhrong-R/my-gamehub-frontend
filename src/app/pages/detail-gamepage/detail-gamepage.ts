import { Component, OnInit } from '@angular/core';
import { Header } from '../header/header';
import { GamesGetRes } from '../../model/game_get_res';
import { GameService } from '../../services/api/games';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, NgIf } from '@angular/common';
import { Constants } from '../../config/costants';
import { TranSactionService } from '../../services/api/trans';

@Component({
  selector: 'app-detail-gamepage',
  imports: [Header, MatIconModule, CommonModule,NgIf],
  templateUrl: './detail-gamepage.html',
  styleUrl: './detail-gamepage.scss',
})
export class DetailGamepage implements OnInit {
  games: GamesGetRes | null = null;

  apiUrl?: string;
  gameId: number | null = null;

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

  async Order() {
    if (this.gameId) {
      try {
        //เปลี่ยนไปลองเพิ่มออเดอร์
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
