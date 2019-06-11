import { Component, OnInit, ViewChild } from '@angular/core';
import {NzModalRef, NzMessageService, NzNotificationService} from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import {zip} from "rxjs/index";
import {CacheService} from "@delon/cache";

@Component({
  selector: 'app-sys-user-add',
  templateUrl: './add.component.html',
})
export class SysUserAddComponent implements OnInit {

  schema: SFSchema ;
  ui: SFUISchema = {
    '*': {
      spanLabel: 9,
      grid: {span: 24},
    },
    $remark: {
      widget: 'textarea',
    }
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzNotificationService,
    public http: _HttpClient,
    private cacheService: CacheService) {}

  ngOnInit(): void {
    zip(
      this.cacheService.get("/chen/core/sys/dict/alain/select/SYS_USER.STATUS", {mode: 'promise', type: 's', expire: 86400}),
      this.cacheService.get("/chen/core/sys/dict/alain/select/SYS_USER.LEVEL", {mode: 'promise', type: 's', expire: 86400}),
    ).subscribe(([sysUserStatusSelect, sysUserLevelSelect]: any) => {
      this.schema = {
        properties: {
          username: {type: 'string', title: '用户名称', minLength: 3, maxLength: 30},
          password: {type: 'string', title: '用户密码', minLength: 6, maxLength: 30},
          status: {type: 'string', title: '用户状态', enum: sysUserStatusSelect},
          level: {type: 'integer', title: '用户等级', enum: sysUserLevelSelect},
          remark: {type: 'string', title: '备注', maxLength: 256},
        },
        required: ['username', 'password', 'status', 'level',],
        ui: {
          spanLabelFixed: 100,
          grid: {
            span: 12
          }
        }
      }
    });
  }

  save(value: any) {
    this.http.post(`/chen/admin/sys/user`, value).subscribe(res => {
      this.msgSrv.success('提示','保存成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
