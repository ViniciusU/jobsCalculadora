const express = require("express")
const routes = require("./routes")
//executando o servidor
const server = express()
//hablitar o req.body
server.use(express.urlencoded({extended:true}))
//habilita arquivos statics
server.set('view engine', 'ejs')
server.use(express.static("public"))
server.use(routes)

server.listen(3000, ()=>console.log('rodando'))