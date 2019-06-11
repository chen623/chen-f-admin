import {Component, OnInit, ViewChild} from '@angular/core';
import {_HttpClient, ModalHelper} from '@delon/theme';
import {STColumn, STComponent, STReq, STRes, STPage, STColumnTag} from '@delon/abc';
import {SFComponent, SFSchema, SFUISchema} from '@delon/form';

import {SysUserViewComponent} from "./view/view.component";
import {SysUserEditComponent} from "./edit/edit.component";
import {CacheService} from "@delon/cache";
import {forkJoin, from, zip} from "rxjs/index";
import {SysUserAddComponent} from "./add/add.component";
import {STData} from "@delon/abc/table/table.interfaces";
import {Observable} from "rxjs/src/internal/Observable";
import {SysUserSetRoleComponent} from "./set-role/set-role.component";

@Component({
  selector: 'app-sys-user',
  templateUrl: './user.component.html',
})
export class SysUserComponent implements OnInit {

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
  url = `/chen/admin/sys/user`;
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
      this.cacheService.get("/chen/core/sys/dict/alain/tag/SYS_USER.STATUS", {mode: 'promise', type: 's', expire: 86400}),
      this.cacheService.get("/chen/core/sys/dict/alain/tag/SYS_USER.LEVEL", {mode: 'promise', type: 's', expire: 86400}),
    ).subscribe(([sysUserStatusDict, sysUserLevelDict]: any[]) => {
      this.columns = [
        {title: '编号', index: 'id'},
        {title: '用户名', index: 'username'},
        {title: '用户描述', index: 'remark', width: '200px'},
        {title: '级别', index: 'level', type: 'tag', tag: sysUserLevelDict},
        {title: '状态', index: 'status', type: 'tag', tag: sysUserStatusDict},
        {title: '最后登录时间', index: 'lastLoginDateTime', type: 'date', dateFormat: 'YYYY年MM月DD日', default: "未登录过"},
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
                this.modal.create(SysUserViewComponent, {'record': item}).subscribe(res => {
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
                this.modal.create(SysUserEditComponent, {'record': item}).subscribe(res => {
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
                this.http.delete('/chen/admin/sys/user/'+item.id).subscribe((res:any)=>{
                  console.log("删除成功");
                  // 刷新当前页
                  this.st.reload();
                })
              }
            },{
              text: '设置角色', type: 'none',
              click: (item: any, modal: any, instance: STComponent) => {
                this.modal.create(SysUserSetRoleComponent, {'record': item}).subscribe(res => {
                    console.log("设置角色成功");
                    // 刷新当前页
                    this.st.reload();
                  }, (res) => {
                    console.log("设置角色失败")
                  }
                );
              }
            },
          ]
        }
      ];
    });

    zip(
      this.cacheService.get("/chen/core/sys/dict/alain/select/SYS_USER.STATUS", {mode: 'promise', type: 's', expire: 86400}),
      this.cacheService.get("/chen/core/sys/dict/alain/select/SYS_USER.LEVEL", {mode: 'promise', type: 's', expire: 86400}),
    ).subscribe(([sysUserStatusDict, sysUserLevelDict]: any) => {

      this.searchSchema = {
        properties: {
          username: {type: 'string', title: '用户名'},
          level: {
            type: 'integer', title: "用户等级",
            enum: sysUserLevelDict,
            ui: {
              widget: 'select'
            }
          },
          status: {
            type: 'string', title: '用户状态',
            enum: sysUserStatusDict,
            ui: {
              widget: 'select',
            }
          },
          remark: {
            type: 'string', title: '备注',
            ui: {
              widget: 'textarea',
              autosize: {minRows: 2, maxRows: 6}
            }
          },
        }
      };

    });

  }

  add() {
    this.modal.create(SysUserAddComponent, {}).subscribe(res => {
      // 刷新当前页
      this.st.reload();
    }, res => {

    }, () => {

    });


  }


}
