const express = require('express')
const sqlite = require('sqlite')
const app = express()
const path = require('path')

const dbConnection = sqlite.open(path.resolve(__dirname,'banco.sqlite'),{ Promise })
const port = process.env.PORT || 3001

//protegendo dominio
// app.use('/admin',(req,res,next) => {
//     if(req.hostname == 'localhos'){
//         next()
//     }else{
//         res.send("<h2>Not allowed</h2>")
//     }
// })

const init = async () => {
    const db = await dbConnection
    await db.run('CREATE TABLE IF NOT EXISTS categorias ( id INTEGER PRIMARY KEY,categoria TEXT)')
    await db.run('CREATE TABLE IF NOT EXISTS vagas (id INTEGER PRIMARY KEY,categoria INTEGER,title TEXT,desc TEXT)')
   // await db.run(`INSERT INTO categorias(categoria) VALUES ('Web developer')`)
    // await db.run(`INSERT INTO vagas(categoria,title,desc) VALUES (3,'Front end','Web developer javascript')`)
}
init()

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));

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
     //console.log(categorias)
})

app.get('/vaga/:id',async (req,res) => {
    const db = await dbConnection
    const vaga = await db.get(`SELECT * FROM vagas WHERE id = ${req.params.id}`)
    res.render('vaga',{ vaga })
    console.log(vaga)
})

app.get('/admin',(req,res) => {
    res.render('admin/home')
})


app.get('/admin/vagas',async (req,res) => {
    const db = await dbConnection
    const vagas = await db.all("SELECT * FROM vagas")
    res.render('admin/vagas',{ vagas })
})

app.get('/admin/categorias',async (req,res) => {
    const db = await dbConnection
    const categorias = await db.all("SELECT * FROM categorias")
    res.render('admin/categorias',{ categorias })
})

app.get('/admin/vagas/delete/:id',async (req,res) => {
    const db = await dbConnection
    await db.run(`DELETE FROM vagas WHERE id = ${req.params.id}`)
    res.redirect('/admin/vagas')
})

app.get('/admin/categorias/delete/:id',async (req,res) => {
    const db = await dbConnection
    await db.run(`DELETE FROM categorias WHERE id = ${req.params.id}`)
    res.redirect('/admin/categorias')
})

app.get('/admin/vaga/nova',async (req,res) => {
    
    const db = await dbConnection
    const categorias = await db.all(`SELECT * FROM categorias`)
    res.render('admin/nova-vaga',{ categorias })
})

app.get('/admin/vagas/update/:id',async (req,res) => {
    const db = await dbConnection
    const categorias = await db.all(`SELECT * FROM categorias`)
    const vaga = await db.all(`SELECT * FROM vagas WHERE id = ${req.params.id}`)
    res.render('admin/vaga-update',{ vaga,categorias })
})


app.post('/admin/vagas/update/:id',async (req,res) => {
    const { categoria, title, desc } = req.body
    const db = await dbConnection
    await db.run(`update vagas SET categoria='${categoria}',title='${title}',desc='${desc}' WHERE id = ${req.params.id}`)
    res.redirect('/admin/vagas')
})


app.get('/admin/categoria/nova',async (req,res) => {
    res.render('admin/nova-categoria')
})

app.post('/admin/vaga/nova',async (req,res) => {
    const { categoria, title, desc } = req.body
    const db = await dbConnection
    await db.run(`INSERT into vagas (categoria,title,desc) VALUES (${categoria},'${title}','${desc}')`)
    res.redirect('/admin/vagas')
})

app.post('/admin/categoria/nova',async (req,res) => {
    const { categoria } = req.body
    const db = await dbConnection
    await db.run(`INSERT INTO categorias(categoria) VALUES ('${ categoria }')`)
    res.redirect('/admin/categorias')
})



app.listen(port,(e) => {
    if(e) throw('Erro de conexao')
    console.log('servidor rodando na porta 3001')
})