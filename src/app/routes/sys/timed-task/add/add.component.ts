import { Component, OnInit, ViewChild } from '@angular/core';
import {NzModalRef, NzMessageService, NzNotificationService} from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import {CacheService} from "@delon/cache";
import {zip} from "rxjs/index";

@Component({
  selector: 'app-sys-timed-task-add',
  templateUrl: './add.component.html',
})
export class SysTimedTaskAddComponent implements OnInit {
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
      this.cacheService.get("/chen/common/sys/dict/alain/select/SYS_TIMED_TASK.TYPE", {mode: 'promise', type: 's', expire: 86400}),
      this.cacheService.get("/chen/common/sys/dict/alain/select/STATUS", {mode: 'promise', type: 's', expire: 86400}),
    ).subscribe(([sysTimedTaskTypeSelect, statusSelect]: any[]) => {
      this.schema = {
        properties: {
          code: {type: 'string', title: '任务标识', minLength: 3, maxLength: 100},
          name: {type: 'string', title: '任务名称', minLength: 3, maxLength: 100},
          className: {type: 'string', title: '任务类名',  minLength: 3,maxLength: 255},
          cronExpression: {type: 'string', title: 'corn表达式',  maxLength: 30},
          data: {type: 'string', title: '任务数据(json格式)',},
          type: {type: 'string', title: '任务类型', enum: sysTimedTaskTypeSelect},
          remark: {type: 'string', title: '任务备注',},
          status: {type: 'string', title: '任务状态', enum: statusSelect},
        },
        required: ['code','name', 'className', 'cronExpression', 'type','status',],
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
    this.http.post(`/chen/admin/sys/timedTask`, value).subscribe(res => {
      this.msgSrv.success('提示','保存成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
