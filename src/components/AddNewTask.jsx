import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './addNewTask.css';

function AddNewTask() {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState('To Do');
  const [email, setEmail] = useState('');
  const [emailsList, setEmailsList] = useState([]);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function handleAddEmail() {
    if (email.trim() !== '') {
      const newEmails = email.split(',').map(e => e.trim()).filter(e => e !== '');
      for (let newEmail of newEmails) {
        if (!validateEmail(newEmail)) {
          setErrorMessage(`Invalid email format: ${newEmail}`);
          return;
        }
      }
      setEmailsList([...emailsList, ...newEmails]);
      setEmail('');
      setErrorMessage('');
    }
  }

  function handleRemoveEmail(index) {
    const updatedEmailsList = [...emailsList];
    updatedEmailsList.splice(index, 1);
    setEmailsList(updatedEmailsList);
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

  function handleSubmit(e) {
    e.preventDefault();
  
    const newEmails = email.split(',').map(e => e.trim()).filter(e => e);
    const invalidEmails = newEmails.filter(e => !validateEmail(e));
  
    // Check for invalid emails
    if (invalidEmails.length > 0) {
      setErrorMessage(`Invalid email format: ${invalidEmails.join(', ')}`);
      return;
    }
  
    const updatedEmailsList = [...emailsList, ...newEmails];
    setEmailsList(updatedEmailsList);
  
    setEmail('');
    setErrorMessage('');
  
    if (taskTitle.trim() === '') {
      setErrorMessage('Task title is required.');
      return;
    }
  
    const taskId = uuidv4();
    const existingTasks = localStorage.getItem('tasks');
    const newTask = {
      id: taskId, 
      taskTitle, 
      taskDescription, 
      taskStatus, 
      emailsList: updatedEmailsList,
      taskCompleted
    };
    const updatedTasks = existingTasks ? JSON.parse(existingTasks).concat(newTask) : [newTask];
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  
    setTaskTitle('');
    setTaskDescription('');
    setTaskStatus('To Do');
    setEmailsList([]);
    setTaskCompleted(false);
    navigate('/');
  }

  return (
    <div className='formContainer' data-testid="formContainer">
      <div className='mainForm'>
        <form onSubmit={handleSubmit}>
          <h1 className='addNewTaskHeading'>Add a new Task</h1>
          <div className="task-form">
            <div className="left-column">
              <div className="alignSameLine">
                <label>Task Title:</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  data-testid="titleInputField"
                  className='titleInputField'
                  required
                />
              </div>
              <div className="alignSameLine">
                <label>Task Description:</label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  data-testid="descriptionTextarea"
                  className='descriptionTextArea'
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
                  data-testid="completedCheckbox"
                  className='completedCheckBox'
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
              <div className='alignEmailItems'>
                <label>Emails:</label>
                <textarea
                  type="text"
                  className='emailInput'
                  value={email}
                  onChange={handleEmailChange}
                  onKeyDown={handleEmailKeyPress}
                  data-testid="emailInput"
                />
              </div>
              {errorMessage && <p className="error-message" data-testid="errorMessage">{errorMessage}</p>}
              <div>
                <ul className='emailList'>
                  {emailsList.map((email, index) => (
                    <div key={index} data-testid={`email-${index}`} className='eachEmail'>
                      {email[0].toUpperCase()}
                      <button
                        className='removeEmailButton'
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
            </div>
          </div>
          <div className="submit-button-row">
            <button type="submit">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddNewTask;