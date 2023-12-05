import express from "express";
import { v4 as uuidv4 } from 'uuid'

const PORT = 3333

const app = express()

const customers = []

// Habilitando a aplicação receber um json
app.use(express.json())


/**
 * cpf - string
 * name - string
 * id - uuid
 * statement - []
 */
app.post('/signup', (request, response) => {
  const { cpf, name } = request.body
  const id = uuidv4()


  customers.push({
    cpf,
    name,
    id,
    statement: []
  })


  return response.status(201).send()
})


app.listen(PORT)