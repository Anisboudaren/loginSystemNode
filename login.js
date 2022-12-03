const mysql = require("mysql");
const express = require("express");
const session = require("express-session");
const path = require("path");


const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root' ,
    password : 'anis2002',
    database : 'nodelogin'
})

const app = express();
app.use(session({
    secret : 'secret',
    resave : true, 
    saveUninitialized : true
}));
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(express.static(path.join(__dirname , 'static')));

app.get('/' , (req , res) => {
    res.sendFile(path.join(__dirname , 'login.html'));
});//get

app.post('/auth' , (req , res)=>{
    const {username , password} = req.body;

    if (username && password) {
        connection.query("SELECT * FROM accounts WHERE username = ? AND password= ?" , [username , password] , (err , results , fields)=>{

            if (err )  throw err;
            if(results.length > 0){
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('/home');
            }    else{
                res.send('incorrect username / password')
            }
            res.end()
            
        })
    } else{
        res.send('please re enter username and password')
        res.end();
    }
})//post

app.get('/home', function(request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		// Output username
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		// Not logged in
		response.send('Please login to view this page!');
	}
	response.end();
});

app.listen(3000 , ()=>{
    console.log("server is runnning at port 3000");
});//listen