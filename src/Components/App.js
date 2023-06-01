import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React from 'react';
import axios from "axios";
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Buffer} from 'buffer';
import { Container, Row, Col } from 'react-bootstrap';

//im fairly certain that I'm supposed to do this to be safe, but im unsure why
//if you are someone from the future please help
import secrets from "../secrets.json";


export class App extends React.Component{
  constructor(props){
    super(props);

    //images holds a list of all generated images, after they ahve been generated
    //based on what currentState is, the page shows different things (loading, no images, some images)
    this.state = {
      img : null,
      images: [],
      currentState: "new",
      prompt:""
    };

    this.generateData = this.generateData.bind(this);
    this.onChangePrompt = this.onChangePrompt.bind(this);
  }

  async generateData(event){
    event.preventDefault();
    if(this.state.prompt == "" || this.state.currentState == "loading"){
      return;
    }

    //since calling for data takes a while, the state is set to be loading the images
    this.setState({currentState: "loading"})

    //this is the main generation of the images
    //makes a request to the back end, which actually hanldes everything
    //after, the backend sends here the images that were generted based on the prompt.
    await axios.post(secrets["dalle-gpt-call-link"], {"prompt": this.state.prompt})
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

  /*
  componentDidMount(){
    //this is msotly for testing purposes to see if the front end can communicate with the backend
    axios.get("http://localhost:5000/power/power")
    .then(res => {
      this.setState({images:res.data.images});
    })
    .catch(
      //lol i currently have nothing in case it fails
    )
  }
  */

  onChangePrompt(e){
    this.setState({prompt:e.target.value});
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
      <Container style = {{padding: 0, margin:0}}>
        <Row style = {{width : "101.3%", height : "100%", margin: 0}}>
          <Col className = "contentCol" >
            {firstCol}
          </Col>
          <Col className = "contentCol" >
            {secondCol}
          </Col>
        </Row>
      </Container>
    </div>);

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
    let BottomTextBox = (
    <div className = "inputBox">
    <Form className = "inner">
      <Form.Group className = "textBox">
        <Form.Control placeholder="Enter Prompt" onChange = {this.onChangePrompt} className = "preventColorChange" onSubmit={this.generateData}/>
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
    //currently in a testing phase, later will need to do an api call for the history components
    let testingHistoryComponents = ["Gaming Images", "powerful images", "testing testing testing"]
    let HistoryComponents = []
    //this is the white line that borders between each component
    let whiteLine = (<div style = {{"width":"40%", "height": "1px", "backgroundColor":"#FFFFFF", "margin": "none", "padding": "none"}} />)
    for(let i= 0; i < 3; i++){
      
      HistoryComponents.push(<div style = {{"display":"flex", "align-items": "center", "flex-direction":"column", "width":"100%"}}>
          <div className = "verticalAlign">
            <div className = "historyComponent">
              <h3>{testingHistoryComponents[i]}</h3>
            </div>
          </div>
          {whiteLine}
        </div>
      );
    }
    //the leftside holds the past chats as well as the profile information on the bottom left
    let LeftSide = (
      <div className = "leftSideBox">
        <div className = "topLeftHistoryBox">
          <h1>History</h1>
        </div>
        <div style = {{"width":"100%", "height": "2px", "backgroundColor":"#FFFFFF", "margin": "none", "padding": "none"}} />
        <div className = "chatHistory">
          {HistoryComponents}

        </div>

        <div className = "profileInfo">

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
