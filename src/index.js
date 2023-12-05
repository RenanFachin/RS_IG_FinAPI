import express from "express";

const app = express()

// Habilitando a aplicação receber um json
app.use(express.json())


const PORT = 3333
app.listen(PORT)