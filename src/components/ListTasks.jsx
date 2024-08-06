import { useState, useEffect } from 'react';
import UpdateTask from './UpdateTask';
import './listTasks.css';

function ListTasks() {
  const [tasksList, setTasksList] = useState([]);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    // Load existing tasks from local storage
    const existingTasks = localStorage.getItem('tasks');
    if (existingTasks) {
      const parsedTasks = JSON.parse(existingTasks);
      setTasksList(parsedTasks);
    }
  }, [showUpdatePopup]);

  function handleDeleteTask(task) {
    // Find the index of the task to be deleted
    const taskIndex = tasksList.findIndex((item) => item.taskTitle === task.taskTitle);

    if (taskIndex !== -1) {
      // Create a copy of the tasks list
      const updatedTasks = [...tasksList];
      // Remove the task from the list
      updatedTasks.splice(taskIndex, 1);
      // Update the tasksList state
      setTasksList(updatedTasks);

      // Update the tasks in local storage
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }
  }

  function handleStatusChange(task, newStatus) {
    // Find the index of the task to be updated
    const taskIndex = tasksList.findIndex((item) => item.taskTitle === task.taskTitle);

    if (taskIndex !== -1) {
      // Create a copy of the tasks list
      const updatedTasks = [...tasksList];
      // Update the task status
      updatedTasks[taskIndex].taskStatus = newStatus;
      // Update the tasksList state
      setTasksList(updatedTasks);

      // Update the tasks in local storage
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }
  }

  function handleEditTask(task) {
    setSelectedTask(task);
    setShowUpdatePopup(true);
  }

  function handleCloseUpdatePopup() {
    setShowUpdatePopup(false);
  }

  return (
    <>
      {showUpdatePopup && selectedTask && (
        <div className="updateTaskOverlay" data-testid="updateTaskOverlay">
          <div className="updateTaskPopup" data-testid="updateTaskPopup">
            <UpdateTask task={selectedTask} onClose={handleCloseUpdatePopup} />
          </div>
        </div>
      )}

      <div className="tasksContainer" data-testid="tasksContainer">
        {(!tasksList || tasksList.length === 0) ? (
          <div className="container">
            <p>No tasks available.</p>
          </div>
        ) : (
          tasksList.map((task, id) => (
            <div className="container taskItem" key={id} data-testid={`taskItem-${id}`}>
              <div className="infoColumn">
                <div className="taskRow">
                  <h2 className="userName" data-testid={`taskTitle-${id}`}>
                    {task['taskTitle']}
                  </h2>
                  <div
                    className="editButtonContainer"
                    onClick={() => handleEditTask(task)}
                    data-testid={`editButton-${id}`}
                  >
                    Edit
                  </div>
                </div>
                <div className="row">
                  <p className="jobTitle">
                    <span style={{ fontWeight: 'bold' }}>Task Description:&nbsp;</span>
                    <span data-testid={`taskDescription-${id}`}>
                      {task['taskDescription'].length > 30
                        ? `${task['taskDescription'].substring(0, 30)}...`
                        : task['taskDescription']}
                    </span>
                  </p>
                </div>
                <div className="row">
                  <p className="jobTitle">
                    <span style={{ fontWeight: 'bold' }}>Status:&nbsp;</span>
                    <select
                      value={task['taskStatus']}
                      onChange={(e) => handleStatusChange(task, e.target.value)}
                      data-testid={`taskStatusSelect-${id}`}
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </p>
                </div>
                <div className="row">
                  <div className="jobTitle">
                    <span style={{ fontWeight: 'bold' }}>Assignees:&nbsp;</span>
                    {task['emailsList'].map((email, index) => (
                      <span
                        key={index}
                        className="skillBox"
                        title={email}
                        data-testid={`emailItem-${id}-${index}`}
                      >
                        {index > 0}
                        <span>{email[0].toUpperCase()}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="row" style={{ marginTop: '20px' }}>
                  <button
                    type="submit"
                    className="deleteButton"
                    onClick={() => handleDeleteTask(task)}
                    data-testid={`deleteButton-${id}`}
                  >
                    Delete Task
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default ListTasks;