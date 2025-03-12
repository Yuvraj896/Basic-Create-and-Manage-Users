const express = require('express') 
const app = express()
const path = require('path')
const userModel = require('./models/user')

app.set("view engine","ejs")
app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.use(express.static(path.join(__dirname, "public")))

app.get('/', function(req,res){
    res.render("index")
})

app.get('/read', async function(req,res){
    let users = await userModel.find()
    res.render('read', {users})
})

app.get('/edit/:userid', async function(req,res){
    let user = await userModel.findOne({_id : req.params.userid})
    res.render('edit', {user})
})

app.post('/update/:userid', async function(req,res){
    let {imageurl, email ,name} = req.body
    let user = await userModel.findOneAndUpdate({_id : req.params.userid},{imageurl, name, email}, {new:true})
    res.redirect("/read")
})

app.get('/delete/:id', async function(req,res){
    let delUser = await userModel.findOneAndDelete({_id : req.params.id})
    res.redirect("/read")
})

app.post('/create', async function(req,res){
    let {name , email, imageurl} = req.body
    let createdUser = await userModel.create({
        name,
        email,
        image : imageurl
    });

    res.redirect("/read")
    console.log(createdUser);
})

app.listen(3000)