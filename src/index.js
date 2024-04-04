const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const user = require("./logindb");
const exam = require("./examdb");

const app = express();
//convert data into json format
app.use(express.json());

//Cấu hình session
const session = require('express-session');

app.use(session({
 secret: 'your_secret_key',
 resave: false,
 saveUninitialized: true,
 cookie: { secure: false } // Set to true if your app is served over HTTPS
}));

app.use(express.urlencoded({extended: false}));

//Use EJS as view engine
app.set('view engine', 'ejs');
//static file
app.use(express.static("public"));

//Cấu hình route
app.get("/", (req, res) => {
    if (!req.session.loggedIn) {
        res.render("login");
    } else {
        res.render("home");
    }
});

app.get("/login", (req, res) => {
    if (req.session.loggedIn) {
        res.render("home");
    } else {
        res.render("login");
    }
});

app.get("/signup", (req,res) => {
    res.render("signup");
});

app.get("/home", (req,res) => {
    if (req.session.loggedIn) {
        res.render("home");
    } else {
        res.redirect("/login");
    }
});

app.get("/exam", (req,res) => {
    if (req.session.loggedIn) {
        res.render("exam");
    } else {
        res.redirect("/login");
    }
});

app.get("/result", (req,res) => {
    if (req.session.loggedIn) {
        res.render("result");
    } else {
        res.redirect("/login");
    }
});

//Đăng xuất
app.get("/logout", (req, res) => {
    req.session.loggedIn = false;
    res.redirect("/login");
});

//Register user
app.post("/signup", async (req,res) => {
    const { username, email, newpassword, confirmpassword } = req.body;

    if (newpassword !== confirmpassword) {
        // Nếu mật khẩu và xác nhận mật khẩu không khớp, trả về trang đăng ký với thông báo lỗi
        res.render("signup", { errorMessage: "Mật khẩu không khớp"});
    } else {
        const data = {
            name: username,
            email: email,
            password: newpassword
        }

        //check if the user already exists
        const existingUser = await user.findOne({name: data.name});
        if(existingUser) {
            res.render("signup", { errorMessage: "Tên tài khoản đã tồn tại. Hãy thử tên tài khoản khác"});
        }
        else{
            //hash the password using bcrypt
            const saltRounds = 10; //Number of salt rounds for bcrypt
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);

            data.password = hashedPassword;
            const userdata = await user.insertMany(data);
            console.log(userdata);
            res.render("login");
        }
    }
});

//Login User
app.post("/login", async (req,res) => {
    try{
        const check = await user.findOne({name: req.body.username});

        //compare hashed passord with input
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if(isPasswordMatch && check){
            // Set loggedIn to true in the session
            req.session.loggedIn = true;
            res.redirect('/home');
        }
        else {
            res.render("login", { errorMessage: "Sai thông tin đăng nhập"});
        }
    }
    catch{
        res.render("login", { errorMessage: "Sai thông tin đăng nhập"});
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});