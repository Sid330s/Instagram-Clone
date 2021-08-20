import React,{useState,useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { FormWrapper } from "./authcard";

const CretePost = ()=>{
    const history = useHistory()
    const [title,setTitle] = useState("")
    const [body,setBody] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")
    useEffect(()=>{
       if(url){
        fetch("/createpost",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                title,
                body,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{

           if(data.error){
              console.log(data.error);
           }
           else{
               history.push('/')
           }
        }).catch(err=>{
            console.log(err)
        })
    }
  },[url, body, title, history])

   const postDetails = async (e)=>{
       e.preventDefault();
       const data = new FormData()
       data.append("file",image)
       data.append("upload_preset","insta-clone")
       data.append("cloud_name","dbk3dftmx")
       fetch("https://api.cloudinary.com/v1_1/dbk3dftmx/image/upload",{
           method:"post",
           body:data
       })
       .then(res=>res.json())
       .then(data=>{
          setUrl(data.url)
       })
       .catch(err=>{
           console.log(err)
       })


   }


   return(
           <div className="container">
             <FormWrapper onSubmit={postDetails}>
                <form>
                      <div className="form-group">
                        <h6 className = "p-1 text-left">Title</h6>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="title"
                            value={title}
                            onChange={(e)=>setTitle(e.target.value)}
                         />
                      </div>

                      <div className="form-group">
                          <h6 className="p-1 text-left">Caption</h6>
                            <input
                            type="text"
                            className="form-control"
                            placeholder="Cool Caption"
                            value={body}
                            onChange={(e)=>setBody(e.target.value)}
                            />
                      </div>
                      <div className="form-group">
                        <h6 className="p-1 text-left">Upload Image</h6>
                        <input type="file" className="form-control-file" id="input1" onChange={(e)=>setImage(e.target.files[0])}/>
                      </div>

                      <button type="submit" className="btn btn-primary">Create Post</button>
              </form>
              </FormWrapper>
        </div>
   )
}


export default CretePost
