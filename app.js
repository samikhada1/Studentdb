var express = require('express')
var app = express()
var path = require("path")
var fs = require('fs')
const port = process.env.PORT || 3000

app.set("views", path.join(__dirname, "views") )
app.set("view engine", "pug")

app.use('/static', express.static('public'))
app.use(express.urlencoded({extended: false}))

app.get('/', (req,res) => {
    res.render('index')
})

app.get('/create', (req,res) => {
    res.render('create')
}) 
app.post('/create', (req,res) => {
    let id = req.body.id
    let fullname = req.body.fullname
    let bio = req.body.bio

    if (id.trim() === '' && fullname.trim() === ''){
        res.render('create', {error: true })
    } else{
        fs.readFile('./data/studentdb.json', (err, data) =>{
            if (err) throw err

            let student = JSON.parse(data)

            student.push({
                Uid: Uid(),
                id: id,
                fullname: fullname,
                bio: bio,

            })
            fs.writeFile('./data/studentdb.json', JSON.stringify(student), err =>{
                if (err) throw err

                res.render('create')
            })
        })
    }
})

app.get('/list', (req, res) =>{
    fs.readFile('./data/studentdb.json', (err, data)=>{
        if (err) throw err

        let studentdbs = JSON.parse(data)

        res.render('list', {studentdbs: studentdbs})

    })
})

app.get('/list/:Uid', (req, res) => {
    let Uid = req.params.Uid

    fs.readFile('./data/studentdb.json', (err, data) =>{
        if (err) throw err

        let studentdbs = JSON.parse(data)

        let studentdb = studentdbs.filter(studentdb => studentdb.Uid == Uid)[0]

        res.render('read', {studentdb: studentdb})
    })
})

app.get('/:Uid/delete', (req, res) =>{
    let Uid = req.params.Uid

    fs.readFile('./data/studentdb.json', (err, data) =>{
        if (err) throw err

        let studentdbs = JSON.parse(data)

        let studentdb = studentdbs.filter(studentdb => studentdb.Uid != Uid)

        fs.writeFile('./data/studentdb.json', JSON.stringify(studentdb), (err) =>{
            if (err) throw err
            res.render('list', {studentdbs: studentdb, deleted: true})
        })
    })
})

app.get('/:Uid/update', (req, res) =>{
    let Uid = req.params.Uid

    fs.readFile('./data/studentdb.json', (err, data) =>{
        if (err) throw err
        let studentdbs = JSON.parse(data)
        let studentdb = studentdbs.filter(studentdb => studentdb.Uid != Uid)
    })
})

function Uid () {
    return '_' + Math.random().toString(36).substr(2, 9);
  };

app.listen(port)