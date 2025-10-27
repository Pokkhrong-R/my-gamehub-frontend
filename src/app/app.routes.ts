import { RouterModule, Routes } from '@angular/router';
import { Homepage } from './pages/homepage/homepage';
import { Registerpage } from './pages/registerpage/registerpage';
import { Loginpage } from './pages/loginpage/loginpage';
import { Editprofile } from './pages/editprofile/editprofile';
import { AuthGuard } from './services/api/authGuard';
import { HomepageAdmin } from './pages/homepage-admin/homepage-admin';
import { Cartpage } from './pages/cartpage/cartpage';
import { Profile } from './pages/profile/profile';
import { TopupPage } from './pages/topup-page/topup-page';
import { MygameDetail } from './pages/mygame-detail/mygame-detail';
import { Transpage } from './pages/transpage/transpage';
import { EditAdminProfile } from './pages/edit-admin-profile/edit-admin-profile';
import { CreateGame } from './pages/create-game/create-game';
import { CreateDiscount } from './pages/create-discount/create-discount';
import { UserHistory } from './pages/user-history/user-history';
import { AdminProfile } from './pages/admin-profile/admin-profile';
import { DetailGamepage } from './pages/detail-gamepage/detail-gamepage';
import { AdminDetailgame } from './pages/admin-detailgame/admin-detailgame';
import { EditGamedetail } from './pages/edit-gamedetail/edit-gamedetail';
import { UserHistoryProfile } from './pages/user-history-profile/user-history-profile';
import { ResultSearch } from './pages/result-search/result-search';
import { ShowAllDiscount } from './pages/show-all-discount/show-all-discount';
import { EditDiscount } from './pages/edit-discount/edit-discount';

export const routes: Routes = [
  { path: 'homepage', component: Homepage},
  { path: 'loginpage', component: Loginpage },
  { path: 'registerpage', component: Registerpage },

  // User pages
{ path: 'user/home', component: Homepage, canActivate: [AuthGuard], data: { role: 1 } },
{ path: 'user/cart/:id', component:Cartpage, canActivate: [AuthGuard], data: { role: 1 } },
{ path: 'user/profile/:id', component:Profile, canActivate: [AuthGuard], data: { role: 1 } },
{ path: 'user/edit-profile/:id', component:Editprofile, canActivate: [AuthGuard], data: { role: 1 } },
{ path: 'user/detail-game/:id', component:DetailGamepage, canActivate: [AuthGuard], data: { role: 1 } },
{ path: 'user/top-up/:id', component:TopupPage, canActivate: [AuthGuard], data: { role: 1 } },
{ path: 'user/mygame-detail/:id', component:MygameDetail, canActivate: [AuthGuard], data: { role: 1 } },
{ path: 'user/transpage/:id', component:Transpage, canActivate: [AuthGuard], data: { role: 1 } },
{ path: 'user/result-search:any', component:ResultSearch, canActivate: [AuthGuard], data: { role: 1} },

// Admin pages
{ path: 'admin/home', component: HomepageAdmin, canActivate: [AuthGuard], data: { role: 0 } },
{ path: 'admin/edit-admin-profile/:id', component: EditAdminProfile, canActivate: [AuthGuard], data: { role: 0 } },
{ path: 'admin/create-game', component: CreateGame, canActivate: [AuthGuard], data: { role: 0 } },
{ path: 'admin/create-discount', component: CreateDiscount, canActivate: [AuthGuard], data: { role: 0 } },
{ path: 'admin/create-game', component: CreateGame, canActivate: [AuthGuard], data: { role: 0 } },
{ path: 'admin/user-trans', component: UserHistory, canActivate: [AuthGuard], data: { role: 0 } },
{ path: 'admin/user-profile/:id', component: UserHistoryProfile, canActivate: [AuthGuard], data: { role: 0 } },
{ path: 'admin/admin-profile/:id', component: AdminProfile, canActivate: [AuthGuard], data: { role: 0 } },
{ path: 'admin/detail-game/:id', component:AdminDetailgame, canActivate: [AuthGuard], data: { role: 0} },
{ path: 'admin/edit-game/:id', component:EditGamedetail, canActivate: [AuthGuard], data: { role: 0} },
{ path: 'admin/show-all-discount', component:ShowAllDiscount, canActivate: [AuthGuard], data: { role: 0} },
{ path: 'admin/edit-discount/:id', component:EditDiscount, canActivate: [AuthGuard], data: { role: 0} },


// // Redirect default
{ path: '', redirectTo: '/homepage', pathMatch: 'full' },
{ path: '**', redirectTo: '/profile' },

 
];
