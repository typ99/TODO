/* eslint-disable no-multi-spaces */
const http = require('http');
const ControllerModule = require('./controllers/todoListController');

const controller = new ControllerModule.Controller();

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(
      200,
      {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
      },
    );
    res.end();
  } else if (req.url === '/signup' && req.method === 'POST') {                         // регистрация аккаунта
    controller.signup(req, res);
  } else if (req.url === '/login' && req.method === 'POST') {                          // вход в аккаунт
    controller.login(req, res);
  } else if (req.url.match(/\/logout/) && req.method === 'GET') {                      // выход из аккаунта
    controller.logout(req, res);
  } else if (req.url.match(/\/api\/todolist/) && req.method === 'GET') {                // получение списка дел
    controller.getTodoList(req, res);
  } else if (req.url.match(/\/api\/todolist\/([0-9]+)/) && req.method === 'GET') {     // получение конкретного дела
    const id = req.url.split('/')[3];
    controller.getTodo(req, res, id);
  } else if (req.url === '/api/todolist' && req.method === 'POST') {                   // создание дела
    controller.createTodo(req, res);
  } else if (req.url.match(/\/api\/todolist\/([0-9]+)/) && req.method === 'PUT') {     // изменение дела
    const id = req.url.split('/')[3];
    controller.updateTodo(req, res, id);
  } else if (req.url.match(/\/api\/todolist\/([0-9]+)/) && req.method === 'DELETE') {  // удаление дела
    const id = req.url.split('/')[3];
    controller.deleteTodo(req, res, id);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
