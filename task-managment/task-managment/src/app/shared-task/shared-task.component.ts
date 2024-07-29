import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-shared-task',
  templateUrl: './shared-task.component.html',
  styleUrl: './shared-task.component.scss'
})
export class SharedTaskComponent implements OnInit {
  TaskListData: any[] = [];
  sharedListData: any[] = [];

  constructor(public commonService: CommonService) { }


  ngOnInit() {
    this.getSharedTask();
    setTimeout(()=>{
      // this.getTask();
    },1000)

  }

  getSharedTask() {
    this.commonService.GetSharedTask().subscribe((res: any) => {
      if (res && res.Status && res.Status.code == 0) {
        this.sharedListData = res.data;
      }
    })
  }


  // getTask() {
  //   this.commonService.getTask().subscribe((res: any) => {
  //     if (res && res.Status && res.Status.code == 0) {
  //       const groupByCategoryName = (items) => {
  //         const grouped = items.reduce((result, item) => {
  //           const { categoryName } = item;
  //           if (!result[categoryName]) {
  //             result[categoryName] = [];
  //           }
  //           result[categoryName].push(item);
  //           return result;
  //         }, {});

  //         return Object.keys(grouped).map(key => ({
  //           name: key,
  //           data: grouped[key]
  //         }));
  //       };
  //       this.TaskListData = groupByCategoryName(res.data);
  //       console.log(this.TaskListData);
  //       this.sharedListData.forEach((x: any) => {
  //         x.data = this.TaskListData.filter(z => z.data.filter(y => y._id == x.taskId))
  //       })
  //       console.log("sharedListData", this.sharedListData);

  //     }
  //   })
  // }

}
