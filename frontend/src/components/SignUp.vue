<script setup>
import { reactive } from "vue";

const emit = defineEmits(['signup', 'close']);

const form = reactive({
  firstName: '',
  lastName: '',
  login: '',
  password: '',
});

const signup = () => {
  const response = fetch('http://localhost:5001/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(form),
  });

  response.then(response => response.json())
    .then(text => emit('signup'));

}
</script>

<template>
  <section class="vh-100">
    <div class="mask d-flex align-items-center h-100" style="background-color: #eee">
      <div class="container h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-12 col-md-9 col-lg-7 col-xl-6">
            <div class="card" style="border-radius: 15px">
              <button @click="$emit('close')" type="button" class="btn-close position-absolute top-0 end-0 mt-4 me-4"
                aria-label="Close"></button>
              <div class="card-body p-5">
                <h2 class="text-uppercase text-center mb-5 font">Создать аккаунт</h2>
                <form>
                  <div class="form-outline mb-4">
                    <input v-model.trim="form.firstName" type="text" id="form3Example1cg"
                      class="form-control form-control-lg font" required placeholder="Имя" />
                  </div>

                  <div class="form-outline mb-4">
                    <input v-model.trim="form.lastName" type="text" id="form3Example1cg"
                      class="form-control form-control-lg font" required placeholder="Фамилия">
                  </div>

                  <div class="form-outline mb-4">
                    <input v-model.trim="form.login" type="text" id="form3Example3cg"
                      class="form-control form-control-lg font" required placeholder="Логин">
                  </div>

                  <div class="form-outline mb-4">
                    <input v-model.trim="form.password" type="password" id="form3Example4cg"
                      class="form-control form-control-lg font" required placeholder="Пароль" />
                  </div>

                  <div class="d-flex justify-content-center">
                    <button @click.prevent="signup" type="button" class="btn btn-primary btn-block btn-lg font">
                      Зарегестрироваться
                    </button>
                  </div>
                </form>
              </div>
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
