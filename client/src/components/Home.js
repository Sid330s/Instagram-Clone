import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../App'
import {Link} from 'react-router-dom'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { FilledHeartIcon , HeartIcon , CommentIcon} from "./Icons";
import deletelogo from "./imgs/delete.png";
import {Card, ListGroup, ListGroupItem, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import {WhatsappShareButton, WhatsappIcon,FacebookShareButton, FacebookIcon,EmailShareButton,EmailIcon} from "react-share";
import classes from './WhatsAppStyles';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import copylogo from './imgs/copy.png';

const Home  = ()=>{
    const [data,setData] = useState([])
    const [comment,setComment] = useState("")
    const {state} = useContext(UserContext)
    useEffect(()=>{
       fetch('/allpost',{
           headers:{
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           }
       }).then(res=>res.json())
       .then(result=>{
           console.log(result)
           setData(result.posts)
       })
    },[data])

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
                   //   console.log(result)
            const newData = data.map(item=>{
                if(item._id===result._id){
                    return result
                }else{
                    return item
                }
            })

            setData(newData)
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
            const newData = data.map(item=>{
                if(item._id===result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
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
              const newData = data.map(item=>{
                if(item._id===result._id){
                    return result
                }else{
                    return item
                }
             })
            setData(newData)
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
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
        })
    }
   return (
       <div style={{paddingTop: "55px"}} className="home">
           {
               data.map(item=>{
                return(
                <Card className="home-card" key={item._id}>
                    <Card.Body style={{paddingTop: "0px", paddingLeft: "0px", paddingRight: "0px", paddingBottom: "0px"}}>
                      <Card.Header style={{padding:"5px"}}>
                        <Row>
                          <Col>
                            <Link to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id :"/profile"  }>
                              <h6 style={{marginBottom: "0px"}}>{item.postedBy.name}</h6>
                            </Link>
                          </Col>
                          <Col>
                            {
                            item.postedBy._id === state._id && <i style={{
                                float:"right"
                            }}
                            onClick={()=>deletePost(item._id)
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
                  <Card.Img variant="top" src={item.photo} />
                     <Card.Body style={{paddingTop: "10px", paddingLeft: "10px", paddingRight: "10px", paddingBottom: "5px"}}>
                       <Row>
                         <Col style={{ paddingLeft: "15px", paddingRight: "10px"}} sm={1}>
                           {
                           item.likes.includes(state._id)
                           ?
                            <i onClick={()=>{unlikePost(item._id)}}
                             ><FilledHeartIcon/></i>
                           :
                           <i onClick={()=>{likePost(item._id)}}
                           ><HeartIcon/></i>
                           }
                         </Col>
                         <Col style={{ paddingLeft: "5px"}} sm={8}>
                           <Card.Text>{item.likes.length}</Card.Text>
                         </Col>
                         <Col sm={2}>
                           <DropdownButton id="dropdown-basic-button" title="Share">
                             <Dropdown.Item>
                               <CopyToClipboard text={`http://localhost:3000/sharedpost/${item._id}`}>
                                 <span>
                                   <img
                                   className={classes.socialMediaButton}
                                   src={copylogo}
                                   alt="copylogo"
                                   />
                                 Copy Link
                               </span>
                               </CopyToClipboard>

                               </Dropdown.Item>
                               <Dropdown.Item>
                               <WhatsappShareButton
                                 url={`http://localhost:3000/sharedpost/${item._id}`}
                                 title={"Hey look at this amazing post"}
                                 separator=" "
                                 className={classes.socialMediaButton}
                               > <WhatsappIcon size={25} /> WhatsApp
                               </WhatsappShareButton>
                               </Dropdown.Item>
                               <Dropdown.Item>
                               <EmailShareButton
                                 url={`http://localhost:3000/sharedpost/${item._id}`}
                                 subject={"Hey look at this amazing post"}
                                 body={"Your friend found this post intresting..."}
                                 separator=" "
                                 className={classes.socialMediaButton}
                               > <EmailIcon size={25} /> Email
                               </EmailShareButton>
                               </Dropdown.Item>
                               <Dropdown.Item>
                               <FacebookShareButton
                                 url={`http://localhost:3000/sharedpost/${item._id}`}
                                 quote={"Hey look at this amazing post"}
                                 hashtag="#InstaClone"
                                 className={classes.socialMediaButton}
                               > <FacebookIcon size={25} /> Facebook
                               </FacebookShareButton>
                               </Dropdown.Item>
                           </DropdownButton>

                         </Col>
                       </Row>
                     </Card.Body>
                   <Card.Body style={{paddingTop: "5px", paddingLeft: "10px", paddingRight: "10px", paddingBottom: "5px"}}>
                     <Card.Title>{item.title}</Card.Title>
                     <Card.Text>{item.body}</Card.Text>
                   </Card.Body>
                   <ListGroup className="list-group-flush">
                   {
                       item.comments.map(record=>{
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
                           makeComment(comment,item._id)
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
                )
            })
           }


       </div>
   )
}


export default Home
