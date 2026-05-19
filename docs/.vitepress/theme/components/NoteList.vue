<script setup lang="ts">
declare const __NOTE_DATA__: any[]
const notes = __NOTE_DATA__ || []
</script>

<template>
  <div class="note-list">
    <div v-for="category in notes" :key="category.name" class="note-category">
      <h3>
        <a :href="category.path + '/'">{{ category.name }}</a>
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
.note-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 1.5rem 0;
}

.note-category {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
}

.note-category:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.note-category h3 {
  margin: 0 0 0.75rem 0;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.note-category h3 a {
  color: var(--vp-c-brand);
  text-decoration: none;
  font-weight: 600;
}

.note-category h3 a:hover {
  text-decoration: underline;
}

.count {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  font-weight: normal;
}

.note-category ul {
  margin: 0.5rem 0 0 0;
  padding-left: 1.25rem;
  list-style: disc;
}

.note-category li {
  margin: 0.4rem 0;
  font-size: 0.95rem;
}

.note-category li a {
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.2s;
}

.note-category li a:hover {
  color: var(--vp-c-brand);
}
</style>
