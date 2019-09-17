import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './backend/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { BookingComponent } from './backend/booking/booking.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { CreateBillComponent } from './backend/create-bill/create-bill.component';
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'sign-up', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'booking', component: BookingComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'create-bill', component: CreateBillComponent },
  {path: '**', redirectTo: '/'},
 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
