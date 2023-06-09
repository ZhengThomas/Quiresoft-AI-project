import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import "./LoginPage.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import axios from "axios";

export class LoginPage extends React.Component{
  constructor(props){
    super(props);

    this.state = {
        password:"",
        email:"",
        failed:false
    };

    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.submit = this.submit.bind(this);

  }

  onChangeEmail(e){
    this.setState({email:e.target.value});
  }

  onChangePassword(e){
    this.setState({password:e.target.value});
  }

  submit(e){
    console.log(this.state);
    this.setState({failed:true});
    
    //TODO - when the backend actually has functionality with logging in, fix this current axios call
    axios.post("http://localhost:5000/api/verifyUser", {"pass": this.state.password, "email":this.state.email})
    .then((res) => {
        console.log(res)
        
        if(res.data != false){
          window.sessionStorage.token = res.data;
          console.log(window.sessionStorage.token)
          window.location.href = "/";
        }
        else{
            this.setState({failed:true});
        }
        
    })
    .catch((res) =>{
        console.log("asd")
    })
  }

  render(){

    //holds the bottom black stuff, as well as the whitespace below the logjn page
    //TODO - add the copyright thing
    let bottomSide = (<div className = "bottomSideLoginPage">
        <div className = "bottomStuff">

        </div>
    </div>)

    //box that appears when login authentication fails
    //TODO - actually make it, modeled off of github
    let failedBox = (<div className = "failedBox">
        Email or password incorrect
    </div>)
    //this is the centered box for the actual login page, as well as the logo
    //TODO - add a logo or something, and also add a forgot password section
    let actualLogin = (<div className = "actualLogin">
        <div className = "logo"></div>
        
        <div className= "loginBox">
            
            <div className = "titleSection">
                <h1>Sign In</h1>
            </div>
            <div className = "inputSection">
                
                <Form className = "formGroupLogin">

                    <Form.Label className = "label">Email address</Form.Label>
                    <Form.Group className = "textBox">
                        <Form.Control className = "preventColorChange" onChange = {this.onChangeEmail}/>
                    </Form.Group>

                    <Form.Label className = "seperatedLabel">Password</Form.Label>
                    <Form.Group className = "textBox">
                        <Form.Control className = "preventColorChange" type = "password" onChange = {this.onChangePassword}/>
                    </Form.Group>

                    <Button id = "button" className = "preventColorChange" onClick = {this.submit}>
                        Submit
                    </Button>
                    <div className = "signUp" onClick={() => {window.location = "/register"}}>
                        Sign Up
                    </div>

                </Form>
            </div>
        </div>
        {this.state.failed ? failedBox : <div className = "failedBox"></div>} 
    </div>)


    return(
      <div className = "loginPageEntire">
        {actualLogin}
        {bottomSide}
      </div>
    );
  }
}