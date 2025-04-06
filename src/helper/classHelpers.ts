import { Class } from "@/types/class.interface";

/**
 * Helper function to calculate the status of a class based on its start and end dates
 * @param cls The class to calculate status for
 * @returns The calculated status of the class
 */
export function calculateClassStatus(cls: Class): Class["status"] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(cls.startDate);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(cls.endDate);
  endDate.setHours(0, 0, 0, 0);

  // If start date is in the future -> not_started
  if (startDate > today) {
    return "not_started";
  }

  // If end date is in the past -> completed
  if (endDate < today) {
    return "completed";
  }

  // Otherwise -> in_progress
  return "in_progress";
}

/**
 * Helper function to update status for a single class
 * @param cls The class to update
 * @returns The updated class with new status
 */
export function updateClassStatus(cls: Class): Class {
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
export function updateClassesStatus(classes: Class[]): Class[] {
  return classes.map((cls) => updateClassStatus(cls));
}
