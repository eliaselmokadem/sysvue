<script setup lang="ts">
import { ref } from 'vue';


let cachedToken = '';
const showSpeed = ref(true);
const isTesting = ref(false);
const download = ref<number | null>(null);
const upload = ref<number | null>(null);
const ping = ref<number | null>(null);
const error = ref<string | null>(null);

const runSpeedTest = async () => {
  isTesting.value = true;
  download.value = null;
  upload.value = null;
  ping.value = null;
  error.value = null;

  try {
    const result = await window.electronAPI.runSpeedTest();
    if (result.error) throw new Error(result.error);

    download.value = result.download;
    upload.value = result.upload;
    ping.value = result.ping;
  } catch (err: any) {
    error.value = err.message;
  }

  isTesting.value = false;
};

</script>

<template>
  <div class="card">
    <h2 @click="showSpeed = !showSpeed" style="cursor: pointer;">
      Internet Snelheid Test {{ showSpeed ? '▲' : '▼' }}
    </h2>

    <div v-show="showSpeed">
      <div v-if="isTesting" class="loading-bar"></div>
      <button @click="runSpeedTest" :disabled="isTesting">Test snelheid</button>

      <div v-if="error" style="color: red;">⚠️ {{ error }}</div>

      <div v-if="download !== null && upload !== null && ping !== null && !isTesting">
        <p><strong>Download:</strong> {{ download.toFixed(2) }} Mbps</p>
        <p><strong>Upload:</strong> {{ upload.toFixed(2) }} Mbps</p>
        <p><strong>Ping:</strong> {{ ping.toFixed(0) }} ms</p>
      </div>
    </div>
  </div>
</template>
