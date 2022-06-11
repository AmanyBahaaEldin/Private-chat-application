import { Tab } from "react-bootstrap";
import { Row, Col, Nav } from "react-bootstrap";
import ChatBubble from "./ChatBubble";
import { useState, useEffect, React } from "react";

function UsersTab(props) {
  const [message, setMessage] = useState({ type: 0, text: "" });
  // const [recievedMessages, setrecievedMessages] = useState([]);
  const [recievedMessages, setrecievedMessages] = useState([
    { recieverID: 0, msgs: [{ type: 0, text: "" }] },
  ]);
  // const [users, setUsers] = useState([]);
  const [users, setUsers] = useState([{ id: 0, name: "" }]);
  const [userIndex, setUserIndex] = useState(0);
  const socket = props.socket;
  useEffect(() => {
    socket.on("connected-users", (usersArr) => {
      setUsers([...usersArr]);
      setrecievedMessages(
        usersArr.map((usr) => ({ recieverID: usr.id, msgs: [] }))
      );
    });

    socket.on("new-message", (message) => {
      setrecievedMessages((x) => [
        ...x.slice(
          0,
          x.findIndex((obj) => obj.recieverID === message.userID)
        ),
        {
          recieverID: message.userID,
          msgs: [
            ...x[x.findIndex((obj) => obj.recieverID === message.userID)].msgs,
            message.msg,
          ],
        },
        ...x.slice(x.findIndex((obj) => obj.recieverID === message.userID) + 1),
      ]);
    });

    socket.on("new-user", (user) => {
      setUsers((z) => [...z, user]);
      setrecievedMessages((y) => [...y, { recieverID: user.id, msgs: [] }]);
    });
  }, [socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { msg: message, userID: users[userIndex].id });
    setrecievedMessages([
      ...recievedMessages.slice(
        0,
        recievedMessages.findIndex(
          (obj) => obj.recieverID === users[userIndex].id
        )
      ),
      {
        recieverID: users[userIndex].id,
        msgs: [
          ...recievedMessages[
            recievedMessages.findIndex(
              (obj) => obj.recieverID === users[userIndex].id
            )
          ].msgs,
          message,
        ],
      },
      ...recievedMessages.slice(
        recievedMessages.findIndex(
          (obj) => obj.recieverID === users[userIndex].id
        ) + 1
      ),
    ]);
    setMessage({ type: 0, text: "" });
  };

  return (
    <div style={{minHeight:"60vh"}}>
      <Tab.Container
        id="left-tabs-example"
        onSelect={(index) => setUserIndex(index)}
      >
        <Row style={{minHeight:"60vh"}} >
          <Col sm={3} className="ml-1">
            <Nav variant="pills" className="flex-column">
              <Nav.Item style={{borderBottomColor:"rgba(248, 248, 124, 0.671)"}}>
                {users.length !== 0 &&
                  users.map((item, index) => {
                    return (
                      <Nav.Link key={index} eventKey={index} style={{backgroundColor: "rgb(83, 84, 100)" , borderRadius:"5vh" }} >
                        {item.name}
                      </Nav.Link>
                    );
                  })}
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9} >
            <Tab.Content>
              <Tab.Pane eventKey={userIndex}>
                <div style={{backgroundColor:"rgb(83, 84, 100)", borderRadius:"5vh"}}>
                {users.length!==0&&<span >{users[userIndex].name}</span>}
                </div>
                
                <ChatBubble
                  messages={
                      recievedMessages.findIndex(
                        (obj) => obj.recieverID === users[userIndex].id
                      )
                     === -1
                      ? []
                      : recievedMessages[
                          recievedMessages.findIndex(
                            (obj) => obj.recieverID === users[userIndex].id
                          )
                        ].msgs
                  }
                  style={{ minHeight: "55vh" }}
                />
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
                      // style={{marginTop :"55%"}}
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
