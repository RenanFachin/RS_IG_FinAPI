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

function getBalance(statement) {
  const balance = statement.reduce((acc, operation) => {
    if (operation.type === 'credit') {
      return acc + operation.amount
    } else {
      return acc - operation.amount
    }
  }, 0)


  return balance
}

// CRIAÇÃO DE CONTA
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

// EXTRATO
app.get('/statement', verifyIfExistsAccountCPF, (request, response) => {
  // recuperando o customer do middleware
  const { customer } = request

  return response.json(customer.statement)
})

// DEPÓSITO
app.post('/deposit', verifyIfExistsAccountCPF, (request, response) => {
  const { description, amount } = request.body

  const { customer } = request

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit"
  }

  customer.statement.push(statementOperation)

  return response.status(201).send()
})

// SAQUE
app.post('/withdraw', verifyIfExistsAccountCPF, (request, response) => {
  const { amount } = request.body

  const { customer } = request


  const balance = getBalance(customer.statement)

  if (balance < amount) {
    return response.status(400).json({ error: "Insufficient funds!" })
  }

  const statementOperation = {
    amount,
    created_at: new Date(),
    type: "debit"
  }

  customer.statement.push(statementOperation)

  return response.status(201).send()
})


// EXTRATO POR DATA (formato: 2023-12-05)
app.get('/statement/date', verifyIfExistsAccountCPF, (request, response) => {
  // recuperando o customer do middleware
  const { customer } = request
  const { date } = request.query

  const dateFormat = new Date(date + " 00:00")

  const statement = customer.statement.filter((statement) => statement.created_at.toDateString() === new Date(dateFormat).toDateString())

  return response.json(statement)
})

app.listen(PORT)