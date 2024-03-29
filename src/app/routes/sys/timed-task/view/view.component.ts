import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import {CacheService} from "@delon/cache";
import {zip} from "rxjs/index";

@Component({
  selector: 'app-sys-timed-task-view',
  templateUrl: './view.component.html',
})
export class SysTimedTaskViewComponent implements OnInit {
  record: any = {};
  sysTimedTask: any;

  constructor(private modal: NzModalRef,
              public msgSrv: NzMessageService,
              public http: _HttpClient,
              public cacheService: CacheService,) {
  }

  ngOnInit(): void {


    zip(
      this.http.get(`/chen/admin/sys/timedTask/${this.record.code}`),
      this.cacheService.get("/chen/common/sys/dict/alain/tag/SYS_TIMED_TASK.TYPE", {mode: 'promise', type: 's', expire: 86400}),
      this.cacheService.get("/chen/common/sys/dict/alain/tag/STATUS", {mode: 'promise', type: 's', expire: 86400}),
    ).subscribe(([sysTimedTask, sysTimedTaskTypeTag, statusTag]: any) => {
      sysTimedTask.type = sysTimedTaskTypeTag[sysTimedTask.type];
      sysTimedTask.status = statusTag[sysTimedTask.status];
      this.sysTimedTask = sysTimedTask;
    });
  }

  close() {
    this.modal.destroy();
  }
}
