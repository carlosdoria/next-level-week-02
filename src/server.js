const express = require('express');
const server = express();
// express é um biblioteca, chama como se fosse uma function
/* "install nodemon -D" permite que o node fique atualizando o server
criar um script no packjson: "dev": "nodemon /src/server.js" para ele renderizar o servidor (nodemon + rota do servidor)*/
const nunjucks = require('nunjucks');
// nunjucks é uma templete engine que permite utilizar JS no HTML
const Database = require('./database/db')
const { subjects, weekdays, getSubject, convertTime} = require('./utils/format');

// configuração do nunjucks
nunjucks.configure("src/views", {
    express: server,
    noCache: true,
});

// .use é uma funcionalidade / configuração do servidor
server.use(express.static("public"))
// receber os dados do req.body
.use(express.urlencoded({ extended: true}))

// rotas da aplicação

.get("/", (req, res) => {
    return res.render('index.html')
})

.get("/study", async (req, res) => {
    const filters = req.query

    if(!filters.subject || !filters.weekday || !filters.time) {
        return res.render('study.html', {filters, subjects, weekdays})
    }

    const timeToMinutes = convertTime(filters.time)
    const query = `
        SELECT classes.*, proffys.*
        FROM proffys
        JOIN classes ON (classes.proffy_id = proffys.id)
        WHERE EXISTS (
            SELECT class_schedule.*
            FROM class_schedule
            WHERE class_schedule.class_id = classes.id
            AND class_schedule.weekday = ${filters.weekday}
            AND class_schedule.time_from <= ${timeToMinutes}
            AND class_schedule.time_to > ${timeToMinutes}
        )
        AND classes.subject = '${filters.subject}'
    `

    try {
        const db = await Database
        const proffys = await db.all(query)

        proffys.map( proffy => {
            proffy.subject = getSubject(proffy.subject)
        })

        return res.render('study.html', { proffys, subjects, filters, weekdays})

    } catch (error) {
        console.log(error)
    }

    
})

.get("/give-classes", (req, res) => {
    return res.render('give-classes.html', {subjects, weekdays})
})

.post("/save-classes", async (req, res) => {
    const createProffy = require("./database/createProffy")

    proffyValue = {
        name: req.body.name,
        avatar: req.body.avatar,
        whatsapp: req.body.whatsapp,
        bio: req.body.bio
    }

    classValue = {
        subject: req.body.subject,
        cost: req.body.cost
    }
    
    const classScheduleValues = req.body.weekday.map((weekday, index) =>{
        return {
            weekday,
            time_from: convertTime(req.body.time_from[index]),
            time_to: convertTime(req.body.time_to[index])
        }
    })
     
    try {
        const db = await Database
        await createProffy(db, { proffyValue, classValue, classScheduleValues })

        let queryString = "?subject=" + req.body.subject
        queryString += "&weekday=" + req.body.weekday[0]
        queryString += "&time=" + req.body.time_from[0]

        return res.redirect('/study'+ queryString)
    } catch (error) {
        console.log(error)
    }
    
})

.listen(3000)