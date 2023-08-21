

<script>
import { ref, onMounted } from 'vue'
import { useStore } from '@/stores'
import VueBasicAlert from 'vue-basic-alert'


export default {
    name: 'DriverInput',
    components: {
        VueBasicAlert
    },
    setup () {
        const store = useStore()
        const driverName = ref('')
        const driverScore = ref()
        const alert = ref(null)

        const appendDriver = () => {
            if (!driverName.value.trim()) {
                alert.value.showAlert('error', 'Please enter a driver name', 'Error')
                return
            }
            if (!isValidScore()) {
                alert.value.showAlert('error', 'Please enter a driver score', 'Error')
                return
            }

            store.addDriver(
                driverName.value.trim(),
                driverScore.value
                )
                alert.value.showAlert('success', 'Score: ' + driverScore.value, driverName.value + ' added to driver list')

            driverName.value = ''
            driverScore.value = ''
            driverScore.placeholder = 0
        }

        const validateScore = () => {
            if (!isValidScore()) {
                scoreError.value = 'Score should be between 0-99 or DNF.'
            } else {
                scoreError.value = ''
            }
        }
        const isValidScore = () => {
            if (driverScore.value === 'DNF') {
                return true
            }
            const score = parseInt(driverScore.value)
            return score >= 0 && score <= 99
        }

        const isValid = ref(true)
    

        return {
            driverName,
            driverScore,
            appendDriver,
            validateScore,
            isValid,
            alert
        }
    }
}
</script>

<template>
    <vue-basic-alert :duration="300" :closeIn="2500" ref="alert" />

    <div class="row">
        <div class="col-8">
            <input v-model="driverName" type="text" placeholder="Driver's Name"/>
        </div>
        <div class="col-4">
            <input v-model="driverScore" placeholder="Score"/>
        </div>
    </div>
    
    <div class="row">
        <div class="col-12">
            <button class="btn btn-dark" @click="appendDriver" :disabled="!isValid">Add Driver</button>
        </div>
    </div>

</template>

<style lang="scss" scoped>
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;

        .row {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            > * {
            padding-left:0px;
            }
        }

        input {
            width:100%;
            margin: 0.5rem;
            padding: 0.5rem;
            border-radius: 0.5rem;
            border: 1px solid #ccc;
        }

        button {
            min-width: 100%;
            margin: 0.5rem;
            padding: 0.5rem;
            border-radius: 0.5rem;
            border: 1px solid #ccc;
        }
    }

</style>