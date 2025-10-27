import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Constants } from '../../config/costants';
import { lastValueFrom } from 'rxjs';
import { AuthService, UserModel } from './auth';
import { GamesGetRes } from '../../model/game_get_res';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(
    private constants: Constants,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  public async getAllGames(options?: {
    [param: string]: string | number | boolean;
  }): Promise<GamesGetRes[]> {
    const url = this.constants.API_ENDPOINT + '/games';
    const params = new HttpParams({ fromObject: options });
    const response = await lastValueFrom(this.http.get<GamesGetRes[]>(url, { params }));
    return response;
  }
  //---------------------------------------------------------------
  public async getMyGame(id:number): Promise<GamesGetRes> {
    const url = `${this.constants.API_ENDPOINT}/games/mygame/${id}`;
    const token = this.authService.getToken();
    if (!token) {
      this.authService.logout();
      console.error('Authentication token not found!');
      return Promise.reject('Authentication token not found!');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return lastValueFrom(this.http.get<GamesGetRes>(url, { headers })); //
  }

  //-----------------------------------------------------------

  public async getMyGameDetail(gameId: number): Promise<GamesGetRes> {
    const url = `${this.constants.API_ENDPOINT}/games/mygame/${gameId}`;
    const token = this.authService.getToken();
    if (!token) {
      this.authService.logout();
      console.error('Authentication token not found!');
      return Promise.reject('Authentication token not found!');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return lastValueFrom(this.http.get<GamesGetRes>(url, { headers })); //
  }

  //---------------------------------------------------------------------

  public async getGameByUserId(userId: number): Promise<GamesGetRes> {
    const url = `${this.constants.API_ENDPOINT}/games/${userId}`;
    const token = this.authService.getToken();
    if (!token) {
      this.authService.logout();
      console.error('Authentication token not found!');
      return Promise.reject('Authentication token not found!');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return lastValueFrom(this.http.get<GamesGetRes>(url, { headers })); //
  }

  //---------------------------------------------------------------
  public async getGameId(gameId: number): Promise<GamesGetRes | null> {
    const url = `${this.constants.API_ENDPOINT}/games/${gameId}`;
    const response = await lastValueFrom(this.http.get(url));
    return response as GamesGetRes; //
  }
//-------------------------------------------------------------------
  public async createNewGame(
    name: string,
    price: number,
    genres: string,
    image: File,
    detail: string
  ): Promise<any> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price.toString());
    formData.append('genres', genres);
    formData.append('detail', detail);
    formData.append('image', image, image.name);
    const url = this.constants.API_ENDPOINT + '/games/create';
    console.log('Sending create game request with FormData:', formData);

    try {
      const response = await lastValueFrom(this.http.post(url, formData));
      console.log('Create New Game success: ', response);
      return response;
    } catch (error) {
      console.error('POST failed: ', error);
    }
  }

  //edit users
  public async updateGame(
    gameId: number,
    name: string,
    price: number,
    genres: string,
    image: File|null,
    detail: string
  ): Promise<any> {
    const gameData = {
      gameId: gameId,
      name: name,
      price: price,
      genres: genres,
      image: image,
      detail: detail,
    };
      const formData = new FormData();

  
    formData.append('name', name);
    formData.append('price', price.toString());
    formData.append('genres', genres);
    formData.append('detail', detail);
    if (image) {
        formData.append('image', image, image.name);
    }
    const url = `${this.constants.API_ENDPOINT}/games/update/${gameId}`;

    return lastValueFrom(this.http.put(url,formData));
  }

  //delete
  public async deletedGame(gameId: number): Promise<void> {
    const url = `${this.constants.API_ENDPOINT}/games/delete/${gameId}`;
    try {
        await lastValueFrom(this.http.delete(url));
        console.log(`Game with ID ${gameId} deleted successfully.`);
    } catch (error) {
        
        console.error(`Failed to delete game with ID ${gameId}:`, error);
        throw error;
    }
  }
}
