import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('store', () => {
  const drivers = ref([])
  const bracket = calculateBracket()

  function addDriver(driver, score) {
    console.log(driver, score)
    this.drivers.push({
      name: driver,
      score: score
    })
  }

  function removeDriver(index) {
    this.drivers.splice(index, 1)
  }

  function sortByScore() {
    return this.drivers.sort((a, b) => b.score - a.score)
  }

  function calculateBracket() {
    const driverCount = drivers.length
    const bracket = []
    let i = 0

    while (i < driverCount) {
      bracket.push({
        driver1: this.drivers[i],
        driver2: this.drivers[driverCount - i]
      })
      i += 1
    }

    return bracket
  }

  

  return { drivers, addDriver, removeDriver, sortByScore, bracket }
})


