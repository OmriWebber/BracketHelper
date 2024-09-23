<template>
    <div class="modal" tabindex="-1" role="dialog" v-if="show">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Enter Filename</h5>
            <button type="button" class="close" @click="closeModal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <input class="filenameInput" v-model="filename" placeholder="Filename" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="submitFilename">Create</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      show: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {
        filename: ''
      };
    },
    methods: {
      closeModal() {
        this.$emit('close');
      },
      submitFilename() {
        this.$emit('submit', this.filename);
        this.filename = '';
      }
    }
  };
  </script>
  
  <style scoped>
  .modal {
    display: block;
    background: rgba(0, 0, 0, 0.5);
  }

  .filenameInput {
    vertical-align: middle;
    padding: 8px;
    height: 40px;
    border-radius: 5px;
    margin: 10px 10px;
    border: 1px solid #ccc;
  }

  .close {
    border: none;
    background: none;
  }
  </style>