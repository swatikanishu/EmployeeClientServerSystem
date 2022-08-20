//adding a global employee payroll list-array which will contain objects read from local storage
//hence will be used in populating table on webpage
let empPayrollList;
//creating event listener which will be instatiated once all the content is loaded on webpage
window.addEventListener('DOMContentLoaded',(event)=>
{
    if(site_properties.use_local_storage.match("true"))
    {
        getEmployeePayrollDataFromStorage();
    }
    else
        getEmployeePayrollDataFromServer();
});
//function defined in form of array functions to get data from local storage
//in array function, ,condition is checked, if particular key (keys are there in local storage and data is added corresponding to it, here our
//key is EmployeePayrollList) is there in database, if there all data is read form localstorage through getItem method, else empty array is returned.
//data is added in local storage in form of strings. json.parse converts local storage in object of Employeepayroll, in the form it was added.
const getEmployeePayrollDataFromStorage= ()=>{
    empPayrollList= localStorage.getItem('EmployeePayrollList')?JSON.parse(localStorage.getItem('EmployeePayrollList')):[];
    processEmployeePayrollDataResponse();
}
const processEmployeePayrollDataResponse=()=>{
    document.querySelector(".emp-count").textContent=empPayrollList.length;
    createInnerHtml();
    localStorage.removeItem('editEmp');
}

const getEmployeePayrollDataFromServer=()=>
{
    makeServiceCall("GET",site_properties.server_url,true)
        .then(responseText=>{
            empPayrollList= JSON.parse(responseText);
            processEmployeePayrollDataResponse();
        })
        .catch(error=>{
            console.log("GET Error Status: "+JSON.stringify(error));
            empPayrollList=[];
            processEmployeePayrollDataResponse();
        })
}

//method to add data into inner html which adds data into the table
const createInnerHtml=()=>
{
    //if emppayroll list is empty then there is no data in localstorage and method is ended.
    if(empPayrollList.length==0) return;
    //creating a header tag of html which will be used with template literals and placeholders to populate the table.
    //as header is added only once, hence it is called first and initially added in template literal using placeholders.
    const headerHtml= "<tr><th></th><th>Name</th><th>Gender</th><th>Department</th><th>Salary</th><th>Start Date</th><th>Actions</th></tr>"
    //using template literal and adding header html in innerHtml where more table data will be populated in tags.
    let innerHtml= `${headerHtml}`;
    //before local storage, method createEmployeePayrollJSON was created which have details of employee payroll in json format.
    //let empPayrollList= createEmployeePayrollJSON();
    //iterating through all the elements of empPayrollList
    for(const empPayrollData of empPayrollList){
        //adding data of empPayrollData into innerHtml using literals and placeholders, as loop iterates,  more data is added in inner html
        //using template literals to get particular values from objects obtained from local storage.
        //calling stringifyDate function from utility class to convert date into specific format.
        innerHtml= `${innerHtml}
        <tr>
            <td><img class="profile" alt="" src="${empPayrollData._profilePic}"></td>
            <td>${empPayrollData._name}</td>
            <td>${empPayrollData._gender}</td>
            <td>${getDeptHtml(empPayrollData._department)}
            </td>
            <td>${empPayrollData._salary}</td>
            <td>${stringifyDate(empPayrollData._startDate)}</td>
            <td><img id="${empPayrollData.id}" onclick= "remove(this)" alt="delete" src="../assets/icons/delete-black-18dp.svg">
            <img id="${empPayrollData.id}" onclick= "update(this)" alt="edit" src="../assets/icons/create-black-18dp.svg"></td>
        </tr>`;
    }
    //displaying the data using innerHTML
    //innerHTML displays the data to webpage by extracting through html tags, defined elsewhere other than html file and added using class name and innerHTML.
    document.querySelector('#table-display').innerHTML=innerHtml;
}

//creating dummy data for testing and adding data in table on webpage
const createEmployeePayrollJSON = () => {
    let empPayrollListLocal = [
      {       
        _name: 'Akash',
        _gender: 'male',
        _department: [
            'Engineering',
            'Finance'
        ],
        _salary: '500000',
        _startDate: '29 Oct 2019',
        _note: '',
        id: new Date().getTime(),
        _profilePic: '../assets/profile-images/Ellipse -2.png'
      },
      {
        _name: 'Kumar',
        _gender: 'female',
        _department: [
            'Sales'
        ],
        _salary: '400000',
        _startDate: '29 Oct 2019',
        _note: '',
        id: new Date().getTime() + 1,
        _profilePic: '../assets/profile-images/Ellipse -1.png'
      }
    ];
    return empPayrollListLocal;
  }
//creating getDeptHtml function 
//function is added differently, because there can more than one department associated to employee
//department object is recieved as input for method and placeholder and template literals are used to add all departments into innerHTML dynamically.
//for loop is used to iterate over all department from object and innerhtml containing tags in deptHtml is returned.
  const getDeptHtml= (deptList)=>
  {
      let deptHtml='';
      for(const dept of deptList)
      {
          deptHtml= `${deptHtml}<div class="dept-label">${dept}</div>`
      }
      return deptHtml;
  }

  //Adding function to delete elements when click on delete icon in actions
  const remove= (node)=>{
      //empPayrollList is array of data which is instatiated once all the content of webpage gets loaded
      let empPayrollData= empPayrollList.find(empData=>empData.id==node.id);
      //after finding out, if element exist or node with given id, index of particular id is find out
      if(!empPayrollData) return;
      //for finding out index, emppayroll list is converted to array only of id by mapping and then
      //emppayrolldata id is compared to get index
      const index= empPayrollList.map(empData=>empData.id).indexOf(empPayrollData.id);
      //using splice to remove element from array
      empPayrollList.splice(index,1);
      if(site_properties.use_local_storage.match("true"))
      {
      //updating the data into local storage
      localStorage.setItem("EmployeePayrollList",JSON.stringify(empPayrollList));
      //updating the count of employees here, otherwise refresh will be required to update count
      //refresh slows the code, hence update of count is done here only.
      document.querySelector(".emp-count").textContent= empPayrollList.length;
      }
      else
      {
          const deleteURL= site_properties.server_url+empPayrollData.id.toString();
          makeServiceCall("DELETE",deleteURL,false)
          .then(responseText=>
            {
                document.querySelector(".emp-count").textContent= empPayrollList.length;
                createInnerHtml();
            })
            .catch(error=>{
                console.log("DELETE Error status: "+JSON.stringify(error));
            })
      }
      //showing updated data of local storage
      createInnerHtml();
  }

  //update method to edit the details of employee payroll
  const update= (node)=>{
      //from the array empPayrollList populated while laoding content of page, employee id to be upadated is find out
      let empPayrollData= empPayrollList.find(empData=>empData.id== node.id);
      //if emplPayrollData is null, return is applied here and nothing changes
      if(!empPayrollData) return;
      //in order to edit details, employee will be redirected to populated employee payroll form
      //hence creating local storage with different key to print populated employee form afterwords
      localStorage.setItem('editEmp',JSON.stringify(empPayrollData));
      //calling employee payroll form
      window.location.replace(site_properties.emp_payroll_page);
  }