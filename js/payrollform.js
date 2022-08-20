
let isUpdate=false;
let employeePayrollObj={};
window.addEventListener('DOMContentLoaded',(event)=>{
    //checking for update as soon as the content page of html gets loaded, if check for update is passed
    //then populating emp payroll form
    checkForUpdate();

    //getting the name and text error and trying to print error message if regex condition is not satisfied
    const name= document.querySelector('#name');
    const textError= document.querySelector('.name-error');
    //adding event listener for name input and defining function for the same
    name.addEventListener('input',function(){
        //if name length is 0, then no error message is printed
        if(name.value.length==0)
        {
            textError.textContent="";
            return;
        }
        try{
            checkName(name.value);
            textError.textContent="";
        }
        catch(e)
        {
            //passing exception message to texterror const.
            textError.textContent=e;
        }
        
    });
   

    //adding event listener for salary and changing salary output for every salary input made through scrolling
    const salary= document.querySelector('#salary');
    const output= document.querySelector('.salary-output');
    //showing the output equal to salary initially.
    output.textContent=salary.value;
    //adding event listenr for salary and printing the salary for each input dynamically.
    salary.addEventListener('input',function(){
    output.textContent=salary.value;
    });
    //method to validate date if, entered in correct range and do not represent future range
    dateError= document.querySelector(".date-error");
    var year= document.querySelector('#year');
    var month= document.querySelector('#month');
    var day=document.querySelector('#day');
    //as year, month or day any input may be changed from user, hence all 3 event listneres are defined
    year.addEventListener('input',checkDate);
    month.addEventListener('input',checkDate);
    day.addEventListener('input',checkDate)
    //calling checkDate method from event listeners
    function checkDate(){ 
    try
    {   
        //converting value of dates from day id, month id and year id into date string
        //getinputvaluebyid is a method which is used to return value using document.queryselector for particular id and returns the output.
        let dates= getInputValueById("#day")+" "+getInputValueById("#month")+" "+getInputValueById("#year");
        //dates is parsed to date and passed to object of employee payroll data class - start date
        dates=new Date(Date.parse(dates));
        checkStartDate(dates);
        //if condition is not satisfied, then error is thrown and catched by try-catch block
        dateError.textContent="";
    }
    catch(e)
    {
        dateError.textContent=e;
    }
    document.querySelector('#cancelButton').href= site_properties.home_page;
}


});
//calling save function to save values entered through form into obect and object into local storage
//when submit button is pressed, save method is initiated
const save=(event)=>{
    //prevents removing of data, if there is error in name or date
    event.preventDefault();
    //if there is error, then form will not be submitted
    event.stopPropagation();
    try
    {
        //major refactoring of code is done here to to save updated employees
        //calling set employeepayroll object which adds value in payroll form to employee payroll obj json
        setEmployeePayrollObject(); 
        //after adding values, create and update storage is called where values are added into local storage or updated
        createAndUpdateStorage();
        resetForm();
        //after resetting, moving back to home page.
        window.location.replace(site_properties.home_page);
    }
    catch(e)
    {
        return;
    }
  
}
//setting employee payroll objects with data entered in payroll form
const setEmployeePayrollObject = () => {
    if(!isUpdate && site_properties.use_local_storage.match("true")){
        employeePayrollObj.id= createNewEmployeeId();
    }
    try{
    employeePayrollObj._name = getInputValueById('#name');
    checkName(employeePayrollObj._name);
    setTextValue(".name-error","");
    }
    catch(e){
        setTextValue(".name-error",e)
        throw(e);
    }
    employeePayrollObj._profilePic = getSelectedValues('[name=profile]').pop();
    employeePayrollObj._gender = getSelectedValues('[name=gender]').pop();
    employeePayrollObj._department = getSelectedValues('[name=department]');
    employeePayrollObj._salary = getInputValueById('#salary');
    employeePayrollObj._note = getInputValueById('#notes');
    let date = getInputValueById('#day')+" "+getInputValueById('#month')+" "+
               getInputValueById('#year') ;
    try{
    checkStartDate(employeePayrollObj.date)
    employeePayrollObj._startDate = date;
    }
    catch(e)
    {
        setTextValue(".date-error",e);
        throw e;
    }
}
//creating and updating storage
function createAndUpdateStorage()
{
    //getting array employeePayrollList, parsed from string to json objects,  from local storage with key EmployeePayrollList
    let employeePayrollList= JSON.parse(localStorage.getItem("EmployeePayrollList"));
    //if list is already defined, then element being added is not the first and EmployeePayrollList is already created in local storage
    if(employeePayrollList)
    {
        //checking if list obtained from local storage have emp payroll object to be added id already
        //if id is already there, then we are udpdating data, else adding new item into data
        let empPayrollData= employeePayrollList.find(empData=>empData.id==employeePayrollObj.id)
        //if empPayrollData is not defined, then id is not present initially
        if(!empPayrollData)
        {
            //pushing the employee payroll object from create employee payroll data to array
            //directly employee payroll object can not be pushed as it is json object created to read data from form, but it needs to be validated
            //using employeepayrolldata class, hence employeepayrolldata class object is added
            employeePayrollList.push(employeePayrollObj);

        }
        //else element with id is there in list and it needs to be updated
        else
        {
            //finding out the index for particular employee id 
            const index= employeePayrollList.map(empData=>empData.id).indexOf(empPayrollData.id);
            //after finding out index, element is deleted and new object is added with same employee id
            employeePayrollList.splice(index,1,employeePayrollObj);
        }
    }
    //for 1st element, creating employee payroll data object, adding id to it, changing it to array and assigning it to employee payroll list
    else
    {
        employeePayrollList=[employeePayrollObj]
    }
    //adding employeepayroll list to local storage again, data is added into local storage and page will move to home page, after submit
    //json file is converted to string to add into local storage
    localStorage.setItem("EmployeePayrollList",JSON.stringify(employeePayrollList));   
}

//creating new employee id for adding of new data
//id are to be created seperately for each object
const createNewEmployeeId = () => {
    //local storage with key as employeeId is created, for the first time, variable empID is assinged 1
    //and added into local storage with key EmployeeID after converting the value into string
    //for successive times, as empID will be defined from local storage, for each time value will be parsed to int and incremented by 1
    //empID is converted to string and added in local storage.
    let empID = localStorage.getItem("EmployeeID");
    empID = !empID ? 1 : (parseInt(empID)+1).toString();
    localStorage.setItem("EmployeeID",empID);
    //returning empID after incrementing previous one for each data.
    return empID;
}

//defining method for selecting values and adding into array
//property name consist of name of field defined in html tags
const getSelectedValues=(propertyValue)=>{
    //getting all the values defined in html using the name
    let allItems= document.querySelectorAll(propertyValue);
    //defining empty array
    let selItems=[];
    //all value of allItems are iterated and once checked values are found out, item value is pushed into selItems array.
    allItems.forEach(item=>{
        if(item.checked) selItems.push(item.value);
    });
    return selItems;
}
//getting input value by id using query selector
const getInputValueById=(id)=>
{
    let value= document.querySelector(id).value;
    return value;
}
//getting input element value using getelementbyid method
const getInputElementValue=(id)=>{
    let value= document.getElementById(id).value;
    return value;
}
//reset form
//when reset button is pressed, then resetForm() method is called
//all the values in form are reset to empty values
const resetForm=()=>{
    //calling set values for defining field into empty string
    setValue('#name','');
    //calling unset selected values to uncheck radio and checked boxes.
    unsetSelectedValues('[name=profile]');
    unsetSelectedValues('[name=gender]');
    unsetSelectedValues('[name=department]');
    setValue('#salary','');
    setValue('#notes','');
    setValue('#day',1);
    setValue('#month','January');
    setValue('#year','2020');
}
//for all the selected value for name (propertyvalue) passed in html, all the elements for name is queried 
const unsetSelectedValues= (propertyValue)=>{
    let allItems= document.querySelectorAll(propertyValue);
    //iterating through loop and converting items.checked=false for unchecking
    allItems.forEach(items=>{
        items.checked=false;
    });
}
//settext value method sets value for particular class in between opening and closing tags 
//for ex error tags
const setTextValue=(id,value)=>
{
    const element= document.querySelector(id);
    element.textContent=value;
}
//set value method is used to set value of field defined in form to be particular value.
//value from fields in html is  passed for processing from html.
//text values are directly values and radio and checked buttons have their values defined.
//select options also have their value defined after selecting from dropdowns.
const setValue=(id,value)=>
{
    const element= document.querySelector(id);
    element.value=value;
}

//checking for update
const checkForUpdate=()=>{
    //getting values from local storage for editEmp key
    const employeePayrollJson= localStorage.getItem('editEmp');
    //if isupdate is true, then json parsing is done to get objects of employee payroll
    //in the form, objects were added in local storage before stringifying 
    isUpdate= employeePayrollJson?true:false;
    if(!isUpdate) return;
    employeePayrollObj= JSON.parse(employeePayrollJson);
    //calling set form method to populate form
    setForm();
}
//setting the values in the form function
const setForm = () => {
    //calling set value function to set text fields and date
    setValue('#name', employeePayrollObj._name);
    //calling set selected values function to check the fields
    setSelectedValues('[name=profile]', employeePayrollObj._profilePic);
    setSelectedValues('[name=gender]', employeePayrollObj._gender);
    setSelectedValues('[name=department]', employeePayrollObj._department);
    setValue('#salary',employeePayrollObj._salary);
    //calling set text value function to set text content of output salary
    setTextValue('.salary-output', employeePayrollObj._salary);
    setValue('#notes',employeePayrollObj._note);
    let date = stringifyDate(employeePayrollObj._startDate).split(" ");
    setValue('#day', date[0]);
    setValue('#month',date[1]);
    setValue('#year',date[2]);
}

const setSelectedValues = (propertyValue, value) => {
    let allItems = document.querySelectorAll(propertyValue);
    
    allItems.forEach(item => {
        
        
        if(Array.isArray(value)) {
            if (value.includes(item.value)) {
                item.checked = true;
            }
        } 
        else if (item.value === value)
            item.checked = true;
    });    
}