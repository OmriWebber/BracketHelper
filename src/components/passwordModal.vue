<template>
    <div class="modal" v-if="show">
      <div class="modal-content">
        <h2>Enter Password</h2>
        <input type="password" v-model="password" @keyup.enter="validatePassword" placeholder="Password" />
        <button @click="validatePassword">Submit</button>
        <p v-if="error" class="error">{{ error }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import bcrypt from 'bcryptjs';

  export default {
    props: {
      show: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {
        password: '',
        error: ''
      };
    },
    emits: ['authenticated'],
    methods: {
        validatePassword() {
            const hashedPassword = '$2b$10$DT.ldA3Ib0HDzuZx.TB2fefFn6VCXe725Lj8VXhhw9wjqsu9KUoTK'; // Replace with your hashed password
            bcrypt.compare(this.password, hashedPassword, (err, result) => {
                if (err) {
                  console.error('Error comparing password:', err);
                  this.error = 'An error occurred. Please try again.';
                } else if (result) {
                  localStorage.setItem('authenticated', 'true'); // Save login state to localStorage
                  this.$emit('authenticated');
                } else {
                  this.error = 'Incorrect password. Please try again.';
                }
            });
            }
    }
  };
  </script>
  
  <style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background: white;
    padding: 30px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    max-width: 400px;
    width: 100%;
  }
  
  h2 {
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
  }
  
  input[type="password"] {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
  }
  
  button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    font-size: 16px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  .error {
    color: red;
    margin-top: 10px;
  }
  </style>