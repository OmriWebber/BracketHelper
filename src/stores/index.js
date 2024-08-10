import { ref, toRaw, watch, nextTick } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('store', () => {
  const drivers = ref(JSON.parse(localStorage.getItem('drivers')) || [])
  const bracket = ref([])

  // Watch for changes in drivers
  watch(drivers, (newDrivers) => {
    nextTick(() => {
      localStorage.setItem('drivers', JSON.stringify(newDrivers));
    });
  })

  function addDriver(driver, score) {
    this.drivers.push({
      name: driver,
      score: score
    })
    localStorage.setItem('drivers', JSON.stringify(this.drivers));
  }

  function removeDriver(index) {
    this.drivers.splice(index, 1)
    localStorage.setItem('drivers', JSON.stringify(this.drivers));
  }

  function sortByScore() {
    var sortedDrivers = this.drivers.sort((a, b) => {
      if (b.score.total !== a.score.total) {
        return b.score.total - a.score.total;
      }
      if (b.score.line !== a.score.line) {
        return b.score.line - a.score.line;
      }
      if (b.score.angle !== a.score.angle) {
        return b.score.angle - a.score.angle;
      }
      return b.score.style - a.score.style;
    });
    localStorage.setItem('drivers', JSON.stringify(sortedDrivers));
    return sortedDrivers

  }

  function sortRandom() {
    var sortedDrivers = this.drivers.sort((a, b) => 0.5 - Math.random())
    localStorage.setItem('drivers', JSON.stringify(sortedDrivers));
    return sortedDrivers
  }

  function clearDrivers() {
    this.drivers.splice(0);
    localStorage.setItem('drivers', JSON.stringify(this.drivers));
  }

  function calculateBracket(limit) {
    if (this.drivers.length < limit) {
      console.log("Not enough drivers for a top " + limit + " bracket")
      return
    }

    const qualifiedDrivers = this.drivers.slice(0, limit)
    console.log(toRaw(qualifiedDrivers))
    let i = 0
    this.bracket = []

    while (i < (limit / 2)) {
      let match = {
        driver1: {position:i+1,driver:qualifiedDrivers[i]},
        driver2: {position:((limit - 1) - i+1), driver:qualifiedDrivers[(limit - 1) - i]}
      }
      this.bracket.push(match)
      i += 1
    }
    console.log(this.bracket)
  }
  
  return { drivers, bracket, addDriver, removeDriver, clearDrivers, sortByScore, calculateBracket, sortRandom }
})


