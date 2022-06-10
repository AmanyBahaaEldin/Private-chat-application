import { useState, useEffect } from "react";
import UsersTab from "./usersTab";
import io from "socket.io-client";

const URL = "http://localhost:3000";
const socket = io(URL);

function Login() {
  const [userName, setUserName] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  socket.on("id", (id) => console.log(id));
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoggedIn(true);
    console.log(userName);
    socket.emit("loginnedUser", userName);
  };

  return (
    <div className="loginDiv" style={{borderRadius:"5%", minHeight:"60vh" , minWidth:"80%" , alignItems:"center"}}>
      {!loggedIn && (
        <form onSubmit={handleSubmit}>
          <div style={{marginTop:"15%" , marginLeft:"5%" , marginRight:"5%"}}>
            <input
              type="text"
              placeholder="Enter Your Name"
              required
              className="form-control"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            ></input>
          </div>
        </form>
      )}
      {loggedIn && <UsersTab socket={socket} />}
    </div>
  );
}
export default Login;

// recievedMessages[recievedMessages.findIndex(obj => obj.userID===message.userID)].msg = [
//   ...(recievedMessages[recievedMessages.findIndex(obj => obj.userID===message.userID)].msg) , message.msg
// ];

// recievedMessages[recievedMessages.findIndex(obj => obj.userID===users[userIndex].id )].msg = [
//   ...(recievedMessages[recievedMessages.findIndex(obj => obj.userID===users[userIndex].id )].msg) , message
// ];

// {/* <ChatBubble messages={recievedMessages[recievedMessages.findIndex(obj => obj.userID===users[userIndex].id )].msg} newMessage={message} /> */}
