const Job = require('../model/Job')
const JobUtils = require('../utils/JobUtils')
const Profile = require('../model/Profile')

module.exports = {   
    save(req,res){
        const jobs = Job.get()
        const lastId = jobs[jobs.length -1]?.id || 0;

        Job.create(
            {
                id:lastId + 1,
                name: req.body.name,
                "daily-hours": req.body["daily-hours"],
                "total-hours": req.body["total-hours"],
                created_at:Date.now() //atribuindo data de hoje
            }
        )
        return res.redirect('/')
    },
    create(req, res){

       return  res.render("job")

    },
    show(req,res){
        const jobId = req.params.id
        const jobs = Job.get()
        const profile = Profile.get()
        const job = jobs.find(job=> Number(job.id) === Number(jobId))
        if(!job){
            return res.send('job not foud')
        }
        job.budget = JobUtils.calculateBudget(job,profile["value-hour"])

        return res.render("job-edit", {job})

    },
    update(req,res){
        const jobId = req.params.id
        const jobs = Jot.get()
        const job = jobs.find(job=> Number(job.id) === Number(jobId))
        if(!job){
            return res.send('job not foud')
        }
        const updatedjob = {
            ...job,
            name:req.body.name,
            "total-hours": req.body["total-hours"],
            "daily-hours": req.body["daily-hours"],


        }
        newJobs =jobs.map(job=>{
            if(Number(job.id)===Number(jobId)){
                job = updatedjob
            }

            return job
        })
        Job.update(newJobs)
        res.redirect("/job-edit/"+jobId)

    },
    delete(req,res){
     
        const jobId = req.params.id
        Job.delete(jobId)
        return res.redirect('/')




    }
}
