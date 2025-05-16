<template>
    <div class="container">
      <h1>Netwerkmonitoring</h1>
  
      <section>
        <div class="card">
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
  import { ref } from 'vue';
  
  interface NetworkDevice {
    ip: string;
    mac: string;
    hostname?: string;
    status: string;
  }
  
  const showDevices = ref(true);
  const loading = ref(false);
  const devices = ref<NetworkDevice[]>([]);
  
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
  opacity: 1; /* veranderd naar standaard zichtbaar */
  transform: translateY(0px); /* standaard positie */
  transition: opacity 0.6s ease, transform 0.6s ease;
}

  
  .card.visible {
    opacity: 1;
    transform: translateY(0);
  }
  </style>