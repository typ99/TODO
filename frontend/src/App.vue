<script setup>
import SignUp from "./components/SignUp.vue";
import LogIn from "./components/LogIn.vue";
import { reactive, ref } from 'vue';

const getTodo = () => {
  const token = localStorage.getItem('token');
  if (token !== null) {
    const response = fetch(`http://localhost:5001/api/todolist?token_user=${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    response.then(response => response.json()).then(data => todoList.value = data);
  }
}

getTodo();

const token = localStorage.getItem('token');

const todo = reactive({
  title: '',
  description: '',
  status: '',
  finishDate: ''
});

let todoList = ref([]);

const logout = () => {
  const token = localStorage.getItem('token');
  const response = fetch(`http://localhost:5001/logout/?token_user=${token}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  localStorage.removeItem('token');
  response.then(response => response.json());
}

const create = () => {
  let todoStatus = '';
  if (todo.status === 'Создано') {
    todoStatus = 'created';
  } else if (todo.status === 'Начато') {
    todoStatus = 'start';
  } else if (todo.status === 'Закончено') {
    todoStatus = 'end';
  }

  const token = localStorage.getItem('token');
  const response = fetch('http://localhost:5001/api/todolist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token_user: token,
      title: todo.title,
      description: todo.description,
      status: todoStatus,
      finishDate: todo.finishDate
    })
  })
  response.then(response => response.json()).then(data => {
    const item = {
      id_todo: data.id,
      Title: todo.title,
      Description: todo.description,
      Status: todoStatus,
      Finish_date: todo.finishDate
    }
    todoList.value.push(item);
  })
}

const remove = (index, id) => {
  const token = localStorage.getItem('token');
  const response = fetch(`http://localhost:5001/api/todolist/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token_user: token
    })
  })
  response.then(response => response.json()).then(data => { todoList.value.splice(index, 1); })
}

let showSignupComponent = ref(false);
let showLoginComponent = ref(false);
let showSignup = ref(token ? false : true);
let showLogin = ref(token ? false : true);
let showLogout = ref(token ? true : false);

const convertDate = (mysqlDate) => {
  const date = new Date(mysqlDate);
  return date.toLocaleDateString();
};

const currentDate = new Date().toISOString();

let statuses = ref([
  'Создано',
  'Начато',
  'Закончено'
]);

let overdues = ref([
  'Да',
  'Нет'
])

let selectedStatus = ref('');
let selectedOverdue = ref('');
</script>

<template>
  <SignUp @close="showSignupComponent = false"
    @signup="showSignupComponent = false; showSignup = true; showLogin = true" v-if="showSignupComponent"></SignUp>
  <LogIn @close="showLoginComponent = false"
    @login="showLoginComponent = false; showSignup = false; showLogin = false; showLogout = true; getTodo()"
    v-if="showLoginComponent"></LogIn>
  <section v-if="!showSignupComponent && !showLoginComponent" class="vh-100" style="background-color: #eee;">
    <div class="container py-5 h-100">
      <div class="position-absolute top-0 end-0 mt-4 me-4">
        <button v-if="showSignup" @click="showSignupComponent = true" type="button"
          class="btn btn-primary m-1">Регистрация</button>
        <button v-if="showLogin" @click="showLoginComponent = true" type="button"
          class="btn btn-primary m-1">Вход</button>
        <button v-if="showLogout" @click.prevent="logout(); showSignup = true; showLogin = true; showLogout = false"
          type="button" class="btn btn-primary m-1">Выход</button>
      </div>
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col col-lg-9 col-xl-12">
          <div class="card" style="border-radius: 15px">
            <div class="card-body p-5">
              <h2 class="text-uppercase text-center my-3 pb-3 font">Список дел</h2>
              <form class="row row-cols-lg-auto g-3 justify-content-center align-items-center mb-4 pb-2">
                <div class="col-12">
                  <div class="form-outline">
                    <input v-model.trim="todo.title" type="text" id="form1" class="form-control font"
                      placeholder="Название дела" required />
                  </div>
                </div>

                <div class="col-12">
                  <div class="form-outline">
                    <input v-model.trim="todo.description" type="text" id="form1" class="form-control font"
                      placeholder="Описание дела" required />
                  </div>
                </div>

                <div class="col-12">
                  <div class="form-outline">
                    <input @click="todo.status = 'Создано'"
                      :class="{ 'btn-warning': todo.status === 'Создано', 'btn-outline-warning': todo.status !== 'Создано' }"
                      type="button" class="btn me-3" value="Создано" required />
                    <input @click="todo.status = 'Начато'"
                      :class="{ 'btn-success': todo.status === 'Начато', 'btn-outline-success': todo.status !== 'Начато' }"
                      type="button" class="btn me-3" value="Начато" required />
                    <input @click="todo.status = 'Закончено'"
                      :class="{ 'btn-danger': todo.status === 'Закончено', 'btn-outline-danger': todo.status !== 'Закончено' }"
                      type="button" class="btn" value="Закончено" required />
                  </div>
                </div>

                <div class="col-12">
                  <div class="form-outline">
                    <input v-model.trim="todo.finishDate" type="date" id="form1" class="form-control font" required />
                  </div>
                </div>

                <div class="col-12">
                  <select v-model="selectedStatus" class="form-select">
                    <option value="none" selected disabled hidden>Статус</option>
                    <option v-for="status in statuses" :value="status">{{ status }}</option>
                  </select>
                </div>

                <div class="col-12">
                  <select v-model="selectedOverdue" class="form-select">
                    <option value="none" selected disabled hidden>Просрочено</option>
                    <option v-for="overdue in overdues" :value="overdue">{{ overdue }}</option>
                  </select>
                </div>

                <div class="col-12">
                  <button @click.prevent="create();" :disabled="!showLogout" type="submit" class="btn btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" fill="currentColor"
                      class="bi bi-plus-lg" viewBox="0 0 16 20">
                      <path fill-rule="evenodd"
                        d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                    </svg>
                  </button>
                </div>
                <table class="table table-hover table-sm align-middle mb-4">
                  <thead class="table-light">
                    <tr>
                      <th scope="col">Название</th>
                      <th scope="col">Описание</th>
                      <th scope="col">Статус</th>
                      <th scope="col">Дата</th>
                      <th scope="col">Просрочено</th>
                      <th scope="col"></th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(todo, index) in todoList">
                      <td>{{ todo.Title }}</td>
                      <td style="hyphens: auto; width: 35%">{{ todo.Description }}</td>
                      <td>{{ (todo.Status === 'created') ? 'Создано' : (todo.Status === 'start') ? 'Начато' :
                          'Закончено'
                      }}</td>
                      <td>{{ convertDate(todo.Finish_date) }}</td>
                      <td>{{ currentDate > todo.Finish_date ? 'Да' : 'Нет' }}</td>
                      <td>
                        <button type="button" class="btn btn-warning">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" fill="currentColor"
                            class="bi bi-pencil-fill" viewBox="0 0 16 20">
                            <path
                              d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                          </svg>
                        </button>
                      </td>
                      <td>
                        <button @click="remove(index, todo.id_todo)" type="button" class="btn btn-danger">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" fill="currentColor"
                            class="bi bi-trash-fill" viewBox="0 0 16 20">
                            <path
                              d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');

.font {
  font-family: 'Montserrat', sans-serif;
}
</style>
