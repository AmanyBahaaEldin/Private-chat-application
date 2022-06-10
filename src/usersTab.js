import { Tab } from "react-bootstrap";
import { Row, Col, Nav } from "react-bootstrap";
import ChatBubble from "./ChatBubble";
import { useState, useEffect , React } from "react";

function UsersTab(props) {
  const [message, setMessage] = useState({ type: 0, text: "" });
  const [recievedMessages, setrecievedMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [userIndex , setUserIndex] = useState(0);
  const socket = props.socket;

  useEffect(() => {
    socket.on("connected-users", (usersArr) => {
      console.log("users array :", usersArr);
      setUsers([...users, ...usersArr]);
    });

    socket.on("new-message", (message) => {
      console.log("Message", message);
      setrecievedMessages([...recievedMessages, message]);
    });

    socket.on("new-user", (user) => {
      console.log(users);
      setUsers([...users, user]);
    });
  }, [recievedMessages, users, socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(message);
    socket.emit("message", { msg: message, userID: users[userIndex].id });
    setrecievedMessages([...recievedMessages, message]);
    setMessage({ type: 0, text: "" });
    console.log(users);
  };
 
  return (
    <div>
      <Tab.Container id="left-tabs-example" onSelect={(index) => setUserIndex(index)}>
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                {(users.length!==0)&& (users.map((item , index) => {return (<Nav.Link key={index} eventKey={index}>{item.name}</Nav.Link>)}))}
              </Nav.Item>
              
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content >
              <Tab.Pane eventKey={userIndex}  >
                <span>...</span>
                <ChatBubble messages={recievedMessages} newMessage={message} 
                style ={{outerHeight:"100%"}}/>
                <form onSubmit={handleSubmit}>
                  <div>
                    <input
                      type="text"
                      placeholder="Enter Your message"
                      required
                      value={message.text}
                      onChange={(e) => {
                        setMessage({ type: 0, text: e.target.value });
                      }}
                    ></input>
                  </div>
                </form>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}

export default UsersTab;
