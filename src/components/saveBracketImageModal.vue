<template>
  <div class="modal" v-if="show">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2 class="title">Save Bracket Image</h2>
      <form class="form" @submit.prevent="submitFileName">
        <label for="fileName">File Name <span>Include file extension eg. "example.png"</span></label>
        <input type="text" id="fileName" v-model="fileName" required />
        <button type="submit">Save</button>
      </form>
      <div v-if="outputUrl" class="output-url">
        <p>Image saved at:</p>
        <a :href="outputUrl" target="_blank">{{ outputUrl }}</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'saveBracketImageModal',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    outputUrl: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      fileName: '',
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    submitFileName() {
      this.$emit('save', this.fileName);
    },
  },
};
</script>

<style scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);

  .title {
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
  }
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border: 1px solid #888;
  width: 400px;
  border-radius: 10px;
  position: relative;
}

.close {
  color: '##000';
  position: absolute;
  right: 16px;
  top: 0px;
  height: 16px;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: grey;
  text-decoration: none;
  cursor: pointer;
}

.form {
  display: flex;
  flex-direction: column;

  label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      font-size: 12px;
      color: #777;
    }
  }

  input {
    margin-bottom: 10px;
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }

  button {
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #000;
    background-color: #ff9500;
    color: black;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #ca7d00;
    }
  }
}

.output-url {
  margin-top: 20px;
  p {
    margin-bottom: 10px;
  }

  a {
    color: #333333;
    text-decoration: none;
  }
}
</style>