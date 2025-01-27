<template>
  <h2>Current Qualifying</h2>

  <div class="quali-container">
    <canvas id="qualifyingCanvas" width="453" height="78"></canvas>
  </div>
</template>

<script>
import { nextTick } from 'vue';
import axios from 'axios';

export default {
  name: 'CurrentQualifying',
  props: {
    currentDriver: {
      type: Object,
      required: false,
    },
  },
  methods: {
    drawCanvas(currentDriver) {
      const canvas = document.getElementById('qualifyingCanvas');
      if (!canvas) {
        console.error('Canvas element not found');
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Failed to get canvas context');
        return;
      }

      const background = new Image();
      background.src = `../images/qualifying-bg.png`; // Ensure this path is correct

      background.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height); // Draw the background image
        ctx.font = '20px FutureEarth';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';

        if (currentDriver[0]) {
          ctx.fillText(`${currentDriver[0].name}`, 130, 64);
          if (currentDriver[0].dnf) {
            ctx.fillText('DNF', 302, 64);

            if (currentDriver[0].fulldnf) {
              ctx.fillText('DNF', 414, 64);
            } else {
              if (currentDriver[0].score.total != 0) {
                ctx.fillText(`${currentDriver[0].score.total}`, 404, 64);
              }
            }
          } else {
            if (currentDriver[0].score.total != 0) {
              ctx.fillText(`${currentDriver[0].score.total}`, 310, 64);
            }
          }
        }
      };
      this.saveActiveQualiImage();
    },

    saveActiveQualiImage() {
      const backendUrl = 'https://bracket-helper-backend-y2ec.vercel.app';
      const canvas = document.getElementById('qualifyingCanvas');
      const image = canvas.toDataURL('image/png');
      const imageData = image.replace(/^data:image\/\w+;base64,/, '');

      axios.post(`${backendUrl}/save-quali-image`, { 
        image: imageData,
      })
        .then(response => {
          // this.$refs.alert.showAlert('success', 'Active Battle image saved!', 'Success');
        })
        .catch(error => {
          console.error('There was an error saving the active battle image!', error);
        });
    },
  },



  updated() {
    this.drawCanvas(this.currentDriver);
    console.log('Updated', this.currentDriver[0].name);
  },
  mounted() {
    this.drawCanvas(this.currentDriver);
  },
  beforeUnmount() {
    this.drawCanvas(this.currentDriver);
  },
};
</script>

<style scoped>
/* Add any styles you need for your component */

@font-face {
  font-family: 'FutureEarth';
  src: url('/fonts/future-earth.ttf') format('truetype');
}

@font-face {
  font-family: 'Montserrat';
  src: url('/fonts/montserrat.ttf') format('truetype');
}

.quali-container {
  display: flex;
  justify-content: center;
  margin-bottom: 100px;
}

h2 {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
  color: #333;
  font-family: FutureEarth, sans-serif;
  text-transform: uppercase;
}
</style>