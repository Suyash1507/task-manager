import ListTasks from '../components/ListTasks';
import "./styles.css"

function Home() {
  return (
    <>
      <h1 style={{
        textAlign: "center"
      }}>
        Tasks List
      </h1>

      <div style={{border: "1px solid #c9c9c937", margin: "20px"}}>
        <ListTasks />
      </div>
    </>
  )
};

export default Home;
