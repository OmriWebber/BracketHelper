<script>

import { useStore } from '@/stores'
import DriverInput from './components/driverInput.vue'
import Navbar from './components/Navbar.vue'


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
            <h3 class="driver-list-title">Driver List</h3>
            <ul class="driver-list">
              <li v-for="driver in drivers">
                {{ driver.name }} - {{ driver.score }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
    

</template>

<style scoped>
  .driver-list-title {
    margin-top: 0;
    text-align: center;
  }

  .driver-list {
    list-style: none;
    padding-left: 0;
  }

  .driver-list li {
    margin-bottom: 4px;
    padding: 10px;
  }

  .driver-list li:nth-child(even) {
    background-color: rgba(184, 184, 184, 0.493);
  }

</style>
