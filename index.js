const express = require('express')
const app = express()

app.set('view engine','ejs')
app.use(express.static('public'))

app.get('/',(req,res) => {
     res.render('home',{name:"thiago"})
})

app.get('/vaga',(req,res) => {
    res.render('vaga',{name:"thiago"})
})

app.listen(3001,(e) => {
    if(e) throw('Erro de conexao')
    console.log('servidor rodando na porta 3001')
})