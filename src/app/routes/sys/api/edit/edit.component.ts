import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import {zip} from "rxjs/index";
import {CacheService} from "@delon/cache";

@Component({
  selector: 'app-sys-api-edit',
  templateUrl: './edit.component.html',
})
export class SysApiEditComponent implements OnInit {
  record: any = {};
  sysApi: any;

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
    this.http.get(`/chen/admin/sys/api/${this.record.id}`).subscribe(res => (this.sysApi = res));

    zip(
      this.cacheService.get("/chen/common/sys/dict/alain/select/SYS_API.HTTP_METHOD", {mode: 'promise', type: 's', expire: 86400}),
      this.cacheService.get("/chen/common/sys/dict/alain/select/SYS_API.TYPE", {mode: 'promise', type: 's', expire: 86400}),
      this.cacheService.get("/chen/common/sys/dict/alain/select/STATUS", {mode: 'promise', type: 's', expire: 86400}),
    ).subscribe(([httpMethodSelect, typeSelect, statusSelect]: any[]) => {
      this.schema = {
        properties: {
          name: {type: 'string', title: 'API名称', minLength: 3, maxLength: 30},
          url: {type: 'string', title: 'API路径', minLength: 3, maxLength: 255},
          httpMethod: {type: 'string', title: 'HTTP请求方法', enum: httpMethodSelect},
          type: {type: 'string', title: 'API类型', enum: typeSelect},
          remark: {type: 'string', title: '权限备注', maxLength: 256},
          status: {type: 'string', title: '权限状态', enum: statusSelect},
        },
        required: ['name','url','httpMethod','type', 'status',],
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
    this.http.put(`/chen/admin/sys/api/${this.record.id}`, value).subscribe(res => {
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
