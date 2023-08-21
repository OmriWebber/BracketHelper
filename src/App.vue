<script>

import { ref, toRaw } from 'vue'
import { useStore } from '@/stores'
import DriverInput from './components/driverInput.vue'
import TournamentBracket from './components/TournamentBracket.vue';
import Navbar from './components/Navbar.vue'
import VueBasicAlert from 'vue-basic-alert'

export default {
  name: 'App',
  components: {
    DriverInput,
    VueBasicAlert,
    TournamentBracket,
    Navbar
  },

  setup () {
    // Get the store
    const store = useStore()

    // Create refs for the driver list, driver name, driver score, and alert
    const alert = ref()
    const cutoff = ref(16)
    let bracket = ref([])

    // Sort the driver list by score
    const sortByScore = () => {
      store.sortByScore()
      alert.value.showAlert('warning', 'Highest to Lowest', 'Driver List Sorted')

    }

    // Create and Render the bracket
    const renderBracket = () => {

      if (store.drivers.length < cutoff.value) {
        alert.value.showAlert('error', 'Add more drivers.', 'Not enough drivers for a top ' + cutoff.value + ' bracket')
        console.log("Not enough drivers for a top " + cutoff.value + " bracket")
        return
      }
      
      bracket = store.calculateBracket(cutoff.value)
      alert.value.showAlert('success', 'Scroll down to see bracket.', 'Bracket Generated')

    }

    // Copy to Clipboard
    const copyToClipboard = () => {
      let text = ''
      for (let i = 0; i < store.drivers.length; i++) {
        text += store.drivers[i].name + ': ' + store.drivers[i].score + '\n'
      }
      navigator.clipboard.writeText(text)
      alert.value.showAlert('success', 'Copied to Clipboard', 'Driver List Copied to Clipboard')
    }

    // Reset the driver list
    const reset = () => {
      store.clearDrivers()
      alert.value.showAlert('info', 'Success', 'Reset Driver List')

    }

    // Remove a driver from the list by index and show an alert
    const removeDriver = (index) => {
      let driverName = store.drivers[index].name
      let driverScore = store.drivers[index].score
      store.removeDriver(index)
      alert.value.showAlert('error', 'Score: ' + driverScore, driverName + ' removed from driver list')
    }
    

    return {
      drivers: store.drivers, sortByScore, cutoff, reset, bracket, removeDriver, alert, renderBracket
    }
  }
}
</script>

<template>
    <vue-basic-alert :duration="300" :closeIn="3000" ref="alert" />

    <Navbar />
    <main>
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <img class="herologo" src="/images/logoalt.png" alt="" width="100">
            <p class="intro-text">
              Welcome to Bracket Helper! This app is designed to help you keep track of your bracket scores for your tournaments. Simply enter the driver's name and score, and the app will keep track of the scores for you!
            </p>
            <div class="container">
              <DriverInput />
              <div class="row">
                <div class="col-6">
                  <button class="btn sub-btn btn-danger" @click="reset">Clear Drivers</button>

                </div>
                <div class="col-6">
                  <button class="btn sub-btn btn-success" @click="renderBracket">Create Bracket</button>

                </div>
              </div>
              
            </div>
            
          </div>
          <div class="col-md-6">
            <div class="row">
              <div class="col-5">
                <h3 class="driver-list-title">Driver List</h3>
              </div>
              <div class="col-7">
                <select v-model="cutoff" name="cutoff" id="cutoff">
                  <option value="8">Top 8</option>
                  <option value="16">Top 16</option>
                  <option value="32">Top 32</option>
                </select>
                <button class="btn btn-warning" @click="sortByScore">Sort</button>
                <button class="btn btn-primary" @click="copyToClipboard">
                  <i class="bi-clipboard"></i> Copy
                </button>
              </div>
            </div>
            
            <ul class="driver-list">
              <li v-for="(driver, index) in drivers" :key="index">
                <a class="btn remove-button" @click="removeDriver(index)"><i class="bi-x-lg"></i></a>
                <span class="orderCounter">{{ index + 1 }}</span>
                <span class="driverName">{{ driver.name }}</span>
                <span class="driverScore"><span class="muted">Score:</span> {{ driver.score }}</span>
                <div class="cutoff-line" v-if="index == cutoff - 1">Top {{ cutoff }} Cutoff</div>
              </li>
            </ul>
          </div>
        </div>
        <TournamentBracket :teams="bracket" />

      </div>

        
    </main>
    

</template>

<style scoped>

.remove-button {
  margin: 0.5rem;
  padding:2px 8px;
  border-radius: 0.5rem;
  font-weight: 600;
  color: rgb(196, 22, 22);
}

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
    margin-top: 10px;
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
    padding: 8px;
    border-radius: 5px;
    margin-left: -30px;
    margin-right: 20px;
  }

  .sub-btn {
    padding: 7px;
    width: 100%;
    margin: 0px;
  }

  button {
    margin: 0.5rem 0.3rem;
    padding: 0.5rem 1.2rem;
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
