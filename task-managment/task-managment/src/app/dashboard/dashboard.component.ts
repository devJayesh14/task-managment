import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  isNew: boolean = true;

  newTask: string = '';
  tasks: string[] = [];
  categorySettings: IDropdownSettings;
  prioritySettings: IDropdownSettings;
  priorityData: any[] = [];
  selectedPriority = [];
  selectedCategory = [];
  userData: any[] = [];
  categoryModal: string = '';
  categoryData: any;
  taskReqModal: any = {}
  TaskListData: any;
  selectedUser: any[] = [];
  constructor(private commonService: CommonService) {

  }

  ngOnInit() {
    this.categorySettings = {
      singleSelection: true,
      idField: '_id',
      textField: 'name',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.prioritySettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.PriorityDDL();
    this.getCategory();
    this.userDDL();
    this.getTask();
  }

  toggleSidebar() {
    this.commonService.isOpen = !this.commonService.isOpen;
  }

  addTask() {
    let isEmpt = '';
    if (!this.taskReqModal.title) {
      isEmpt += "Please Enter Title<br>"
    }
    if (!this.taskReqModal.description) {
      isEmpt += "Please Enter Description<br>"
    }
    if (this.selectedCategory.length == 0) {
      isEmpt += "Please Select Category<br>"
    }
    if (this.selectedPriority.length == 0) {
      isEmpt += "Please Select Priority<br>"
    }
    if (!isEmpt) {
      if (this.selectedUser.length > 0) {
        this.taskReqModal.sharedWith = this.selectedUser[0].id;
      }
      this.taskReqModal.categoryId = this.selectedCategory[0]._id;
      this.taskReqModal.categoryName = this.selectedCategory[0].name;
      this.taskReqModal.priorityId = this.selectedPriority[0].id;
      this.taskReqModal.priorityName = this.selectedPriority[0].name;
      this.commonService.addTask(this.taskReqModal).subscribe((res: any) => {
        if (res && res.Status && res.Status.code == 0) {
          this.getTask();
          this.taskReqModal = {};
        }
      })
    }
  }

  getTask() {
    this.commonService.getTask().subscribe((res: any) => {
      if (res && res.Status && res.Status.code == 0) {
        const groupByCategoryName = (items) => {
          const grouped = items.reduce((result, item) => {
            const { categoryName } = item;
            if (!result[categoryName]) {
              result[categoryName] = [];
            }
            result[categoryName].push(item);
            return result;
          }, {});

          return Object.keys(grouped).map(key => ({
            name: key,
            data: grouped[key]
          }));
        };
        this.TaskListData = groupByCategoryName(res.data);
        console.log(this.TaskListData);

      }
    })
  }

  PriorityDDL() {
    this.commonService.PriorityDDL().subscribe((x: any) => {
      if (x && x.Status && x.Status.code == 0) {
        this.priorityData = x.data;
      }
    })
  }
  userDDL() {
    this.commonService.userDDL().subscribe((x: any) => {
      if (x && x.Status && x.Status.code == 0) {
        this.userData = x.data;
      }
    })
  }

  addCategory() {
    this.commonService.addCategory({ name: this.categoryModal }).subscribe((res: any) => {
      if (res && res.Status && res.Status.code == 0) {
        this.categoryModal = '';
        this.getCategory();
      }
    })
  }
  getCategory() {
    this.commonService.getCategory().subscribe((res: any) => {
      if (res && res.Status && res.Status.code == 0) {
        this.categoryData = res.data;
      }
    })
  }

  close() {
    this.categoryModal = '';
    this.taskReqModal = {};
  }

  editTask(data) {
    this.taskReqModal.title = data.title;
    this.taskReqModal.description = data.description;
    this.selectedCategory = [{ name: data.categoryName, _id: data._id }];
    this.selectedPriority = [{ name: data.priorityName, _id: data.priorityId }];
  }

  deleteTask(data) {
    Swal.fire({
      position: 'center',
      title: 'Delete Task',
      text: 'Are you sure you want to delete?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      this.commonService.deleteTask(data._id).subscribe((res: any) => {
        if (res && res.Status && res.Status.code == 0) {
          this.getTask();
        }
      })
    })
  }
}
