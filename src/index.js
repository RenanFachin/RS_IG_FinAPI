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

  // Validação -> método some vai retornar true caso a condição seja satisfeita
  const customerAlreadyExists = customers.some((customer) => customer.cpf === cpf)

  if (customerAlreadyExists) {
    return response.status(400).json({ error: "Customer already exists!" })
  }


  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: []
  })


  return response.status(201).send()
})


app.get('/statement/:cpf', (request, response) => {
  const { cpf } = request.params

  const customer = customers.find(customer => customer.cpf === cpf)


  return response.json(customer.statement)
})


app.listen(PORT)