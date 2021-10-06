const express = require('express');
const _ = require('lodash');
const multer  =   require('multer'); 
const morgan = require('morgan');
const { render } = require('ejs');
const moogoose = require('mongoose');
const User = require('./Models/User');
const Product = require('./Models/Products');
var methodOverride = require('method-override'); 

//express app
const app = express();
app.use(methodOverride('_method'));

//mongoDB
const dbURI = 'mongodb+srv://Yuusha001:Yuusha123789@cluster0.27q6a.mongodb.net/MaNguonMo?retryWrites=true&w=majority';
moogoose.connect(dbURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((res) => {
    //open port
    app.listen(process.env.PORT || 2000);
    console.log('Server open in port 2000 !');
}).catch((err) => console.log(err))

// view engine
app.set('view engine', 'ejs');

//midleware & static files
app.use(express.static('./Public'));
app.use(express.static('./uploads'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

//routing
app.get('/',(req,res) => {
    Product.find().then((result) => {
        res.status(200).render('index', {title: 'Home', mota: 'Trang Chủ', products: result});
    }).catch((err) => {
        console.log(err);
    })
});

app.get('/index',(req,res) => {
    res.status(200).redirect('/');
});

app.get('/chinhsach',(req,res) => {
    res.status(200).render('chinhsach', {title: 'Chính sách', mota: `FAQ's`});
});

app.get('/dichvu',(req,res) => {
    res.status(200).render('dichvu', {title: 'Dịch vụ', mota: 'Dịch vụ'});
});

app.get('/dn_dk',(req,res) => {
    res.status(200).render('dn_dk', {title: 'Login & SignUp', mota: 'Đăng Nhập / Đăng Ký'});
});

app.get('/events',(req,res) => {
    res.status(200).render('events', {title: 'Events', mota: 'Nhiều sự kiện vô cùng hẫp dẫn'});
});

app.get('/HeThongCuaHang',(req,res) => {
    res.status(200).render('HeThongCuaHang', {title: 'Hệ thống cửa hàng', mota: 'Hệ thống cửa hàng'});
});

app.get('/products',(req,res) => {
    res.status(200).render('products', {title: 'Products', mota: 'Hàng Mới Về'});
});

app.get('/setquatang',(req,res) => {
    res.status(200).render('setquatang', {title: 'Sét quà tặng', mota: 'SET QUÀ TẶNG - GIFT'});
});

app.get('/thanhtoan',(req,res) => {
    res.status(200).render('ThanhToan', {title: 'Thanh Toán', mota: 'Thanh Toán'});
});

app.get('/lienhe',(req,res) => {
    res.status(200).render('lienhe', {title: 'Liên Hệ', mota: 'Liên Hệ'});
});

app.get('/login/:id/post',(req,res) => {
    res.status(200).render('post', {title: 'Đăng Bài', mota: 'Đăng bài'});
});

app.get('/find',(req,res) => {
    Product.find().then((result) => {
        res.render('find',{title:'All Posts', products: result});
    }).catch((err) => {
        console.log(err);
    })
});

//function 
app.post('/register',(req,res) => {
    const NewUser = new User({
        userName: req.body.Username,
        password: req.body.Password,
        email: req.body.Email,
        phone: req.body.Phone
    });
    NewUser.save().then((result)=>{
        res.redirect('/dn_dk');
    }).catch((err)=>{
        console.log(err);
    })
});

app.post('/login',(req,res) => {
    const ThisUser = {
        userName: req.body.Username,
        password: req.body.Password
    };
    User.findOne(ThisUser).then((result1) => {
        if(result1 != null) {
            res.redirect(`login/${result1._id}`);
        }
        else res.redirect('404');
        
    }).catch((err)=>{
        console.log(err);
    })
});

app.get('/login/:id',(req,res)=>{
    const id = req.params.id;
    User.findById(id).then(result =>{
        res.render('admin',{ acc: result, title: 'User' });
    }).catch((err)=>{
        console.log(err);
    })
});

const storage = multer.diskStorage({  
    destination: function (req, file, cb) {  
        cb(null, 'uploads/');  
    },  
    filename: function (req, file, cb) {  
      cb(null, file.originalname);  
    }  
});  

const upload = multer({ storage : storage }).single('myfile');

app.post('/post', upload ,(req,res) => { 
    const product = new Product({
        title : req.body.title,
        snippet : req.body.snippet,
        gia_goc : req.body.gia_goc,
        gia_moi : req.body.gia_moi,
        image: req.file.originalname      
    });
    console.log(product);
    product.save().then((result)=>{
        res.redirect('index');
    }).catch((err)=>{
        console.log(err);
    })
});

app.delete('/index/:id',(req, res) => {
    const id = req.params.id;
    Product.findByIdAndDelete(id).then(result =>{
        res.redirect('/find');
    });
})

app.get('/index/:id/edit',(req, res) =>{
    const id = req.params.id;
    Product.findById(id).then(result =>{
        res.render('update',{title: 'Update', blog: result });
    }).catch((err)=>{
        console.log(err);
    })
})

app.put('/index/:id', upload, (req, res) =>{
    const id = req.params.id;
    const update = {
        title : req.body.title,
        snippet : req.body.snippet,
        gia_goc : req.body.gia_goc,
        gia_moi : req.body.gia_moi,
        image: req.file.originalname     
    };
    Product.findByIdAndUpdate(id, update, {
        new: true,
        upsert: true,
        rawResult: true // Return the raw result from the MongoDB driver
    }).then(result =>{
        res.redirect('/find');
    });
})