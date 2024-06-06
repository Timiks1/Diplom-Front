import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { News, TeacherTest } from './interfaces'; // Предполагается, что вы импортировали интерфейс News из вашего файла interfaces.ts
import { User } from './user.interface'; // Импортируем интерфейс User
import { v4 as uuidv4 } from 'uuid';
import { Group } from './Models/group.model';
import { Review } from './Models/review.model';
import { Syllabus } from '../sylabus-page/syllabus.interface';
import { Lesson } from './Models/lesson.model';
import { StudentAttendance } from './Models/lesson.model';
import { HomeWork } from './Models/HomeWork.model';
import { Exam } from './Models/Exam.model';
@Injectable({
  providedIn: 'root',
})
export class ServerService {
  private baseUrl: string = 'https://localhost:7247/api'; // URL вашего сервера
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/Identity/Login`, {
        userName: username,
        password: password,
      })
      .pipe(
        switchMap((response) => {
          if (response && response.token) {
            const user = {
              token: response.token,
              expiration: response.expiration,
            };
            // Сохраняем пользователя в локальном хранилище
            localStorage.setItem('currentUser', JSON.stringify(user));
            // Устанавливаем пользователя в BehaviorSubject
            this.currentUserSubject.next(user);

            // Получаем текущего пользователя
            return this.getCurrentUser().pipe(
              map((response) => {
                const currentUser = response.item;
                if (currentUser && currentUser.id) {
                  const updatedUser = {
                    ...user,
                    userId: currentUser.id,
                    userName: currentUser.userName,
                    email: currentUser.email,
                    firstName: currentUser.firstName,
                    lastName: currentUser.lastName,
                    departmentEmail: currentUser.departmentEmail,
                    phoneNumber: currentUser.phoneNumber,
                    departmentName: currentUser.departmentName,
                    departmentId: currentUser.departmentId,
                  };
                  // Обновляем пользователя с ID в локальном хранилище
                  localStorage.setItem(
                    'currentUser',
                    JSON.stringify(updatedUser)
                  );
                  // Устанавливаем обновленного пользователя в BehaviorSubject
                  this.currentUserSubject.next(updatedUser);
                  console.log('Current User:', currentUser);
                }
                return currentUser;
              }),
              catchError((error) => {
                console.error('Error fetching current user:', error);
                return throwError(error);
              })
            );
          }
          return throwError('Authentication failed');
        })
      );
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  logout(): void {
    // Удаляем пользователя из локального хранилища
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  // Метод для получения новостей с сервера
  getNews(): Observable<News[]> {
    return this.http
      .get<any>(`${this.baseUrl}/News`)
      .pipe(map((response) => response.items as News[]));
  }

  getUser(userId: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${userId}`);
  }

  getScheduleForCurrentUser(month: string, year: string): Observable<any> {
    const fileName = `${month}.${year}`;

    const userId = this.currentUserValue.userId;
    return this.http.get<any>(`${this.baseUrl}/schedules/teacher-schedule`, {
      params: {
        fileName: fileName,
        teacherId: userId,
      },
    });
  }
  getScheduleForCurrentUserAndDay(
    day: string,
    month: string,
    year: string
  ): Observable<any> {
    const fileName = `0${month}.${year}`;

    const userId = this.currentUserValue.userId;
    return this.http.get<any>(
      `${this.baseUrl}/schedules/teacher-schedule-day`,
      {
        params: {
          fileName: fileName,
          teacherId: userId,
          day: day,
        },
      }
    );
  }
  getTestScheduleForCurrentUser(month: string, year: string): Observable<any> {
    const fileName = `${month}.${year}.tests`;

    const userId = this.currentUserValue.userId;
    return this.http.get<any>(`${this.baseUrl}/schedules/teacher-schedule`, {
      params: {
        fileName: fileName,
        teacherId: userId,
      },
    });
  }
  // Метод для получения текущего пользователя
  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Identity/GetCurrentUser`);
  }
  //af346b95-fb99-472d-9432-a36a1f8c6752
  downloadWorkLoadTemplate(): Observable<Blob> {
    return this.http
      .get(
        `${this.baseUrl}/TeacherLoads/af346b95-fb99-472d-9432-a36a1f8c6752`,
        { responseType: 'blob' }
      )
      .pipe(
        catchError((error) => {
          console.error('Ошибка загрузки шаблона плана:', error);
          return throwError(error);
        })
      );
  }
  uploadWorkloadFile(file: File): Observable<any> {
    const userId = this.currentUserValue.userId;
    const userName = this.currentUserValue.userName;
    const now = new Date();
    const fileName = `0${
      now.getMonth() + 1
    }.${now.getFullYear()}-Навантаження-${userName}`;
    const formData = new FormData();
    formData.append('file', file, fileName);

    const params = new HttpParams()
      .set('Id', uuidv4())
      .set('TeacherId', userId)
      .set('Name', fileName);

    return this.http
      .post<any>(`${this.baseUrl}/TeacherLoads`, formData, { params })
      .pipe(
        catchError((error) => {
          console.error('Ошибка загрузки файла:', error);
          return throwError(error);
        })
      );
  }
  // Загрузка шаблона плана с сервера
  downloadPlanTemplate(): Observable<Blob> {
    return this.http
      .get(
        `${this.baseUrl}/IndividualPlans/7ab5ed4b-d797-4ffd-87fe-05853519d1cd`,
        { responseType: 'blob' }
      )
      .pipe(
        catchError((error) => {
          console.error('Ошибка загрузки шаблона плана:', error);
          return throwError(error);
        })
      );
  }

  // Отправка заполненного плана на сервер
  uploadFilledPlan(file: File): Observable<any> {
    const userId = this.currentUserValue.userId;
    const userName = this.currentUserValue.userName;
    const now = new Date();
    const fileName = `0${
      now.getMonth() + 1
    }.${now.getFullYear()}-IndividualPlan-${userName}`;
    const formData = new FormData();
    formData.append('file', file, fileName);

    const params = new HttpParams()
      .set('Id', uuidv4())
      .set('TeacherId', userId)
      .set('Name', fileName);

    return this.http
      .post<any>(`${this.baseUrl}/IndividualPlans`, formData, { params })
      .pipe(
        catchError((error) => {
          console.error('Ошибка загрузки файла:', error);
          return throwError(error);
        })
      );
  }
  updateProfile(profile: any): Observable<any> {
    const userId = this.currentUserValue.userId;
    return this.http.put<any>(`${this.baseUrl}/Users/${userId}`, profile).pipe(
      catchError((error) => {
        console.error('Error updating profile:', error);
        return throwError(error);
      })
    );
  }
  getCertificates(): Observable<any> {
    const userId = this.currentUserValue.userId;
    return this.http
      .get<any>(`${this.baseUrl}/ScientificAndPedagogicalActivities`, {
        params: new HttpParams().set('teacherId', userId),
      })
      .pipe(
        map((response) => response),
        catchError((error) => {
          console.error('Error fetching certificates:', error);
          return throwError(error);
        })
      );
  }

  uploadCertificate(file: File, certificateName: string): Observable<any> {
    const teacherId = this.currentUserValue.userId;
    const formData = new FormData();
    formData.append('file', file, certificateName);

    const params = new HttpParams()
      .set('id', uuidv4())
      .set('teacherId', teacherId)
      .set('name', certificateName);

    return this.http
      .post<any>(
        `${this.baseUrl}/ScientificAndPedagogicalActivities`,
        formData,
        { params }
      )
      .pipe(
        catchError((error) => {
          console.error('Error uploading certificate:', error);
          return throwError(error);
        })
      );
  }

  downloadCertificate(certificateId: string): Observable<Blob> {
    return this.http
      .get(
        `${this.baseUrl}/ScientificAndPedagogicalActivities/${certificateId}`,
        { responseType: 'blob' }
      )
      .pipe(
        catchError((error) => {
          console.error('Error downloading certificate:', error);
          return throwError(error);
        })
      );
  }
  deleteCertificate(certificateId: string): Observable<any> {
    return this.http
      .delete<any>(
        `${this.baseUrl}/ScientificAndPedagogicalActivities/${certificateId}`
      )
      .pipe(
        catchError((error) => {
          console.error('Error deleting certificate:', error);
          return throwError(error);
        })
      );
  }

  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.baseUrl}/groups`).pipe(
      catchError((error) => {
        console.error('Error fetching groups:', error);
        return throwError(error);
      })
    );
  }

  // Метод для получения дисциплин учителя
  getTeacherDisciplines(): Observable<any> {
    const teacherId = this.currentUserValue.userId; // ID учителя берется из currentUser
    return this.http
      .get<any>(`${this.baseUrl}/Disciplines/GetByUserId/${teacherId}`)
      .pipe(
        map((response) => response.items),
        catchError((error) => {
          console.error('Error fetching teacher disciplines:', error);
          return throwError(error);
        })
      );
  }
  getLessonsByDiscipline(subjectName: string): Observable<{ items: Lesson[] }> {
    return this.http
      .get<{ items: Lesson[] }>(`${this.baseUrl}/Lessons/GetBySubjectName`, {
        params: new HttpParams().set('subjectName', subjectName),
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching lessons:', error);
          return throwError(error);
        })
      );
  }

  uploadSyllabus(syllabus: Syllabus, fileName: string): Observable<any> {
    const userId = this.currentUserValue.userId; // Получаем ID текущего пользователя
    const formData = new FormData();
    formData.append(
      'file',
      new Blob([JSON.stringify(syllabus)], { type: 'application/json' }),
      fileName
    );

    const params = new HttpParams()
      .set('TeacherId', userId)
      .set('Name', `${fileName}-${this.currentUserValue.lastName}`);

    return this.http
      .post<any>(`${this.baseUrl}/Syllabi//create-from-json`, formData, {
        params,
      })
      .pipe(
        catchError((error) => {
          console.error('Error uploading syllabus:', error);
          return throwError(error);
        })
      );
  }
  getTeacherTests(): Observable<TeacherTest[]> {
    const teacherId = this.currentUserValue.userId; // ID учителя берется из currentUser
    return this.http
      .get<any>(`${this.baseUrl}/TeacherTests/GetByUserId/${teacherId}`)
      .pipe(
        map((response) => response.items as TeacherTest[]),
        catchError((error) => {
          console.error('Error fetching teacher tests:', error);
          return throwError(error);
        })
      );
  }
  addTeacherTest(
    testTheme: string,
    testUrl: string,
    group: string
  ): Observable<any> {
    const teacherId = this.currentUserValue.userId;
    const newTest: TeacherTest = {
      id: uuidv4(),
      teacherId: teacherId,
      status: 'waiting',
      testTheme: testTheme,
      testUrl: testUrl,
    };

    return this.http.post<any>(`${this.baseUrl}/TeacherTests`, newTest).pipe(
      catchError((error) => {
        console.error('Error adding new test:', error);
        return throwError(error);
      })
    );
  }
  updateTeacherTest(test: TeacherTest): Observable<any> {
    return this.http
      .put<any>(`${this.baseUrl}/TeacherTests/${test.id}`, test)
      .pipe(
        catchError((error) => {
          console.error('Error updating test:', error);
          return throwError(error);
        })
      );
  }
  getDepartmentMeetings(departmentId: string): Observable<any[]> {
    return this.http
      .get<any>(
        `${this.baseUrl}/DepartmentMeetingPlans/GetByDepartmentId/${departmentId}`
      )
      .pipe(
        map((response) => response.items || response), // Убедимся, что возвращаем массив
        catchError((error) => {
          console.error('Error fetching meetings:', error);
          return throwError(error);
        })
      );
  }
  downloadTemplate(): Observable<any> {
    return this.http
      .get<any>(
        `${this.baseUrl}/ExchangeVisitsPlans/4d82beb4-5e7b-48e6-b084-5bdc485bc1e7`
      )
      .pipe(
        catchError((error) => {
          console.error('Error downloading template:', error);
          return throwError(error);
        })
      );
  }

  // Метод для загрузки файлов
  uploadExchangeVisitFile(
    file: File,
    teacherId: string,
    fileName: string
  ): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, fileName);

    const params = new HttpParams()
      .set('TeacherId', teacherId)
      .set('Name', fileName);

    return this.http
      .post<any>(`${this.baseUrl}/ExchangeVisitsPlans`, formData, { params })
      .pipe(
        catchError((error) => {
          console.error('Error uploading file:', error);
          return throwError(error);
        })
      );
  }

  generateUUID(): string {
    return uuidv4();
  }
  getStudentsGroups(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/StudentsGroups`).pipe(
      catchError((error) => {
        console.error('Error fetching student groups:', error);
        return throwError(error);
      })
    );
  }
  addReview(review: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Reviews`, review).pipe(
      catchError((error) => {
        console.error('Error adding review:', error);
        return throwError(error);
      })
    );
  }
  updateStudentAttendance(attendanceId: string, attendance: StudentAttendance): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/StudentAttendances/${attendanceId}`, attendance).pipe(
      catchError(error => {
        console.error('Error updating student attendance:', error);
        return throwError(error);
      })
    );
  }
  getHomeWorksByStudentId(studentId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/HomeWorks/GetByStudentId/${studentId}`).pipe(
      catchError(error => {
        console.error('Error fetching homeworks:', error);
        return throwError(error);
      })
    );
  }

  updateHomework(id: string, homework: HomeWork): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/HomeWorks/${id}`, homework).pipe(
      catchError(error => {
        console.error('Error updating homework:', error);
        return throwError(error);
      })
    );
  }
  gradeHomework(homeworkId: string, grade: number): Observable<any> {
    const url = `${this.baseUrl}/HomeWorks/GradeAsync/${homeworkId}/${grade}`;
    return this.http.put<any>(url, {}).pipe(
      catchError(error => {
        console.error('Error grading homework:', error);
        return throwError(error);
      })
    );
  }
  addHomework(homework: HomeWork): Observable<any> {
    const formData = new FormData();
    formData.append('Id', homework.id);
    formData.append('Name', homework.name);
    formData.append('Description', homework.description);
    formData.append('Comment', homework.comment || '');
    formData.append('Answer', homework.answer || '');
    formData.append('IsChecked', homework.isChecked.toString());
    formData.append('Grade', homework.grade.toString());
    formData.append('StudentId', homework.studentId);
    formData.append('DisciplineId', homework.disciplineId);
    formData.append('TeacherId', homework.teacherId);

    // Добавьте файл в FormData
    if (homework.file) {
        const byteCharacters = atob(homework.file);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/octet-stream' });
        formData.append('File', blob, `${homework.name}.file`);
    }

    return this.http.post<any>(`${this.baseUrl}/HomeWorks`, formData).pipe(
        catchError(error => {
            console.error('Error adding homework:', error);
            return throwError(error);
        })
    );
}
getGroupById(groupId: string): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/StudentsGroups/${groupId}`).pipe(
    catchError(error => {
      console.error('Error fetching group:', error);
      return throwError(error);
    })
  );
}
getLessonById(lessonId: string): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/Lessons/${lessonId}`).pipe(
    catchError(error => {
      console.error('Error fetching lesson:', error);
      return throwError(error);
    })
  );
}
updateLesson(lessonId: string, lesson: Lesson): Observable<any> {
  return this.http.put<any>(`${this.baseUrl}/Lessons/${lessonId}`, lesson).pipe(
    catchError(error => {
      console.error('Error updating lesson:', error);
      return throwError(error);
    })
  );
}
createLesson(lesson: Lesson): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/Lessons`, lesson).pipe(
    catchError(error => {
      console.error('Error creating lesson:', error);
      return throwError(error);
    })
  );
}
uploadDevelopmentPlan(file: File): Observable<any> {
  const userId = this.currentUserValue.userId;
  const userName = this.currentUserValue.userName;
  const now = new Date();
  const fileName = `0${now.getMonth() + 1}.${now.getFullYear()}-DevelopmentPlan-${userName}`;
  const formData = new FormData();
  formData.append('file', file, fileName);

  const params = new HttpParams()
    .set('Id', uuidv4())
    .set('TeacherId', userId)
    .set('Name', fileName);

  return this.http
    .post<any>(`${this.baseUrl}/DevelopmentPlans`, formData, { params })
    .pipe(
      catchError((error) => {
        console.error('Ошибка загрузки файла:', error);
        return throwError(error);
      })
    );
}
downloadDevelopmentPlanTemplate(): Observable<Blob> {
  const templateId = '4d82beb4-5e7b-48e6-b084-5bdc485bc1e7';
  return this.http
    .get(`${this.baseUrl}/DevelopmentPlans/${templateId}`, {
      responseType: 'blob',
    })
    .pipe(
      catchError((error) => {
        console.error('Error downloading development plan template:', error);
        return throwError(error);
      })
    );
}
getExamsByDiscipline(disciplineId: string): Observable<Exam[]> {
  return this.http.get<Exam[]>(`${this.baseUrl}/StudentExams/by-discipline/${disciplineId}`).pipe(
    catchError((error) => {
      console.error('Error fetching exams:', error);
      return throwError(error);
    })
  );
}
updateStudentExamGrade(examId: string, exam: Exam): Observable<any> {
  console.log(exam)
  return this.http.put<any>(`${this.baseUrl}/StudentExams/${examId}`, exam).pipe(
    catchError(error => {
      console.error('Error updating exam grade:', error);
      return throwError(error);
    })
  );
}
getStudentReviews(studentId: string): Observable<Review[]> {
  return this.http.get<Review[]>(`${this.baseUrl}/Reviews/ByStudent/${studentId}`).pipe(
    catchError(error => {
      console.error('Error fetching reviews:', error);
      return throwError(error);
    })
  );
}
getTeacherReviews(teacherId: string): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/ExchangeVisitsPlanReview/by-teacher/${teacherId}`).pipe(
    catchError(error => {
      console.error('Error fetching teacher reviews:', error);
      return throwError(error);
    })
  );
}

}
