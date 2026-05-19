<script setup lang="ts">
declare const __NOTE_DATA__: any[]

const notes = __NOTE_DATA__ || []
</script>

<template>
  <div class="note-list">
    <div v-for="category in notes" :key="category.name" class="note-category">
      <h3>
        <a :href="category.path">{{ category.name }}</a>
        <span class="count">({{ category.count }} 篇)</span>
      </h3>
      <ul v-if="category.children">
        <li v-for="child in category.children" :key="child.name">
          <a :href="child.path">{{ child.name }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.note-list { margin-top: 1.5rem; }
.note-category { margin-bottom: 1.5rem; }
.note-category h3 { margin-bottom: 0.5rem; }
.note-category h3 a { color: var(--vp-c-brand-1); text-decoration: none; font-weight: 600; }
.note-category h3 a:hover { text-decoration: underline; }
.note-category .count { color: var(--vp-c-text-2); font-size: 0.9em; font-weight: normal; margin-left: 0.5rem; }
.note-category ul { list-style: none; padding-left: 1.5rem; margin: 0.5rem 0; }
.note-category li { margin: 0.3rem 0; }
.note-category li a { color: var(--vp-c-text-1); text-decoration: none; }
.note-category li a:hover { color: var(--vp-c-brand-1); }
</style>
