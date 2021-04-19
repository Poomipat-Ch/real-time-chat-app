import React from "react";
import Chat from "./chat/chat";
import Process from "./process/process";
import "./App.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./home/home";
import io from "socket.io-client";
const socket = io("https://kenta-realtime-chat.herokuapp.com");

function Appmain(props) {
  return (
    <React.Fragment>
      <div className="center">
        <Chat
          username={props.match.params.username}
          roomname={props.match.params.roomname}
          socket={socket}
        />
      </div>
    </React.Fragment>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact>
            <Home socket={socket} />
          </Route>
          <Route path="/chat/:roomname/:username" component={Appmain} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
