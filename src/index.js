const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const {username} = request.headers
  const user = users.find( (users)=> users.username === username )

  if(!user){
    response.status(404).json({error: "Invalid User"})
  }

  request.user = user

  return next()
}

app.post('/users', (request, response) => {
  const {name, username} = request.body

  const userAlreadyExist = users.some((users)=> users.username == username )
  

  if(userAlreadyExist){
    return response.status(400).json({error: "User already exists!"})
  }

  users.push({
    id: uuidv4(),
    name,
    username,
    todos:[]
  })
  const user = users[users.length - 1]

  return response.status(201).json(user)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request

  return response.json(user.todos)
});



app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {title,deadline} = request.body
  const {user} = request

  //const dataFormat = new Date(date + "00:00")

  user.todos.push({
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  })

  const todo = user.todos[user.todos.length - 1]

  response.status(201).json(todo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {title, deadline} = request.body
  const {id} = request.params
  const {user} = request

  const todo = user.find( (user)=> user.todos.id === id )

  console.log(todo)

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;