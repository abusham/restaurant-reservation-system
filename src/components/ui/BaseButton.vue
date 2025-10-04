<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  variant?: "primary" | "secondary";
  disabled?: boolean;
}>();

const primaryClass = "bg-primary text-white hover:bg-primary-950";
const secondaryClass =
  "bg-white text-primary border border-primary hover:bg-primary-50";
const variantClasses = computed(() => {
  switch (props.variant) {
    case "primary":
      return primaryClass;
    case "secondary":
      return secondaryClass;
    default:
      return primaryClass;
  }
});
const buttonClass = computed(() => {
  const baseClass =
    "rounded-lg py-2.5 px-5 font-semibold transition duration-300 ease-in-out";
  const hoverScale = props.disabled ? "" : "hover:scale-90";
  const disabledClasses = props.disabled ? "cursor-not-allowed opacity-70" : "";

  return `${baseClass} ${variantClasses.value} ${hoverScale} ${disabledClasses}`;
});
</script>

<template>
  <button :class="buttonClass" :disabled="disabled" type="button">
    <slot></slot>
  </button>
</template>

<style scoped lang="scss"></style>
