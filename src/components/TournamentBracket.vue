<template>
  <vue-basic-alert :duration="300" :closeIn="3000" ref="alert" />

  <div class="bracket-container">
    <h2 class="bracket-title">Tournament Bracket</h2>
    <canvas id="bracketCanvas" width="1920" height="1080" @click="handleClick"></canvas>
    <div class="bracket-action-container" v-if="showButton" :style="buttonStyle">
      <button class="bracket-advance-button" @click="advanceDriver">{{ this.advanceText }}</button>
      <button class="bracket-setactive-button" @click="setActiveBattle">Set Active</button>
      <button class="bracket-dq-button" @click="disqualifyDriver">DQ</button>
      <button class="bracket-delete-button" v-if="showDeleteButton" @click="deleteDriver"><img src="/images/x.svg" alt="Delete Button"/></button>
    </div>
    <div class="bracket-button-container">
      <div class="bracket-clear-button-container">
        <button @click="clearTop16">Clear Top 16</button>
        <button @click="clearTop8">Clear Top 8</button>
        <button @click="clearTop4">Clear Top 4</button>
        <button @click="clearTop2">Clear Top 2</button>
        <button @click="clearPodium">Clear Podium</button>
        <button @click="clearAll">Clear All Bracket Progress</button>
      </div>

      <div class="bracket-export-button-container">
        <button class="copy" @click="copyBracketDataToClipboard">Copy Bracket Data</button>
        <button class="export" @click="exportBracketImage">Export Bracket Image</button>
        <button class="url" @click="saveBracketImageToURL">Save Image to Custom Static URL</button>
      </div>
    </div>
  </div>
  <saveBracketImageModal :show="showModal" :outputUrl="outputUrl" @close="showModal = false" @save="saveImageWithFileName"></saveBracketImageModal>

  <div class="active-battle-container">
    <h2 class="battle-title">Active Battle</h2>
      <canvas id="activeBattleCanvas" width="1920" height="1080"></canvas>
  </div>
</template>

<script>
import { ref, toRaw, onMounted, onUnmounted, onUpdated, watch, computed } from 'vue'
import axios from 'axios';
import VueBasicAlert from 'vue-basic-alert'
import saveBracketImageModal from './saveBracketImageModal.vue'


export default {
  name: 'BracketComponent',
  components: {
    VueBasicAlert,
    saveBracketImageModal,
  },
  props: {
    bracket: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      showButton: false,
      showDeleteButton: false,
      advanceText : 'Advance',
      buttonStyle: {
        position: 'absolute',
        top: '0px',
        left: '0px',
        zIndex: '100',
      },
      hoveredDriver: null,
      showModal: false,
      outputUrl: '',
    };
  },
  methods: {
    saveBracket() {
      localStorage.setItem('bracket', JSON.stringify(this.bracket));
    },
    drawBracket() {
      if(this.bracket) {
        const localBracket = JSON.parse(localStorage.getItem('bracket'));

        const canvas = document.getElementById('bracketCanvas');
        const ctx = canvas.getContext('2d');
        const background = new Image();
        if (this.bracket.round) {
          background.src = `../images/${this.bracket.round}-bracket-bg.png`; // Ensure this path is correct
        } else {
          background.src = `../images/bracket-bg.png`; // Ensure this path is correct
        }

        // Load the custom font
        const font = new FontFace('FutureEarth', 'url(/fonts/future-earth.ttf)');
        font.load();
        document.fonts.add(font);

        background.onload = async () => {
          // Clear the canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw the background image
          ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

          // Draw each match
          this.bracket.top32.forEach((driver, index) => {
            let xPosition, yPosition;

            // Set text properties
            ctx.font = '18px FutureEarth';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';

            switch (index) {
              case 0:
                xPosition = 140;
                yPosition = 100;
                break;
              case 1:
                xPosition = canvas.width - 140;
                yPosition = 100;
                break;
              case 2:
                xPosition = canvas.width - 140;
                yPosition = canvas.height - 478;
                break;
              case 3:
                xPosition = 140;
                yPosition = canvas.height - 478;
                break;
              case 4:
                xPosition = 140;
                yPosition = canvas.height - 249;
                break;
              case 5:
                xPosition = canvas.width - 140;
                yPosition = canvas.height - 249;
                break;
              case 6:
                xPosition = canvas.width - 140;
                yPosition = 332;
                break;
              case 7:
                xPosition = 140;
                yPosition = 332;
                break;
              case 8:
                xPosition = 140;
                yPosition = 448;
                break;
              case 9:
                xPosition = canvas.width - 140;
                yPosition = 448;
                break;
              case 10:
                xPosition = canvas.width - 140;
                yPosition = 948;
                break;
              case 11:
                xPosition = 140;
                yPosition = 947;
                break;
              case 12:
                xPosition = 140;
                yPosition = 716;
                break;
              case 13:
                xPosition = canvas.width - 140;
                yPosition = 718;
                break;
              case 14:
                xPosition = canvas.width - 140;
                yPosition = 216;
                break;
              case 15:
                xPosition = 140;
                yPosition = 216;
                break;
              case 16:
                xPosition = 140;
                yPosition = 256;
                break;
              case 17:
                xPosition = canvas.width - 140;
                yPosition = 256;
                break;
              case 18:
                xPosition = canvas.width - 140;
                yPosition = 759;
                break;
              case 19:
                xPosition = 140;
                yPosition = 756;
                break;
              case 20:
                xPosition = 140;
                yPosition = 988;
                break;
              case 21:
                xPosition = canvas.width - 140;
                yPosition = 988;
                break;
              case 22:
                xPosition = canvas.width - 140;
                yPosition = 488;
                break;
              case 23:
                xPosition = 140;
                yPosition = 488;
                break;
              case 24:
                xPosition = 140;
                yPosition = 371;
                break;
              case 25:
                xPosition = canvas.width - 140;
                yPosition = 371;
                break;
              case 26:
                xPosition = canvas.width - 140;
                yPosition = 872;
                break;
              case 27:
                xPosition = 140;
                yPosition = 872;
                break;
              case 28:
                xPosition = 140;
                yPosition = 640;
                break;
              case 29:
                xPosition = canvas.width - 140;
                yPosition = 640;
                break;
              case 30:
                xPosition = canvas.width - 140;
                yPosition = 140;
                break;
              case 31:
                xPosition = 140;
                yPosition = 140;
                break;
            }

            const driverText = `${driver.name} ${driver.disqualified ? '(DQ)' : ''}`;
            ctx.fillText(driverText, xPosition, yPosition);
            driver.position = { driverX: xPosition, driverY: yPosition }; // Save position for hover detection
            driver.order = index + 1
            driver.round = 32

          });
          ctx.font = 'italic 50px FutureEarth';
          ctx.fillStyle = 'white';

          ctx.fillText(this.bracket.round, canvas.width / 2, (canvas.height / 2) + 12);

          let top16 = this.bracket.top16;
          if(top16.length > 0) {
            ctx.font = '18px FutureEarth';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';

            top16.forEach((top16driver, index) => {
              let xPosition, yPosition, order;

              switch (top16driver.order) {
                case 1:
                case 32: 
                  xPosition = 340;
                  yPosition = 118;
                  order = 1;
                  break;
                case 2:
                case 31:
                  xPosition = canvas.width - 340;
                  yPosition = 118;
                  order = 2;
                  break;
                case 3:
                case 30:
                  xPosition = canvas.width - 340;
                  yPosition = 618;
                  order = 3;
                  break;
                case 4:
                case 29:
                  xPosition = 340;
                  yPosition = 618;
                  order = 4;
                  break;
                case 5:
                case 28:
                  xPosition = 340;
                  yPosition = 849;
                  order = 5;
                  break;
                case 6:
                case 27:
                  xPosition = canvas.width - 340;
                  yPosition = 849;
                  order = 6;
                  break;
                case 7:
                case 26:
                  xPosition = canvas.width - 340;
                  yPosition = 348;
                  order = 7;
                  break;
                case 8:
                case 25:
                  xPosition = 340;
                  yPosition = 348;
                  order = 8;
                  break;
                case 9:
                case 24:
                  xPosition = 340;
                  yPosition = 466;
                  order = 9;
                  break;
                case 10:
                case 23:
                  xPosition = canvas.width - 340;
                  yPosition = 466;
                  order = 10;
                  break;
                case 11:
                case 22:
                  xPosition = canvas.width - 340;
                  yPosition = 966;
                  order = 11;
                  break;
                case 12:
                case 21:
                  xPosition = 340;
                  yPosition = 966;
                  order = 12;
                  break;
                case 13:
                case 20:
                  xPosition = 340;
                  yPosition = 733;
                  order = 13;
                  break;
                case 14:
                case 19:
                  xPosition = canvas.width - 340;
                  yPosition = 733;
                  order = 14;
                  break;
                case 15:
                case 18:
                  xPosition = canvas.width - 340;
                  yPosition = 232;
                  order = 15;
                  break;
                case 16:
                case 17:
                  xPosition = 340;
                  yPosition = 232;
                  order = 16;
                  break;
              }

              const driverText = `${top16driver.name} ${top16driver.disqualified ? '(DQ)' : ''}`;
              ctx.fillText(driverText, xPosition, yPosition);
              top16driver.position = { driverX: xPosition, driverY: yPosition }; // Save position for hover detection
              top16driver.order = order
              top16driver.round = 16
            });
          }

          let top8 = this.bracket.top8;
          if(top8.length > 0) {
            ctx.font = '18px FutureEarth';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';

            top8.forEach((top8driver, index) => {
              let xPosition, yPosition, order;

              switch (top8driver.order) {
                case 1:
                case 16: 
                  xPosition = 546;
                  yPosition = 177;
                  order = 1;
                  break;
                case 2:
                case 15:
                  xPosition = canvas.width - 546;
                  yPosition = 177;
                  order = 2;
                  break;
                case 3:
                case 14:
                  xPosition = canvas.width - 546;
                  yPosition = 678;
                  order = 3;
                  break;
                case 4:
                case 13:
                  xPosition = 546;
                  yPosition = 678;
                  order = 4;
                  break;
                case 5:
                case 12:
                  xPosition = 546;
                  yPosition = 908;
                  order = 5;
                  break;
                case 6:
                case 11:
                  xPosition = canvas.width - 546;
                  yPosition = 908;
                  order = 6;
                  break;
                case 7:
                case 10:
                  xPosition = canvas.width - 546;
                  yPosition = 409;
                  order = 7;
                  break;
                case 8:
                case 9:
                  xPosition = 546;
                  yPosition = 409;
                  order = 8;
                  break;
              }

              const driverText = `${top8driver.name} ${top8driver.disqualified ? '(DQ)' : ''}`;
              ctx.fillText(driverText, xPosition, yPosition);
              top8driver.position = { driverX: xPosition, driverY: yPosition }; // Save position for hover detection
              top8driver.order = order
              top8driver.round = 8
            });
          }

          let top4 = this.bracket.top4;
          if(top4.length > 0) {
            ctx.font = '16px FutureEarth';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';

            top4.forEach((top4driver, index) => {
              let xPosition, yPosition, order;

              switch (top4driver.order) {
                case 1:
                case 8: 
                  xPosition = 754;
                  yPosition = 292;
                  order = 1;
                  break;
                case 2:
                case 7:
                  xPosition = canvas.width - 754;
                  yPosition = 292;
                  order = 2;
                  break;
                case 3:
                case 6:
                  xPosition = canvas.width - 754;
                  yPosition = 791;
                  order = 3;
                  break;
                case 4:
                case 5:
                  xPosition = 754;
                  yPosition = 791;
                  order = 4;
                  break;
              }
              const driverText = `${top4driver.name} ${top4driver.disqualified ? '(DQ)' : ''}`;
              ctx.fillText(driverText, xPosition, yPosition);
              top4driver.position = { driverX: xPosition, driverY: yPosition }; // Save position for hover detection
              top4driver.order = order
              top4driver.round = 4
            });
          }

          let top2 = this.bracket.top2;
          if(top2.length > 0) {
            ctx.font = '18px FutureEarth';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';

            top2.forEach((top2driver, index) => {
              let xPosition, yPosition, order;

              switch (top2driver.order) {
                case 1:
                case 4: 
                  xPosition = 960;
                  yPosition = 466;
                  order = 1;
                  break;
                case 2:
                case 3:
                  xPosition = canvas.width - 960;
                  yPosition = 619;
                  order = 2;
                  break;
              }
              const driverText = `${top2driver.name} ${top2driver.disqualified ? '(DQ)' : ''}`;
              ctx.fillText(driverText, xPosition, yPosition);
              top2driver.position = { driverX: xPosition, driverY: yPosition }; // Save position for hover detection
              top2driver.order = order
              top2driver.round = 2
            });
          }

          let podium = this.bracket.podium;
          if(podium.length > 0) {
            ctx.font = '18px FutureEarth';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';

            podium.forEach((podiumDriver, index) => {
              let xPosition, yPosition, order;

              switch (podiumDriver.order) {
                case 1:
                  xPosition = 960;
                  yPosition = 890;
                  order = 1;
                  break;
                case 2:
                  xPosition = 754;
                  yPosition = 1008;
                  order = 2;
                  break;
                case 3:
                  xPosition = canvas.width - 754;
                  yPosition = 1008;
                  order = 3;
                  break;
              }
              const driverText = `${podiumDriver.name}`;
              ctx.fillText(driverText, xPosition, yPosition);
              podiumDriver.position = { driverX: xPosition, driverY: yPosition }; // Save position for hover detection
              podiumDriver.order = order
              podiumDriver.round = 'podium'
            });
          }

          

          this.saveBracket();
          this.saveBracketImage();
        };
      }
    },
    drawTop16Bracket() {
      const canvas = document.getElementById('bracketCanvas');
      const ctx = canvas.getContext('2d');
      ctx.fillText('Top 16 Bracket', canvas.width / 2, 50);
    },
    async saveBracketImage() {
      const backendUrl = 'https://bracket-helper-backend-y2ec.vercel.app';
      const canvas = document.getElementById('bracketCanvas');
      const image = canvas.toDataURL('image/png');
      const imageData = image.replace(/^data:image\/\w+;base64,/, '');

      axios.post(`${backendUrl}/save-bracket-image`, { 
        image: imageData,
      })
        .then(response => {
          this.$refs.alert.showAlert('success', 'Bracket image saved!', 'Success');
        })
        .catch(error => {
          this.$refs.alert.showAlert('error', 'Error saving bracket image', 'Fail');
          console.error('There was an error saving the bracket image!', error);
        });
    },
    handleClick(event) {
      const canvas = document.getElementById('bracketCanvas');
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) * (canvas.width / rect.width);
      const y = (event.clientY - rect.top) * (canvas.height / rect.height);

      const xRatio = 1920 / rect.width;
      const yRatio = 1080 / rect.height;

      this.hoveredDriver = this.bracket.top32.find(driver => {
        const { driverX, driverY } = driver.position;
        return x >= driverX - 80 && x <= driverX + 80 && y >= driverY - 20 && y <= driverY + 20; // Adjust these values based on text size
      });

      if (this.hoveredDriver) {
        this.showButton = true;
        if(this.hoveredDriver.round === 16 || this.hoveredDriver.round === 8 || this.hoveredDriver.round === 4 || this.hoveredDriver.round === 2 || this.hoveredDriver.round === 'podium') {
          this.showDeleteButton = true;
        }
        const buttonTop = y / yRatio + 70; // Adjust button position
        const buttonLeft = x / xRatio - 60; // Adjust button position

        this.buttonStyle.top = `${buttonTop}px`;
        this.buttonStyle.left = `${buttonLeft}px`;
        this.advanceText = `Advance ${this.hoveredDriver.name}`;
      } else {
        this.showButton = false;
        this.showDeleteButton = false;
      }
    },
    hideButton() {
      this.showButton = false;
      this.showDeleteButton = false;
    },
    advanceDriver() {
      if (this.hoveredDriver) {
        if(this.hoveredDriver.round === 32) {
          this.bracket.top16.push(this.hoveredDriver);
          this.$refs.alert.showAlert('success', `${this.hoveredDriver.name} advanced!`, 'Success');
          this.showButton = false;
        } else if (this.hoveredDriver.round === 16) {
          this.bracket.top8.push(this.hoveredDriver);
          this.$refs.alert.showAlert('success', `${this.hoveredDriver.name} advanced!`, 'Success');
          this.showButton = false;
        } else if (this.hoveredDriver.round === 8) {
          this.bracket.top4.push(this.hoveredDriver);
          this.$refs.alert.showAlert('success', `${this.hoveredDriver.name} advanced!`, 'Success');
          this.showButton = false;
        } else if (this.hoveredDriver.round === 4) {
          this.bracket.top2.push(this.hoveredDriver);
          this.$refs.alert.showAlert('success', `${this.hoveredDriver.name} advanced!`, 'Success');
          this.showButton = false;
        } else if (this.hoveredDriver.round === 2) {
          this.bracket.podium = [];
          const firstPlace = this.hoveredDriver;
          const secondPlace = this.bracket.top2.find(driver => driver !== firstPlace);
          const remainingTop4 = this.bracket.top4.filter(driver => driver !== firstPlace && driver !== secondPlace);
          const thirdPlace = remainingTop4.reduce((prev, curr) => {
            const prevOrder = this.bracket.top32.find(driver => driver.name === prev.name).order;
            const currOrder = this.bracket.top32.find(driver => driver.name === curr.name).order;
            return prevOrder < currOrder ? prev : curr;
          });
          this.bracket.podium.push(
            { ...firstPlace, order: 1, round: 'podium' },
            { ...secondPlace, order: 2, round: 'podium' },
            { ...thirdPlace, order: 3, round: 'podium' }
          );

          this.$refs.alert.showAlert('success', `${this.hoveredDriver.name} advanced!`, 'Success');
          this.showButton = false;
        }
      }
    },

    deleteDriver() {
      if (this.hoveredDriver) {
        if(this.hoveredDriver.round === 16) {
          this.bracket.top16 = this.bracket.top16.filter(driver => driver !== this.hoveredDriver);
          this.$refs.alert.showAlert('success', `${this.hoveredDriver.name} removed!`, 'Success');
          this.showButton = false;
          this.showDeleteButton = false;

        }
        if(this.hoveredDriver.round === 8) {
          this.bracket.top8 = this.bracket.top8.filter(driver => driver !== this.hoveredDriver);
          this.$refs.alert.showAlert('success', `${this.hoveredDriver.name} removed!`, 'Success');
          this.showButton = false;
          this.showDeleteButton = false;

        }
        if(this.hoveredDriver.round === 4) {
          this.bracket.top4 = this.bracket.top4.filter(driver => driver !== this.hoveredDriver);
          this.$refs.alert.showAlert('success', `${this.hoveredDriver.name} removed!`, 'Success');
          this.showButton = false;
          this.showDeleteButton = false;
        }
        if(this.hoveredDriver.round === 2) {
          this.bracket.top2 = this.bracket.top2.filter(driver => driver !== this.hoveredDriver);
          this.$refs.alert.showAlert('success', `${this.hoveredDriver.name} removed!`, 'Success');
          this.showButton = false;
          this.showDeleteButton = false;
        }
        if(this.hoveredDriver.round === 'podium') {
          this.bracket.podium = this.bracket.podium.filter(driver => driver !== this.hoveredDriver);
          this.$refs.alert.showAlert('success', `${this.hoveredDriver.name} removed!`, 'Success');
          this.showButton = false;
          this.showDeleteButton = false;
        }
      }
    },

    disqualifyDriver() {
      if (this.hoveredDriver) {
        if(this.hoveredDriver.disqualified) {
          this.hoveredDriver.disqualified = false;
        } else {
          this.hoveredDriver.disqualified = true;
        }
      }
    },

    clearTop16() {
      this.bracket.top16 = [];
      this.saveBracket();
      this.drawBracket();
    },

    clearTop8() {
      this.bracket.top8 = [];
      this.saveBracket();
      this.drawBracket();
    },

    clearTop4() {
      this.bracket.top4 = [];
      this.saveBracket();
      this.drawBracket();
    },

    clearTop2() {
      this.bracket.top2 = [];
      this.saveBracket();
      this.drawBracket();
    },

    clearPodium() {
      this.bracket.podium = [];
      this.saveBracket();
      this.drawBracket();
    },

    clearAll() {
      this.bracket.top16 = [];
      this.bracket.top8 = [];
      this.bracket.top4 = [];
      this.bracket.top2 = [];
      this.bracket.podium = [];
      this.saveBracket();
      this.drawBracket();
    },

    copyBracketDataToClipboard() {
      const bracketData = JSON.stringify(this.bracket);
      navigator.clipboard.writeText(bracketData);
      this.$refs.alert.showAlert('success', 'Bracket data copied to clipboard!', 'Success');
    },

    exportBracketImage() {
      const canvas = document.getElementById('bracketCanvas');
      const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      const link = document.createElement('a');
      link.download = 'bracket.png';
      link.href = image;
      link.click();
    },

    saveBracketImageToURL() {
      this.showModal = true;
      this.outputUrl = '';
    },
    async saveImageWithFileName(fileName) {
      const canvas = document.getElementById('bracketCanvas');
      const image = canvas.toDataURL('image/png');
      const imageData = image.replace(/^data:image\/\w+;base64,/, '');

      const backendUrl = 'https://bracket-helper-backend-y2ec.vercel.app';
      try {
        const response = await axios.post(`${backendUrl}/save-bracket-image-to-url`, {
          image: imageData,
          fileName: fileName,
        });
        this.outputUrl = response.data.url; // Assuming the response contains the URL
        this.$refs.alert.showAlert('success', 'Bracket image saved with filename!', 'Success');
      } catch (error) {
        this.$refs.alert.showAlert('error', 'Error saving bracket image with filename', 'Error');
        console.error('There was an error saving the bracket image with filename!', error);
      }
    },
    async setActiveBattle() {
      if (this.hoveredDriver) {
        this.bracket.activeBattle.lead = await this.hoveredDriver;
        const opponentOrder = (this.bracket.activeBattle.round + 1) - this.hoveredDriver.order;
        const opponent = this.bracket.top32.find(driver => driver.order === opponentOrder);
        this.bracket.activeBattle.chase = opponent;
        this.bracket.activeBattle.round = this.hoveredDriver.round;
        this.drawActiveBattle();
        this.$refs.alert.showAlert('success', `Lead Driver ${this.hoveredDriver.name} vs Chase Driver ${opponent.name} set as active battle!`, 'Success');
      }
    },
    drawActiveBattle() {
      const canvas = document.getElementById('activeBattleCanvas');
      const ctx = canvas.getContext('2d');
      const background = new Image();
      background.src = '../images/battle-bg.png'; // Ensure this path is correct

      // Load the custom font
      const font = new FontFace('FutureEarth', 'url(/fonts/future-earth.ttf)');
      font.load();
      document.fonts.add(font);

      background.onload = async () => {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the background image
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Draw the active battle
        ctx.font = '18px FutureEarth';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';

        const xPositionLead = 960;
        const yPositionLead = 564;

        const xPositionChase = 960;
        const yPositionChase = 640;

        const leadDriverText = `${this.bracket.activeBattle.lead.name}`;
        const chaseDriverText = `${this.bracket.activeBattle.chase.name}`;
        ctx.fillText(leadDriverText, xPositionLead, yPositionLead);
        ctx.fillText(chaseDriverText, xPositionChase, yPositionChase);
      };
      this.saveActiveBattleImage();
    },
    saveActiveBattleImage() {
      const backendUrl = 'https://bracket-helper-backend-y2ec.vercel.app';
      const canvas = document.getElementById('activeBattleCanvas');
      const image = canvas.toDataURL('image/png');
      const imageData = image.replace(/^data:image\/\w+;base64,/, '');

      axios.post(`${backendUrl}/save-active-battle-image`, { 
        image: imageData,
      })
        .then(response => {
          this.$refs.alert.showAlert('success', 'Active Battle image saved!', 'Success');
        })
        .catch(error => {
          this.$refs.alert.showAlert('error', 'Error saving active battle image', 'Fail');
          console.error('There was an error saving the active battle image!', error);
        });
    },

  },
  mounted() {
    this.drawBracket();
  },
  updated() {
    this.drawBracket();
  },
};
</script>

<style scoped>

@font-face {
  font-family: 'FutureEarth';
  src: url('/fonts/future-earth.ttf') format('truetype');
}

@font-face {
  font-family: 'Montserrat';
  src: url('/fonts/montserrat.ttf') format('truetype');
}

.bracket {
  padding-top: 40px;
  padding-bottom: 80px;
}

.bracket-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
  color: #333;
  font-family: FutureEarth, sans-serif;
  text-transform: uppercase;
}

.bracket-container {
  padding-top: 40px;
  padding-bottom: 80px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-top: 80px;
  font-family: FutureEarth, sans-serif;
  position: relative;
}

.bracket-side {
  width: 45%;
}

.bracket-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.bracket-item {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px 20px;
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.match-number {
  font-weight: bold;
  color: #555;
}

.driver-name {
  font-size: 18px;
  color: #222;
}

#bracketCanvas, #activeBattleCanvas {
  width: 100%;
  height: auto;
}

.bracket-button-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 8px;

  .bracket-clear-button-container {
    display: flex;
    flex-direction: row;
    gap: 8px;
    justify-content: center;
    margin-top: 8px;

    button {
      font-family: 'Montserrat', sans-serif;
      padding: 4px 12px;
      background-color: #222;
      color:white;
      border: 1px solid #212121;
      border-radius: 4px;
      font-weight: 500;
      font-size: 14px;
      transition: background-color 0.2s;

      &:hover {
        background-color: #484848;
      }
    }
  }

  .bracket-export-button-container {
    display: flex;
    flex-direction: row;
    gap: 8px;
    justify-content: center;
    margin-top: 8px;

    button.export {
      /* text-transform: uppercase; */
      font-family: 'Montserrat', sans-serif;
      padding: 4px 12px;
      background-color: #009d47;
      color:black;
      border: 1px solid #212121;
      border-radius: 4px;
      font-weight: 500;
      font-size: 14px;
      transition: background-color 0.2s;

      &:hover {
        background-color: #007c38;
      }
    }

    button.copy {
      /* text-transform: uppercase; */
      font-family: 'Montserrat', sans-serif;
      padding: 4px 12px;
      background-color: #0080ff;
      color:black;
      border: 1px solid #212121;
      border-radius: 4px;
      font-weight: 500;
      font-size: 14px;
      transition: background-color 0.2s;

      &:hover {
        background-color: #0065ca;
      }
    }

    button.url {
      /* text-transform: uppercase; */
      font-family: 'Montserrat', sans-serif;
      padding: 4px 12px;
      background-color: #ff9500;
      color:black;
      border: 1px solid #212121;
      border-radius: 4px;
      font-weight: 500;
      font-size: 14px;
      transition: background-color 0.2s;

      &:hover {
        background-color: #ca7d00;
      }
    }
  }
}


.bracket-action-container {
  display: flex;
  justify-content: center;
  align-items: stretch;
  width: auto;
  height: auto;
  gap: 1px;
}

.bracket-advance-button {
  font-size: 12px;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  border: 1px solid #212121;
  border-radius: 4px 4px 4px 4px;
  white-space: nowrap;
  background-color: #ffffff;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #d3d3d3;
  }
}

.bracket-setactive-button {
  font-size: 12px;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  border: 1px solid #212121;
  border-radius: 4px 4px 4px 4px;
  white-space: nowrap;
  background-color: #ffffff;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #d3d3d3;
  }
}

.bracket-dq-button {
  font-size: 12px;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  border: 1px solid #212121;
  border-radius: 4px 4px 4px 4px;
  white-space: nowrap;
  background-color: #ffffff;
  transition: background-color 0.2s;

  &:hover {
    background-color: #d3d3d3;
  }
}

.bracket-delete-button {
  font-size: 12px;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  border: 1px solid #212121;
  border-radius: 4px 4px 4px 4px;
  background-color: #ffffff;
  transition: background-color 0.2s;

  &:hover {
    background-color: #d3d3d3;
  }

  img {
    margin-top: -3px;
    width: 12px;
    height: 12px;
  }
}

.active-battle-container {
  padding: 40px 0px 120px 0px;
  overflow: hidden;


  .battle-title {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-top: 20px;
    margin-bottom: 20px;
    color: #333;
    font-family: FutureEarth, sans-serif;
    text-transform: uppercase;
  }
}

#activeBattleCanvas {
  transform: scale(3);
}
</style>