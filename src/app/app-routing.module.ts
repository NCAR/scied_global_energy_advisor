import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntroductionComponent } from './introduction/introduction.component';
import { InteractiveComponent } from './interactive/interactive.component';
import { ResultsComponent } from './results/results.component';

const routes: Routes = [
   {path: 'introduction', component: IntroductionComponent},
   {path: 'main/:status', component: InteractiveComponent},
   {path: 'results', component: ResultsComponent},
   {path: '**', redirectTo: '/introduction', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
