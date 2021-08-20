import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../App'
import {useParams} from 'react-router-dom'
import {Row, Col, Container, Image} from 'react-bootstrap';
const Profile  = ()=>{
    const [userProfile,setProfile] = useState(null)

    const {state,dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const [showfollow,setShowFollow] = useState(state?!state.following.includes(userid):true)
    useEffect(()=>{
       fetch(`/user/${userid}`,{
           headers:{
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           }
       }).then(res=>res.json())
       .then(result=>{
           //console.log(result)

            setProfile(result)
       })
    },[userid])


    const followUser = ()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{

            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
             setProfile((prevState)=>{
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:[...prevState.user.followers,data._id]
                        }
                 }
             })
             setShowFollow(false)
        })
    }
    const unfollowUser = ()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{

            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))

             setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item !== data._id )
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:newFollower
                        }
                 }
             })
             setShowFollow(true)

        })
    }
   return (
       <>
       {userProfile ?

         <div style={{maxWidth:"550px",margin:"0px auto"}}>
             <div style={{borderBottom:"1px solid grey", paddingTop: "100px"}}>
             <div style={{display:"flex", justifyContent:"space-around"}}>
             <Container>
               <Row>
                 <Col sm={7}>
                   <Image style={{width: "200px", height:"200px"}} src={userProfile.user.pic} roundedCircle />
                 </Col>
                 <Col sm={5} style={{top:"20px"}} >
                   <h4>{userProfile.user.name}</h4>
                   <h5>{userProfile.user.email}</h5>
                     <h6>{userProfile.posts.length} posts</h6>
                     <h6>{userProfile.user.followers.length} followers</h6>
                     <h6>{userProfile.user.following.length} following</h6>
                 </Col>
               </Row>
               {showfollow?
               <button style={{
                   margin:"10px"
               }} className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick={()=>followUser()}
                >
                    Follow
                </button>
                :
                <button
                style={{
                    margin:"10px"
                }}
                className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick={()=>unfollowUser()}
                >
                    UnFollow
                </button>
                }
             </Container>
           </div>
         </div>
         <div style={{paddingTop: "25px"}} className="gallery">
             {
                 userProfile.posts.map(item=>{
                     return(
                       <Image style={{width: "250px", height:"200px"}} key={item._id} src={item.photo} alt={item.title} rounded/>
                     )
                 })
             }


         </div>
       </div>
       : <h2>loading...!</h2>}

       </>
   )
}


export default Profile
