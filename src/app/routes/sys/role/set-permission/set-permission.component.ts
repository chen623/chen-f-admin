import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import {CacheService} from "@delon/cache";
import {zip} from "rxjs/index";

@Component({
  selector: 'app-sys-role-set-permission',
  templateUrl: './set-permission.component.html',
})
export class SysRoleSetPermissionComponent implements OnInit {
  record: any = {};
  sysPermission: any;

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

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private cacheService: CacheService
  ) {}

  ngOnInit(): void {
    zip(
      this.http.get(`/chen/admin/sys/role/${this.record.id}/sysPermission`),
      this.http.get(`/chen/admin/sys/permission/all/enabled`),
    ).subscribe(([sysRolePermissionList, sysPermissionList]: any[]) => {

      let defaultSysRolePermissionList= (<any[]>(sysRolePermissionList)).map((value,index,array)=>{
        return value.id;
      });
      let sysPermissionListEnum = (<any[]>(sysPermissionList)).map((value,index,array)=>{
        return {title: value.remark, value: value.id};
      });

      this.sysPermission = sysRolePermissionList;
      this.schema = {
        properties: {
          sysPermissionList: {
            type: 'string',
            title: '权限',
            enum: sysPermissionListEnum,
            ui: {
              widget: 'transfer',
              titles: ['未拥有', '已拥有']
            },
            default: defaultSysRolePermissionList
          },
        },
        required: [],
        ui: {
          spanLabelFixed: 100,
          grid: {
            span: 12
          }
        }
      };
    });
  }

  save(value: any) {
    this.http.put(`/chen/admin/sys/role/${this.record.id}/setSysPermission`, value).subscribe(res => {
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
