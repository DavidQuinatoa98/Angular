import { Routes } from '@angular/router';
import { Home } from './Pages/home/home';
import { SintesisAditiva } from './Components/sintesis-aditiva/aditiva';
import { KeyboardComponent } from './Components/Piano/piano';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'aditiva', component: SintesisAditiva },
    { path: 'sustractiva', component: SintesisSustractiva }
    { path: 'piano', component: KeyboardComponent}
  ];