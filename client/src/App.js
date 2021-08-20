 import React,{useEffect,createContext,useReducer,useContext} from 'react';
import NavBar from './components/Navbar'
import "./App.css"
import "react-toastify/dist/ReactToastify.css";
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom'
import Home from './components/Home'
import Signin from './components/Signin'
import Profile from './components/Profile'
import Signup from './components/Signup'
import CreatePost from './components/CreatePost'
import {reducer,initialState} from './reducers/userReducer'
import UserProfile from './components/UserProfile'
import SubscribedUserPosts from './components/SubscribesUserPosts'
import Post from './components/Post'
import Reset from './components/Reset'
export const UserContext = createContext()


const Routing = ()=>{
  const history = useHistory()
  const {dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
    }else{
      if(!history.location.pathname.startsWith('/reset'))
           history.push('/signin')
    }
  },[dispatch, history])
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
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/create">
        <CreatePost/>
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/sharedpost/:postId">
        <Post/>
      </Route>
      <Route path="/myfollowingpost">
        <SubscribedUserPosts />
      </Route>
      <Route exact path="/reset">
        <Reset/>
      </Route>

    </Switch>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
