import { Component, OnInit } from '@angular/core';
import { Header } from "../header/header";
import { HttpClient } from '@angular/common/http';
import { GameService } from '../../services/api/games';
import { Router } from '@angular/router';
import { GamesGetRes, } from '../../model/game_get_res';
import { MatFormFieldModule } from "@angular/material/form-field";
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from "@angular/material/select";
import { CommonModule, NgFor} from "@angular/common";


@Component({
  selector: 'app-create-game',
  imports: [Header, MatFormFieldModule, MatInputModule, FormsModule, MatSelectModule, NgFor, CommonModule],
  templateUrl: './create-game.html',
  styleUrl: './create-game.scss'
})
export class CreateGame  implements OnInit{

genresOption:string[] = ["action game","action role-playing game","indie game","simulation game","sports game","brain training game"];

name: string = '';
price: number = 0;
genres: string = '';
detail: string = '';


// genreses:Genres[] =[
//   {value:1,name: 'action_game'},
//   {value:2,name: 'action_role_playing_game'},
//   {value:3,name: 'indie_game'},
//   {value:4,name: 'simulation_game'},
//   {value:5,name: 'sports_game'},
//   {value:6,name: 'brain_training_game'},
// ];
  constructor(private http:HttpClient,private gameService:GameService,private router:Router){}
  
games:GamesGetRes[] = [];
private selectedImage: File| null = null;
displayImage:string = '';
fileImage: string = '';   
  async ngOnInit(){
  await this.loadGames();
  }
  async loadGames() {
   try {
    const gameFromAPI =  await this.gameService.getAllGames();    
   
   const genresMap = new Map<number, any>();
   
   for(const game of gameFromAPI ){
    if(!genresMap.has(game.genres)){
      genresMap.set(game.genres,game);
    }
   }
   this.games = Array.from(genresMap.values());
   console.log('Information Form API:', this.games);
   
    
   } catch (error) {
     console.error('Loading games Failed', error);
    
   }
  }
   onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {

      this.selectedImage = input.files[0]; //save file

      const reader = new FileReader(); //preview
      reader.onload = e => {

        this.displayImage = reader.result as string;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }
 async createGame() {

   if (!this.selectedImage) {
        alert('กรุณาเลือกไฟล์ภาพสำหรับเกม');
        return; 
    }
    const newGame = await this.gameService.createNewGame(this.name,this.price,this.genres,this.selectedImage,this.detail);
    if(newGame){
       alert(`สร้างเกม 🕹️ ${this.name} 🎮สำเร็จ! 🎉`);
    this.router.navigate(['admin/home']);
    return;
    }else {
       alert('การสร้างเกมล้มเหลว โปรดสร้างใหม่อีกครั้ง');
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