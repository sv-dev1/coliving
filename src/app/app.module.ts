import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule ,HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
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
import { ErrorInterceptor } from './helpers/error.interceptor';
import { RefferalCodeComponent } from './backend/refferal-code/refferal-code.component';
import { SettingsComponent } from './backend/settings/settings.component';
import { ChatService } from './chat.service';
import { NgxUiLoaderModule } from  'ngx-ui-loader';
import { LoaderInterceptor } from './helpers/loader.interceptor';
import { environment } from '../environments/environment';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TaskSuggestionsComponent } from './backend/task-suggestions/task-suggestions.component';
import { Socket } from 'ng-socket-io';
import { BlockCopyPasteDirective } from './block-copy-paste.directive';
import { MatSliderModule} from '@angular/material/slider';
import { CategoryComponent } from './backend/category/category.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { LightboxModule } from 'ngx-lightbox';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { PropertyComponent } from './backend/property/property.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { PropertyrequestsComponent } from './backend/propertyrequests/propertyrequests.component';
import { MatBadgeModule} from '@angular/material/badge';
import { MatIconModule, MatSlideToggleModule} from '@angular/material';
import { MatMenuModule} from '@angular/material/menu';
import { TeamInfoComponent } from './backend/team-info/team-info.component';
import { FlatmateIssuesComponent } from './backend/flatmate-issues/flatmate-issues.component';
import { AppDwonloadPageComponent } from './app-dwonload-page/app-dwonload-page.component';
import { NgcCookieConsentModule, NgcCookieConsentConfig} from 'ngx-cookieconsent';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { DownloadComponent } from './download/download.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { FaqComponent } from './faq/faq.component';

import { ShareButtonsModule } from '@ngx-share/buttons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons/faFacebookSquare';
import { ShareModule } from '@ngx-share/core';
import { LandlordAccountComponent } from './backend/landlord-account/landlord-account.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { HomePagecomponentComponent } from './admin/home-pagecomponent/home-pagecomponent.component';
import { FaqPagecomponentComponent } from './admin/faq-pagecomponent/faq-pagecomponent.component';
import { SiteConfigcomponentComponent } from './admin/site-configcomponent/site-configcomponent.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { PagesComponent } from './admin/pages/pages.component';
import { PageContentComponent } from './admin/page-content/page-content.component';
import { escapeHtmlPipe } from '../app/admin/safe-html.pipe';
import { escapeHtmlPipe1 } from './safe-html1.pipe';
import { FrontHeaderComponent } from './layouts/front-header/front-header.component';
import { FrontFooterComponent } from './layouts/front-footer/front-footer.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { FeedbackComponent } from './admin/feedback/feedback.component';


import { CountdownModule } from 'ngx-countdown';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';


const icons = [
  // ... other icons
  faFacebookSquare
];

library.add(...icons);

const shareProp = {
  facebook: {
    icon: ['fab', 'facebook-square']
  }
};


/*const cookieConfig:NgcCookieConsentConfig = {
  cookie: {
    domain: 'localhost'// it is recommended to set your domain, for cookies to work properly
  },
  palette: {
    popup: {
      background: '#000'
    },
    button: {
      background: '#f1d600'
    }
  },
  theme: 'edgeless',
  type: 'opt-out',
  layout: 'my-custom-layout',
  layouts: {
    "my-custom-layout": '{{messagelink}}{{compliance}}'
  },
  elements:{
    messagelink: `
    <span id="cookieconsent:desc" class="cc-message">{{message}} 
      <a aria-label="learn more about our privacy policy" tabindex="1" class="cc-link" href="{{privacyPolicyHref}}" target="_blank">{{privacyPolicyLink}}</a>
    </span>
    `,
  },
  content:{
      message: 'By using our site, you acknowledge that you have read and understand our ',
      privacyPolicyLink: 'Privacy Policy, Terms & conditions, GDPR',
      privacyPolicyHref: 'https://www.freeprivacypolicy.com/privacy/view/7a10aabac9e57a1b138755a444037066',
  }
};*/

const config: SocketIoConfig = { url: 'https://chatapis.colivingapp.com', options: {} };

let Loginconfig = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(environment.google_CLIENTID)
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("204221357350343")
  }
]);
 
export function provideConfig() {
  return Loginconfig;
}

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
    RefferalCodeComponent,
    SettingsComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    TaskSuggestionsComponent,
    BlockCopyPasteDirective,
    CategoryComponent,
    PropertyComponent,
    PropertyrequestsComponent,
    TeamInfoComponent,
    FlatmateIssuesComponent,
    AppDwonloadPageComponent,
    EmailVerificationComponent,
    DownloadComponent,
    ThankYouComponent,
    FaqComponent,
    LandlordAccountComponent,
    PrivacyPolicyComponent,
    HomePagecomponentComponent,
    FaqPagecomponentComponent,
    SiteConfigcomponentComponent,
    AdminLoginComponent,
    AdminDashboardComponent,
    PagesComponent,
    PageContentComponent,
    escapeHtmlPipe,
    escapeHtmlPipe1,
    FrontHeaderComponent,
    FrontFooterComponent,
    NotFoundComponent,
    FeedbackComponent,
    
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
    FullCalendarModule,
    NgxUiLoaderModule,
    NgbModule,
    SocketIoModule.forRoot(config),
    NgbModule,
    SocialLoginModule,
    MatSliderModule,
    NgxPaginationModule,
    LightboxModule,
    InternationalPhoneNumberModule,
    GooglePlaceModule,
    NgxIntlTelInputModule,
    MatBadgeModule,
    MatIconModule,MatMenuModule,MatSlideToggleModule,
   // NgcCookieConsentModule.forRoot(cookieConfig),
    ShareButtonsModule.withConfig({
      debug: true
    }),
    ShareButtonsModule.withConfig({ prop: shareProp }),
    ShareModule,
    CKEditorModule,    
    CountdownModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule

  ],
  
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
      DatePipe,ChatService,
      { provide: AuthServiceConfig,     useFactory: provideConfig   }
    ],
    exports: [escapeHtmlPipe, escapeHtmlPipe1],
  bootstrap: [AppComponent]
})
export class AppModule { }
