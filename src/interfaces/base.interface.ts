import { FieldValue } from 'firebase/firestore';

export interface IBaseEntity {
  id: string;
  createdAt?: string | FieldValue;
  updatedAt?: string | FieldValue;
}
