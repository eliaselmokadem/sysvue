<template>
  <div class="container">
    <h1>SysVue Dashboard</h1>

    <!-- Systeeminformatie -->
    <section>
      <div class="card">
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
      <div class="card">
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
import { ref } from 'vue';
import NetworkMonitoring from './components/NetworkMonitoring.vue';


const info = ref<any>(null);
const host = ref('');
const pingResult = ref<any>(null);

const showSystemInfo = ref(true);
const showPingTool = ref(true);

const isLoadingSystemInfo = ref(false);
const isPinging = ref(false);

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
