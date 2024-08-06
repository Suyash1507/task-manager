import { useState, useEffect } from 'react';

function UpdateTask({ task, onClose }) {
  const [taskId, setTaskId] = useState("");
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState('');
  const [email, setEmail] = useState('');
  const [emailsList, setEmailsList] = useState([]);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setTaskTitle(task.taskTitle);
    setTaskDescription(task.taskDescription);
    setTaskStatus(task.taskStatus);
    setEmailsList([...task.emailsList]);
    setTaskCompleted(task.taskCompleted);
    setTaskId(task.id);
  }, [task]);

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function handleAddEmail() {
    if (email.trim() !== '') {
      const newEmails = email.split(',').map(e => e.trim()).filter(e => e !== '');
      const invalidEmails = newEmails.filter(e => !validateEmail(e));
      if (invalidEmails.length > 0) {
        setErrorMessage(`Invalid email format: ${invalidEmails.join(', ')}`);
        return;
      }
      setEmailsList(prev => [...prev, ...newEmails]);
      setEmail('');
    }
  }

  function handleRemoveEmail(index) {
    const updatedEmailsList = [...emailsList];
    updatedEmailsList.splice(index, 1);
    setEmailsList(updatedEmailsList);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newEmails = email.split(',').map(e => e.trim()).filter(e => e);
    const invalidEmails = newEmails.filter(e => !validateEmail(e));

    if (invalidEmails.length > 0) {
      setErrorMessage(`Invalid email format: ${invalidEmails.join(', ')}`);
      return;
    }

    const updatedEmailsList = [...emailsList, ...newEmails];
    setEmailsList(updatedEmailsList); 

    setEmail('');
    setErrorMessage('');

    if (taskTitle.trim() === '') {
      setTaskTitle(task.taskTitle);
      setErrorMessage('Task title is required.');
      return;
    }

    const existingTasks = localStorage.getItem('tasks');
    const tasks = existingTasks ? JSON.parse(existingTasks) : [];

    const taskIndexToUpdate = tasks.findIndex((task) => task.id === taskId);

    if (taskIndexToUpdate !== -1) {
      const updatedTask = {
        ...tasks[taskIndexToUpdate],
        taskTitle,
        taskDescription,
        taskStatus,
        emailsList: updatedEmailsList,
        taskCompleted,
      };

      const updatedTasks = [...tasks];
      updatedTasks[taskIndexToUpdate] = updatedTask;

      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }

    onClose();
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
    if (errorMessage) {
      setErrorMessage('');
    }
  }

  function handleEmailKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  }

  return (
    <form onSubmit={handleSubmit} data-testid="updateTaskForm">
      <h1 className="addNewTaskHeading">Update Task</h1>
      <div className="task-form">
        <div className="left-column">
          <div className="alignSameLine">
            <label>Task Title:</label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="titleInputField"
              data-testid="titleInputField"
            />
          </div>
          <div className="alignSameLine">
            <label>Task Description:</label>
            <textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="descriptionTextArea"
              data-testid="descriptionTextarea"
            />
          </div>
        </div>
        <div className="right-column">
          <div className="alignSameLine">
            <label>Completed:</label>
            <input
              type="checkbox"
              checked={taskCompleted}
              onChange={(e) => setTaskCompleted(e.target.checked)}
              className="completedCheckBox"
              data-testid="completedCheckbox"
            />
          </div>
          <div className="alignSameLine">
            <label>Task Status:</label>
            <select
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value)}
              data-testid="taskStatusSelect"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
          <>
            <div className="alignEmailItems">
              <label>Emails:</label>
              <input
                type="text"
                className="emailInput"
                value={email}
                onChange={handleEmailChange}
                onKeyDown={handleEmailKeyPress}
                data-testid="emailInput"
              />
            </div>
            {errorMessage && <p className="error-message" data-testid="errorMessage">{errorMessage}</p>}
            <div>
              <ul className="emailList" data-testid="emailList">
                {emailsList.map((email, index) => (
                  <div key={index} className="eachEmail" data-testid={`email-${index}`}>
                    {email[0].toUpperCase()}
                    <button
                      className="removeEmailButton"
                      type="button"
                      onClick={() => handleRemoveEmail(index)}
                      data-testid={`removeEmailButton-${index}`}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </ul>
            </div>
          </>
        </div>
      </div>
      <div className="submit-button-row">
        <button type="submit" data-testid="updateButton">Update</button>
        &nbsp;&nbsp;
        <button type="button" onClick={onClose} data-testid="cancelButton">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default UpdateTask;