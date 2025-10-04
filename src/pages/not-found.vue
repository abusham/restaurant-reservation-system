<script setup lang="ts">
import BaseButton from "@/components/ui/BaseButton.vue";
</script>

<template>
  <div class="flex flex-col items-center justify-center pt-24">
    <p class="text-8xl font-bold leading-tight text-font">404</p>
    <h1 class="text-3xl font-bold leading-tight text-font">Page not found</h1>
    <RouterLink to="/"
      ><BaseButton variant="primary" class="mt-10"
        >Go Home</BaseButton
      ></RouterLink
    >
  </div>
</template>
