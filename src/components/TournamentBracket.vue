<template>
  <div class="tournament">
    
    <!-- Placeholder for the bracket -->
    <div v-if="bracket">
      <div v-for="(match, index) in bracket" :key="index" class="matchup">
        <div class="driver">
          {{match.driver1.position}}. {{ match.driver1.driver.name }}
        </div>
        <div class="driver">
          {{match.driver2.position}}. {{ match.driver2.driver.name }}
        </div>
        <br>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from '@/stores'
import { ref, watch } from 'vue'

export default {
  setup() {

    const store = useStore()
    const bracket = ref(store.bracket)

    watch(() => store.bracket, () => {
      bracket.value = store.bracket
    })
    return {
      bracket
    }
  }
}
</script>

<style scoped>
.tournament {
  display: flex;
  justify-content: space-between;
}

.round {
  display: flex;
  flex-direction: column;
}

.team {
  margin: 5px;
  padding: 5px;
  border: 1px solid black;
}
</style>