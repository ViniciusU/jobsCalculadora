const Profile = require('../model/Profile')

module.exports={
    index(req, res){
        return res.render("profile",{profile: Profile.get()})

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
        Profile.update({
            ...Profile.get(),
            ...req.body,
            "value-hour": valueHour
        })

        return res.redirect('/profile')

    }
}