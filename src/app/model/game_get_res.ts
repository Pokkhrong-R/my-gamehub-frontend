export interface GamesGetRes {
    games: GamesGetRes[] | undefined;
    count: any;
    game_id:    number;
    name:       string;
    price:      number;
    genres:     number;
    image:      string;
    detail:     string;
    ranking_id: null;
    amount:     number;
    sale_date:  Date;
}
