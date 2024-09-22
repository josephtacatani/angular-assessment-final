import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactListComponent } from './contact-list/contact-list.component'; // Example component
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect root to /home
  { path: 'home', component: ContactListComponent },    // Load ContactListComponent for /home
  { path: 'contacts', component: ContactListComponent }, // Load ContactListComponent for /contacts
  { path: 'contacts/:id', component: ContactDetailsComponent }, // Contact Details page
  { path: '**', component: NotFoundComponent }          // Wildcard route for 404 Not Found
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],  // Import RouterModule and configure routes
  exports: [RouterModule]
})
export class AppRoutingModule { }
