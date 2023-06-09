
const express = require('express');
const router = express.Router();
const Model = require('./../model/model');
var jwt = require('jsonwebtoken');
const { useReducer } = require('react');
const { default: userEvent } = require('@testing-library/user-event');

const {bcrypt} = require('bcrypt')
require('dotenv').config()
module.exports = router;

//post request username and password
router.post('/register', async (req, res) => {
    console.log("ASD")

    
    try{
        const {pass, email} = req.body;
        const checkDupes = await Model.findOne({ email})

        if (checkDupes){    
            return res.status(409).send("User Already Exist. Please Login");
        }
        console.log("Data Saved")

        const user = await Model.create({
            email: email.toLowerCase(),
            pass: pass,
        })
        console.log('created')

        const token = jwt.sign(
        { user_id: user._id, email},
        process.env.TOKEN_KEY,
        {
            expiresIn: "2h",
        }
        );
        console.log("token saved")
        user.token = token;

        res.status(201).json(user)

    }
    catch(error){
        res.status(400).json({message: error.message})

    }
})



//this is the post request that handles logging in. Checks username exists and password is right
router.post("/verifyUser", async (req, res) => {
    console.log("HERE")
    try{
        console.log("F")

        const {pass, email} = req.body;
        const verifyData = await Model.find({pass: pass, email: email})
        console.log(verifyData.length)
        if (verifyData.length == 1){
            const token = jwt.sign(
                { user_id: verifyData._id, email},
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );
            console.log(token)       
            res.status(201).json(token)
        } else {
            res.status(200).json(false)
        }

    } catch(error){
        res.status(400).json({message: error.message})
    }
  
  });



router.get('/getAll', (req, res) => {
    res.send('Get All API')
})

router.get('/getOne/:id', (req, res) => {
    res.send(req.params.id)
})

router.patch('/update/:id', (req, res) => {
    res.send('Update by ID API')
})

router.delete('/delete/:id', (req, res) => {
    res.send('Delete by ID API')
})


