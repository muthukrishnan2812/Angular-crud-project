import { Component, OnInit } from '@angular/core'; // Import OnInit
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmployeeModel } from './employee-crud.model';
import { ApiService } from '../shared/api.service';
import { map } from 'rxjs';
import { identifierName } from '@angular/compiler';

@Component({
  selector: 'app-employee-crud',
  templateUrl: './employee-crud.component.html',
  styleUrls: ['./employee-crud.component.scss'] // Corrected property name
})
export class EmployeeCrudComponent implements OnInit { // Implement OnInit
  formValue!: FormGroup;
  employeeData !: any;
  employeeModelObj: EmployeeModel = new EmployeeModel(); // Initialize an instance of EmployeeModel
  employeeIdCounter = 1;
  showAdd !:boolean;
  showUpdate !:boolean;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.formValue = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      phoneNumber: [''],
      salary: ['']
    });
    this.getAllEmployee();
  }
  clickAddEmployee(){
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }

  postEmployeeDetails() {
    // Populate employeeModelObj with form values
    this.employeeModelObj.id = this.employeeIdCounter++;
    this.employeeModelObj.firstName = this.formValue.value.firstName;
    this.employeeModelObj.lastName = this.formValue.value.lastName;
    this.employeeModelObj.email = this.formValue.value.email;
    this.employeeModelObj.phoneNumber = this.formValue.value.phoneNumber;
    this.employeeModelObj.salary = this.formValue.value.salary;

    // Call API to post employee details
    this.api.postEmployee(this.employeeModelObj)
      .subscribe(
        (res: any) => {
          console.log(res);
          alert("Employee Added Successfully");
          let ref = document.getElementById('cancel')
          ref?.click();
          this.formValue.reset();
          this.getAllEmployee();
        },
        (err: any) => {
          alert("Something went wrong");
        }
      );
  }
  getAllEmployee() {
    this.api.getEmployee()
      .subscribe(
        (res: any) => {
          this.employeeData = res;
        }
      )
  }
  deleteEmployee(row: any) {
    this.api.deleteEmployee(row.id)
      .subscribe(
        (res: any) => {
          alert("Employee data deleted");
          console.log(row);
          this.getAllEmployee();
        },
        (error) => {
          console.error("Error deleting employee data:", error);
          // Optionally, you can notify the user about the error
          // For example:
          // alert("Failed to delete employee data. Please try again later.");
        }
      );
  }
  onEdit(row: any) {
    this.showAdd = false;
    this.showUpdate = true;
    this.employeeModelObj.id=row.id;
    this.formValue.controls['firstName'].setValue(row.firstName);
    this.formValue.controls['lastName'].setValue(row.lastName);
    this.formValue.controls['email'].setValue(row.email);
    this.formValue.controls['phoneNumber'].setValue(row.phoneNumber);
    this.formValue.controls['salary'].setValue(row.salary);
  }
  updateEmployeeDetails() {
    this.employeeModelObj.firstName = this.formValue.value.firstName;
    this.employeeModelObj.lastName = this.formValue.value.lastName;
    this.employeeModelObj.email = this.formValue.value.email;
    this.employeeModelObj.phoneNumber = this.formValue.value.phoneNumber;
    this.employeeModelObj.salary = this.formValue.value.salary;
    this.api.updateEmployee(this.employeeModelObj,this.employeeModelObj.id)
    .subscribe(res=>{
      alert("Updated succesfully");
      let ref=document.getElementById('cancel')
      ref?.click();
      this.formValue.reset();
      this.getAllEmployee();
    })
  }

}
