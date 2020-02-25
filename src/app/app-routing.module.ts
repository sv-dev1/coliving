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
import { PropertyComponent } from './backend/property/property.component';
import { TeamInfoComponent } from './backend/team-info/team-info.component';
import { FlatmateIssuesComponent } from './backend/flatmate-issues/flatmate-issues.component';
import { AppDwonloadPageComponent } from './app-dwonload-page/app-dwonload-page.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { DownloadComponent } from './download/download.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { FaqComponent } from './faq/faq.component';
import { LandlordAccountComponent } from './backend/landlord-account/landlord-account.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

import { HomePagecomponentComponent } from './admin/home-pagecomponent/home-pagecomponent.component';
import { FaqPagecomponentComponent } from './admin/faq-pagecomponent/faq-pagecomponent.component';
import { SiteConfigcomponentComponent } from './admin/site-configcomponent/site-configcomponent.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { PagesComponent } from './admin/pages/pages.component';
import { PageContentComponent } from './admin/page-content/page-content.component';
import { FeedbackComponent } from './admin/feedback/feedback.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'app.download', component: AppDwonloadPageComponent },
  { path: 'play.app.colive', component: DownloadComponent },
  { path: 'email.verify', component: EmailVerificationComponent }, 
  { path: 'thank-you', component: ThankYouComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'home', component: HomeComponent },
  { path: 'faq', component: FaqComponent },
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
  { path: 'properties', component: PropertyComponent, canActivate: [AuthGuard] },
  { path: 'team-Info/:id', component: TeamInfoComponent, canActivate: [AuthGuard] },
  { path: 'flatmate-issues', component: FlatmateIssuesComponent, canActivate: [AuthGuard] },
  
  { path: 'crm.access.admin', component: AdminLoginComponent},
  { path: 'admin/customer-feedback', component: FeedbackComponent, canActivate: [AuthGuard] },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/home-page-content', component: HomePagecomponentComponent, canActivate: [AuthGuard] },
  { path: 'admin/faq-page-content', component: FaqPagecomponentComponent, canActivate: [AuthGuard] },
  { path: 'admin/site-config', component: SiteConfigcomponentComponent, canActivate: [AuthGuard] },
  { path: 'admin/pages', component: PagesComponent, canActivate: [AuthGuard] },
  { path: 'admin/page-content', component: PageContentComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: LandlordAccountComponent, canActivate: [AuthGuard] },
  
  {path: '**', redirectTo: '/'},
 
]; 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
