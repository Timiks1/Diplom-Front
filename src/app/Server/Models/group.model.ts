import { Student } from "./Student.model";
import { Discipline } from "./Discipline.model"
export interface Group {
  id: string;
  name: string;
  description: string;
  students: Student[];
  disciplines: Discipline[];
}
// student.model.ts

// discipline.model.ts
