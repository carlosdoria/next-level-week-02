const Database = require('./db')
const createProffy = require('./createProffy')


Database.then( async db => {
    // Inserir dados
    proffyValue = {
        name: "Mayke Brito",
        avatar: "https://avatars2.githubusercontent.com/u/2254731?s=460&amp;u=0ba16a79456c2f250e7579cb388fa18c5c2d7d65&amp;v=4",
        whatsapp: "8294365813",
        bio: "Entusiasta das melhores tecnologias de química avançada. Apaixonado por explodir coisas em laboratório e por mudar a vida das pessoas através de experiências. Mais de 200.000 pessoas já passaram por uma de minhas explosões.",
    }

    classValue = {
        //proffys_id aparece depois de cadastrado no database
        subject: "1",
        cost: "20",
    }

    classScheduleValues = [
        //class_id aparece depois de cadastrado no database
        {
            weekday: 1,
            time_from: 720,
            time_to: 1500
        },
        {
            weekday: 3,
            time_from: 520,
            time_to: 1000
        }
    ]

    // await createProffy(db, {proffyValue, classValue, classScheduleValues})

    // Consultar dados inseridos

    // all proffys
    const selectAllProffys = await db.all("SELECT * FROM proffys")
    // console.log(selectAllProffys)

    // consultar as classes de um determinado professor
    // e trazer junto os dados dele
    const selectClassesAndProffys = await db.all(`
        SELECT classes.*, proffys.*
        FROM classes
        JOIN proffys ON (proffys.id = classes.proffy_id)
        WHERE classes.proffy_id = 1;
    `)
    // console.log(selectClassesAndProffys)

    // o horário que a pessoa trabalha
    // time_from precisa ser maior ou igual ao horário solicitado
    // time_to precisa ser maior 
    const selectClassesSchedule = await db.all(`
        SELECT class_schedule.*
        FROM class_schedule
        WHERE class_schedule.class_id = "1"
        AND class_schedule.weekday = "3"
        AND class_schedule.time_from <= "520"
        AND class_schedule.time_to > "900"
    `)

    console.log(selectClassesSchedule)

})