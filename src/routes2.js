const express = require('express')
const { Http2ServerRequest } = require('http2')
const routes = express.Router()

const profile = {
    name: "jackeline",
    avatar: "https://avatars.githubusercontent.com/u/17316392?s=460&u=6912a91a70bc89745a2079fdcdad3bc3ce370f13&v=4",
    "monthly-budget": 3000,
    "days-per-week":5,
    "hours-per-day":5,
    "vacation-per-year":4,
    "value-hour": 75
}
//calculo de tempo restante


const jobs = [
    {
    id:1,
    name: "pizzaria Guloso",
    "daily-hours": 2,
    "total-hours": 1,
    created_at: Date.now(),
   

    },
    {
    id:2,
    name: "oneTwo project",
    "daily-hours": 3,
    "total-hours": 40,
    created_at: Date.now(),
  

    }
]

function remainingDays(job){
    //
     const remainingDay = (job["total-hours"]/job["daily-hours"]).toFixed()
        const createdDate = new Date(job.created_at)
        //dia do vencimento em dias
        const dueDay = createdDate.getDate() + Number(remainingDay)
        //data do vencimento em ml segundos
        const dueDateInMs = createdDate.setDate(dueDay)
        const timeDiffInMs = dueDateInMs - Date.now()
        //transformar milli em dias
        const dayInMs = 1000 * 60 * 60 * 24
        const dayDiff = Math.ceil(timeDiffInMs / dayInMs)
        // restam x dias
        console.log("-----------------")
        console.log(createdDate)
        console.log(dueDay)
        console.log(dueDateInMs)
        console.log(timeDiffInMs)
        console.log(dayInMs)
        console.log(timeDiffInMs)

        return dayDiff
}
routes.get('/',(req,res)=> {
    //ajustes no job
    const updatedJobs = jobs.map((job)=>{
    const remaining = remainingDays(job)
    const status = remaining<=0? 'done':'progress'
        
    return {
            //espalhamento (tudo que tem dentro do job)
            ...job,
            remaining,
            status,
            budget: profile["value-hour"]*job["total-hours"]
         }
    })
    
    return res.render(__dirname+"/views/index.ejs",{jobs: updatedJobs})})


routes.get('/job',(req,res)=> res.render(__dirname+"/views/job.ejs"))
routes.post('/job',(req,res)=> {
   //const job = req.body

   //job.crated_at = Date.now() //atribuindo uma nova data

   const lastID= jobs[jobs.length -1]?.id || 1;
   jobs.push({
       id: lastID +1,
       name: req.body.name,
       "daily=hours": req.body["daily-hours"],
       "total-hours": req.body["total-hours"],
       created_at: Date.now() // atrinuindo data de hoje
   })

   
    return res.redirect('/')
})

routes.get('/job-edit',(req,res)=> res.render(__dirname+"/views/job-edit.ejs"))
routes.get('/profile',(req,res)=> res.render(__dirname+"/views/profile.ejs",{profile}))
module.exports = routes;