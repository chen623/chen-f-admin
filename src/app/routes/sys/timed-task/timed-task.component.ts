import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import {STColumn, STComponent, STPage, STReq, STRes} from '@delon/abc';
import {SFComponent, SFSchema, SFUISchema} from '@delon/form';
import {SysUserAddComponent} from "../user/add/add.component";
import {SysUserSetRoleComponent} from "../user/set-role/set-role.component";
import {SysUserViewComponent} from "../user/view/view.component";
import {CacheService} from "@delon/cache";
import {SysUserEditComponent} from "../user/edit/edit.component";
import {zip} from "rxjs/index";
import {SysTimedTaskViewComponent} from "./view/view.component";
import {SysTimedTaskAddComponent} from "./add/add.component";
import {SysTimedTaskEditComponent} from "./edit/edit.component";

@Component({
  selector: 'app-sys-timed-task',
  templateUrl: './timed-task.component.html',
})
export class SysTimedTaskComponent implements OnInit {

  @ViewChild('sf') sf: SFComponent;
  searchSchema: SFSchema;
  ui: SFUISchema = {
    '*': {
      spanLabel: 4,
      spanControl: 20,
      grid: {
        span: 6
      }
    }
  };


  @ViewChild('st') st: STComponent;
  url = `/chen/admin/sys/timedTask`;
  params: any = {};
  req: STReq = {
    params: this.params,
    reName: {
      pi: 'pageIndex',
      ps: 'pageNumber'
    }
  };
  res: STRes = {
    reName: {
      total: 'total',
      list: 'records'
    }
  };
  page: STPage = {
    front: false,
    show: true,
    placement: 'right',

    showSize: true,
    pageSizes: [10, 20, 30, 40, 50],
    showQuickJumper: true,
    total: true
  };
  columns: STColumn[];


  constructor(private http: _HttpClient, private modal: ModalHelper, private cacheService: CacheService) {

  }

  ngOnInit() {
    zip(
      this.cacheService.get("/chen/core/sys/dict/alain/tag/SYS_TIMED_TASK.TYPE", {mode: 'promise', type: 's', expire: 86400}),
      this.cacheService.get("/chen/core/sys/dict/alain/tag/STATUS", {mode: 'promise', type: 's', expire: 86400}),
    ).subscribe(([sysTimedTaskTypeTag, statusTag]: any[]) => {
      this.columns = [
        {title: '任务标识', index: 'code'},
        {title: '任务名称', index: 'name'},
        {title: '任务类名', index: 'className'},
        {title: 'corn表达式', index: 'cronExpression'},
        {title: '任务数据', index: 'data'},
        {title: '任务类型', index: 'type', type: 'tag', tag: sysTimedTaskTypeTag},
        {title: '任务备注', index: 'remark'},
        {title: '任务状态', index: 'status', type: 'tag', tag: statusTag},
        {title: '修改时间', index: 'updateDateTime', type: 'date', dateFormat: 'YYYY年MM月DD日', default: "未修改过"},
        {title: '创建时间', index: 'createDateTime', type: 'date', dateFormat: 'YYYY年MM月DD日'},
        {
          title: '操作',
          buttons: [
            {
              text: '查看', type: 'none',
              // modal: {
              //   component: SysUserViewComponent, params: (record: STData )=>  record, paramsName: 'record'},
              click: (item: any, modal: any, instance: STComponent) => {
                this.modal.create(SysTimedTaskViewComponent, {'record': item}).subscribe(res => {
                  console.log("查看关闭成功");
                }, res => {
                  console.log("查看关闭失败");
                }, () => {
                  console.log("查看关闭结束");
                });

              }
            },
            {
              text: '编辑', type: 'none',
              click: (item: any, modal: any, instance: STComponent) => {
                this.modal.create(SysTimedTaskEditComponent, {'record': item}).subscribe(res => {
                    console.log("编辑成功");
                    // 刷新当前页
                    this.st.reload();
                  }, (res) => {
                    console.log("编辑失败")
                  }
                );
              }
            }, {
              text: '删除', type: 'del',
              click: (item: any, modal: any, instance: STComponent) => {
                this.http.delete(`/chen/admin/sys/timedTask/${item.code}`).subscribe((res:any)=>{
                  console.log("删除成功");
                  // 刷新当前页
                  this.st.reload();
                })
              }
            },{
              text: '立即执行一次', type: 'none',
              click: (item: any, modal: any, instance: STComponent) => {
                this.http.post(`/chen/admin/sys/timedTask/${item.code}/execution`).subscribe((res:any)=>{
                  console.log("删除成功");
                  // 刷新当前页
                  this.st.reload();
                })
              }
            },
          ]
        }
      ];
    });

      zip(
        this.cacheService.get("/chen/core/sys/dict/alain/select/SYS_TIMED_TASK.TYPE", {mode: 'promise', type: 's', expire: 86400}),
        this.cacheService.get("/chen/core/sys/dict/alain/select/STATUS", {mode: 'promise', type: 's', expire: 86400}),
      ).subscribe(([sysTimedTaskTypeSelect, statusSelect]: any[]) => {

      this.searchSchema = {
        properties: {
          code: {type: 'string', title: '任务标识'},
          name: {type: 'string', title: '任务名称'},
          className: {type: 'string', title: '任务类名'},
          type: {
            type: 'string', title: "任务类型",
            enum: sysTimedTaskTypeSelect,
            ui: {
              widget: 'select'
            }
          },
          remark: {
            type: 'string', title: '备注',
            ui: {
              widget: 'textarea',
              autosize: {minRows: 2, maxRows: 6}
            }
          },
          status: {
            type: 'string', title: '任务状态',
            enum: statusSelect,
            ui: {
              widget: 'select',
            }
          },
        }
      };

    });

  }

  add() {
    this.modal.create(SysTimedTaskAddComponent, {}).subscribe(res => {
      // 刷新当前页
      this.st.reload();
    }, res => {

    }, () => {

    });


  }


}
