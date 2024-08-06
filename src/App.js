import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import NewTask from './pages/NewTask';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/newtask" element={<NewTask />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
