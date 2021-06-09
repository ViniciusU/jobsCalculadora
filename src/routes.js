const express = require('express')
const { Http2ServerRequest } = require('http2')
const routes = express.Router()

const Profile = {
    data: 
        {  
            name: "jackeline",
            avatar: "https://avatars.githubusercontent.com/u/17316392?s=460&u=6912a91a70bc89745a2079fdcdad3bc3ce370f13&v=4",
            "monthly-budget": 3000,
            "days-per-week":5,
            "hours-per-day":5,
            "vacation-per-year":4,
            "value-hour": 75
        },

    controllers:{
        index(req, res){
            return res.render(__dirname+"/views/profile.ejs",{profile: Profile.data})

        },
        updade(req, res){
            //req.body para pegar dados
            const data = req.body
            const weeksPerYear = 52
            const weeksPerMonth = (weeksPerYear - (data["vacation-per-year"]))/12
            //total de horas trabalhadas na semana
            const weekTotalHours = (data["hours-per-day"])*(data["days-per-week"])
            //horas trabalhasdas no mês 
            const monthlyTotalHours = weekTotalHours * weeksPerMonth
    
            

            //qual será o valor da minha hora
            const valueHour = (data["monthly-budget"])/monthlyTotalHours

            Profile.data = data
            Profile.data = {
                ...Profile.data,
                ...req.body,
                "value-hour": valueHour,
            }

            return res.redirect('/profile')

        }
    }
    

}
const Job = {
    data: 
        [
            {
                id: 1,
                name: "Pizzaria Guloso",
                "daily-hours": 2,
                "total-hours":3,
                created_at: Date.now(),
           
        
            },
            {
                id:2,
                name: "OneTwo Project",
                "daily-hours": 3,
                "total-hours": 40,
                created_at: Date.now(),
             
            },
        ],
    controllers:{   
        
        index(req,res){
            const updatedJobs = Job.data.map((job)=>{
            const remaining = Job.services.remainingDays(job)
            const status = remaining <=0 ? 'done' : 'progress'
            
            
            return {
                ...job,
                remaining,
                status,
                budget: Job.services.calculateBudget(job, Profile.data["value-hour"])
            
                }
                })
              
                return res.render(__dirname+"/views/index.ejs", {jobs: updatedJobs})  
            
        },
        save(req,res){
            const lastId = Job.data[Job.data.length -1]?.id || 0;

            Job.data.push({
                id:lastId + 1,
                name: req.body.name,
                "daily-hours": req.body["daily-hours"],
                "total-hours": req.body["total-hours"],
                created_at:Date.now() //atribuindo data de hoje
            })
            return res.redirect('/')
        },
        create(req, res){

           return  res.render(__dirname+"/views/job.ejs")

        },
        show(req,res){
            const jobId = req.params.id
            const job = Job.data.find(job=> Number(job.id) === Number(jobId))
            if(!job){
                return res.send('job not foud')
            }
            job.budget = Job.services.calculateBudget(job,Profile.data["value-hour"])

            return res.render(__dirname+"/views/job-edit.ejs", {job})

        },
        update(req,res){
            const jobId = req.params.id
            const job = Job.data.find(job=> Number(job.id) === Number(jobId))
            if(!job){
                return res.send('job not foud')
            }
            const updatedjob = {
                ...job,
                name:req.body.name,
                "total-hours": req.body["total-hours"],
                "daily-hours": req.body["daily-hours"],


            }
            Job.data =Job.data.map(job=>{
                if(Number(job.id)===Number(jobId)){
                    job = updatedjob
                }

                return job
            })
            res.redirect("/job-edit/"+jobId)

        },
        delete(req,res){
            const jobId = req.params.id
            Job.data = Job.data.filter(job => Number(job.id) !== Number(jobId))

            return res.redirect('/')




        }
    },
    services:{
            remainingDays(job){
                const remainingDay = (job["total-hours"]/job["daily-hours"]).toFixed()
            
                const createdDate = new Date(job.created_at)
                const dueDay = createdDate.getDate() + Number(remainingDay)
                const dueDateInMs = createdDate.setDate(dueDay)
            
                const timeDiffInMs = dueDateInMs - Date.now()
                // transformar milli em dias
                const dayInMs = 1000*60*60*24
                const dayDiff = Math.ceil(timeDiffInMs / dayInMs)
            
                return dayDiff
            
            },
            calculateBudget:(job, valueHour) => valueHour*job["total-hours"]
            

        }

  

}

routes.get('/', Job.controllers.index)
routes.get('/job',Job.controllers.create)
routes.post('/job',Job.controllers.save)
routes.get('/job-edit/:id',Job.controllers.show)
routes.post('/job-edit/:id',Job.controllers.update)
routes.post('/job/delete/:id',Job.controllers.delete)
routes.get('/profile', Profile.controllers.index)
routes.post('/profile', Profile.controllers.updade)




module.exports = routes;