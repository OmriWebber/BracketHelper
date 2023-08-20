<script>

import { ref } from 'vue'
import { useStore } from '@/stores'
import DriverInput from './components/driverInput.vue'
import Navbar from './components/Navbar.vue'

import dropdown from 'vue-dropdowns';

export default {
  name: 'App',
  components: {
    DriverInput,
    Navbar
  },

  setup () {
    const store = useStore()
    const sortByScore = () => {
      store.sortByScore()
    }
    const cutoff = ref(16)

    const bracket = store.bracket
    console.log(bracket)

    return {
      drivers: store.drivers, sortByScore, cutoff, bracket
    }
  }
}
</script>

<template>
    <Navbar />
    <main>
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <img class="herologo" src="src/assets/logoalt.png" alt="" width="100">
            <p class="intro-text">
              Welcome to Bracket Helper! This app is designed to help you keep track of your bracket scores for your tournaments. Simply enter the driver's name and score, and the app will keep track of the scores for you!
            </p>
            <DriverInput />
          </div>
          <div class="col-md-6">
            <div class="row">
              <div class="col-7">
                <h3 class="driver-list-title">Driver List</h3>
              </div>
              <div class="col-5">
                <select v-model="cutoff" name="cutoff" id="cutoff">
                  <option value="8">Top 8</option>
                  <option value="16">Top 16</option>
                  <option value="32">Top 32</option>
                </select>
                <button class="button" @click="sortByScore">Sort</button>
              </div>
            </div>
            
            <ul class="driver-list">
              <li v-for="(driver, index) in drivers" :key="index">
                <span class="orderCounter">{{ index + 1 }}</span>
                <span class="driverName">{{ driver.name }}</span>
                <span class="driverScore"><span class="muted">Score:</span> {{ driver.score }}</span>
                <div class="cutoff-line" v-if="index == cutoff - 1">Top {{ cutoff }} Cutoff</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      </main>
    

</template>

<style scoped>

.cutoff-line {
  color: rgb(196, 22, 22);
  font-weight: 600;
  padding: 20px 0px 10px;
  display: flex;
  align-items: center;
  text-align: center;
}

.cutoff-line::before,
.cutoff-line::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #000;
}

.cutoff-line:not(:empty)::before {
  margin-right: .25em;
}

.separator:not(:empty)::after {
  margin-left: .25em;
}
  .driver-list-title {
    margin-top: 12px;
    text-align: left;
  }

  .herologo {
    margin: 0 auto;
    display: block;
  }

  .orderCounter {
    margin: 30px;
  }
  .driverScore {
    margin-right: 40px;
    float:right;
  }

  .intro-text {
    margin-left: 20px;
  }

  .muted {
    color: #575757;
    font-size: 0.8rem;
  }

  .driver-list {
    list-style: none;
    padding-left: 0;
    max-height: 400px;
    overflow-y: scroll;
  }

  .driver-list li {
    padding: 10px;
    background-color: rgba(238, 238, 238, 0.527);

  }

  .driver-list li:nth-child(even) {
    background-color: rgba(184, 184, 184, 0.493);
  }

  #cutoff {
    padding: 3px;
    border-radius: 5px;
  }

  button {
    width: 40%;
    margin: 0.5rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid #ccc;
  }

  .my-dropdown-toggle {
  border-radius: 5px;

  ::v-deep .dropdown-toggle {
    color: tomato;
    font-size: 25px;
    font-weight: 800;
  }

  ::v-deep .dropdown-toggle-placeholder {
    color: #c4c4c4;
  }
}

</style>
