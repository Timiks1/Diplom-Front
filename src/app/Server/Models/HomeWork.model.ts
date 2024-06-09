export interface HomeWork {
    id: string;
    name: string;
    description: string;
    comment?: string;
    answer?: string;
    studentName: string;
    teacherName: string;
    disciplineName?: string;
    file?: string; // Assuming file is stored as a Base64 string
    isChecked: boolean;
    grade: number;
    studentId: string;
    disciplineId: string;
    teacherId: string;
  }
  