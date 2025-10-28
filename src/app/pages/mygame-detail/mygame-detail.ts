import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header'; // (เช็ค Path)
import { RouterModule } from '@angular/router'; // <-- 1. Import สำหรับลิงก์
import { AuthService } from '../../services/api/auth'; // (เช็ค Path)
import { GameService } from '../../services/api/games'; // (เช็ค Path)
import { GamesGetRes } from '../../model/game_get_res'; // (เช็ค Path)

@Component({
  selector: 'app-my-games',
  standalone: true,
  imports: [
    CommonModule,
    Header,
    RouterModule // <-- 3. เพิ่มที่นี่
  ],
    templateUrl: './mygame-detail.html',
  styleUrl: './mygame-detail.scss'
})
export class MygameDetail implements OnInit {

  myGames: GamesGetRes[] = []; // 4. ตัวแปรเก็บเกม
  isLoading: boolean = true;
  errorMessage: string | null = null;
  
  constructor(
    private gameService: GameService, // (ใช้ชื่อ Service ที่ถูกต้อง)
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadMyGames();
  }

  async loadMyGames(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = null;

    try {
      // 5. ดึง ID ของ User ที่ล็อกอินอยู่
      const userId = this.authService.getCurrentUserId(); // (ใช้ฟังก์ชันที่ถูกต้อง)
      if (!userId) {
        throw new Error('User not logged in or ID not found.');
      }

      // 6. เรียก Service (getMyGame)
      // Service ของคุณ return 'GamesGetRes'
      // และ Controller ของคุณ return { games: rows, ... }
      const response = await this.gameService.getMyGame(userId);

      // 7. [สำคัญ] นำ 'games' array จาก response มาใช้งาน
      this.myGames = response.games ?? [];
      
    } catch (err: any) {
      this.errorMessage = 'ไม่สามารถโหลดรายการเกมของคุณได้';
      console.error('Failed to load my games:', err);
    } finally {
      this.isLoading = false;
    }
  }
}