<script>

import { useStore } from '@/stores'
import DriverInput from './components/driverInput.vue'
import Navbar from './components/Navbar.vue';


export default {
  name: 'App',
  components: {
    DriverInput,
    Navbar
  },
  setup () {
    const store = useStore()

    return {
      drivers: store.drivers
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
            <DriverInput />
          </div>
          <div class="col-md-6">
            <h3>Drivers</h3>
            <ul class="driver-list">
              <li v-for="driver in drivers" :key="driver.name">
                {{ driver.name }} - {{ driver.score }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="wrapper">
        
        
      </div>
    </main>
    

</template>

<style scoped>

</style>
