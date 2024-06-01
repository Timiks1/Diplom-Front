export interface News {
    id: string;
    date: string;
    departmentId: string | null;
    department: string | null;
    isFromDepartment: boolean;
    description: string;
  }
  
  export interface Department {
    id: string;
    name: string;
    headOfDepartmentId: string;
    headOfDepartment: DepartmentMember;
    description: string;
    contacts: string;
    members: DepartmentMember[];
  }
  
  export interface DepartmentMember {
    id: string;
    userName: string;
    normalizedUserName: string;
    email: string;
    normalizedEmail: string;
    emailConfirmed: boolean;
    passwordHash: string;
    securityStamp: string;
    concurrencyStamp: string;
    phoneNumber: string;
    phoneNumberConfirmed: boolean;
    twoFactorEnabled: boolean;
    lockoutEnd: Date;
    lockoutEnabled: boolean;
    accessFailedCount: number;
    firstName: string;
    lastName: string;
    departmentEmail: string;
    address: string;
    departmentId: string;
    department: string;
    disciplines: Discipline[];
    syllabi: Syllabus[];
    traineeship: Traineeship;
    scientificAndPedagogicalActivity: ScientificAndPedagogicalActivity;
  }
  
  export interface Discipline {
    id: string;
    teachers: string[];
    name: string;
    fieldOfStudy: string;
    description: string;
    courses: string[];
  }
  
  export interface Syllabus {
    id: string;
    teacherId: string;
    teacher: string;
    name: string;
    file: string;
  }
  
  export interface Traineeship {
    id: string;
    traineeId: string;
    trainee: string;
    name: string;
    file: string;
  }
  
  export interface ScientificAndPedagogicalActivity {
    id: string;
    teacherId: string;
    teacher: string;
    name: string;
    file: string;
  }
  export interface TeacherTest {
    id: string;
    teacherId: string;
    status: string;
    testTheme: string;
    testUrl: string;
  }