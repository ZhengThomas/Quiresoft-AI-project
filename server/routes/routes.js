const express = require('express');
const router = express.Router();
const Model = require('./../model/model');
module.exports = router;

//post request username and password
router.post('/post', async (req, res) => {
    const data = new Model({
        email: req.body.email,
        pass: req.body.pass

    })
    try{
        const saveData = await data.save();
        res.status(200).json(saveData);
    }
    catch(error){
        res.status(400).json({message: error.message})

    }
})

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
