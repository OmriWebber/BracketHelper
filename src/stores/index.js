import { ref, toRaw } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('store', () => {
  const drivers = ref([])
  const bracket = ref([])

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

  function clearDrivers() {
    this.drivers.splice(0);
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
        driver1: qualifiedDrivers[i],
        driver2: qualifiedDrivers[(limit - 1) - i]
      }
      this.bracket.push(match)
      i += 1
    }
    console.log(this.bracket)
  }



  

  return { drivers, bracket, addDriver, removeDriver, clearDrivers, sortByScore, calculateBracket }
})


