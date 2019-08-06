import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import {CacheService} from "@delon/cache";
import {zip} from "rxjs/index";

@Component({
  selector: 'app-sys-timed-task-edit',
  templateUrl: './edit.component.html',
})
export class SysTimedTaskEditComponent implements OnInit {
  record: any = {};
  sysTimedTask: any;

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
    this.http.get(`/chen/admin/sys/timedTask/${this.record.code}`).subscribe(res => (this.sysTimedTask = res));

    zip(
      this.cacheService.get("/chen/common/sys/dict/alain/select/SYS_TIMED_TASK.TYPE", {mode: 'promise', type: 's', expire: 86400}),
      this.cacheService.get("/chen/common/sys/dict/alain/select/STATUS", {mode: 'promise', type: 's', expire: 86400}),
    ).subscribe(([sysTimedTaskTypeSelect, statusSelect]: any[]) => {
      this.schema = {
        properties: {
          code: {type: 'string', title: '任务标识', minLength: 3, maxLength: 100},
          name: {type: 'string', title: '任务名称', minLength: 3, maxLength: 100},
          className: {type: 'string', title: '任务类名', minLength: 6, maxLength: 255},
          cronExpression: {type: 'string', title: 'corn表达式', minLength: 6, maxLength: 30},
          data: {type: 'string', title: '任务数据', minLength: 6, maxLength: 255},
          type: {type: 'string', title: '用户状态', enum: sysTimedTaskTypeSelect},
          remark: {type: 'string', title: '备注', maxLength: 256},
          status: {type: 'string', title: '用户状态', enum: statusSelect},

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
    this.http.put(`/chen/admin/sys/timedTask/${this.record.code}`, value).subscribe(res => {
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
