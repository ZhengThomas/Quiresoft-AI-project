import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import "./LoginPage.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import axios from "axios";

//Because of how similar the register page looks like to the login page, they will share the same css

export class RegisterPage extends React.Component{
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
    e.preventDefault();

    console.log(this.state);
    this.setState({failed:true});
    

    //TODO - when the backend actually has functionality with logging in, fix this current axios call
    axios.post("http://localhost:5000/api/register", {"pass": this.state.password, "email":this.state.email})
    .then((res) => {
        console.log(res)
        
        if(res.data != false){
          console.log(res.data)
          console.log("RES")
          window.sessionStorage.token = res.data;
          console.log("Success");
          console.log(window.sessionStorage.token)
          //set page to be the actual app
          window.location.href = "/";

        }
        else{
            this.setState({failed:true});
        }
        
    })
    .catch((res) =>{
        //TODO - add a failstate where it tells you it couldnt contact server.
        //This fail is different than if the username/password already exists
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
    //TODO - add a logo or something
    let actualLogin = (<div className = "actualLogin">
        <div className = "logo"></div>
        
        <div className= "loginBox">
            
            <div className = "titleSection">
                <h1>Register</h1>
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
                        Create Account
                    </Button>
                    <div className = "signUp" onClick={() => {window.location = "/login"}}>
                        Sign In
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