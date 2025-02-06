<template>
  <vue-basic-alert :duration="300" :closeIn="3000" ref="alert" />
  <h2>Current Scores</h2>
  <div class="scores-container">
    <canvas id="currentScoresCanvas" width="1514" height="79"></canvas>
  </div>

</template>

<script>
import { nextTick } from 'vue';
import axios from 'axios';
import VueBasicAlert from 'vue-basic-alert'

export default {
  name: 'CurrentScores',
  components: {
    VueBasicAlert
  },
  props: {
    drivers: {
      type: Array,
      required: false,
    },
  },
  methods: {
    drawCanvas(drivers) {
      const canvas = document.getElementById('currentScoresCanvas');
      if (!canvas) {
        console.error('Canvas element not found');
        return;
      }
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        console.error('Failed to get canvas context');
        return;
      }

      const background = new Image();
      background.src = `../images/current-scores-bg.png`; // Ensure this path is correct

      background.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height); // Draw the background image
        ctx.font = '25px FutureEarth';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'left';

        let driverScores = '';
        for (let i = 0; i < drivers.length; i++) {
          driverScores += (i+1) + '. ' + drivers[i].name + ' - ' + drivers[i].score.total + '    ';
        }

        let animationCompleted = false;
        let renderStarted = false;


        const stream = canvas.captureStream(60); // Capture the canvas stream at 60fps
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/mp4; codecs=vp9'
        });

        const chunks = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const blob = new Blob(chunks, { type: 'video/mp4' });
          const url = URL.createObjectURL(blob);
          const video = document.createElement('video');
          video.src = url;
          video.loop = true;
          video.controls = false;
          video.autoplay = true;
          video.muted = true;

          // Create a FormData object and append the Blob
          const formData = new FormData();
          formData.append('file', blob, 'current-scores.webm');

          // Send the FormData object via an API POST request
          try {
            const response = await axios.post('https://bracket-helper-backend-y2ec.vercel.app/save-scores-video', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
            console.log('Video uploaded successfully:', response.data);
            this.$refs.alert.showAlert('success', 'Current Scores Saved!', 'Success');
          } catch (error) {
            console.error('Error uploading video:', error);
          }
        };

        mediaRecorder.start();

        let xPos = canvas.width; // Initial x position of the text
        const speed = 1; // Speed of the text movement

        const animate = () => {
          ctx.clearRect(300, 0, canvas.width - 300, canvas.height); // Clear the text area
          ctx.drawImage(background, 0, 0, canvas.width, canvas.height); // Redraw the background image

          ctx.save();
          ctx.beginPath();
          ctx.rect(278, 0, canvas.width - 278, canvas.height);
          ctx.clip();

          ctx.fillText(driverScores, xPos, 46);

          ctx.restore();

          xPos -= speed; // Move the text to the left

          // Reset xPos if the text has moved completely out of the clipping region

          if (xPos + ctx.measureText(driverScores).width < 300) {
            xPos = canvas.width;
            animationCompleted = true;
          }

          if (animationCompleted && !renderStarted) {
            mediaRecorder.stop();
            renderStarted = true;
          }
          requestAnimationFrame(animate); // Request the next frame

        };

        animate();

        
        
      };
    },
  },

  updated() {
    this.drawCanvas(this.drivers);
  },
  mounted() {
    this.drawCanvas(this.drivers);
  },
  beforeUnmount() {
    this.drawCanvas(this.drivers);
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

.scores-container {
  display: flex;
  justify-content: center;
  margin-bottom: 100px;
}

#currentScoresCanvas {
  width: 100%;
}

#videoContainer {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  width: 100%;
  position: relative;
  
}

#videoContainer video {
  width: 100%;
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