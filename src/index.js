import express from "express";
import { v4 as uuidv4 } from 'uuid'

const PORT = 3333

const app = express()

const customers = []

// Habilitando a aplicação receber um json
app.use(express.json())

// Middleware
function verifyIfExistsAccountCPF(request, response, next) {
  const { cpf } = request.headers

  const customer = customers.find(customer => customer.cpf === cpf)

  if (!customer) {
    return response.status(400).json({ error: "Customer not found." })
  }


  // repassando o customer
  request.customer = customer

  return next()
}


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


app.get('/statement/', verifyIfExistsAccountCPF, (request, response) => {
  // recuperando o customer do middleware
  const { customer } = request

  return response.json(customer.statement)
})


app.listen(PORT)