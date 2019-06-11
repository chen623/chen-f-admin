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
import {SysRoleViewComponent} from "./view/view.component";
import {SysRoleEditComponent} from "./edit/edit.component";
import {SysRoleAddComponent} from "./add/add.component";
import {SysRoleSetPermissionComponent} from "./set-permission/set-permission.component";
import {ArrayService} from "@delon/util";

@Component({
  selector: 'app-sys-role',
  templateUrl: './role.component.html',
})
export class SysRoleComponent implements OnInit {
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
  url = `/chen/admin/sys/role`;
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


  constructor(private http: _HttpClient,
              private modal: ModalHelper,
              private cacheService: CacheService,
              private arrayService: ArrayService) {

  }

  ngOnInit() {

    let list:any[] = [
      {id:'0',name:'0'},
      {id:'1',parent_id:'0',name:'1'},
      {id:'2',parent_id:'1',name:'1'},
    ];
    let tree = this.arrayService.arrToTree(list);
    console.log(list);
    console.log(tree);



    zip(
      this.cacheService.get("/chen/core/sys/dict/alain/tag/STATUS", {mode: 'promise', type: 's', expire: 86400}),
    ).subscribe(([statusDict]: any[]) => {
      this.columns = [
        {title: '编号', index: 'id'},
        {title: '角色名称', index: 'name'},
        {title: '角色描述', index: 'remark', width: '200px'},
        {title: '状态', index: 'status', type: 'tag', tag: statusDict},
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
                this.modal.create(SysRoleViewComponent, {'record': item}).subscribe(res => {
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
                this.modal.create(SysRoleEditComponent, {'record': item}).subscribe(res => {
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
                this.http.delete('/chen/admin/sys/role/'+item.id).subscribe((res:any)=>{
                  console.log("删除成功");
                  // 刷新当前页
                  this.st.reload();
                })
              }
            },{
              text: '设置权限', type: 'none',
              click: (item: any, modal: any, instance: STComponent) => {
                this.modal.create(SysRoleSetPermissionComponent, {'record': item}).subscribe(res => {
                    console.log("设置角色成功");
                    // 刷新当前页
                    this.st.reload();
                  }, (res) => {
                    console.log("设置角色失败")
                  }
                );
              }
            },{
              text: '设置菜单', type: 'none',
              click: (item: any, modal: any, instance: STComponent) => {
                this.modal.create(SysRoleSetPermissionComponent, {'record': item}).subscribe(res => {
                    console.log("设置角色成功");
                    // 刷新当前页
                    this.st.reload();
                  }, (res) => {
                    console.log("设置角色失败")
                  }
                );
              }
            },{
              text: '设置API', type: 'none',
              click: (item: any, modal: any, instance: STComponent) => {
                this.modal.create(SysRoleSetPermissionComponent, {'record': item}).subscribe(res => {
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
      this.cacheService.get("/chen/core/sys/dict/alain/select/STATUS", {mode: 'promise', type: 's', expire: 86400}),
    ).subscribe(([statusDict]: any) => {

      this.searchSchema = {
        properties: {
          name: {type: 'string', title: '角色名称'},
          status: {
            type: 'string', title: '状态',
            enum: statusDict,
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
    this.modal.create(SysRoleAddComponent, {}).subscribe(res => {
      // 刷新当前页
      this.st.reload();
    }, res => {

    }, () => {

    });
  }

}
