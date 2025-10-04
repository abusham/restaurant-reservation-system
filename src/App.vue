<script setup lang="ts">
import AppHeader from "@/components/layout/AppHeader.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
</script>

<template>
  <AppHeader />
  <main class="min-h-[calc(100vh-121px)] bg-primary-50 pb-12">
    <RouterView />
  </main>
  <AppFooter />
</template>

<style scoped lang="scss"></style>
