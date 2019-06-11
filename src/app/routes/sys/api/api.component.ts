import {Component, OnInit, ViewChild} from '@angular/core';
import {_HttpClient, ModalHelper} from '@delon/theme';
import {STColumn, STComponent, STPage, STReq, STRes} from '@delon/abc';
import {SFComponent, SFSchema, SFUISchema} from '@delon/form';
import {SysPermissionEditComponent} from "../permission/edit/edit.component";
import {SysPermissionViewComponent} from "../permission/view/view.component";
import {SysPermissionAddComponent} from "../permission/add/add.component";
import {CacheService} from "@delon/cache";
import {SysRoleSetPermissionComponent} from "../role/set-permission/set-permission.component";
import {zip} from "rxjs/index";
import {SysApiViewComponent} from "./view/view.component";
import {SysApiEditComponent} from "./edit/edit.component";
import {SysApiAddComponent} from "./add/add.component";

@Component({
  selector: 'app-sys-api',
  templateUrl: './api.component.html',
})
export class SysApiComponent implements OnInit {
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
  url = `/chen/admin/sys/api`;
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
      this.cacheService.get("/chen/core/sys/dict/alain/tag/SYS_API.HTTP_METHOD", {mode: 'promise', type: 's', expire: 86400}),
      this.cacheService.get("/chen/core/sys/dict/alain/tag/SYS_API.TYPE", {mode: 'promise', type: 's', expire: 86400}),
      this.cacheService.get("/chen/core/sys/dict/alain/tag/STATUS", {mode: 'promise', type: 's', expire: 86400}),
    ).subscribe(([httpMethodTag, typeTag, statusTag]: any[]) => {
      this.columns = [
        {title: '编号', index: 'id'},
        {title: 'API名称', index: 'name'},
        {title: 'API路径', index: 'url'},
        {title: 'HTTP请求方法', index: 'httpMethod',type: 'tag', tag: httpMethodTag},
        {title: 'API类型', index: 'type',type: 'tag', tag: typeTag},
        {title: '备注', index: 'remark'},
        {title: '状态', index: 'status', type: 'tag', tag: statusTag},
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
                this.modal.create(SysApiViewComponent, {'record': item}).subscribe(res => {
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
                this.modal.create(SysApiEditComponent, {'record': item}).subscribe(res => {
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
                this.http.delete('/chen/admin/sys/api/' + item.id).subscribe((res: any) => {
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
        this.cacheService.get("/chen/core/sys/dict/alain/select/SYS_API.HTTP_METHOD", {mode: 'promise', type: 's', expire: 86400}),
        this.cacheService.get("/chen/core/sys/dict/alain/select/SYS_API.TYPE", {mode: 'promise', type: 's', expire: 86400}),
        this.cacheService.get("/chen/core/sys/dict/alain/select/STATUS", {mode: 'promise', type: 's', expire: 86400}),
      ).subscribe(([httpMethodSelect, typeSelect, statusSelect]: any[]) => {

      this.searchSchema = {
        properties: {
          name: {type: 'string', title: 'API名称'},
          url: {type: 'string', title: 'API路径'},
          httpMethod: {type: 'string', title: 'HTTP请求方法',
            enum: httpMethodSelect,
            ui: {
              widget: 'select',
            }},
          type: {type: 'string', title: 'API类型',
            enum: typeSelect,
            ui: {
              widget: 'select',
            }},
          status: {
            type: 'string', title: '状态',
            enum: statusSelect,
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
    this.modal.create(SysApiAddComponent, {}).subscribe(res => {
      // 刷新当前页
      this.st.reload();
    }, res => {

    }, () => {

    });
  }
}
