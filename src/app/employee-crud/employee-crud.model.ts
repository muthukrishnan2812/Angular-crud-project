export class EmployeeModel {
    static lastId = 0;
    id: number ;
    firstName: string = '';
    lastName: string = '';
    email: string = '';
    phoneNumber: string = '';
    salary: string = '';
    constructor(){
        this.id=EmployeeModel.lastId++;
    }
}