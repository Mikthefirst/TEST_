const cors = require('cors');
const path = require('path');
const express = require('express');
const multer  = require('multer')
const userCrudOperations = require('./user.js');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname+'/imgs/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
})
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype))
        cb(null, true);
    else
        cb(null, false);
};
const upload = multer({ storage, fileFilter })

const app = express();
const parser = express.urlencoded({extended: true});

//Middleware
app.use(express.static(__dirname));
app.use(express.json());
app.use(parser);
app.use(cors());
//constants
const port = 3000;

//Listeners of requests
app.get('/', async (req, res) => {
    res.sendFile(__dirname + 'index.html');
});

app.post('/PDFcreation', upload.single('image'), async (req, res) => {
    console.log('post request');
    try {
        //flag created to return user
        let flag = false;
        //check user existance
        flag = await userCrudOperations.getUser(req.body.mail);
        console.log('if user exist ' + flag);
        if (!flag)
            flag= await userCrudOperations.createUser([req, req.file.filename]);
        else
            flag = await userCrudOperations.updateUser(req);
        //sending good status if operations return true
        res.sendStatus(200);
        //flag ? res.end("true") : res.end("false");
    } 
    catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
});


//Port-listener
app.listen(port, () => {
    console.log('start listening');
})