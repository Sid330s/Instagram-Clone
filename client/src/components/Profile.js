import React,{useEffect,useState,useContext} from 'react';
import {UserContext} from '../App';
import {Row, Col, Container, Image} from 'react-bootstrap';

const Profile  = ()=>{
    const [mypics,setPics] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [image,setImage] = useState("")
    useEffect(()=>{
       fetch('/mypost',{
           headers:{
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           }
       }).then(res=>res.json())
       .then(result=>{
           console.log(result)
           setPics(result.mypost)
       })
    },[])
    useEffect(()=>{
       if(image){
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


           fetch('/updatepic',{
               method:"put",
               headers:{
                   "Content-Type":"application/json",
                   "Authorization":"Bearer "+localStorage.getItem("jwt")
               },
               body:JSON.stringify({
                   pic:data.url
               })
           }).then(res=>res.json())
           .then(result=>{
               console.log(result)
               localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
               dispatch({type:"UPDATEPIC",payload:result.pic})
               //window.location.reload()
           })

        })
        .catch(err=>{
            console.log(err)
        })
       }
    },[image, dispatch, state])
    const updatePhoto = (file)=>{
        setImage(file)
    }
   return (
       <div style={{maxWidth:"550px",margin:"0px auto"}}>
           <div style={{borderBottom:"1px solid grey", paddingTop: "100px"}}>
           <div style={{display:"flex", justifyContent:"space-around"}}>
           <Container>
             <Row>
               <Col sm={7}>
                 <Image style={{width: "200px", height:"200px"}} src={state?state.pic:"loading"} roundedCircle />
               </Col>
               <Col sm={5} style={{top:"20px"}} >
                 <h4>{state?state.name:"loading"}</h4>
                 <h5>{state?state.email:"loading"}</h5>
                   <h6>{mypics.length} posts</h6>
                   <h6>{state?state.followers.length:"0"} followers</h6>
                   <h6>{state?state.following.length:"0"} following</h6>
               </Col>
             </Row>
           </Container>
           </div>

           <div className="form-group p-3">
             <label for="input1">Update Profile Picture</label>
             <input type="file" className="form-control-file" id="input1" onChange={(e)=>updatePhoto(e.target.files[0])}/>
           </div>

            </div>
           <div style={{paddingTop: "25px"}} className="gallery">
               {
                   mypics.map(item=>{
                       return(
                         <Image style={{width: "270px", height:"200px"}} key={item._id} src={item.photo} alt={item.title} rounded/>

                       )
                   })
               }


           </div>
       </div>
   )
}


export default Profile
