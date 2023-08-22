<template>
  <div class="tournament">
    
    <!-- Placeholder for the bracket -->
    <div v-if="bracket">
      <div v-for="(match, index) in bracket" :key="index" class="matchup">
        <div class="driver">
          {{ match.driver1.name }}: {{ match.driver1.score.total }}
        </div>
        <div class="driver">
          {{ match.driver2.name }}: {{ match.driver2.score.total }}
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
      console.log("TEST")
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