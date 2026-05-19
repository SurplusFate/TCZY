<script setup lang="ts">
declare const __NOTE_DATA__: any[]

const notes = __NOTE_DATA__ || []
const totalCount = notes.reduce((sum, n) => sum + (n.count || 0), 0)
</script>

<template>
  <div class="note-stats">
    <div class="stat-item">
      <span class="stat-number">{{ notes.length }}</span>
      <span class="stat-label">分类</span>
    </div>
    <div class="stat-item">
      <span class="stat-number">{{ totalCount }}</span>
      <span class="stat-label">文章</span>
    </div>
  </div>
</template>

<style scoped>
.note-stats { display: flex; gap: 2rem; margin: 1rem 0; }
.stat-item { text-align: center; }
.stat-number { display: block; font-size: 2rem; font-weight: bold; color: var(--vp-c-brand-1); }
.stat-label { color: var(--vp-c-text-2); font-size: 0.9rem; }
</style>
