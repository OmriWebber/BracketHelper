<script>

import axios from 'axios';
import { ref, toRaw, onMounted, onUnmounted, watch, computed } from 'vue'
import DriverInput from './components/driverInput.vue'
import Navbar from './components/Navbar.vue'
import VueBasicAlert from 'vue-basic-alert'
import useClipboard from 'vue-clipboard3'
import FilenameModal from './components/filenameModal.vue';
import PasswordModal from './components/passwordModal.vue';
import BracketComponent from './components/TournamentBracket.vue';

export default {
  name: 'App',
  components: {
    DriverInput,
    VueBasicAlert,
    Navbar,
    FilenameModal,
    PasswordModal,
    BracketComponent
  },
  setup () {
    const authenticated = ref(false); // Add a ref to track authentication status

    // Create refs for the new filename, selected file, and files
    const newFilename = ref('');
    const selectedFile = ref(localStorage.getItem('selectedFile'));
    const files = ref([]);

    // Create a ref for the modal
    const showModal = ref(false);

    // Create refs for the driver list, driver name, driver score, and alert
    const alert = ref()
    const cutoff = ref(32)
    const drivers = ref(JSON.parse(localStorage.getItem('drivers')) || []);
    const { toClipboard } = useClipboard()
    const tournamentBracket = ref([]);
    const backendUrl = 'https://bracket-helper-backend-y2ec.vercel.app';

    onMounted(() => {
      // Check if the user is already authenticated
      if (localStorage.getItem('authenticated') === 'true') {
        authenticated.value = true;
      }

      fetchFiles();
      if (selectedFile.value) {
        loadDrivers();
      }
    });

    async function fetchFiles() {
      axios.get(`${backendUrl}/list-files`)
        .then(response => {
          files.value = response.data.files.blobs.filter(file => file.pathname.endsWith('.json'));
        })
        .catch(error => {
          console.error('There was an error fetching the files!', error);
        });
    }

    async function loadDrivers() {
      if (selectedFile.value) {
        const filename = selectedFile.value.url;
        if(filename === undefined) {
          return;
        }
        setTimeout(() => {
          axios.get(`${backendUrl}/load-drivers?filename=${filename}`)
            .then(response => {
              drivers.value = response.data.drivers;
              localStorage.setItem('drivers', JSON.stringify(response.data.drivers))
              sortByScore();
            })
            .catch(error => {
              console.error('There was an error loading the drivers!', error);
            });
        }, 500); // Delay to allow the file to be created if it doesn't exist
      }
    }

    function createFile(filename) {
      const drivers = [];
      filename = filename + '.json';
      const file = {filename, drivers};
      axios.post(`${backendUrl}/create-file`, file)
        .then(response => {
          fetchFiles();
          localStorage.setItem('selectedFile', filename); // Save the selected file to local storage without .json
          loadDrivers(); // Load drivers for the newly selected file
          showModal.value = false;
          alert.value.showAlert('success', 'Success', `File Created ${filename}`);
        })
        .catch(error => {
          console.error('There was an error creating the file!', error);
        });
    }

    function generateTournamentBracket() {
      if (drivers.value && drivers.value.length > 0) {
        let roundName = selectedFile.value.pathname || '';
        
        const bracket = {
          round: roundName.split('.')[0],
          top32: [],
          top16: [],
          top8: [],
          top4: [],
          top2: [],
          podium: [],
          cutoff: cutoff.value
        };
        const totalDrivers = drivers.value.length;

        // Add matches
        for (let i = 0; i < cutoff.value; i++) {
          if(cutoff.value === 16) {
            if (i < totalDrivers) {
              bracket.top16.push({
                  name: drivers.value[i].name,
              });
            } else {
              bracket.top16.push({
                  name: '--'
              });
            }
          } else {
            if (i < totalDrivers) {
              bracket.top32.push({
                  name: drivers.value[i].name,
              });
            } else {
              bracket.top32.push({
                  name: '--'
              });
            }
          }
          
        }


        tournamentBracket.value = bracket;
        alert.value.showAlert('success', 'Scroll down to view bracket', `Bracket generated for top ${cutoff.value}`);
      } else {
        console.error('No drivers loaded to generate the tournament bracket.');
      }
    }

    // Sort the driver list by score
    const sortByScore = () => {
      let sortedDrivers = drivers.value.sort((a, b) => {
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
      updateFile(sortedDrivers);
      localStorage.setItem('drivers', JSON.stringify(sortedDrivers));
    }

    // Copy to Clipboard
    const copyToClipboard = async () => {
      
      let text = ''
      for (let i = 0; i < drivers.value.length; i++) {
        text += i+1 + ". " + drivers.value[i].name + ': ' + drivers.value[i].score.total + '\n'
      }

      try {
        await toClipboard(text)
        alert.value.showAlert('success', 'Copied to Clipboard', 'Driver List Successfully Copied')

      } catch (e) {
        console.error(e)
        alert.value.showAlert('error', 'Unable to perform action', 'Error copying driver list')

      }
    }

    // Remove a driver from the list by index and show an alert
    const removeDriver = (index) => {
      if (index >= 0 && index < drivers.value.length) {
        const driver = drivers.value[index];
        if (driver) {
          const driverName = driver.name || 'Unknown';
          const driverScore = driver.score || { line: 0, angle: 0, style: 0, total: 0 };
          drivers.value.splice(index, 1);
          localStorage.setItem('drivers', JSON.stringify(drivers.value));
          updateFile(drivers.value);
          alert.value.showAlert('error', `Score: ${driverScore.total}`, `${driverName} removed from driver list`);
        } else {
          console.error('Driver at index is undefined:', index);
        }
      } else {
        console.error('Invalid index:', index);
      }
    };

    const updateFile = (drivers) => {
      if (selectedFile) {
        axios.post(`${backendUrl}/save-drivers`, {
          drivers,
          filename: selectedFile.value.pathname
        })
        .then(response => {
        })
        .catch(error => {
          console.error('There was an error updating the file!', error);
        });
      }
    };

    // Watch for changes in the selected file and save it to local storage
    watch(selectedFile, (newFile) => {
      alert.value.showAlert('success', 'Changed selected file, loading drivers..', 'File changed to ' + newFile.pathname);
      localStorage.setItem('selectedFile', newFile.pathname);
      loadDrivers();
    });
    
    return {
      authenticated,
      loadDrivers,
      showModal,
      createFile,
      newFilename,
      selectedFile,
      files,
      drivers,
      sortByScore,
      cutoff,
      removeDriver,
      alert,
      tournamentBracket,
      generateTournamentBracket,
      copyToClipboard
    }
  }
}
</script>

<template>
    <vue-basic-alert :duration="300" :closeIn="3000" ref="alert" />

    <Navbar />
    <main>
      
      <div class="container">
        <PasswordModal :show="!authenticated" @authenticated="authenticated = true" />
        <div class="row" v-if="authenticated">
          <div class="col-md-6">
            <img class="herologo" src="/images/logoalt.png" alt="" width="100">
            <p class="intro-text text-center">
              Welcome to Bracket Helper! This app is designed to help you keep track of your bracket scores for tournaments. Simply select an existing file or create a new file to start entering in driver names and scores. The app will then keep track of the scores for you and display them on the FDE website.
            </p>
            <div class="container">
              <div class="row">
                <div class="col-7 mx-auto">
                  <div class="row fileSelect">
                    <select v-model="selectedFile" class="dropdownInput">
                      <option v-for="file in files" :key="file" :value="file">{{ file.pathname }}</option>
                    </select>
                    <button class="btn btn-success" @click="showModal = true">New File</button>
                  </div>
                </div>
              </div>
              <DriverInput @driver-added="loadDrivers" />
              

            </div>
            
          </div>
          <div class="col-md-6">
            <div class="row">
                <div class="col-12">
                  <h3 class="driver-list-title">Driver List</h3>
                </div>
                <div class="controls col-12">
                  <select v-model="cutoff" name="cutoff" id="cutoff">
                    <option value="16">Top 16</option>
                    <option value="32">Top 32</option>
                  </select>
                  <div>
                    <button class="btn btn-primary" style="margin-right: 0px;" @click="copyToClipboard">
                      <i class="bi-clipboard"></i> Copy
                    </button>
                  </div>
                </div>
            </div>
            <p v-if="drivers.length == 0" class="text-center" style="margin-top:30px;">No drivers added yet.</p>
            <ul class="driver-list">
              
              <li v-for="(driver, index) in drivers" :key="index">
                <a class="btn remove-button" @click="removeDriver(index)"><i class="bi-x-lg"></i></a>
                <span class="orderCounter">{{ index + 1 }}</span>
                <span class="driverName">{{ driver.name }}</span>
                <span class="driverScore">
                  <span class="muted">
                    {{ driver.score?.line ?? 0 }} / {{ driver.score?.angle ?? 0 }} / {{ driver.score?.style ?? 0 }}
                  </span>
                <span class="muted"> - Total:</span> {{ driver.score?.total ?? 0 }}</span>
                <div class="cutoff-line" v-if="index == cutoff - 1">Top {{ cutoff }} Cutoff</div>
              </li>
            </ul>
            <div class="generate-button-container">
              <button class="btn btn-info" @click="generateTournamentBracket">Generate Bracket</button>
            </div>
            
          </div>
        </div>
        <BracketComponent :bracket="tournamentBracket" />
      </div>

      <footer class="text-light text-center text-lg-start">
        <!-- Copyright -->
        <div class="text-center p-3" style="background-color: rgba(0, 0, 0, 0.2);">
          Made with <img width="20" height="20" src="/images/heart.png" alt="like--v1"/> by <img height="20" src="/images/soup2.png"/>
          
        </div>
        <!-- Copyright -->
      </footer>
    </main>
    
    <FilenameModal :show="showModal" @close="showModal = false" @submit="createFile" />
</template>

<style scoped>

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 0px;
}

footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #202020;
}
.remove-button {
  margin: 0.5rem;
  padding:2px 8px;
  border-radius: 0.5rem;
  font-weight: 600;
  color: rgb(196, 22, 22);
}

.cutoff-line {
  color: rgb(196, 22, 22);
  font-weight: 600;
  padding: 20px 0px 10px;
  display: flex;
  align-items: center;
  text-align: center;
}

.cutoff-line::before,
.cutoff-line::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #000;
}

.cutoff-line:not(:empty)::before {
  margin-right: .25em;
}

.fileSelect {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;

  select {
    width: 100%;
    margin-right: 10px;
  }

  button {
    width: 50%;
  }
}

.separator:not(:empty)::after {
  margin-left: .25em;
}
  .driver-list-title {
    margin-top: 12px;
    text-align: center;
  }

  .herologo {
    margin: 0 auto;
    display: block;
  }

  .orderCounter {
    margin: 30px;
  }
  .driverScore {
    margin-top: 10px;
    margin-right: 40px;
    float:right;
  }

  .intro-text {
    margin-left: 20px;
  }

  .muted {
    color: #575757;
    font-size: 0.8rem;
  }

  .driver-list {
    list-style: none;
    padding-left: 0;
    max-height: 400px;
    overflow-y: scroll;
  }

  .driver-list li {
    padding: 10px;
    background-color: rgba(238, 238, 238, 0.527);

  }

  .driver-list li:nth-child(even) {
    background-color: rgba(184, 184, 184, 0.493);
  }

  #cutoff, .dropdownInput {
    vertical-align: middle;
    padding: 8px;
    height: 40px;
    border-radius: 5px;
    margin: 10px 0px;
  }

  

  .sub-btn {
    padding: 7px;
    width: 100%;
    margin: 0px;
  }

  button {
    margin: 0.5rem 0.3rem;
    padding: 0.5rem 1.2rem;
    border-radius: 0.5rem;
    border: 1px solid #ccc;
  }

  .my-dropdown-toggle {
  border-radius: 5px;

  ::v-deep .dropdown-toggle {
    color: tomato;
    font-size: 25px;
    font-weight: 800;
  }

  ::v-deep .dropdown-toggle-placeholder {
    color: #c4c4c4;
  }
}

.generate-button-container {
  display: flex;
  justify-content: center;
  margin-top: 0px;
}

</style>
