<template>
    <div class="container">
      <h1>Netwerkmonitoring</h1>
  
      <section>
        <div class="card"
        ref="container"
        :style="{
          transform: `rotateX(${roll * SCALE_CONSTANT}deg) rotateY(${tilt * SCALE_CONSTANT}deg)`
        }">
          <h2 @click="toggleDevices" style="cursor: pointer;">
            Verbonden toestellen {{ showDevices ? '▲' : '▼' }}
          </h2>
  
          <div v-show="showDevices">
            <div v-if="loading" class="loading-bar"></div>
            <button @click="fetchDevices" :disabled="loading">Apparaten ophalen</button>
  
            <div v-if="devices.length">
              <div v-for="device in devices" :key="device.ip" class="card device-card">
                <p><strong>IP-adres:</strong> {{ device.ip }}</p>
                <p><strong>MAC-adres:</strong> {{ device.mac }}</p>
                <p><strong>Hostnaam:</strong> {{ device.hostname || 'Onbekend' }}</p>
                <p><strong>Status:</strong> {{ device.status }}</p>
              </div>
            </div>
  
            <div v-else-if="!loading">
              <p>Geen apparaten gevonden.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted } from 'vue';
  import { ref } from 'vue';
  
  interface NetworkDevice {
    ip: string;
    mac: string;
    hostname?: string;
    status: string;
  }
  
  onMounted(() => {
  window.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;
    targetTilt.value = x * 2;
    targetRoll.value = y * 2;
  });

  const animate = () => {
    roll.value += (targetRoll.value - roll.value) * 0.1;
    tilt.value += (targetTilt.value - tilt.value) * 0.1;
    requestAnimationFrame(animate);
  };

  animate();
});
  const showDevices = ref(true);
  const loading = ref(false);
  const devices = ref<NetworkDevice[]>([]);
    const roll = ref(0);
const tilt = ref(0);
const targetRoll = ref(0);
const targetTilt = ref(0);
const SCALE_CONSTANT = -10;
const container = ref(null);
  const toggleDevices = () => {
    showDevices.value = !showDevices.value;
  };
  
  const fetchDevices = async () => {
    loading.value = true;
    devices.value = await window.electronAPI.getConnectedDevices();
    loading.value = false;
  };
  </script>
  
  <style scoped>
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
    0% { background-position: -100% 0; }
    100% { background-position: 100% 0; }
  }
  
  .device-card {
    background-color: #2b2b2b;
    margin-top: 10px;
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

  
  .card.visible {
    opacity: 1;
    transform: translateY(0);
  }
  </style>