<script setup lang="ts">
import { ref } from "vue";
import EditBranchModal from "@/components/modals/EditBranchModal.vue";
import { useReservations } from "@/composables/useReservations";
import { apiService } from "@/services/api";
import type { Branch, ReservationTimes } from "@/types/reservations";

const {
  branchesWithReservations,
  loading,
  getReservationTablesCount,
  getTableOptions,
  updateBranchSettings,
  fetchBranches,
} = useReservations();

const selectedBranch = ref<Branch | null>(null);
const isEditModalOpen = ref(false);
const isSaving = ref(false);

const openEditModal = (branch: Branch) => {
  selectedBranch.value = branch;
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  selectedBranch.value = null;
};

const handleSaveSettings = async (
  duration: number,
  times: ReservationTimes
) => {
  if (!selectedBranch.value) return;

  isSaving.value = true;
  try {
    await updateBranchSettings(selectedBranch.value.id, duration, times);
    closeEditModal();
  } catch (error) {
    console.error("Failed to update branch:", error);
  } finally {
    isSaving.value = false;
  }
};

const handleDisableReservations = async () => {
  if (!selectedBranch.value) return;

  isSaving.value = true;
  try {
    await apiService.disableReservations(selectedBranch.value.id);
    await fetchBranches(); // Refresh the list
    closeEditModal();
  } catch (error) {
    console.error("Failed to disable reservations:", error);
  } finally {
    isSaving.value = false;
  }
};

const formatDuration = (minutes: number): string => {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const hourLabel = hours === 1 ? "Hour" : "Hours";
    const minuteLabel = remainingMinutes === 1 ? "Minute" : "Minutes";

    if (remainingMinutes === 0) {
      return `${hours} ${hourLabel}`;
    }

    return `${hours} ${hourLabel} ${remainingMinutes} ${minuteLabel}`;
  }

  const minuteLabel = minutes === 1 ? "Minute" : "Minutes";
  return `${minutes} ${minuteLabel}`;
};
</script>

<template>
  <div class="mt-12 bg-white rounded-md shadow-md min-h-[400px]">
    <div class="flex justify-end px-5 py-4 border-b border-gray-200">
      <slot name="add-button"></slot>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-20">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
      ></div>
    </div>

    <div
      v-else-if="branchesWithReservations.length === 0"
      class="flex flex-col items-center justify-center py-20"
    >
      <p class="text-gray-500 text-lg">No branches with reservations enabled</p>
      <p class="text-gray-400 text-sm mt-2">
        Click "Add Branches" to enable reservations
      </p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full table-fixed min-w-[700px]">
        <thead class="border-b border-gray-200">
          <tr>
            <th class="p-4 text-left text-lg text-font font-semibold">
              Branch
            </th>
            <th class="p-4 text-left text-lg text-font font-semibold">
              Reference
            </th>
            <th class="p-4 text-left text-lg text-font font-semibold">
              Number of Tables
            </th>
            <th class="p-4 text-left text-lg text-font font-semibold">
              Reservation Duration
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="branch in branchesWithReservations"
            :key="branch.id"
            @click="openEditModal(branch)"
            class="even:bg-gray-50 odd:bg-white border-b last:border-b-0 cursor-pointer"
          >
            <td class="p-4 text-base text-font">{{ branch.name }}</td>
            <td class="p-4 text-base text-font">
              {{ branch.reference || "-" }}
            </td>
            <td class="p-4 text-base text-font">
              {{ getReservationTablesCount(branch) }}
            </td>
            <td class="p-4 text-base text-font">
              {{ formatDuration(branch.reservation_duration) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit Branch Modal -->
    <EditBranchModal
      :is-open="isEditModalOpen"
      :branch="selectedBranch"
      :table-options="selectedBranch ? getTableOptions(selectedBranch) : []"
      :loading="isSaving"
      @save="handleSaveSettings"
      @disable-reservations="handleDisableReservations"
      @close="closeEditModal"
    />
  </div>
</template>

<style scoped lang="scss"></style>
