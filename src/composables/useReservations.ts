import { ref, computed } from "vue";
import { apiService } from "@/services/api";
import type {
  Branch,
  ReservationTimes,
  TableOption,
} from "@/types/reservations";

const branches = ref<Branch[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

export function useReservations() {
  // Get branches that accept reservations
  const branchesWithReservations = computed(() =>
    branches.value.filter((b) => b.accepts_reservations)
  );

  // Get branches that don't accept reservations
  const branchesWithoutReservations = computed(() =>
    branches.value.filter((b) => !b.accepts_reservations)
  );

  // Fetch all branches
  const fetchBranches = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiService.getBranches();
      branches.value = response.data;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to fetch branches";
      console.error("Error fetching branches:", err);
    } finally {
      loading.value = false;
    }
  };

  // Enable reservations for a branch
  const enableBranchReservations = async (branchId: string) => {
    try {
      await apiService.enableReservations(branchId);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to enable reservations";
      throw err;
    }
  };

  // Disable all reservations
  const disableAllReservations = async () => {
    try {
      const promises = branchesWithReservations.value.map((branch) =>
        apiService.disableReservations(branch.id)
      );
      await Promise.all(promises);
      await fetchBranches(); // Refresh data
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to disable reservations";
      throw err;
    }
  };

  // Update branch reservation settings
  const updateBranchSettings = async (
    branchId: string,
    duration: number,
    times: ReservationTimes
  ) => {
    try {
      await apiService.updateBranch(branchId, {
        reservation_duration: duration,
        reservation_times: times,
      });
      await fetchBranches(); // Refresh data
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to update branch settings";
      throw err;
    }
  };

  // Get count of tables that accept reservations for a branch
  const getReservationTablesCount = (branch: Branch): number => {
    if (!branch.sections) return 0;

    return branch.sections.reduce((count, section) => {
      const tablesCount = section.tables.filter(
        (t) => t.accepts_reservations
      ).length;
      return count + tablesCount;
    }, 0);
  };

  // Get table options for a branch
  const getTableOptions = (branch: Branch): TableOption[] => {
    if (!branch.sections) return [];

    const options: TableOption[] = [];
    branch.sections.forEach((section) => {
      section.tables.forEach((table) => {
        if (table.accepts_reservations) {
          options.push({
            id: table.id,
            label: `${section.name} - ${table.name}`,
            sectionId: section.id,
          });
        }
      });
    });
    return options;
  };

  return {
    branches,
    branchesWithReservations,
    branchesWithoutReservations,
    loading,
    error,
    fetchBranches,
    enableBranchReservations,
    disableAllReservations,
    updateBranchSettings,
    getReservationTablesCount,
    getTableOptions,
  };
}
