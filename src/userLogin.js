import { useState, useEffect } from "react";
import UsersTab from "./usersTab";
import io from "socket.io-client";

const URL = "http://localhost:3000";
const socket = io(URL);

function Login() {
  const [userName, setUserName] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
    socket.on("id" , id=>console.log(id));
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoggedIn(true);
    console.log(userName);
    socket.emit("loginnedUser", userName);
  };

  return (
    <div>
      {!loggedIn && (
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="Enter Your Name"
              required
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
