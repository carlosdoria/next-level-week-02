const proffys = [
    {
        name: "Diego Fernandes",
        avatar: "https://avatars2.githubusercontent.com/u/2254731?s=460&amp;u=0ba16a79456c2f250e7579cb388fa18c5c2d7d65&amp;v=4",
        whatsapp: 8294365813,
        bio: "Entusiasta das melhores tecnologias de química avançada. Apaixonado por explodir coisas em laboratório e por mudar a vida das pessoas através de experiências. Mais de 200.000 pessoas já passaram por uma de minhas explosões.",
        subject: "Química",
        cost: "20",
        time_from: 720,
        time_to: 1500
    }, {
        name: "Daniela Evangelista",
        avatar: "https://avatars2.githubusercontent.com/u/2254731?s=460&amp;u=0ba16a79456c2f250e7579cb388fa18c5c2d7d65&amp;v=",
        whatsapp: 8294365813,
        bio: "Entusiasta das melhores tecnologias de química avançada. Apaixonado por explodir coisas em laboratório e por mudar a vida das pessoas através de experiências. Mais de 200.000 pessoas já passaram por uma de minhas explosões.",
        subject: "Programação",
        cost: "30",
        time_from: 720,
        time_to: 1500
    }
]

const subjects = [
    "Artes",
    "Biologia",
    "Ciências",
    "Educação Física",
    "Física",
    "Geografia",
    "História",
    "Matemática",
    "Português",
    "Química",
]

const weekdays = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
]

const express = require('express');
const server = express();
const nunjucks = require('nunjucks')

function getSubject (subjectNumber) {
    return subjects[subjectNumber]
}

// configuração do nunjucks
nunjucks.configure("src/views", {
    express: server,
    noCache: true,
})

server
// .use é uma funcionalidade/ configuração do servidor
.use(express.static("public"))

// rotas da aplicação
.get("/", (req, res) => {
    return res.render('index.html')
})

.get("/study", (req, res) => {
    const filters = req.query
    console.log(filters)
    return res.render('study.html', {proffys, filters, subjects, weekdays})
})

.get("/give-classes", (req, res) => {
    const data = req.query
    console.log(data)
    console.log(subjects[0])
    const isNotEmpty = Object.keys(data).length != 0
    if (isNotEmpty) { 
        data.subject = getSubject(data.subject)
        proffys.push(data)
        return res.redirect('study')
    }

    return res.render('give-classes.html', {subjects, weekdays})
})

.listen(3000)