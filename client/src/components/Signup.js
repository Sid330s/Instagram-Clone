import React,{useState} from 'react'
import {Link,useHistory} from 'react-router-dom'
import { FormWrapper } from "./authcard";
import logo from "./imgs/images.png";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()

const SignUp  = ()=>{
    const history = useHistory()
    const [name,setName] = useState("")
    const [password,setPasword] = useState("")
    const [email,setEmail] = useState("")
    const uploadFields = async (e) =>{
      e.preventDefault();
        if(!/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(email)){
             return toast('INVALID EMAILID',{position: toast.POSITION.TOP_LEFT});
        }
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email,
                pic:"https://res.cloudinary.com/dbk3dftmx/image/upload/v1625901209/defaultpic_ydudez.jpg"
            })
        }).then(res=>res.json())
        .then(data=>{
           if(data.error){

              return toast(data.error,{position: toast.POSITION.TOP_LEFT})
           }
           else{

                toast("SIGNUP SUCCESSFUL",{position: toast.POSITION.TOP_LEFT})
               history.push('/signin')
           }
        }).catch(err=>{
            console.log(err)
        })
    }

   return (

    <div className="container">
      <FormWrapper onSubmit={uploadFields}>
         <form>
               <img style={{width: "280px", height: "70px"}} className="form-group" src={logo} alt="logo" />
               <div className="form-group">
                 <h6 className = "p-1 text-left">Name</h6>
                   <input
                     type="text"
                     className="form-control"
                     placeholder="John Wick"
                     value={name}
                     onChange={(e)=>setName(e.target.value)}
                  />
               </div>

               <div className="form-group">
                   <h6 className="p-1 text-left">Email</h6>
                     <input
                     type="email"
                     className="form-control"
                     placeholder="johnwick@gmail.com"
                     value={email}
                     onChange={(e)=>setEmail(e.target.value)}
                     />
               </div>

               <div className="form-group">
                   <h6 className="p-1 text-left">Password</h6>
                     <input
                       type="password"
                       className="form-control"
                       placeholder="Enter password"
                       value={password}
                       pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
                       title="Must contain at least 1 number, 1 uppercase, and at least 6 or more characters"
                       onChange={(e)=>setPasword(e.target.value)}
                     />
               </div>

               <button type="submit" className="btn btn-primary">Sign Up</button>
               <div className="form-group">
                 <p className="forgot-password text-center">
                   Don't have an account? <Link to="/signin">Sign In</Link>
                 </p>
               </div>
       </form>
       </FormWrapper>
 </div>
   )
}


export default SignUp;
