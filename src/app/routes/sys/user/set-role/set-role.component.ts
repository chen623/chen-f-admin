import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import {zip} from "rxjs/index";
import {CacheService} from "@delon/cache";

@Component({
  selector: 'app-sys-user-set-role',
  templateUrl: './set-role.component.html',
})
export class SysUserSetRoleComponent implements OnInit {
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

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private cacheService: CacheService
  ) {}

  ngOnInit(): void {
    zip(
      this.http.get(`/chen/admin/sys/user/${this.record.id}/sysRole`),
      this.http.get(`/chen/admin/sys/role/all/enabled`),
    ).subscribe(([sysUserRoleList, sysRoleList]: any[]) => {


      let defaultSysUserRoleList = (<any[]>(sysUserRoleList)).map((value,index,array)=>{
        return value.id;
      });
      let sysRoleListEnum = (<any[]>(sysRoleList)).map((value,index,array)=>{
        return {title: value.remark, value: value.id};
      });

      this.sysRole = sysRoleList;
      this.schema = {
        properties: {
          sysRoleList: {
            type: 'string',
            title: '角色',
            enum: sysRoleListEnum,
            ui: {
              widget: 'transfer',
              titles: [ '未拥有', '已拥有' ]
            },
            default: defaultSysUserRoleList
          },
        },
        required: [],
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
    this.http.put(`/chen/admin/sys/user/${this.record.id}/setSysRole`, value).subscribe(res => {
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
