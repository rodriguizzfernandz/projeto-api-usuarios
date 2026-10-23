const express = require("express")
const app = express()
const mysql = require("mysql2/promise")
app.use (express.json())


const pool = mysql.createPool({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "root",
    database: "usuarios_api",
    waitForConnections: true
})

app.get("/usuarios", async(req,res)=> {
    const[usuarios] = await pool.execute("SELECT * FROM usuario")
    return res.json(usuarios)
})


app.post("/usuarios", async(req,res)=> {
    const{email, senha} = req.body

    if(!email||!senha){
        return res.status(400).json({error: "Email e senha são obrigatórios"})
    }
    const[resultado] = await pool.execute("INSERT INTO usuario(email, senha) VALUES (?,?)",
        [email, senha])
    return res.status(201).json({id: resultado.insertId, email, senha})
})

app.delete("/usuarios/:id", async(req,res)=> {

    const id = req.params.id

    const[deletar] = await pool.execute("DELETE FROM usuario WHERE id = ?",[id])

    if(deletar.affectedRows == 0){
        return res.status(404).json({error: "Usuario não encontrado"})
    }
    return res.status(200).json("Usuario deletado com sucesso!")
})

app.put("/usuarios/:id", async(req,res)=> {
    const{email, senha} = req.body
    const id = req.params.id

    if(!email||!senha){
        return res.status(400).json({error: "Email e senha são obrigatórios"})
    }
    const [resultado] = await pool.execute("UPDATE usuario SET email = ?, senha = ? WHERE id = ?",
        [email,senha,id]
    ) 
    return res.status(201).json({id: resultado.id, email, senha})
})

app.listen(3000, () => console.log("O api está no ar"))