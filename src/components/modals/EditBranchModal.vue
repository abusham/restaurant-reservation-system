<script setup lang="ts">
import { ref, watch, computed } from "vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import {
  type Branch,
  type ReservationTimes,
  type TableOption,
  type DayOfWeek,
  DAYS_OF_WEEK,
} from "@/types/reservations";
import { vClickOutside } from "@/directives/clickOutside";

const props = defineProps<{
  isOpen: boolean;
  branch: Branch | null;
  tableOptions: TableOption[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  save: [duration: number, times: ReservationTimes];
  disableReservations: [];
  close: [];
}>();

const reservationDuration = ref(30);
const reservationTimes = ref<ReservationTimes>({});
const isTableDropdownOpen = ref(false);

const dayLabels: Record<DayOfWeek, string> = {
  saturday: "Saturday",
  sunday: "Sunday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
};

watch(
  () => props.branch,
  (newBranch) => {
    if (newBranch) {
      reservationDuration.value = newBranch.reservation_duration || 30;
      reservationTimes.value = JSON.parse(
        JSON.stringify(newBranch.reservation_times || {})
      );
    }
  },
  { immediate: true }
);

watch(
  () => props.isOpen,
  (newVal) => {
    if (!newVal) {
      isTableDropdownOpen.value = false;
    }
  }
);

const getTableNames = computed(() => {
  return props.tableOptions.map((t) => t.label).join(", ");
});

const addTimeSlot = (day: DayOfWeek) => {
  if (!reservationTimes.value[day]) {
    reservationTimes.value[day] = [];
  }
  if (reservationTimes.value[day]!.length < 3) {
    reservationTimes.value[day]!.push(["00:00", "00:00"]);
  }
};

const removeTimeSlot = (day: DayOfWeek, index: number) => {
  if (reservationTimes.value[day]) {
    reservationTimes.value[day]!.splice(index, 1);
  }
};

const updateTimeSlot = (
  day: DayOfWeek,
  slotIndex: number,
  timeIndex: 0 | 1,
  value: string
) => {
  if (reservationTimes.value[day] && reservationTimes.value[day]![slotIndex]) {
    reservationTimes.value[day]![slotIndex][timeIndex] = value;
  }
};

const applyToAllDays = () => {
  const saturdayTimes = reservationTimes.value.saturday || [];
  if (saturdayTimes.length > 0) {
    DAYS_OF_WEEK.forEach((day) => {
      if (day !== "saturday") {
        reservationTimes.value[day] = JSON.parse(JSON.stringify(saturdayTimes));
      }
    });
  }
};

const canAddTimeSlot = (day: DayOfWeek) => {
  return (
    !reservationTimes.value[day] || reservationTimes.value[day]!.length < 3
  );
};

const handleSave = () => {
  emit("save", reservationDuration.value, reservationTimes.value);
};

const workingHours = computed(() => {
  if (!props.branch) return "00:00 - 00:00";
  return `${props.branch.opening_from} - ${props.branch.opening_to}`;
});

const modalTitle = computed(() => {
  return props.branch
    ? `Edit ${props.branch.name} - branch reservation settings`
    : "Edit Branch";
});
</script>

<template>
  <BaseModal
    v-if="branch"
    :is-open="isOpen"
    :title="modalTitle"
    max-width="3xl"
    @close="emit('close')"
  >
    <div class="space-y-6 max-h-[60vh] overflow-y-auto px-2">
      <!-- Working Hours Info -->
      <div class="bg-blue-50 border-2 border-blue-300 rounded-lg px-4 py-3">
        <p class="text-blue-700 font-medium">
          Branch working hours are {{ workingHours }}
        </p>
      </div>

      <!-- Reservation Duration -->
      <div class="space-y-2">
        <label class="block text-base font-medium text-gray-700">
          Reservation Duration <span class="text-sm">(minutes)</span>
          <span class="text-red-500">*</span>
        </label>
        <input
          v-model.number="reservationDuration"
          type="number"
          min="1"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          :disabled="loading"
        />
      </div>

      <!-- Tables Dropdown -->
      <div class="space-y-2">
        <label class="block text-base font-medium text-gray-700"
          >Tables
          <span class="text-sm">(that accepts reservations)</span></label
        >
        <div
          v-if="tableOptions && tableOptions.length > 0"
          class="relative"
          v-click-outside="() => (isTableDropdownOpen = false)"
        >
          <button
            type="button"
            @click="isTableDropdownOpen = !isTableDropdownOpen"
            class="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-0 flex items-center justify-between"
            :disabled="loading"
          >
            <span class="text-font truncate">{{ getTableNames }}</span>
            <svg
              class="w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ml-2"
              :class="{ 'rotate-180': isTableDropdownOpen }"
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

          <Transition name="dropdown">
            <div
              v-if="isTableDropdownOpen"
              class="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              <label
                v-for="table in tableOptions"
                :key="table.id"
                class="flex items-center px-4 py-3 border-b last:border-b-0"
              >
                <span class="ml-3 text-font">{{ table.label }}</span>
              </label>
            </div>
          </Transition>
        </div>
        <p v-else class="text-gray-500 text-sm">
          No sections/tables available for this branch
        </p>
      </div>

      <!-- Days of Week -->
      <div class="space-y-4">
        <div
          v-for="day in DAYS_OF_WEEK"
          :key="day"
          class="border border-gray-300 rounded-lg p-4"
        >
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-base font-semibold text-gray-700">
              {{ dayLabels[day] }}
            </h3>
            <button
              v-if="
                day === 'saturday' &&
                reservationTimes.saturday &&
                reservationTimes.saturday.length > 0
              "
              @click="applyToAllDays"
              class="text-primary hover:text-primary-950 font-semibold text-sm"
              type="button"
              :disabled="loading"
            >
              Apply on all days
            </button>
          </div>

          <!-- Time Slots -->
          <div class="space-y-2">
            <div
              v-if="!reservationTimes[day] || reservationTimes[day]!.length === 0"
              class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center"
            >
              <button
                @click="addTimeSlot(day)"
                class="text-gray-500 font-medium flex items-center justify-center w-full transition duration-300 hover:text-gray-700"
                type="button"
                :disabled="loading"
              >
                <span class="text-xl mr-2">+</span>
                Add Available Reservation Times
              </button>
            </div>

            <div
              v-for="(slot, slotIndex) in reservationTimes[day]"
              :key="slotIndex"
              class="flex items-center gap-2"
            >
              <div
                class="flex-1 flex items-center gap-2 border-2 border-primary rounded-lg px-3 py-2"
              >
                <input
                  :value="slot[0]"
                  @input="
                    updateTimeSlot(
                      day,
                      slotIndex,
                      0,
                      ($event.target as HTMLInputElement).value
                    )
                  "
                  type="time"
                  class="flex-1 focus:outline-none"
                  :disabled="loading"
                />
                <span class="text-gray-500">-</span>
                <input
                  :value="slot[1]"
                  @input="
                    updateTimeSlot(
                      day,
                      slotIndex,
                      1,
                      ($event.target as HTMLInputElement).value
                    )
                  "
                  type="time"
                  class="flex-1 focus:outline-none"
                  :disabled="loading"
                />
                <button
                  @click="removeTimeSlot(day, slotIndex)"
                  class="text-gray-400 transition duration-300 hover:text-gray-600"
                  type="button"
                  :disabled="loading"
                >
                  ✕
                </button>
              </div>

              <button
                v-if="slotIndex === reservationTimes[day]!.length - 1 && canAddTimeSlot(day)"
                @click="addTimeSlot(day)"
                class="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-lg transition duration-300 hover:bg-gray-50"
                type="button"
                :disabled="loading"
              >
                <span class="text-xl text-gray-500">+</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Disable Reservations -->
      <div class="pt-4">
        <button
          @click="emit('disableReservations')"
          class="text-red-400 font-semibold hover:text-red-600 tranistion duration-300"
          type="button"
          :disabled="loading"
        >
          Disable Reservations
        </button>
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
        :disabled="!reservationDuration || loading"
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
