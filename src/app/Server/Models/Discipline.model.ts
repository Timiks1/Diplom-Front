export interface Discipline {
    id: string;
    teachers: any[] | null; // или определите интерфейс для Teacher и используйте его здесь
    name: string;
    fieldOfStudy: string;
    description: string;
    courses: string[];
  }
  