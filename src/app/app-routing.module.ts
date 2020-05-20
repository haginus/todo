import { NgModule } from '@angular/core';
import { RouterModule, Routes, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ListComponent } from './list/list.component';
import { SettingsComponent } from './settings/settings.component';

export class DataResolve implements Resolve <any> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return route.url.map(seg => seg.path)[0];
  }
}

const routes: Routes = [
  { path: 'list/:id', component: ListComponent, resolve: { path: DataResolve } },
  { path: 'settings', component: SettingsComponent, resolve: { path: DataResolve } }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ],
  declarations: [],
  providers: [DataResolve]
})
export class AppRoutingModule { }


