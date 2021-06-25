const taskName = document.getElementById("taskName"),
taskDescription = document.getElementById("taskDescription"),
addTaskBtn = document.getElementById("addTask"),
todoListUL = document.getElementById("todoList"),
newTaskSection = document.querySelector(".newTask"),
taskSelected = document.getElementById("taskSelected"),
taskSelectedName = document.getElementById("taskSelectedName"),
taskSelectedDesc = document.getElementById("taskSelectedDesc"),
pomoTimeBtn = document.getElementById("pomoTimeBtn"),
doneBtn = document.getElementById("done"),
filterOptions = document.getElementById("nav").getElementsByTagName("b"),
urlApi = "https://localhost:44321";
let taskSelectedId = 0,
taskSelectedPomos = 0,
taskList = [],
startTimer,
paused = true,
firstTime = true;

fetchRequest("ToDoLists", "Get", null, (list) => {
  list.forEach((task) => {
    let taskLi = document.createElement("li");
    taskLi.id = task.TaskName;
    taskLi.innerText = task.TaskName + `: ${task.TaskPomos} Pomodoros`;
    taskList.push(task);
    if (task.Done === true) {
      taskLi.classList.add("crossOut");
    }
    todoListUL.append(taskLi);
    taskLi.addEventListener("click", () => {
      firstTime = true;
      stopTimer(startTimer);
      document.getElementById("minutes").innerText = 25;
      document.getElementById("seconds").innerText = "00";
      newTaskSection.style.display = "none";
      taskSelected.style.display = "flex";
      taskSelectedName.innerText = task.TaskName;
      taskSelectedDesc.innerText = task.TaskDescription;
      taskSelectedId = task.IdTask;
      taskSelectedPomos = task.TaskPomos;
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

function stopTimer(startTimer) {
  let paused = true;
  clearInterval(startTimer);
}
pomoTimeBtn.addEventListener("click", () => {
  if (firstTime) {
    startTimer = setInterval(countDown, 1000);
  } else {
    clearInterval(startTimer);
    startTimer = setInterval(countDown, 1000);
  }
  if (paused == true) {
    pomoTimeBtn.src = "./img/pauseBtn.svg";
    firstTime = false;
    paused = false;
  } else {
    stopTimer(startTimer);
    pomoTimeBtn.src = "./img/playBtn.svg";
    paused = true;
  }
});

function countDown() {
  if (!paused) {
    const m = document.getElementById("minutes");
    const s = document.getElementById("seconds");
    if (s.innerText == 00 && m.innerText == 00) {
      stopTimer(startTimer);
      console.log('reset timer "PUT" method to link pomos to task ');
      console.log(taskSelectedName);
      console.log(taskSelectedDesc);
      fetchRequest(
        "ToDoLists/" + taskSelectedId,
        "PUT",
        {
          IdTask: taskSelectedId,
          TaskName: taskSelectedName.innerText,
          TaskPomos: `${taskSelectedPomos + 1}`,
          TaskDescription: taskSelectedDesc.innerText,
          Done: false,
        },
        () => location.reload()
      );
    } else if (s.innerText > 10) {
      s.innerHTML = `${s.innerText - 1}`;
    } else if (s.innerText <= 10 && s.innerText >= 1) {
      s.innerHTML = "0" + `${s.innerText - 1}`;
    } else if (s.innerText < 1) {
      s.innerHTML = 59;
      m.innerText = `${m.innerText - 1}`;
    } else if (m.innerText <= 10 && m.innerText >= 1) {
      m.innerHTML = "0" + `${m.innerText - 1}`;
    }
  }
}
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
