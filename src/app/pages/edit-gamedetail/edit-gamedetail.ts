import { Component, OnInit } from '@angular/core';
import { Header } from '../header/header';
import { HttpClient } from '@angular/common/http';
import { GameService } from '../../services/api/games';
import { ActivatedRoute, Router } from '@angular/router';
import { GamesGetRes } from '../../model/game_get_res';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, NgFor } from '@angular/common';
import { Constants } from '../../config/costants';

@Component({
  selector: 'app-edit-gamedetail',
  imports: [
    Header,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    NgFor,
    CommonModule,
  ],
  templateUrl: './edit-gamedetail.html',
  styleUrl: './edit-gamedetail.scss',
})
export class EditGamedetail implements OnInit {
  genresOption: string[] = [
    'action game',
    'action role-playing game',
    'indie game',
    'simulation game',
    'sports game',
    'brain training game',
  ];
  games?: GamesGetRes[] = [];
  game: GamesGetRes|null = null
  private newImageFile: File | null = null;
  name: string = '';
  price: number = 0;
  genres: string ='';
  detail: string = '';
  image: File | null = null;
  displayImage: string | null = null;
  gameId: number = 0;

  constructor(
    private gameService: GameService,
    private router: Router,
    private constants: Constants,
    private activeRoute: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.loadGames();
  }
  async loadGames() {
    try {

      const gameFromAPI = this.activeRoute.snapshot.paramMap.get('id');
      if (!gameFromAPI) {
        console.log('not found game id');
        this.router.navigate(['/admin/home']);
        return;
      }

      this.gameId = Number(gameFromAPI);
      const gameData = (await this.gameService.getGameId(this.gameId)) as GamesGetRes;
      this.game = gameData;

      (this.name = gameData.name),
        (this.price = gameData.price),
        (this.genres = gameData?.name??''),
        (this.displayImage = `${this.constants.API_ENDPOINT}/uploads/${gameData.image}`);
      this.detail = gameData.detail;

      console.log('Successfully loaded game data:', gameData);
    } catch (error) {
      console.error('Loading games Failed', error);
    }
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.newImageFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.displayImage = reader.result as string;
      };
      reader.readAsDataURL(this.newImageFile);
    }
  }
  async save() {
    if (!this.genres) { 
        alert('กรุณาเลือกประเภทของเกม');
        return; 
    }
 

    const updateGame = await this.gameService.updateGame(
      this.gameId,
      this.name,
      this.price,
      this.genres,
      this.newImageFile,
      this.detail
    );
    if (updateGame) {
      alert(`อัพเดตเกม 🕹️ ${this.name} 🎮สำเร็จ! 🎉`);
      this.router.navigate(['admin/home']);
      return;
    } else {
      alert('การอัพเดตเกมล้มเหลว โปรดลองใหม่อีกครั้ง');
    }
  }

  cancel() {
    this.router.navigate(['/admin/home']);
  }
}
//  interface Genres {
//   value: number;
//   name: string;
// }
