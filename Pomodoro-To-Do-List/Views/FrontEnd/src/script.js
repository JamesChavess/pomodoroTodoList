const taskName = document.getElementById('taskName');
const taskDescription = document.getElementById('taskDescription');
const addTaskBtn = document.getElementById('addTask');
const todoListUL = document.getElementById('todoList');
const newTaskSection = document.querySelector('.newTask')
const taskSelected = document.getElementById('taskSelected');
const taskSelectedName = document.getElementById('taskSelectedName');
const taskSelectedDescription = document.getElementById('taskSelectedDescription');
const pomoTimeBtn = document.getElementById('pomoTimeBtn');
const doneBtn = document.getElementById('doneBtn');
const urlApi = 'https://localhost:44321';

fetchRequest('ToDoLists','Get',null,(list)=>{
        list.forEach(task =>{
            console.log(task.TaskName)
            let taskLi = document.createElement('li')
            taskLi.innerText = task.TaskName
            todoListUL.append(taskLi);
            taskLi.addEventListener('click',()=>{
                console.log(task.TaskName,task.TaskDescription)
                newTaskSection.style.display = 'none';
                taskSelected.style.display = 'flex';
                taskSelectedName.innerText = task.TaskName;
                taskSelectedDescription.innerText = task.TaskDescription;
                pomoTimeBtn.src = './img/playBtn.svg';
            })
          
        })
});
function countDown(minutes,seconds){
  setInterval(() => {
    console.log(minutes,seconds)
     if (seconds.innerText < 1 ){
      seconds.innerHTML = 59
      minutes.innerText = `${minutes.innerText-1}`
    }else if(seconds.innerText >= 1){
      seconds.innerHTML = `${seconds.innerText-1}`
    }
      if(minutes.innerText == 0){
        console.log('pomodoroCount++')
      } 
  }, 1000);
  }

pomoTimeBtn.addEventListener('click',()=>{
  pomoTimeBtn.src = './img/pauseBtn.svg';
  const minutes = document.getElementById('minutes');
  const seconds = document.getElementById('seconds');
  console.log(minutes.innerText,seconds.innerText);
  countDown(minutes,seconds)
})


function currentDate(){
    const currMonth = document.getElementById('month');
    const currDay = document.getElementById('day');
    const currYear = document.getElementById('year');
    let date = new Date();
    currDay.innerHTML = date.getDate();
    currYear.innerHTML = date.getFullYear();
    switch(date.getMonth()+1){
        case 1 :
        currMonth.innerHTML = 'Jan'
        break;
        case 2 :
        currMonth.innerHTML = 'Feb'
        break;
        case 3 :
        currMonth.innerHTML = 'Mar'
        break;
        case 4 :
        currMonth.innerHTML = 'April'
        break;
        case 5 :
        currMonth.innerHTML = 'May'
        break;
        case 6 :
        currMonth.innerHTML = 'June'
        break;
        case 7 :
        currMonth.innerHTML = 'July'
        break;
        case 8 :
        currMonth.innerHTML = 'Aug'
        break;
        case 9 :
        currMonth.innerHTML = 'Sep'
        break;
        case 10 :
        currMonth.innerHTML = 'Oct'
        break;
        case 11 :
        currMonth.innerHTML = 'Nov'
        break;
        case 12 :
        currMonth.innerHTML = 'Dec'
        break;
    }
}
currentDate();
function fetchRequest(rutaControlador,metodo,cuerpoPeticion,callback) {
    let requestInit = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: metodo,
    };
    if (cuerpoPeticion) {
      requestInit.body = JSON.stringify(cuerpoPeticion);
    }
    fetch(urlApi + "/api/" + rutaControlador, requestInit)
      .then((response) => (response.status == 204 ? null : response.json()))
      .then((data) => {
        callback.call(window, data);
      });
  }
addTaskBtn.addEventListener('click',()=>{
    if(taskName.value && taskDescription.value){
    console.log(taskName.value)
    console.log(taskDescription.value)
    fetchRequest('ToDoLists','Post',
    {
        "TaskName": taskName.value,
        "TaskPomos": 0,
        "TaskDescription": taskDescription.value
        }
    ,(data)=>{
        console.log('call back executes',data)
        location.reload();
    })}else{
        alert('task name and description must exist')
    }
   
})

