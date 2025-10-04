<script setup lang="ts">
defineProps<{
  isOpen: boolean;
  title: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}>();

const emit = defineEmits<{
  close: [];
}>();

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
};
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto"
        @click.self="emit('close')"
      >
        <div
          :class="[
            'bg-white rounded-lg shadow-xl w-full my-8',
            maxWidthClasses[maxWidth || 'md'],
          ]"
          @click.stop
        >
          <!-- Header -->
          <div class="px-6 py-5 border-b border-gray-200">
            <h2 class="text-2xl font-bold text-font">{{ title }}</h2>
          </div>

          <!-- Content -->
          <div class="px-6 py-6">
            <slot></slot>
          </div>

          <!-- Footer -->
          <div
            v-if="$slots.footer"
            class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3"
          >
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.9);
}
</style>
