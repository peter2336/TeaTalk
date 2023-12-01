import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import ChatProvider from "./context/ChatProvider";
import "./App.css";
import Login from "./component/Authentication/Login";
import Singup from "./component/Authentication/Singup";

function App() {
  return (
    <ChatProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Singup />}></Route>
          <Route path="/chat" element={<ChatPage />}></Route>
        </Routes>
      </div>
    </ChatProvider>
  );
}

export default App;
