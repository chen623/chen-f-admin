import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { SysRoutingModule } from './sys-routing.module';
import { SysUserComponent } from './user/user.component';
import { SysUserViewComponent } from './user/view/view.component';
import { SysUserEditComponent } from './user/edit/edit.component';
import { SysUserAddComponent } from './user/add/add.component';
import { SysUserSetRoleComponent } from './user/set-role/set-role.component';
import { SysRoleComponent } from './role/role.component';
import {SysRoleViewComponent} from './role/view/view.component';
import { SysRoleEditComponent } from './role/edit/edit.component';
import { SysRoleAddComponent } from './role/add/add.component';
import { SysRoleSetPermissionComponent } from './role/set-permission/set-permission.component';
import { SysPermissionComponent } from './permission/permission.component';
import { SysPermissionViewComponent } from './permission/view/view.component';
import { SysPermissionAddComponent } from './permission/add/add.component';
import { SysPermissionEditComponent } from './permission/edit/edit.component';
import { SysTimedTaskComponent } from './timed-task/timed-task.component';
import { SysTimedTaskViewComponent } from './timed-task/view/view.component';
import { SysTimedTaskAddComponent } from './timed-task/add/add.component';
import { SysTimedTaskEditComponent } from './timed-task/edit/edit.component';
import { SysDruidComponent } from './druid/druid.component';
import { SysApiComponent } from './api/api.component';
import { SysApiViewComponent } from './api/view/view.component';
import { SysApiAddComponent } from './api/add/add.component';
import { SysApiEditComponent } from './api/edit/edit.component';

const COMPONENTS = [
  SysUserComponent,
  SysRoleComponent,
  SysPermissionComponent,
  SysTimedTaskComponent,
  SysApiComponent];
const COMPONENTS_NOROUNT = [
  SysUserViewComponent,
  SysUserEditComponent,
  SysUserAddComponent,
  SysUserSetRoleComponent,
  SysRoleViewComponent,
  SysRoleEditComponent,
  SysRoleAddComponent,
  SysRoleSetPermissionComponent,
  SysPermissionViewComponent,
  SysPermissionAddComponent,
  SysPermissionEditComponent,
  SysTimedTaskViewComponent,
  SysTimedTaskAddComponent,
  SysTimedTaskEditComponent,
  SysDruidComponent,
  SysApiViewComponent,
  SysApiAddComponent,
  SysApiEditComponent];

@NgModule({
  imports: [
    SharedModule,
    SysRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class SysModule { }
