<template>
    <section class="pt-6 border-t">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Ping Tool</h2>
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <input
          v-model="host"
          type="text"
          placeholder="bv. 8.8.8.8"
          class="flex-1 border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          @click="doPing"
          class="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
        >
          Ping
        </button>
      </div>
      <div v-if="pingResult" class="mt-4 bg-gray-100 p-4 rounded shadow-sm">
        <p><strong>Host:</strong> {{ pingResult.host }}</p>
        <p><strong>Alive:</strong> {{ pingResult.alive ? '✅ Ja' : '❌ Nee' }}</p>
        <p><strong>Time:</strong> {{ pingResult.time }} ms</p>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  
  
  const host = ref('');
  const pingResult = ref<any>(null);
  
  const doPing = async () => {
    pingResult.value = await window.electronAPI.pingHost(host.value);
  };
  </script>