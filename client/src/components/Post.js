import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../App'
import {Link} from 'react-router-dom'
import {useParams} from 'react-router-dom'
import deletelogo from "./imgs/delete.png";
import {Card, ListGroup, ListGroupItem, Row, Col} from "react-bootstrap"
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { FilledHeartIcon , HeartIcon , CommentIcon} from "./Icons";
const Post  = ()=>{
    const [data,setData] = useState(null)

    const [comment,setComment] = useState("")
    const {state} = useContext(UserContext)
    const {postId} = useParams()
    console.log(postId);

    useEffect(()=>{
       fetch(`/post/${postId}`,{
           headers:{
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           }
       }).then(res=>res.json())
       .then(result=>{
         console.log(result);
           setData(result.post)
       })
    },[postId, data])

    const likePost = (id)=>{
          fetch('/like',{
              method:"put",
              headers:{
                  "Content-Type":"application/json",
                  "Authorization":"Bearer "+localStorage.getItem("jwt")
              },
              body:JSON.stringify({
                  postId:id
              })
          }).then(res=>res.json())
          .then(result=>{
            setData(result)
          }).catch(err=>{
              console.log(err)
          })
    }
    const unlikePost = (id)=>{
          fetch('/unlike',{
              method:"put",
              headers:{
                  "Content-Type":"application/json",
                  "Authorization":"Bearer "+localStorage.getItem("jwt")
              },
              body:JSON.stringify({
                  postId:id
              })
          }).then(res=>res.json())
          .then(result=>{
            //   console.log(result)
            setData(result)
          }).catch(err=>{
            console.log(err)
        })
    }

    const makeComment = (text,postId)=>{
          fetch('/comment',{
              method:"put",
              headers:{
                  "Content-Type":"application/json",
                  "Authorization":"Bearer "+localStorage.getItem("jwt")
              },
              body:JSON.stringify({
                  postId,
                  text
              })
          }).then(res=>res.json())
          .then(result=>{
              console.log(result)
            setData(result)
          }).catch(err=>{
              console.log(err)
          })
    }

    const deletePost = (postid)=>{
        fetch(`/deletepost/${postid}`,{
            method:"delete",
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            setData(null)
        })
    }
   return  (
     <div style={{paddingTop: "55px"}} className="home">
     {data ? (
       <>
       <Card className="home-card" key={data._id}>
           <Card.Body style={{paddingTop: "0px", paddingLeft: "0px", paddingRight: "0px", paddingBottom: "0px"}}>
             <Card.Header style={{padding:"5px"}}>
               <Row>
                 <Col>
                   <Link to={data.postedBy._id !== state._id?"/profile/"+data.postedBy._id :"/profile"  }>
                     <h6 style={{marginBottom: "0px"}}>{data.postedBy.name}</h6>
                   </Link>
                 </Col>
                 <Col>
                   {
                   data.postedBy._id === state._id && <i style={{
                       float:"right"
                   }}
                   onClick={()=>deletePost(data._id)
                   }
                   ><img
                     style={{
                       width: "24px",
                       height: "24px",
                       objectFit: "cover",
                       borderRadius: "12px",
                       cursor: "pointer"
                     }}
                     src={deletelogo}
                     alt="deletelogo"
                   /></i>
                   }
                 </Col>
               </Row>
             </Card.Header>
           </Card.Body>
         <Card.Img variant="top" src={data.photo} />
            <Card.Body style={{paddingTop: "10px", paddingLeft: "10px", paddingRight: "10px", paddingBottom: "5px"}}>
              <Row>
                <Col style={{ paddingLeft: "15px", paddingRight: "10px"}} sm={1}>
                  {
                  data.likes.includes(state._id)
                  ?
                   <i onClick={()=>{unlikePost(data._id)}}
                    ><FilledHeartIcon/></i>
                  :
                  <i onClick={()=>{likePost(data._id)}}
                  ><HeartIcon/></i>
                  }
                </Col>
                <Col style={{ paddingLeft: "5px"}} sm={9}>
                  <Card.Text>{data.likes.length}</Card.Text>
                </Col>

              </Row>
            </Card.Body>
          <Card.Body style={{paddingTop: "5px", paddingLeft: "10px", paddingRight: "10px", paddingBottom: "5px"}}>
            <Card.Title>{data.title}</Card.Title>
            <Card.Text>{data.body}</Card.Text>
          </Card.Body>
          <ListGroup className="list-group-flush">
          {
              data.comments.map(record=>{
                  return(
                  <ListGroupItem style={{paddingTop: "5px", paddingLeft: "10px", paddingRight: "10px", paddingBottom: "5px"}} key={record._id}>
                    <span style={{fontWeight:"500", marginRight: "5px"}}>{record.postedBy.name}</span>
                    {record.text}
                  </ListGroupItem>
                  )
              })
          }
        </ListGroup>

            <Card.Body style={{paddingTop: "10px", paddingLeft: "10px", paddingRight: "10px", paddingBottom: "10px"}}>
              <form onSubmit={(e)=>{
                  e.preventDefault()
                  makeComment(comment,data._id)
                  setComment("")
              }}>
              <Row>
                <Col style={{paddingTop: "3px", paddingLeft: "15px", paddingRight: "12px"}} sm={1}>
                  <CommentIcon/>
                </Col>
                <Col style={{paddingLeft: "10px", paddingRight: "10px"}} sm={9}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Add a comment"
                    value={comment}
                    onChange={(e)=>setComment(e.target.value)}
                 />
                </Col>
                <Col style={{paddingLeft: "0px", paddingRight: "12px"}} sm={2}>
                  <input
                    type="submit"
                    className="form-control btn btn-outline-success"
                    value="Post"
                  />
                </Col>
              </Row>
              </form>
            </Card.Body>
         </Card>
         </>
     ) : (
       <>
        Loading...
       </>
     )
     }
       </div>
   )
}


export default Post
