<template>
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-semibold text-gray-800">Systeeminformatie</h2>
        <button
          @click="$emit('load')"
          class="bg-purple-600 text-white px-5 py-2 rounded hover:bg-purple-700 transition"
        >
          Ophalen
        </button>
      </div>
  
      <div v-if="info" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="bg-gray-100 rounded p-4 shadow-sm">
            <h3 class="font-semibold text-gray-700 mb-1">CPU-belasting</h3>
            <p class="text-lg text-gray-900">{{ info.cpu?.currentload?.toFixed(1) ?? '—' }}%</p>
          </div>
          <div class="bg-gray-100 rounded p-4 shadow-sm">
            <h3 class="font-semibold text-gray-700 mb-1">RAM-gebruik</h3>
            <p class="text-lg text-gray-900">
              {{ (info.ram?.used / 1024 / 1024 / 1024)?.toFixed(2) ?? '—' }} GB /
              {{ (info.ram?.total / 1024 / 1024 / 1024)?.toFixed(2) ?? '—' }} GB
            </p>
          </div>
        </div>
  
        <div>
          <h3 class="text-xl font-semibold text-gray-800 mt-6 mb-2">Netwerkinterfaces</h3>
          <div class="grid sm:grid-cols-2 gap-4">
            <div
              v-for="(iface, index) in info.net"
              :key="index"
              class="bg-gray-50 rounded-lg p-4 border shadow-sm"
            >
              <h4 class="font-bold text-gray-700 mb-2">{{ iface.iface }}</h4>
              <p><strong>IP:</strong> {{ iface.ip4 || 'Geen IP' }}</p>
              <p><strong>MAC:</strong> {{ iface.mac }}</p>
              <p><strong>Type:</strong> {{ iface.type }}</p>
              <p>
                <strong>Status:</strong>
                <span :class="iface.operstate === 'up' ? 'text-green-600' : 'text-red-600'">
                  {{ iface.operstate }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  defineProps<{ info: any }>();
  </script>
  