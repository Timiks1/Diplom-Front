export interface LessonResponse {
    id: string;
    departmentId: string | null;
    name: string | null;
    file: string | null;
    teacherId: string;
    date: string;
    lesson: string;
    teacher: string;
    time: string;
    description: string;
    groupName: string;
  }