<script setup lang="ts">
import { ref, onMounted } from "vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import ReservationsTable from "@/components/reservations/ReservationsTable.vue";
import ConfirmationModal from "@/components/modals/ConfirmationModal.vue";
import AddBranchesModal from "@/components/modals/AddBranchesModal.vue";
import { useReservations } from "@/composables/useReservations";

const {
  branchesWithoutReservations,
  fetchBranches,
  enableBranchReservations,
  disableAllReservations,
} = useReservations();

const isDisableConfirmOpen = ref(false);
const isAddBranchesOpen = ref(false);
const isProcessing = ref(false);

onMounted(() => {
  fetchBranches();
});

const openDisableConfirmation = () => {
  isDisableConfirmOpen.value = true;
};

const closeDisableConfirmation = () => {
  isDisableConfirmOpen.value = false;
};

const handleDisableAll = async () => {
  isProcessing.value = true;
  try {
    await disableAllReservations();
    closeDisableConfirmation();
  } catch (error) {
    console.error("Failed to disable reservations:", error);
  } finally {
    isProcessing.value = false;
  }
};

const openAddBranches = () => {
  isAddBranchesOpen.value = true;
};

const closeAddBranches = () => {
  isAddBranchesOpen.value = false;
};

const handleAddBranches = async (branchIds: string[]) => {
  isProcessing.value = true;
  try {
    const promises = branchIds.map((id) => enableBranchReservations(id));
    await Promise.all(promises);
    await fetchBranches();
    closeAddBranches();
  } catch (error) {
    console.error("Failed to enable reservations:", error);
  } finally {
    isProcessing.value = false;
  }
};
</script>

<template>
  <div>
    <div class="bg-white py-5 border-b border-gray-200">
      <div class="container-wrapper flex flex-row items-center justify-between">
        <p class="text-font text-2xl font-semibold">Reservations</p>
        <BaseButton variant="primary" @click="openDisableConfirmation">
          Disable Reservations
        </BaseButton>
      </div>
    </div>
    <div class="container-wrapper">
      <ReservationsTable>
        <template #add-button>
          <BaseButton variant="secondary" @click="openAddBranches">
            Add Branches
          </BaseButton>
        </template>
      </ReservationsTable>
    </div>

    <!-- Disable All Reservations Confirmation Modal -->
    <ConfirmationModal
      :is-open="isDisableConfirmOpen"
      title="Disable All Reservations"
      message="Are you sure you want to disable reservations for all branches? This action will affect all currently active branches."
      :loading="isProcessing"
      @confirm="handleDisableAll"
      @cancel="closeDisableConfirmation"
    />

    <!-- Add Branches Modal -->
    <AddBranchesModal
      :is-open="isAddBranchesOpen"
      :branches="branchesWithoutReservations"
      :loading="isProcessing"
      @save="handleAddBranches"
      @close="closeAddBranches"
    />
  </div>
</template>

<style scoped lang="scss"></style>
