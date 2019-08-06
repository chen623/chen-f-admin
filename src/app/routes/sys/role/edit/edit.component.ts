import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import {CacheService} from "@delon/cache";
import {zip} from "rxjs/index";

@Component({
  selector: 'app-sys-role-edit',
  templateUrl: './edit.component.html',
})
export class SysRoleEditComponent implements OnInit {
  record: any = {};
  sysRole: any;

  schema: SFSchema;
  ui: SFUISchema = {
    '*': {
      spanLabel: 9,
      grid: {span: 24},
    },
    $status: {
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
    this.http.get(`/chen/admin/sys/role/${this.record.id}`).subscribe(res => (this.sysRole = res));

    zip(
      this.cacheService.get("/chen/common/sys/dict/alain/select/STATUS", {mode: 'promise', type: 's', expire: 86400}),
    ).subscribe(([statusSelect]: any) => {
      this.schema = {
        properties: {
          name: {type: 'string', title: '角色名称', minLength: 3, maxLength: 30},
          remark: {type: 'string', title: '角色备注', maxLength: 256},
          status: {type: 'string', title: '角色状态', enum: statusSelect},
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
    this.http.put(`/chen/admin/sys/role/${this.record.id}`, value).subscribe(res => {
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
