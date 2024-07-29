import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {
  categoryData: any;
  categoryModal: string;
  isNew: boolean = true;

  constructor(public commonService: CommonService) {

  }


  ngOnInit() {
    this.getAllCategory();
  }

  getAllCategory() {
    this.commonService.getCategory().subscribe((res: any) => {
      if (res && res.Status && res.Status.code == 0) {
        this.categoryData = res.data;
      }
    })

  }

  editCategory()
  {

  }

  deleteCategory(data) {
    Swal.fire({
      position: 'center',
      title: 'Delete Category',
      text: 'Are you sure you want to delete?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      this.commonService.deleteCategory(data._id).subscribe((res: any) => {
        if (res && res.Status && res.Status.code == 0) {
          this.getAllCategory();
        }
      })
    })
  }

  close() {
    this.categoryModal = '';
  }

  addCategory() {

  }
}
