import { EClassStatus } from "@/types/enum";
import { IClass } from "@/types/domain/class/class.interface";

/**
 * Helper function to calculate the status of a class based on its start and end dates
 * @param cls The class to calculate status for
 * @returns The calculated status of the class
 */
export function calculateClassStatus(cls: IClass): EClassStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(cls.startDate);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(cls.endDate);
  endDate.setHours(0, 0, 0, 0);

  // If start date is in the future -> not_started
  if (startDate > today) {
    return EClassStatus.NOT_STARTED;
  }

  // If end date is in the past -> completed
  if (endDate < today) {
    return EClassStatus.COMPLETED;
  }

  // Otherwise -> in_progress
  return EClassStatus.IN_PROGRESS;
}

/**
 * Helper function to update status for a single class
 * @param cls The class to update
 * @returns The updated class with new status
 */
export function updateClassStatus(cls: IClass): IClass {
  return {
    ...cls,
    status: calculateClassStatus(cls),
  };
}

/**
 * Helper function to update status for multiple classes
 * @param classes Array of classes to update
 * @returns Array of updated classes with new statuses
 */
export function updateClassesStatus(classes: IClass[]): IClass[] {
  return classes.map((cls) => updateClassStatus(cls));
}
