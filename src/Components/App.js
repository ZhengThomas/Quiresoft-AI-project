import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React from 'react';
import axios from "axios";
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Buffer} from 'buffer';
import { Container, Row, Col } from 'react-bootstrap';
import jwt_decode from "jwt-decode";


//im fairly certain that I'm supposed to do this to be safe, but im unsure why
//if you are someone from the future please help
import secrets from "../secrets.json";


//So app covers post the post generator and the chatbot
//im fairly certain this is a stupid way of doing things but im not very smart
export class App extends React.Component{
  constructor(props){
    super(props);

    //images holds a list of all generated images, after they ahve been generated
    //based on what currentState is, the page shows different things (loading, no images, some images)
    this.state = {
      img : null,
      images: [],
      currentState: "new",
      prompt:"",
      loggedIn:false,
      type :"post",
      pastChats : []
    };

    this.generatePostData = this.generatePostData.bind(this);
    this.onChangePrompt = this.onChangePrompt.bind(this);
    this.generateData = this.generateData.bind(this);
    this.generateChatData = this.generateChatData.bind(this);
  }

  async generateData(e){
    e.preventDefault();
    if(this.state.type == "post"){
      this.generatePostData(e);
    }
    else if (this.state.type == "chat"){
      this.generateChatData(e);
    }
  }

  testToken(){

    const token = sessionStorage.getItem('token');
    console.log("got here")
    if (token !== null && token !== ""){
      var decodedToken = jwt_decode(token);
      console.log(decodedToken)
      console.log("DECODED TOKEN ^")
      var currTime =  Date.now() / 1000
      console.log(currTime)

      console.log(decodedToken.exp)
      if (currTime > decodedToken.exp){
        return "expired token";
      } else {
        return "valid token"
      }
      //Add else statement sayiing what to do if verified correctly.
    } 
    else {
      return "no token";
    }
  }

  async generatePostData(event){

    if(this.state.prompt == "" || this.state.currentState == "loading"){
      return;
    }
    
    //if token is bad, then we send you to the login page
    let tokenResult = this.testToken();
    if(tokenResult == "expired token" || tokenResult == "no token"){
      //TODO - create a popup for the token
      //currently this is a stopgap measure
      window.location.href = "/login";
      return;
    }


    if(this.state.securityToken == "" || !this.state.loggedIn){
      this.setState({currentState:"login"});
    }

    //since calling for data takes a while, the state is set to be loading the images
    this.setState({currentState: "loading"});

    //this is the main generation of the images
    //makes a request to the back end, which actually hanldes everything
    //after, the backend sends here the images that were generted based on the prompt.
    await axios.post(secrets["dalle-gpt-call-link-long"], {"prompt": this.state.prompt, "token":this.state.securityToken})
    .then(res => {
      console.log(res.data);

      let finalState = []
      for(let i = 0; i < res.data.length; i++){
        finalState.push(res.data[i].url);
      }
      this.setState({images:finalState, currentState:"finished"});
    })
    .catch(err => {
      this.setState({currentState:"failed"});
      console.log(err);
    });

  }
 

  
  async generatePostData(event){

    if(this.state.prompt == "" || this.state.currentState == "loading"){
      return;
    }
    
    //if token is bad, then we send you to the login page
    let tokenResult = this.testToken();
    if(tokenResult == "expired token" || tokenResult == "no token"){
      //TODO - create a popup for the token
      //currently this is a stopgap measure
      window.location.href = "/login";
      return;
    }


    if(this.state.securityToken == "" || !this.state.loggedIn){
      this.setState({currentState:"login"});
    }

    //since calling for data takes a while, the state is set to be loading the images
    this.setState({currentState: "loading"});

    //this is the main generation of the images
    //makes a request to the back end, which actually hanldes everything
    //after, the backend sends here the images that were generted based on the prompt.
    await axios.post(secrets["dalle-gpt-call-link-long"], {"prompt": this.state.prompt, "token":this.state.securityToken})
    .then(res => {
      console.log(res.data);

      let finalState = []
      for(let i = 0; i < res.data.length; i++){
        finalState.push(res.data[i].url);
      }
      this.setState({images:finalState, currentState:"finished"});
    })
    .catch(err => {
      this.setState({currentState:"failed"});
      console.log(err);
    });

  }

  async generateChatData(e){
    console.log("chat")
    
    if(this.state.prompt == "" || this.state.currentState == "loading"){
      return;
    }

    const tokenResult = this.testToken();
    if(tokenResult == "no token" || tokenResult == "expired token"){
      //TODO - add a popup to make the user login
      //stopgap blah blah blah
      window.location.href = "/login";
      return;
    }

    let toAdd = this.state.pastChats;
    //TODO - change the username to the actual username
    toAdd.push({"speaker":"username", "text":this.state.prompt});
    this.setState({pastChats:toAdd, prompt:"", currentState:"waiting"});

    axios.post(secrets["straight-gpt-call"], {"prompt": this.state.prompt, "token":this.state.securityToken})
    .then((res) => {
      let toAdd = this.state.pastChats;
      toAdd.push({"speaker": "chatGPT", "text":res.data[0].text});
      this.setState({pastChats:toAdd, currentState:"new"});
      return;
    })
    .catch((err) => {
      console.log("error in axios call for chat");
    })
  }

  
  componentDidMount(){

    let secToken = window.sessionStorage.securityToken;
    let secTokenExpiry = window.sessionStorage.securityTokenTime;
    if(secToken == null){
      secToken = "";
    }
    //sec token hasnt expired (unreliable, as if time on computer is changed then it might give bad time)
    //logggedIn defaults to false
    if(secTokenExpiry < Date.now()){
      this.setState({"loggedIn":true});
    }

    //yeah i know, i wrote the code assuming id get a token inside the state
    //since at the time i didnt fully understand where id be storing them
    this.setState({securityToken:secToken, securityTime:secTokenExpiry});
  }

  onChangePrompt(e){
    this.setState({prompt:e.target.value});
  }

  changeTo(e, which){
    e.preventDefault();
    this.setState({"type":which});
  }

  addBreaks(text){
    let splitText = text.split("\n")
    let finishedObject;
    for(let i = 0; i < splitText.length; i++){
      
    }
  }

  //TODO - everything looks like shit
  //follow the mockup online or make up your own stuff.
  render(){
    //based on the number of images that the backend sends to the front end, we store more images
    //im pretty sure dalle sends 4

    
    let images = []
    for(let i = 0; i < this.state.images.length; i++){
      //console.log(this.state.images[i])
      images.push(<img src = {this.state.images[i]} className = "contentImage"></img>);
    }
    
    let firstCol = []
    let secondCol = []
    for(let i = 0; i < Math.floor(images.length / 2); i++){
      firstCol.push(images[i]);
    }
    for(let i = Math.floor(images.length/2); i < images.length; i++){
      secondCol.push(images[i]);
    }
    
    //this is the images above the text box. This could be empty, if there are no images at all
    //TODO - Figure out how to use react col, so i cant set the sm = {6} to work
    //in other words, make it responsive to the size of the webpage
    let Content = (<div className = "contentBox">
      <Container className = "contentContainer">
        <Row style = {{width : "100", height : "100%", margin: 0}}>
          <Col className = "contentCol" >
            {firstCol}
          </Col>
          <Col className = "contentCol" >
            {secondCol}
          </Col>
        </Row>
      </Container>
    </div>);

    if(this.state.type == "chat"){
      //this content holds all the past texts
      //the way i styled it is heavilty inspired by discord
      let allTexts = [];
      for(let i = this.state.pastChats.length - 1; i >= 0; i--){
        allTexts.push(<div className = "textContainer">
          <div className = "profilePicContainer" >
            <img src = {`/images/test1.png`} className = "profilePicImage"></img>
          </div>
          <div className = "textArea">
            <div className = "titleText"><p>{this.state.pastChats[i].speaker}</p></div>
            <div className = "contentText">
              {this.state.pastChats[i].text}
            </div>
          </div>
        </div>)
      }
      Content = (<div className = "chatGptText">
        <div className = "realGptText">
          {allTexts}
        </div>
      </div>)
    }

    if(this.state.currentState == "loading"){
      Content = 
      (<div className = "loadingBox">
        <img src = {`/images/loading.png`} className = "loadingImage" style = {{transform: "rotate(39deg)", animation: `spin ${0.9}s linear infinite`}}/>
      </div>
      )
    }

    if(this.state.currentState == "failed"){
      Content = 
      (<div className = "loadingBox">
        <h1 className = "errorText">Loading of images failed. Please try again</h1>
      </div>
      )
    }

    //this is the textBox on the bottom, along with the button
    //TODO - change the fucking button. How do I put it into the textbox???? and make it a triangle?????
    //this ^ is honestly a fair bit low priority it looks ok
    let BottomTextBox = (
    <div className = "inputBox">
    <Form className = "inner" onSubmit={this.generateData}>
      <Form.Group className = "textBox">
        <Form.Control placeholder="Enter Prompt" onChange = {this.onChangePrompt} className = "preventColorChange" onSubmit={this.generateData} value = {this.state.prompt}/>
      </Form.Group>
      <Button id = "button" onClick = {this.generateData} className = "preventColorChange">
        Submit
      </Button>
    </Form>
    </div>
    );

    //the rightside holds both the searchbar as well as the actual content of the chat
    //combination of above BottomTextBox and Content
    let RightSide = (<div className = "rightSideBox">
      {Content}
      {BottomTextBox}

    </div>);

    
    //each little piece of history displayed on the left side
    //will be put into below LeftSide
    //This area used to be a hisotry bar, but it was changed, so there may be some things that are named weirdly

    //this is the white line that borders between each button component
    let whiteLine = (<div style = {{"width":"40%", "height": "1px", "backgroundColor":"#FFFFFF", "margin": "none", "padding": "none"}} />)
    let chatbotButton = (
    <div style = {{"display":"flex", "align-items": "center", "flex-direction":"column", "width":"100%"}}>
    <div className = "verticalAlign" onClick = {(e) => {this.changeTo(e, "chat")}}>
      <div className = "navigationComponent">
        <h3>Chat Bot</h3>
      </div>
    </div>
    {whiteLine}
    </div>);

    let imageGenButton = (
    <div style = {{"display":"flex", "align-items": "center", "flex-direction":"column", "width":"100%"}}>
    <div className = "verticalAlign" onClick = {(e) => {this.changeTo(e, "posts")}}>
      <div className = "navigationComponent">
        <h3>Post Generator</h3>
      </div>
    </div>
    </div>);
    //the leftside holds the past chats as well as the profile information on the bottom left
    let LeftSide = (
      <div className = "leftSideBox">
        <div className = "topLeftInfoBox" style = {{height:"9%"}}>
          <h1>{this.state.type == "post" ? "Post Generator" : "Chat Bot"}</h1>
        </div>

        <div style = {{"width":"100%", "height":"81%"}}>
          <div style = {{"width":"100%", "height": "2px", "backgroundColor":"#FFFFFF", "margin": "none", "padding": "none"}} />
          <div className = "navbarArea">
            {chatbotButton}
            {imageGenButton}
          </div>
        </div>

        <div style = {{"width":"100%", "height": "2px", "backgroundColor":"#FFFFFF", "margin": "none", "padding": "none"}} />

        <div className = "profileInfo" style = {{height:"9.4%"}}>
          <Container className = "profileContainer" style = {{padding:"0.5vh"}}>
            <Row style = {{margin: 0}} className = "profileSection">
              <Col md = {3} className = "profileImageHolder">
                <img src = {`/images/test1.png`} className = "contentImage"></img>
              </Col>
              <Col md = {9} className = "profileTextHolder">
                <div className = "text">
                  profileNamebutverylong
                </div>
              </Col>
            </Row>
          </Container>
        </div>

      </div>
    )
    
    return(
      <div className = "fullApp">
        {LeftSide}
        {RightSide}
      </div>
    );
  }
}

export default App;
