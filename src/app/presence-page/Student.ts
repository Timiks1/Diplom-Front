export interface Student {
  id: number;
  photo: string;
  name: string;
  present: boolean;
  grade: number;
  attendance: 'present' | 'late' | 'absent';
}
