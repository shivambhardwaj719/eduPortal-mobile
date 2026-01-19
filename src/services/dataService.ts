import api from './api';
import { apiPaths } from '../constants/apiPaths';
import {
    Student,
    Course,
    Assignment,
    Exam,
    ExamResult,
    Attendance,
    Faculty,
    Event,
    Book,
    BookIssue,
    StudentFee,
    Notification,
    Grade,
    PaginatedResponse
} from '../types';

// Students Service
export const studentsService = {
    getAll: async (params?: Record<string, any>): Promise<PaginatedResponse<Student>> => {
        const response = await api.get(apiPaths.students.list, { params });
        return response.data;
    },
    getById: async (id: number): Promise<Student> => {
        const response = await api.get(`${apiPaths.students.list}/${id}`);
        return response.data;
    },
};

// Grades Service
export const gradesService = {
    getAll: async (): Promise<PaginatedResponse<Grade>> => {
        const response = await api.get(apiPaths.grades.list);
        return response.data;
    },
};

// Courses Service
export const coursesService = {
    getAll: async (params?: Record<string, any>): Promise<PaginatedResponse<Course>> => {
        const response = await api.get(apiPaths.courses.list, { params });
        return response.data;
    },
    getById: async (id: number): Promise<Course> => {
        const response = await api.get(`${apiPaths.courses.list}/${id}`);
        return response.data;
    },
    getEnabled: async (): Promise<Course[]> => {
        const response = await api.get(apiPaths.courses.enabledList);
        return response.data;
    },
};

// Assignments Service
export const assignmentsService = {
    getAll: async (params?: Record<string, any>): Promise<PaginatedResponse<Assignment>> => {
        const response = await api.get(apiPaths.assignments.list, { params });
        return response.data;
    },
    getById: async (id: number): Promise<Assignment> => {
        const response = await api.get(`${apiPaths.assignments.list}/${id}`);
        return response.data;
    },
    create: async (data: Partial<Assignment>): Promise<Assignment> => {
        const response = await api.post(apiPaths.assignments.create, data);
        return response.data;
    },
    update: async (id: number, data: Partial<Assignment>): Promise<Assignment> => {
        const response = await api.put(`${apiPaths.assignments.update}/${id}`, data);
        return response.data;
    },
};

// Exams Service
export const examsService = {
    getAll: async (params?: Record<string, any>): Promise<PaginatedResponse<Exam>> => {
        const response = await api.get(apiPaths.exams.list, { params });
        return response.data;
    },
    getById: async (id: number): Promise<Exam> => {
        const response = await api.get(`${apiPaths.exams.list}/${id}`);
        return response.data;
    },
};

// Exam Results Service
export const examResultsService = {
    getAll: async (params?: Record<string, any>): Promise<PaginatedResponse<ExamResult>> => {
        const response = await api.get(apiPaths.examResults.list, { params });
        return response.data;
    },
    getByStudent: async (studentId: number): Promise<ExamResult[]> => {
        const response = await api.get(apiPaths.examResults.list, { params: { student_id: studentId } });
        return response.data.results;
    },
};

// Attendance Service
export const attendanceService = {
    getAll: async (params?: Record<string, any>): Promise<PaginatedResponse<Attendance>> => {
        const response = await api.get(apiPaths.attendance.list, { params });
        return response.data;
    },
    create: async (data: Partial<Attendance>): Promise<Attendance> => {
        const response = await api.post(apiPaths.attendance.create, data);
        return response.data;
    },
    getStudentAttendance: async (studentId: number, params?: Record<string, any>): Promise<Attendance[]> => {
        const response = await api.get(apiPaths.attendance.list, {
            params: { student_id: studentId, ...params }
        });
        return response.data.results;
    },
};

// Faculty Service
export const facultyService = {
    getAll: async (params?: Record<string, any>): Promise<PaginatedResponse<Faculty>> => {
        const response = await api.get(apiPaths.faculties.list, { params });
        return response.data;
    },
    getById: async (id: number): Promise<Faculty> => {
        const response = await api.get(`${apiPaths.faculties.list}/${id}`);
        return response.data;
    },
};

// Events Service
export const eventsService = {
    getAll: async (params?: Record<string, any>): Promise<PaginatedResponse<Event>> => {
        const response = await api.get(apiPaths.events.list, { params });
        return response.data;
    },
    getById: async (id: number): Promise<Event> => {
        const response = await api.get(`${apiPaths.events.list}/${id}`);
        return response.data;
    },
    getUpcoming: async (): Promise<Event[]> => {
        const response = await api.get(apiPaths.events.list, {
            params: { upcoming: true, limit: 10 }
        });
        return response.data.results;
    },
};

// Library Service
export const libraryService = {
    getAllBooks: async (params?: Record<string, any>): Promise<PaginatedResponse<Book>> => {
        const response = await api.get(apiPaths.library.list, { params });
        return response.data;
    },
    getBookById: async (id: number): Promise<Book> => {
        const response = await api.get(`${apiPaths.library.list}/${id}`);
        return response.data;
    },
    getIssuedBooks: async (studentId?: number): Promise<PaginatedResponse<BookIssue>> => {
        const response = await api.get(apiPaths.library.listIssues, {
            params: studentId ? { student_id: studentId } : {}
        });
        return response.data;
    },
};

// Finance Service
export const financeService = {
    getStudentFees: async (studentId?: number): Promise<PaginatedResponse<StudentFee>> => {
        const response = await api.get(apiPaths.finance.listFees, {
            params: studentId ? { student_id: studentId } : {}
        });
        return response.data;
    },
    getFeeStructures: async (): Promise<any[]> => {
        const response = await api.get(apiPaths.finance.listStructures);
        return response.data.results;
    },
};

// Notifications Service
export const notificationsService = {
    getAll: async (params?: Record<string, any>): Promise<PaginatedResponse<Notification>> => {
        const response = await api.get(apiPaths.notifications.list, { params });
        return response.data;
    },
    markAsRead: async (id: number): Promise<void> => {
        await api.patch(`${apiPaths.notifications.list}/${id}`, { is_read: true });
    },
    getStats: async (): Promise<any> => {
        const response = await api.get(apiPaths.notifications.stats);
        return response.data;
    },
};

export default {
    students: studentsService,
    grades: gradesService,
    courses: coursesService,
    assignments: assignmentsService,
    exams: examsService,
    examResults: examResultsService,
    attendance: attendanceService,
    faculty: facultyService,
    events: eventsService,
    library: libraryService,
    finance: financeService,
    notifications: notificationsService,
};
