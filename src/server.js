const express = require("express")
const routes = require("./routes")
const path = require("path")
//executando o servidor
const server = express()
//hablitar o req.body
server.use(express.urlencoded({extended:true}))
//habilita arquivos statics
server.set('view engine', 'ejs')
//Mudar a localizção da pasta views
server.set('views', path.join(__dirname,'views'))

server.use(express.static("public"))
server.use(routes)

server.listen(3000, ()=>console.log('rodando'))