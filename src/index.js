const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require("./config");

const app = express();
//convert data into json format
app.use(express.json());

app.use(express.urlencoded({extended: false}));

//Use EJS as view engine
app.set('view engine', 'ejs');
//static file
app.use(express.static("public"));

//Cấu hình route
app.get("/", (req, res) => {
    res.render("login");
});

app.get("/login", (req, res) => {
    res.render("login"); 
});

app.get("/signup", (req,res) => {
    res.render("signup");
});

app.get("/home", (req,res) => {
    res.render("home");
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
        const existingUser = await collection.findOne({name: data.name});
        if(existingUser) {
            res.render("signup", { errorMessage: "Tên tài khoản đã tồn tại. Hãy thử tên tài khoản khác"});
        }
        else{
            //hash the password using bcrypt
            const saltRounds = 10; //Number of salt rounds for bcrypt
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);

            data.password = hashedPassword;
            const userdata = await collection.insertMany(data);
            console.log(userdata);
            res.render("login");
        }
    }
});

//Login User
app.post("/login", async (req,res) => {
    try{
        const check = await collection.findOne({name: req.body.username});

        //compare hashed passord with input
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if(isPasswordMatch && check){
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