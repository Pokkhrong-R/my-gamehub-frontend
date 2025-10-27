export interface UsersGetRes {
    message: string;
    rows:    UsersGetRes[];
}

export interface UsersGetRes{
    user_id:        number;
    username:       string;
    email:          string;
    password:       string;
    profile_image:  string;
    wallet_balance: number;
}
