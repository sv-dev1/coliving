import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './backend/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { BookingComponent } from './backend/booking/booking.component';
import { CreateBillComponent } from './backend/create-bill/create-bill.component';
import { TeamGroupComponent } from './backend/team-group/team-group.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { HouseChoresComponent } from './backend/house-chores/house-chores.component';
import { SplitBillComponent } from './backend/split-bill/split-bill.component';
import { MyAccountComponent } from './backend/my-account/my-account.component';
import { RefferalCodeComponent } from './backend/refferal-code/refferal-code.component';
import { SettingsComponent } from './backend/settings/settings.component';
import { Socket } from 'ng-socket-io';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TaskSuggestionsComponent } from './backend/task-suggestions/task-suggestions.component';
import { CategoryComponent } from './backend/category/category.component';
import { OccupationComponent } from './backend/occupation/occupation.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'sign-up', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'booking', component: BookingComponent },
  { path: 'create-bill', component: CreateBillComponent, canActivate: [AuthGuard] },
  { path: 'team-group', component: TeamGroupComponent, canActivate: [AuthGuard] },
  { path: 'contact-us', component: ContactUsComponent},
  { path: 'house-chores', component: HouseChoresComponent, canActivate: [AuthGuard] },
  { path: 'split-bill', component: SplitBillComponent, canActivate: [AuthGuard] },
  { path: 'my-account', component: MyAccountComponent, canActivate: [AuthGuard] },
  { path: 'refer-a-friend', component: RefferalCodeComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'task-suggestions/:p1', component: TaskSuggestionsComponent, canActivate: [AuthGuard] },
  { path: 'categories', component: CategoryComponent, canActivate: [AuthGuard] },
  { path: 'occupation', component: OccupationComponent, canActivate: [AuthGuard] },
  {path: '**', redirectTo: '/'},
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
