import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SysUserComponent } from './user/user.component';
import { SysRoleComponent } from './role/role.component';
import { SysPermissionComponent } from './permission/permission.component';
import { SysTimedTaskComponent } from './timed-task/timed-task.component';
import {SysDruidComponent} from "./druid/druid.component";
import { SysApiComponent } from './api/api.component';

const routes: Routes = [

  { path: 'user', component: SysUserComponent },
  { path: 'role', component: SysRoleComponent },
  { path: 'permission', component: SysPermissionComponent },
  { path: 'timed-task', component: SysTimedTaskComponent },
  { path: 'druid', component: SysDruidComponent },
  { path: 'api', component: SysApiComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SysRoutingModule { }
