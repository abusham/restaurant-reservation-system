<script setup lang="ts">
import { ref, watch } from "vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import type { Branch } from "@/types/reservations";
import { vClickOutside } from "@/directives/clickOutside";

const props = defineProps<{
  isOpen: boolean;
  branches: Branch[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  save: [branchIds: string[]];
  close: [];
}>();

const selectedBranches = ref<string[]>([]);
const isDropdownOpen = ref(false);

watch(
  () => props.isOpen,
  (newVal) => {
    if (!newVal) {
      selectedBranches.value = [];
      isDropdownOpen.value = false;
    }
  }
);

const toggleBranch = (branchId: string) => {
  const index = selectedBranches.value.indexOf(branchId);
  if (index > -1) {
    selectedBranches.value.splice(index, 1);
  } else {
    selectedBranches.value.push(branchId);
  }
};

const getSelectedBranchNames = () => {
  return props.branches
    .filter((b) => selectedBranches.value.includes(b.id))
    .map((b) => (b.reference ? `${b.name} (${b.reference})` : b.name))
    .join(", ");
};

const handleSave = () => {
  if (selectedBranches.value.length > 0) {
    emit("save", selectedBranches.value);
  }
};
</script>

<template>
  <BaseModal
    :is-open="isOpen"
    title="Add Branches"
    max-width="2xl"
    @close="emit('close')"
  >
    <div class="space-y-2">
      <label class="block text-base font-medium text-gray-700">Branches</label>

      <div class="relative" v-click-outside="() => (isDropdownOpen = false)">
        <button
          type="button"
          @click="isDropdownOpen = !isDropdownOpen"
          class="w-full px-4 py-3 text-left bg-white border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 flex items-center justify-between"
          :disabled="loading"
        >
          <span class="text-font">
            {{
              selectedBranches.length > 0
                ? getSelectedBranchNames()
                : "Select branches"
            }}
          </span>
          <svg
            class="w-5 h-5 text-gray-400 transition-transform"
            :class="{ 'rotate-180': isDropdownOpen }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <!-- Dropdown -->
        <Transition name="dropdown">
          <div
            v-if="isDropdownOpen"
            class="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            <div
              v-if="branches.length === 0"
              class="px-4 py-3 text-gray-500 text-center"
            >
              No branches available
            </div>
            <label
              v-for="branch in branches"
              :key="branch.id"
              class="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
            >
              <input
                type="checkbox"
                :checked="selectedBranches.includes(branch.id)"
                @change="toggleBranch(branch.id)"
                class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span class="ml-3 text-font">
                {{
                  branch.reference
                    ? `${branch.name} (${branch.reference})`
                    : branch.name
                }}
              </span>
            </label>
          </div>
        </Transition>
      </div>
    </div>

    <template #footer>
      <BaseButton
        variant="secondary"
        @click="emit('close')"
        :disabled="loading"
      >
        Close
      </BaseButton>
      <BaseButton
        variant="primary"
        @click="handleSave"
        :disabled="selectedBranches.length === 0 || loading"
      >
        {{ loading ? "Saving..." : "Save" }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<style scoped lang="scss">
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
