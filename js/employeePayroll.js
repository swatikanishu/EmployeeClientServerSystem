

//making salary output dynamic
const salary= document.querySelector('#salary');
const output= document.querySelector('.salary-output');
output.textContent= salary.value;
salary.addEventListener('input',function()
{
   output.textContent=salary.value;
});
//validation for name
let employeePayrollObject= new EmployeePayrollData();   
const name= document.querySelector('#name');
const nameError= document.querySelector(".name-error");
name.addEventListener('input',()=>
{
    try {
        if(name.value=="")
        {
            nameError.textContent='';
        }
        else
        {
        employeePayrollObject.name= name.value;
        nameError.textContent='';
        }
    } catch (e)
    {
        nameError.textContent=e;
    }
});


//validation for date
 dateError= document.querySelector(".date-error");
var year= document.querySelector('#year');
var month= document.querySelector('#month');
var day=document.querySelector('#day');
let currentDate= new Date();



year.addEventListener('input',checkDate);
month.addEventListener('input',checkDate);
day.addEventListener('input',checkDate)

function checkDate(){ 
    try
    {
        let dates= document.getElementById("#day")+" "+document.getElementById("#month")+" "+document.getElementById("#year");
        let date= document.querySelector('#day')+" "+document.querySelector('#month')+" "+document.querySelector('#year');
        dates=new Date(Date.parse(dates));
        employeePayrollObject.startDate=dates;
        dateError.textContent="";
    }
    catch(e)
    {
        dateError.textContent=e;
    }

}