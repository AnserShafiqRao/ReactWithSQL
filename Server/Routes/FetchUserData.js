const express = require('express')
const Fetching = express.Router();

const db  = require('../Database');



Fetching.get('/fetchuser/:UserName',(req,res) =>{
    const UserName = req.params.UserName;
    const fetchUser = `SELECT * FROM usersData WHERE USERNAME = ?`;

    db.query(fetchUser, [UserName], (err,result) =>{
        if(err){
            console.log(`No user with UserName: ${UserName}`)
            return res.status(500).json(null).send('No User Found');
        }
        res.status(200).json(result);
    })
})


module.exports = Fetching;