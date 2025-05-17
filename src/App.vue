<template>
  <div class="container">
    <h1>SysVue Dashboard</h1>

    <!-- Systeeminformatie -->
    <section>
      <div
        class="card"
        ref="container"
        :style="{
          transform: `rotateX(${roll * SCALE_CONSTANT}deg) rotateY(${tilt * SCALE_CONSTANT}deg)`
        }"
      >
        <h2 @click="showSystemInfo = !showSystemInfo" style="cursor: pointer;">
          Systeeminformatie {{ showSystemInfo ? '▲' : '▼' }}
        </h2>

        <div v-show="showSystemInfo">
          <div v-if="isLoadingSystemInfo" class="loading-bar"></div>
          <button @click="load" :disabled="isLoadingSystemInfo">Ophalen</button>

          <div v-if="info">
            <p><strong>CPU:</strong> {{ info.cpu?.currentload?.toFixed(1) ?? '—' }}%</p>
            <p><strong>RAM:</strong> {{ (info.ram?.used / 1024 / 1024 / 1024)?.toFixed(2) ?? '—' }} GB /
              {{ (info.ram?.total / 1024 / 1024 / 1024)?.toFixed(2) ?? '—' }} GB</p>
            <div v-for="(iface, i) in info.net" :key="i" class="card" style="background-color: #2b2b2b;">
              <p><strong>Interface:</strong> {{ iface.iface }}</p>
              <p><strong>IP:</strong> {{ iface.ip4 }}</p>
              <p><strong>Status:</strong> {{ iface.operstate }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Ping Tool -->
    <section>
      <div class="card"
      ref="container"
        :style="{
          transform: `rotateX(${roll * SCALE_CONSTANT}deg) rotateY(${tilt * SCALE_CONSTANT}deg)`
        }">
        <h2 @click="showPingTool = !showPingTool" style="cursor: pointer;">
          Ping Tool {{ showPingTool ? '▲' : '▼' }}
        </h2>

        <div v-show="showPingTool">
          <div v-if="isPinging" class="loading-bar"></div>
          <input v-model="host" placeholder="bv. 8.8.8.8" />
          <button @click="ping" :disabled="isPinging">Ping</button>

          <div v-if="pingResult && !isPinging">
            <p><strong>Host:</strong> {{ pingResult.host }}</p>
            <p><strong>Alive:</strong> {{ pingResult.alive ? '✅' : '❌' }}</p>
            <p><strong>Time:</strong> {{ pingResult.time }} ms</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Network Monitoring -->
    <section>
      <NetworkMonitoring />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import NetworkMonitoring from './components/NetworkMonitoring.vue';

const container = ref(null);
const info = ref<any>(null);
const host = ref('');
const pingResult = ref<any>(null);
const SCALE_CONSTANT = -10;
const showSystemInfo = ref(true);
const showPingTool = ref(true);
const isLoadingSystemInfo = ref(false);
const isPinging = ref(false);
const roll = ref(0);
const tilt = ref(0);
const targetRoll = ref(0);
const targetTilt = ref(0);


onMounted(() => {
  window.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;
    targetTilt.value = x * 2;
    targetRoll.value = y * 2;
  });

  // Smooth animation loop
  const animate = () => {
    roll.value += (targetRoll.value - roll.value) * 0.1;
    tilt.value += (targetTilt.value - tilt.value) * 0.1;
    requestAnimationFrame(animate);
  };
  animate();
});
const load = async () => {
  isLoadingSystemInfo.value = true;
  const data = await window.electronAPI.getSystemInfo();
  info.value = {
    cpu: data.cpu,
    ram: data.mem,
    net: data.net
  };
  isLoadingSystemInfo.value = false;
};

const ping = async () => {
  isPinging.value = true;
  pingResult.value = await window.electronAPI.pingHost(host.value);
  isPinging.value = false;
};
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: auto;
  padding: 40px 20px;
  font-family: 'Segoe UI', sans-serif;
  background-color: #121212;
  color: #ffffff;
}

.card {
  background-color: #1e1e1e;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease-out;
  will-change: transform;
}


button {
  background-color: #61dafb;
  color: black;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:disabled {
  background-color: #444;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #1db954;
}

.loading-bar {
  height: 4px;
  width: 100%;
  background: linear-gradient(to right, #61dafb 10%, transparent 10%);
  background-size: 200% 100%;
  animation: loadingMove 1s linear infinite;
  margin-bottom: 10px;
  border-radius: 2px;
}

@keyframes loadingMove {
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 100% 0;
  }
}
</style>
