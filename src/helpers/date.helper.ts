import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { vi } from "date-fns/locale";

interface TimestampFields {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export const formatFirestoreTimestamp = (timestamp: Timestamp): string => {
  return format(timestamp.toDate(), "EEEE HH:mm dd/MM/yyyy", { locale: vi });
};

export const formatFirestoreData = <T extends TimestampFields>(
  data: T | T[],
  isBeutifyDate: boolean = true
): T | T[] => {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map((item) => formatFirestoreData(item, isBeutifyDate)) as T[];
  }

  const formattedData = { ...data };

  if (isBeutifyDate) {
    if (formattedData.createdAt instanceof Timestamp) {
      formattedData.createdAt = formatFirestoreTimestamp(
        formattedData.createdAt
      ) as unknown as Timestamp;
    }
    if (formattedData.updatedAt instanceof Timestamp) {
      formattedData.updatedAt = formatFirestoreTimestamp(
        formattedData.updatedAt
      ) as unknown as Timestamp;
    }
  }

  // Format nested objects
  Object.keys(formattedData).forEach((key) => {
    const value = formattedData[key as keyof T];
    if (value && typeof value === "object" && !(value instanceof Timestamp)) {
      formattedData[key as keyof T] = formatFirestoreData(
        value as T,
        isBeutifyDate
      ) as T[keyof T];
    }
  });

  return formattedData;
};
