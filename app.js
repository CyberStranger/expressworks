const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const crypto = require('crypto');
const fs = require('fs');
const { json } = require('body-parser');


const app = express();
app.use(bodyparser.urlencoded({extended: false}));
app.use(require('stylus').middleware(process.argv[3] || path.join(__dirname, 'public')));
app.use(express.static(process.argv[3] || path.join(__dirname, 'public')));


app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'pug');


app.get('/home', (req, res)=>{
    res.render('index', {date: new Date().toDateString()});
});

app.get('/books', (req, res)=>{
    fs.readFile(process.argv[3], (err, data)=>{
        if(err){ res.sendStatus(500); }
        try {
            books = JSON.parse(data);
        } catch (error) {
            res.sendStatus(500);
        }
        
        res.json(books);
    });
});

app.get('/search', (req, res)=>{
    res.json(req.query);
})

app.put('/message/:id', (req, res) =>{
    const id = req.params.id;
    const hexdigest = crypto.createHash('sha1')
        .update(new Date().toDateString() + id)
        .digest('hex');
    res.end(hexdigest);
})

app.post('/form', (req, res)=>{
    res.send(req.body.str.split('').reverse().join(''));
});


app.listen(process.argv[2] || 3000);
