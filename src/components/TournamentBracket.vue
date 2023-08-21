<template>
  <div class="tournament">
    
    <!-- Placeholder for the bracket -->
    <div v-if="bracket">
      <div v-for="(match, index) in bracket" :key="index" class="matchup">
        <div class="driver">
          {{ match.driver1.name }}: {{ match.driver1.score }}
        </div>
        <div class="driver">
          {{ match.driver2.name }}: {{ match.driver2.score }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from '@/stores'
import { ref } from 'vue'

export default {
  props: {
    cutoff: {
      type: Number,
      default: 16
    },
    bracket: {
      type: Array,
      default: null
    }
  },
  setup() {
    const store = useStore()
    const bracket = ref(null)

    const calculateBracket = () => {
      bracket.value = store.calculateBracket()
    }

    return {
      calculateBracket,
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