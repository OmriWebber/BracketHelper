

<script>
import { ref, onMounted } from 'vue'
import { useStore } from '@/stores'
import VueBasicAlert from 'vue-basic-alert'


export default {
    name: 'DriverInput',
    components: {
        VueBasicAlert
    },
    methods: {

        addDriver() {
            this.appendDriver()
        }
    },
    setup () {
        const store = useStore()
        const driverName = ref('')
        const driverScoreLine = ref()
        const driverScoreAngle = ref()
        const driverScoreStyle = ref()
        const alert = ref(null)
        const checked = ref(true)

        const appendDriver = () => {
            if (!driverName.value.trim()) {
                alert.value.showAlert('error', 'Please enter a driver name', 'Error')
                return
            }

            if (!checked.value) {
                store.addDriver(
                    driverName.value.trim(),
                    { line: 0, angle: 0, style: 0, total: 0 }
                )
                alert.value.showAlert('success', 'Score: 0', driverName.value + ' added to driver list')
                driverName.value = ''
                return
            }
            
            if (!isValidLineScore()) {
                alert.value.showAlert('error', 'Please enter a valid line score (0 - 33)', 'Error')
                return
            }

            if (!isValidAngleScore()) {
                alert.value.showAlert('error', 'Please enter a valid angle score (0 - 33)', 'Error')
                return
            }

            if (!isValidStyleScore()) {
                alert.value.showAlert('error', 'Please enter a valid style score (0 - 33)', 'Error')
                return
            }

            let totalScore = parseInt(driverScoreLine.value) + parseInt(driverScoreAngle.value) + parseInt(driverScoreStyle.value)
            let driverScore = { 
                line: driverScoreLine.value, 
                angle:  driverScoreAngle.value, 
                style: driverScoreStyle.value, 
                total: totalScore
            }

            store.addDriver(
                driverName.value.trim(),
                driverScore
                )
                alert.value.showAlert('success', 'Score: ' + driverScore.total, driverName.value + ' added to driver list')

            driverName.value = ''
            
            driverScoreLine.value = ''
            driverScoreAngle.value = ''
            driverScoreStyle.value = ''
            driverScoreLine.placeholder = 'Line'
            driverScoreAngle.placeholder = 'Angle'
            driverScoreStyle.placeholder = 'Style'
        }

        const isValidLineScore = () => {
            const lineScore = parseInt(driverScoreLine.value)
            return lineScore >= 0 && lineScore <= 33
        }

        const isValidAngleScore = () => {
            const angleScore = parseInt(driverScoreAngle.value)
            return angleScore >= 0 && angleScore <= 33
        }

        const isValidStyleScore = () => {
            const lineScore = parseInt(driverScoreStyle.value)
            return lineScore >= 0 && lineScore <= 33
        }

        const isValid = ref(true)
        

        return {
            driverName,
            driverScoreLine,
            driverScoreAngle,
            driverScoreStyle,
            appendDriver,
            isValid,
            checked,
            alert
        }
    }
}
</script>

<template>
    <vue-basic-alert :duration="300" :closeIn="2500" ref="alert" />

    <div class="row" @keyup.enter="addDriver">
        <div class="checkbox">
            <label class="">Qualifications</label><input class="qualiCheckbox" type="checkbox" v-model="checked">
        </div>
        <div class="col-12">
            <input v-model="driverName" type="text" placeholder="Driver's Name"/>
        </div>
        
        <span v-if="checked">
            <div class="row">
                <div class="col-4">
                    <input v-model="driverScoreLine" type="number" placeholder="Line">
                </div>
                <div class="col-4">
                    <input v-model="driverScoreAngle" type="number" placeholder="Angle">
                </div>
                <div class="col-4">
                    <input v-model="driverScoreStyle" type="number" placeholder="Style">
                </div>
            </div>
            
        </span>
        
    </div>
    
    <div class="row">
        <div class="col-12">
            <button class="btn btn-dark" @click="appendDriver" :disabled="!isValid">Add Driver</button>
        </div>
    </div>

</template>

<style lang="scss" scoped>
    .checkbox {
        text-align: center !important;
        padding: 0 0 20px 0;
    }
    .qualiCheckbox {
        margin-left: 10px !important;
        width:20px !important;
    }
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
            padding-left: calc(var(--bs-gutter-x)* 0.5);
            }

            .col {
                width: 100%;
            }
        }

        input {
            width:100%;
            margin: 0.25rem;
            padding: 0.5rem;
            border-radius: 0.5rem;
            border: 1px solid #ccc;
        }

        button {
            min-width: 100%;
            margin: 0.25rem;
            padding: 0.5rem;
            border-radius: 0.5rem;
            border: 1px solid #ccc;
        }
    }

</style>