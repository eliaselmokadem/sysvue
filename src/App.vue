<template>
  <div class="container">
    <h1>SysVue Dashboard</h1>

    <section>
      <div class="card">
        <h2>Systeeminformatie</h2>
        <button @click="load">Ophalen</button>

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
    </section>

    <section>
      <div class="card">
        <h2>Ping Tool</h2>
        <input v-model="host" placeholder="bv. 8.8.8.8" />
        <button @click="ping">Ping</button>

        <div v-if="pingResult">
          <p><strong>Host:</strong> {{ pingResult.host }}</p>
          <p><strong>Alive:</strong> {{ pingResult.alive ? '✅' : '❌' }}</p>
          <p><strong>Time:</strong> {{ pingResult.time }} ms</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const info = ref<any>(null);
const host = ref('');
const pingResult = ref<any>(null);

const load = async () => {
  const data = await window.electronAPI.getSystemInfo();
  info.value = {
    cpu: data.cpu,
    ram: data.mem,
    net: data.net
  };
};

const ping = async () => {
  pingResult.value = await window.electronAPI.pingHost(host.value);
};
</script>
