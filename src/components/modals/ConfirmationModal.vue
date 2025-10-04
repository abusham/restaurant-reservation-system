<script setup lang="ts">
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseModal from "@/components/ui/BaseModal.vue";

defineProps<{
  isOpen: boolean;
  title?: string;
  message?: string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();
</script>

<template>
  <BaseModal
    :is-open="isOpen"
    :title="title || 'Confirm Action'"
    max-width="md"
    @close="emit('cancel')"
  >
    <p class="text-base text-gray-600">
      {{ message || "Are you sure you want to proceed?" }}
    </p>

    <template #footer>
      <BaseButton
        variant="secondary"
        @click="emit('cancel')"
        :disabled="loading"
      >
        Cancel
      </BaseButton>
      <BaseButton
        variant="primary"
        @click="emit('confirm')"
        :disabled="loading"
      >
        {{ loading ? "Processing..." : "Confirm" }}
      </BaseButton>
    </template>
  </BaseModal>
</template>
