<script>

import { ref, toRaw } from 'vue'
import { useStore } from '@/stores'
import DriverInput from './components/driverInput.vue'
import TournamentBracket from './components/TournamentBracket.vue';
import Navbar from './components/Navbar.vue'
import VueBasicAlert from 'vue-basic-alert'
import useClipboard from 'vue-clipboard3'

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
    const bracket = store.bracket
    const drivers = store.drivers
    const { toClipboard } = useClipboard()

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
      
      store.calculateBracket(cutoff.value)
      alert.value.showAlert('success', 'Scroll down to see bracket.', 'Bracket Generated')

    }

    // Copy to Clipboard
    const copyToClipboard = async () => {
      
      let text = ''
      for (let i = 0; i < store.drivers.length; i++) {
        text += i+1 + ". " + store.drivers[i].name + ' - ' + store.drivers[i].score.total + '\n'
      }

      try {
        await toClipboard(text)
        console.log('Copied to clipboard')
        alert.value.showAlert('success', 'Copied to Clipboard', 'Driver List Successfully Copied')

      } catch (e) {
        console.error(e)
        alert.value.showAlert('error', 'Unable to perform action', 'Error copying driver list')

      }
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
      drivers, sortByScore, cutoff, reset, bracket, removeDriver, alert, renderBracket, copyToClipboard,
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
            <p v-if="drivers.length == 0" class="text-center" style="margin-top:30px;">No drivers added yet.</p>
            <ul class="driver-list">
              
              <li v-for="(driver, index) in drivers" :key="index">
                <a class="btn remove-button" @click="removeDriver(index)"><i class="bi-x-lg"></i></a>
                <span class="orderCounter">{{ index + 1 }}</span>
                <span class="driverName">{{ driver.name }}</span>
                <span class="driverScore"><span class="muted" >{{ driver.score.line }} / {{ driver.score.angle }} / {{ driver.score.style }}</span> <span class="muted">Total:</span> {{ driver.score.total }}</span>
                <div class="cutoff-line" v-if="index == cutoff - 1">Top {{ cutoff }} Cutoff</div>
              </li>
            </ul>
          </div>
        </div>
        <TournamentBracket/>

      </div>

      <footer class="text-light text-center text-lg-start">
        <!-- Copyright -->
        <div class="text-center p-3" style="background-color: rgba(0, 0, 0, 0.2);">
          Made with <img width="20" height="20" src="images/heart.png" alt="like--v1"/> by <img height="20" src="images/soup2.png"/>
          
        </div>
        <!-- Copyright -->
      </footer>
    </main>
    

</template>

<style scoped>
footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: #202020;
}
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
