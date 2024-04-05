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

function requireLogin(req, res, next) {
    if (!req.session.loggedIn) {
        return res.redirect('/login');
    }
    next();
}

function formatTime(time) {
    const hours = Math.floor(time / 3600000).toString().padStart(2, '0');
    const minutes = Math.floor((time % 3600000) / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((time % 60000) / 1000).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

//Cấu hình route
app.get("/", async (req, res) => {
    if (!req.session.loggedIn) {
        res.render("login");
    } else {
        try {
            const exams = await exam.find({}); // Lấy tất cả các bản ghi trong collection exams
            res.render("home", { exams: exams }); // Truyền dữ liệu vào trang home
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    }
});

app.get("/login", async (req, res) => {
    if (req.session.loggedIn) {     //Nếu chưa đăng xuất sẽ chuyển thẳng đến home
        try {           
            const exams = await exam.find({}); // Lấy tất cả các bản ghi trong collection exams
            res.render("home", { exams: exams }); // Truyền dữ liệu vào trang home
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    } else {
        res.render("login");
    }
});

app.get("/signup", (req,res) => {
    res.render("signup");
});


//Home api
app.get("/home", requireLogin, async (req, res) => {
    res.locals.clearSessionStorage = true;
    if (req.session.loggedIn) {
       try {
           const exams = await exam.find({}); // Lấy tất cả các bản ghi trong collection exams
           res.render('home', { exams: exams, formatTime: formatTime }); // Truyền dữ liệu vào trang home
       } catch (err) {
           console.error(err);
           res.status(500).send('Server Error');
       }
    } else {
       res.redirect("/login");
    }
   });

   app.get("/search", requireLogin, async (req, res) => { //Tìm kiếm kỳ thi
    let query = {};
    if (req.query.name) {
        query.name = { $regex: req.query.name, $options: 'i' };
    }
    if (req.query.status && req.query.status !== '') {
        query.status = req.query.status;
    }

    try {
        const exams = await exam.find(query);
        res.render('home', { exams: exams, formatTime: formatTime });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get("/start-exam/:id", requireLogin, async (req, res) => {
    const examData = await exam.findById(req.params.id);
    res.render("exam", { exam: examData });
});

//Exam api
app.get("/exam", requireLogin, (req,res) => {
    if (req.session.loggedIn) {
        res.render("exam");
    } else {
        res.redirect("/login");
    }
});

//API xử lí việc nộp bài
app.post("/submit-exam/:id", requireLogin, async (req, res) => {    
    // Lấy dữ liệu từ form
    const answers = req.body;
    // Lấy thông tin bài thi dựa trên ID
    const exam = await exam.findById(req.params.id);
    // So sánh câu trả lời với câu trả lời đúng
    // (Đây là một ví dụ đơn giản, bạn cần thực hiện logic phức tạp hơn dựa trên yêu cầu của bạn)
    let score = 0;
    exam.questions.forEach((question, index) => {
        const userAnswerIndex = answers[`question-${index}`];
        if (question.answerOptions[userAnswerIndex].isCorrectAnswer) {
            score++;
        }
    });

    // Hiển thị kết quả
    res.render("result", { score: score });
});

//Result api
app.get("/result", requireLogin, (req,res) => {
        res.render("result");
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