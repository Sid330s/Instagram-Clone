import React from 'react';
import NavBar from './components/Navbar'
import "./App.css"
import "react-toastify/dist/ReactToastify.css";
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom'
import Signin from './components/Signin'
import Signup from './components/Signup'


const Routing = ()=>{
 return(
   <Switch>
     <Route exact path="/" >
     <Home />
     </Route>
     <Route path="/signin">
       <Signin />
     </Route>
     <Route path="/signup">
       <Signup />
     </Route>
   </Switch>
 )
}

function App() {
 return (
     <BrowserRouter>
       <NavBar />
       <Routing />
     </BrowserRouter>
 );
}

export default App;
