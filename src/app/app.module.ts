import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './data.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ng6-toastr-notifications';
import { DatePipe } from '@angular/common';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './backend/layouts/header/header.component';
import { SidebarComponent } from './backend/layouts/sidebar/sidebar.component';
import { FooterComponent } from './backend/layouts/footer/footer.component';
import { DashboardComponent } from './backend/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BookingComponent } from './backend/booking/booking.component';
import { CreateBillComponent } from './backend/create-bill/create-bill.component';
import { TeamGroupComponent } from './backend/team-group/team-group.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { HouseChoresComponent } from './backend/house-chores/house-chores.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { SplitBillComponent } from './backend/split-bill/split-bill.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!
import { MyAccountComponent } from './backend/my-account/my-account.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    BookingComponent,
    ContactUsComponent,
    CreateBillComponent,
    TeamGroupComponent,
    HouseChoresComponent,
    SplitBillComponent,
    MyAccountComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AngularMultiSelectModule,
    BsDatepickerModule.forRoot(),
    FullCalendarModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
