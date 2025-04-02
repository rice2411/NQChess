export interface Class {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  students: string[];
  schedule: string;
  status: "closed" | "open" | "finished";
}
