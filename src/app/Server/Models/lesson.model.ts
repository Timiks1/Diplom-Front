export interface Lesson {
    id: string;
    date: string;
    subjectName: string;
    lessonName: string;
    teacherId: string;
    homeWorkId: string | null;
    studentAttendances: any; // Update this type as per your data structure
  }
  export interface StudentAttendance {
    id: string;
    studentId: string;
    isPresent: boolean;
    isLate: boolean;
    grade: number;
    lessonId: string;
  }