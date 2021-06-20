const taskName = document.getElementById("taskName");
const taskDescription = document.getElementById("taskDescription");
const addTaskBtn = document.getElementById("addTask");
const todoListUL = document.getElementById("todoList");
const newTaskSection = document.querySelector(".newTask");
const taskSelected = document.getElementById("taskSelected");
const taskSelectedName = document.getElementById("taskSelectedName");
const taskSelectedDescription = document.getElementById(
  "taskSelectedDescription"
);
const pomoTimeBtn = document.getElementById("pomoTimeBtn");
const doneBtn = document.getElementById("done");
const filterOptions = document.getElementById("nav").getElementsByTagName("b");
const urlApi = "https://localhost:44321";
let taskList = [];

fetchRequest("ToDoLists", "Get", null, (list) => {
  list.forEach((task) => {
    let taskLi = document.createElement("li");
    taskLi.id = task.TaskName;
    taskLi.innerText = task.TaskName;
    taskList.push(task);
    if (task.Done === true) {
      taskLi.classList.add("crossOut");
    }
    todoListUL.append(taskLi);
    taskLi.addEventListener("click", () => {
      newTaskSection.style.display = "none";
      taskSelected.style.display = "flex";
      taskSelectedName.innerText = task.TaskName;
      taskSelectedDescription.innerText = task.TaskDescription;
      pomoTimeBtn.src = "./img/playBtn.svg";

      doneBtn.addEventListener("click", () => {
        fetchRequest(
          "ToDoLists/" + task.IdTask,
          "PUT",
          {
            IdTask: task.IdTask,
            TaskName: task.TaskName,
            TaskPomos: task.TaskPomos,
            TaskDescription: task.TaskDescription,
            Done: true,
          },
          () => location.reload()
        );
      });
    });
  });
});
function countDown(minutes, seconds) {
  setInterval(() => {
    if (seconds.innerText < 1) {
      seconds.innerHTML = 59;
      minutes.innerText = `${minutes.innerText - 1}`;
    } else if (seconds.innerText >= 1) {
      seconds.innerHTML = `${seconds.innerText - 1}`;
    }
  }, 1000);
}
pomoTimeBtn.addEventListener("click", () => {
  pomoTimeBtn.src = "./img/pauseBtn.svg";
  const minutes = document.getElementById("minutes");
  const seconds = document.getElementById("seconds");
  console.log(minutes.innerText, seconds.innerText);
  countDown(minutes, seconds);
});
function currentDate() {
  const currMonth = document.getElementById("month");
  const currDay = document.getElementById("day");
  const currYear = document.getElementById("year");
  let date = new Date();
  currDay.innerHTML = date.getDate();
  currYear.innerHTML = date.getFullYear();
  switch (date.getMonth() + 1) {
    case 1:
      currMonth.innerHTML = "Jan";
      break;
    case 2:
      currMonth.innerHTML = "Feb";
      break;
    case 3:
      currMonth.innerHTML = "Mar";
      break;
    case 4:
      currMonth.innerHTML = "April";
      break;
    case 5:
      currMonth.innerHTML = "May";
      break;
    case 6:
      currMonth.innerHTML = "June";
      break;
    case 7:
      currMonth.innerHTML = "July";
      break;
    case 8:
      currMonth.innerHTML = "Aug";
      break;
    case 9:
      currMonth.innerHTML = "Sep";
      break;
    case 10:
      currMonth.innerHTML = "Oct";
      break;
    case 11:
      currMonth.innerHTML = "Nov";
      break;
    case 12:
      currMonth.innerHTML = "Dec";
      break;
  }
}
currentDate();
function fetchRequest(route, method, petitionBody, callback) {
  let requestInit = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: method,
  };
  if (petitionBody) {
    requestInit.body = JSON.stringify(petitionBody);
  }
  fetch(urlApi + "/api/" + route, requestInit)
    .then((response) => (response.status == 204 ? null : response.json()))
    .then((data) => {
      callback.call(window, data);
    });
}
addTaskBtn.addEventListener("click", () => {
  if (taskName.value && taskDescription.value) {
    fetchRequest(
      "ToDoLists",
      "Post",
      {
        TaskName: taskName.value,
        TaskPomos: 0,
        TaskDescription: taskDescription.value,
      },
      (data) => {
        console.log("call back executes", data);
        location.reload();
      }
    );
  } else {
    alert("task name and description must exist");
  }
});

function filterDone() {
  Array.from(taskList).forEach((task) => {
    if (task.Done == false) {
      document.getElementById(`${task.TaskName}`).style.display = "none";
    } else if (task.Done == true) {
      document.getElementById(`${task.TaskName}`).style.display = "flex";
    }
  });
  Array.from(filterOptions).forEach((option) => {
    if (option.id != "doneFilter") {
      option.style.color = "#8A8A8A";
    }
  });
}
function filterTodo() {
  Array.from(taskList).forEach((task) => {
    if (task.Done == true) {
      document.getElementById(`${task.TaskName}`).style.display = "none";
    } else if (task.Done == false) {
      document.getElementById(`${task.TaskName}`).style.display = "flex";
    }
  });
  Array.from(filterOptions).forEach((option) => {
    if (option.id != "todoFilter") {
      option.style.color = "#8A8A8A";
    }
  });
}
function filterAll() {
  Array.from(taskList).forEach((task) => {
    document.getElementById(`${task.TaskName}`).style.display = "flex";
  });
  Array.from(filterOptions).forEach((option) => {
    if (option.id != "allFilter") {
      option.style.color = "#8A8A8A";
    }
  });
}

Array.from(filterOptions).forEach((option) => {
  option.addEventListener("click", () => {
    if (option.id === "doneFilter") {
      filterDone();
      option.style.color = "#f1bf22";
    } else if (option.id === "todoFilter") {
      filterTodo();
      option.style.color = "#f1bf22";
    } else {
      filterAll();
      option.style.color = "#f1bf22";
    }
  });
});
console.log(Array.from(filterOptions));
