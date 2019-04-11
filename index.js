const express = require('express')
const sqlite = require('sqlite')
const app = express()

const dbConnection = sqlite.open('banco.sqlite',{ Promise })

const init = async () => {
    const db = await dbConnection
    await db.run('CREATE TABLE IF NOT EXISTS categorias ( id INTEGER PRIMARY KEY,categoria TEXT)')
    await db.run('CREATE TABLE IF NOT EXISTS vagas (id INTEGER PRIMARY KEY,categoria INTEGER,title TEXT,desc TEXT)')
   // await db.run(`INSERT INTO categorias(categoria) VALUES ('Web developer')`)
    // await db.run(`INSERT INTO vagas(categoria,title,desc) VALUES (3,'Front end','Web developer javascript')`)
}
init()


app.set('view engine','ejs')
app.use(express.static('public'))

app.get('/',async (req,res) => {
    const db = await dbConnection
    const categoriasDb = await db.all("SELECT * FROM categorias")
    const vagas = await db.all("SELECT * FROM vagas")
    const categorias = categoriasDb.map(vaga => {
        return {
            ...vaga,
            vagas:[...vagas.filter(item => item.categoria == vaga.id)]
        }
    })

     res.render('home',{ categorias })
     console.log(categorias)
})

app.get('/vaga',(req,res) => {
    res.render('vaga',{name:"thiago"})
})

app.listen(3001,(e) => {
    if(e) throw('Erro de conexao')
    console.log('servidor rodando na porta 3001')
})