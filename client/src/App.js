import Homepage from "./components/homepage";
import Login from "./components/login";
import Signup from "./components/signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {

  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup></Signup>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/"  element={<Homepage ></Homepage>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
