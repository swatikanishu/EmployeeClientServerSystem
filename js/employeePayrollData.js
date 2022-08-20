//creating employee payroll data class, which has geter and setter for different properties
class EmployeePayrollData
{
    //getter and setter for name
    get name(){ return this._name;}
    set name(name)
    {
    
        let nameRegex= RegExp('^[A-Z]{1}[a-zA-Z ]{2,}$');
        if(nameRegex.test(name))
            this._name=name;
        else throw 'Name is Incorrect!';
    }
    //geter and setter for id
    id;
    //getter and setter fr profilepic
    get profilePic() { return this._profilePic; }
    set profilePic(profilePic) 
    { 
     this._profilePic = profilePic; 
    }
    //getter and setter for gender
   get gender() { return this._gender; }
   set gender(gender)
    { 
     this._gender = gender; 
    }
    //getter and setter for department
   get department() { return this._department; }
   set department(department)
    { 
     this._department = department; 
    }
    //getter and setter for salary
   get salary() { return this._salary; }
   set salary(salary) 
   { 
     this._salary = salary; 
   }
 //getter and setter for note
   get note() { return this._note; }
   set note(note) 
   { 
     this._note = note; 
   }
   //getter and setter for startdate
   get startDate(){return this._startDate;}
    set startDate(startDate)
    {
        let currentDate= new Date();
        //checking if start date is not a future date
        if(currentDate- startDate>=0)
            this._startDate= startDate;
        else throw  'invalid date';
    }

    toString()
    {
         const options= {year:'numeric',month:'long',day:'numeric'};
         //3 Equals are used and return true when both datatype and value matches
         const empDate= this.startDate===undefined ? "undefined": this.startDate.toLocaleDateString("en-US",options); 
       return "id: " + this.id + ", name: " + this.name + ", gender: " + this.gender + 
         ", profilePic: " + this.profilePic + ", department: " + this.department +
         ", salary: " + this.salary + ", startDate: " + empDate + ", note: " + this.note;
    }
}