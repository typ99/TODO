/* eslint-disable class-methods-use-this */
const { getPostData } = require('../utils');
const ViewModule = require('../views/todoListView');
const DatabaseModule = require('../models/todoListModel');

const view = new ViewModule.View();
const database = new DatabaseModule.Database();

class Controller {
  // @desc  Signup New User
  // @route POST /signup

  async signup(req, res) {
    try {
      const body = await getPostData(req);
      const user = JSON.parse(body);
      await database.signup(
        user.login,
        user.password,
        user.firstName,
        user.lastName,
      );
      view.outputSignup(res);
    } catch (error) {
      if (error.login !== undefined) {
        view.outputErrorSignup(res, error);
      } else {
        view.outputError(res);
      }
    }
  }

  // @desc  Login In Account
  // @route POST /login

  async login(req, res) {
    try {
      const body = await getPostData(req);
      const user = JSON.parse(body);
      const tokenUser = await database.login(
        user.login,
        user.password,
      );
      view.outputLogin(res, tokenUser);
    } catch (error) {
      if (error.message === undefined) {
        view.outputErrorLogin(res);
      } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(error));
      }
    }
  }

  // @desc  Logout From Account
  // @route GET /logout

  async logout(req, res) {
    try {
      const token = req.url.split('=')[1];
      await database.logout(token);
      view.outputLogout(res);
    } catch (error) {
      console.log(error);
    }
  }

  // @desc  Gets All TODO
  // @route GET /api/todolist

  async getTodoList(req, res) {
    try {
      const token = req.url.split('=')[1];
      const todoList = await database.findAll(token);
      view.outputTodoList(res, todoList);
    } catch (error) {
      console.log(error);
      view.outputError(res, error);
    }
  }

  // @desc  Gets Single TODO
  // @route GET /api/todolist/:id

  async getTodo(req, res, id) {
    try {
      const body = await getPostData(req);
      const todo = JSON.parse(body);
      const todoId = await database.findById(id, todo.token_user);
      view.outputTodo(res, todoId);
    } catch (error) {
      view.outputError(res);
    }
  }

  // @desc  Create A TODO
  // @route POST /api/todolist

  async createTodo(req, res) {
    try {
      const body = await getPostData(req);
      const todo = JSON.parse(body);
      const newTodo = await database.create(
        todo.token_user,
        todo.title,
        todo.description,
        todo.status,
        todo.finishDate,
      );
      view.outputCreatedTodo(res, newTodo);
    } catch (error) {
      view.outputError(res);
    }
  }

  // @desc  Update A TODO
  // @route PUT /api/todolist/:id

  async updateTodo(req, res, id) {
    try {
      const body = await getPostData(req);
      const todo = JSON.parse(body);
      const todoId = await database.findById(id, todo.token_user);
      if (todoId) {
        await database.update(
          todo.token_user,
          todoId[0].id_todo,
          todo.title,
          todo.description,
          todo.status,
          todo.finishDate,
        );
        view.outputUpdatedTodo(res, todoId);
      } else {
        view.outputUpdatedTodo(res, todoId);
      }
    } catch (error) {
      view.outputError(res);
    }
  }

  // @desc  Delete TODO
  // @route DELETE /api/todolist/:id

  async deleteTodo(req, res, id) {
    try {
      const body = await getPostData(req);
      const todo = JSON.parse(body);
      const todoId = await database.findById(id, todo.token_user);
      if (todoId) {
        await database.remove(todo.token_user, id);
        view.outputDeletedTodo(res, todoId, id);
      } else {
        view.outputDeletedTodo(res, todoId, id);
      }
    } catch (error) {
      view.outputError(res);
    }
  }
}

module.exports = {
  Controller,
};
