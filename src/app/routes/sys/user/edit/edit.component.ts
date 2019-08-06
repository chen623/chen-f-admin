import {Component, OnInit, ViewChild} from '@angular/core';
import {NzModalRef, NzMessageService} from 'ng-zorro-antd';
import {_HttpClient} from '@delon/theme';
import {SFSchema, SFUISchema} from '@delon/form';
import {zip} from "rxjs/index";
import {CacheService} from "@delon/cache";

@Component({
  selector: 'app-sys-user-edit',
  templateUrl: './edit.component.html',
})
export class SysUserEditComponent implements OnInit {
  record: any = {};
  sysUser: any;

  schema: SFSchema;
  ui: SFUISchema = {
    '*': {
      spanLabel: 9,
      grid: {span: 24},
    },
    $status: {
      grid: {span: 24},
    },
    $level: {
      grid: {span: 24},
    },
    $remark: {
      widget: 'textarea',
      autosize: {minRows: 3, maxRows: 6},
      grid: {
        span: 24
      }
    }
  };

  constructor(private modal: NzModalRef,
              private msgSrv: NzMessageService,
              public http: _HttpClient,
              private cacheService: CacheService) {
  }

  ngOnInit(): void {
    this.http.get(`/chen/admin/sys/user/${this.record.id}`).subscribe(res => (this.sysUser = res));

    zip(
    this.cacheService.get("/chen/common/sys/dict/alain/select/SYS_USER.STATUS", {mode: 'promise', type: 's', expire: 86400}),
    this.cacheService.get("/chen/common/sys/dict/alain/select/SYS_USER.LEVEL", {mode: 'promise', type: 's', expire: 86400}),
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
    this.http.put(`/chen/admin/sys/user/${this.record.id}`, value).subscribe(res => {
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
