

<script>
import { ref } from 'vue'
import { useStore } from '@/stores'

export default {
    name: 'DriverInput',
    setup () {
        const store = useStore()
        const driverName = ref('')
        const driverScore = ref()

        const appendDriver = () => {
            store.addDriver(
                driverName.value,
                driverScore.value
            )
            driverName.value = ''
            driverScore.value = ''
            driverScore.placeholder = 0
        }

        return {
            driverName,
            driverScore,
            appendDriver
        }
    }
}
</script>

<template>
    <div class="container">
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
                <button class="btn btn-secondary" @click="appendDriver">Add Driver</button>
            </div>
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