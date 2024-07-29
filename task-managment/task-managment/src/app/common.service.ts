import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  isOpen: any;
  constructor(private http: HttpClient) { }


  registerUser(data) {
    return this.http.post("http://localhost:5000/api/auth/register", data);
  }

  login(data) {
    return this.http.post("http://localhost:5000/api/auth/login", data);
  }

  PriorityDDL() {
    return this.http.get("http://localhost:5000/api/auth/getPriorityDDL");
  }

  userDDL() {
    return this.http.get("http://localhost:5000/api/auth/getUserDDL");
  }

  getCategory() {
    return this.http.get("http://localhost:5000/api/auth/getCategory");
  }

  deleteCategory(id) {
    return this.http.delete(`http://localhost:5000/api/auth/deleteCategory/${id}`);
  }

  updateCategory(data) {
    return this.http.put("http://localhost:5000/api/auth/updateCategory", data);
  }

  addCategory(data) {
    return this.http.post("http://localhost:5000/api/auth/addCategory", data);
  }

  getTask() {
    return this.http.get("http://localhost:5000/api/auth/getTask");
  }

  deleteTask(id) {
    return this.http.get(`http://localhost:5000/api/auth/deleteTask/${id}`);
  }

  updateTask(data) {
    return this.http.put("http://localhost:5000/api/auth/updateTask", data);
  }

  addTask(data) {
    return this.http.post("http://localhost:5000/api/auth/addTask", data);
  }

  GetSharedTask()
  {
    return this.http.get('http://localhost:5000/api/auth/shared-tasks')
  }
}
