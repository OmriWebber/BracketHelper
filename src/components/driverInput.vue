

<script>
import { ref, onMounted } from 'vue'
import VueBasicAlert from 'vue-basic-alert'
import axios from 'axios'


export default {
    name: 'DriverInput',
    components: {
        VueBasicAlert
    },
    emits: ['driver-added'],
    methods: {
        addDriver() {
            this.appendDriver()
        }
    },
    setup (props, { emit }) {
        const driverName = ref('')
        const driverScoreLine = ref()
        const driverScoreAngle = ref()
        const driverScoreStyle = ref()
        const alert = ref(null)
        const selectedFile = ref(localStorage.getItem('selectedFile') || '');

        const backendUrl = 'https://bracket-helper-backend-y2ec.vercel.app';

        const appendDriver = () => {
            if (!driverName.value.trim()) {
                alert.value.showAlert('error', 'Please enter a driver name', 'Error')
                return
            }

            let drivers = JSON.parse(localStorage.getItem('drivers')) || [];
            
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

            const newDriver = {
                name: driverName.value.trim(),
                score: {
                    line: driverScoreLine.value || 0,
                    angle: driverScoreAngle.value || 0,
                    style: driverScoreStyle.value || 0,
                    total: (driverScoreLine.value || 0) + (driverScoreAngle.value || 0) + (driverScoreStyle.value || 0)
                }
            };

            // Add driver to list
            console.log(newDriver)
            drivers.push(newDriver);
            console.log(drivers);
            updateFile(drivers);

            // Alert user that driver was added
            alert.value.showAlert('success', `Score: ${newDriver.score.total}`, driverName.value + ' added to driver list');
            
            // Clear input fields
            driverName.value = '';
            driverScoreLine.value = ''
            driverScoreAngle.value = ''
            driverScoreStyle.value = ''

            // Emit the event to notify the parent component
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

        const updateFile = (drivers) => {
            if (selectedFile.value) {
                const file = localStorage.getItem('selectedFile')
                console.log(file, "Drivers: ", drivers);
                axios.post(`${backendUrl}/save-drivers`, {
                    drivers,
                    filename: file,
                })
                .then(response => {
                    console.log('File updated successfully', response.data.putResponse);
                    emit('driver-added');

                })
                .catch(error => {
                    console.error('There was an error updating the file!', error);
                });
            }
        };
        
        return {
            driverName,
            driverScoreLine,
            driverScoreAngle,
            driverScoreStyle,
            appendDriver,
            alert
        }
    }
}
</script>

<template>
    <vue-basic-alert :duration="300" :closeIn="2500" ref="alert" />

    <div class="row" @keyup.enter="addDriver">
        <div class="col-12">
            <input v-model="driverName" type="text" placeholder="Driver's Name"/>
        </div>
        
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
        
    </div>
    
    <div class="row">
        <div class="col-12">
            <button class="btn btn-dark" @click="appendDriver">Add Driver</button>
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