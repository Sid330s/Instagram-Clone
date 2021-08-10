import React,{useContext,useState,useEffect} from 'react'
import {Link ,useHistory} from 'react-router-dom'
import { ExploreIcon } from "./Icons";
import homelogo from "./imgs/home.png";
import pluslogo from "./imgs/plus.png";
import searchlogo from "./imgs/search.png";
import { Navbar, Nav, Container, Button, Dropdown, DropdownButton, Row, Col } from 'react-bootstrap';

const Search=()=>{
  const [query,setQuery] = useState("")
  const [ans,setAns] = useState([])

  useEffect(()=>{
      var temp_q = query
      if(temp_q==="") temp_q="-"
      fetch('/search-users',{
          method:"post",
          headers:{
              "Content-Type":"application/json",
              "Authorization":"Bearer "+localStorage.getItem("jwt")
          },
          body:JSON.stringify({
              query:temp_q
          })
      }).then(res=>res.json())
      .then(result=>{
        setAns(result.user)
        console.log(result)
      }).catch(err=>{
          console.log(err)
      })
    },[query])
  return(
    <Container style={{marginTop: "70px", marginLeft: "560px", width: "30%"}} className="home">
      <Row>
        <Col style={{paddingRight: "0px"}} sm={8}>
          <input
            type="text"
            className="form-control"
            placeholder="Search here.."
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
          />
        </Col>
        <Col style={{paddingLeft: "5px"}} sm={4}>
          <DropdownButton id="dropdown-basic-button" title="Search">
          {
            ans.map(item=>{
             return(
               <Dropdown.Item><Link to={item._id !== state._id?"/profile/"+item._id :"/profile" }>
                 {item.email}</Link></Dropdown.Item>
             )
           }
           )
          }
          </DropdownButton>
        </Col>
      </Row>
    </Container>
  )
}

const NavBar = ()=>{

     const [showSearch, setShowSearch] = useState(false)
     const {state,dispatch} = useContext(UserContext)

     const history = useHistory()
      return(
        <div>
          <Navbar collapseOnSelect fixed='top' expands='sm' style={{backgroundColor: "rgb(114,163,155)"}} variant='light'>
            <Container>
              <Navbar.Toggle aria-controls='responsive-navbar-nav' />
              <Navbar.Collapse id='responsive-navbar-nav'>
                <Nav className="container-fluid">

                <>
                <Nav.Item>
                  <Nav.Link as={Link} to="/signin">Sign In</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
                </Nav.Item>
                </>

                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>

        </div>
    )

}


export default NavBar
