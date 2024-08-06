import './header.css';
import { Link } from "react-router-dom";
function Header() {
  return (
    <header className="header" data-testid='header'>
      <div className="left">
        <Link to="/" style={{textDecoration: "none"}} data-testid="appTitleLink">
          <h1 className='appTitle' data-testid="appTitle">Task Manager</h1>
        </Link>
      </div>
      <div className="right">
        <Link to="/newtask" style={{textDecoration: "none"}} data-testid="appTaskLink"> 
          <p className="appTask" data-testid="appTask">Add Task</p>
        </Link>
      </div>
    </header>
  );
}

export default Header;