const express = require('express')
const cors = require('cors')
const app = express()
const fs = require('fs')
const path = require('path')
const compression = require('compression')
const serverless = require('serverless-http');




//middleware
app.use(express.json())
app.use(compression())
app.use(cors())



const dataPath = path.join(__dirname,'data','post.json')

//routes

app.get('/', (req,res)=>{
    res.send("This is Home!")
})

app.get('/api/posts',(req,res)=>{
    res.setHeader('Content-Type','application/json');
    const readStream = fs.createReadStream(dataPath)
    readStream.pipe(res);
        readStream.on('error', (err) => {
        console.error("Stream error:", err);
        res.status(500).send("Server Error");
    });
})


app.get('/api/posts/:id', (req,res)=>{
    const ID = Number(req.params.id)
    fs.readFile(dataPath, 'utf8', (err,data)=>{
        if (err) throw err;
        try{
            const posts = JSON.parse(data)
            const post = posts.find(post => post.postId === ID)
            res.json(post)
        }catch(err){
            res.send(err)
        }
    })
})


module.exports = app;
module.exports.handler = serverless(app);
