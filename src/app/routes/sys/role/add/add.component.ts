import { Component, OnInit, ViewChild } from '@angular/core';
import {NzModalRef, NzMessageService, NzNotificationService} from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import {CacheService} from "@delon/cache";
import {zip} from "rxjs/index";

@Component({
  selector: 'app-sys-role-add',
  templateUrl: './add.component.html',
})
export class SysRoleAddComponent implements OnInit {

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
      this.cacheService.get("/chen/common/sys/dict/alain/select/STATUS", {mode: 'promise', type: 's', expire: 86400}),
    ).subscribe(([statusSelect]: any) => {
      this.schema = {
        properties: {
          name: {type: 'string', title: '角色名称', minLength: 3, maxLength: 30},
          remark: {type: 'string', title: '角色备注', maxLength: 256},
          status: {type: 'string', title: '用户状态', enum: statusSelect},
        },
        required: ['name', 'status',],
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
    this.http.post(`/chen/admin/sys/role`, value).subscribe(res => {
      this.msgSrv.success('提示','保存成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
