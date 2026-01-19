// User Types
export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    profile_type: string;
    is_active: boolean;
    avatar?: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
    school_id?: string;
    host?: string;
}

// Student Types
export interface Student {
    id: number;
    student_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    date_of_birth: string;
    gender: 'male' | 'female' | 'other';
    address: string;
    guardian_name: string;
    guardian_phone: string;
    guardian_email: string;
    admission_date: string;
    is_active: boolean;
    profile_image?: string;
}

export interface StudentClass {
    id: number;
    student_id: number;
    student: Student;
    grade_id: number;
    grade: Grade;
    academic_year: string;
    roll_number: string;
    section: string;
}

// Academic Types
export interface Grade {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
}

export interface Course {
    id: number;
    name: string;
    code: string;
    description: string;
    grade_id: number;
    faculty_id?: number;
    credit_hours: number;
    is_active: boolean;
}

export interface Assignment {
    id: number;
    title: string;
    description: string;
    course_id: number;
    course: Course;
    due_date: string;
    total_marks: number;
    status: 'active' | 'closed' | 'draft';
}

export interface Exam {
    id: number;
    name: string;
    exam_type: string;
    course_id: number;
    course: Course;
    exam_date: string;
    start_time: string;
    end_time: string;
    total_marks: number;
    passing_marks: number;
}

export interface ExamResult {
    id: number;
    exam_id: number;
    exam: Exam;
    student_id: number;
    student: Student;
    marks_obtained: number;
    grade: string;
    remarks?: string;
}

// Attendance Types
export interface Attendance {
    id: number;
    student_id: number;
    student: Student;
    date: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    remarks?: string;
}

// Finance Types
export interface StudentFee {
    id: number;
    student_id: number;
    student: Student;
    fee_type: string;
    amount: number;
    due_date: string;
    paid_date?: string;
    status: 'pending' | 'paid' | 'overdue';
    academic_year: string;
}

// Faculty Types
export interface Faculty {
    id: number;
    faculty_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    department: string;
    designation: string;
    qualification: string;
    date_of_joining: string;
    is_active: boolean;
    profile_image?: string;
}

// Event Types
export interface Event {
    id: number;
    title: string;
    description: string;
    event_type: string;
    start_date: string;
    end_date: string;
    location: string;
    organizer: string;
    is_active: boolean;
}

// Notification Types
export interface Notification {
    id: number;
    title: string;
    message: string;
    notification_type: string;
    is_read: boolean;
    created_at: string;
    sender_id?: number;
}

// Library Types
export interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    publisher: string;
    category: string;
    total_copies: number;
    available_copies: number;
    cover_image?: string;
}

export interface BookIssue {
    id: number;
    book_id: number;
    book: Book;
    student_id: number;
    issue_date: string;
    due_date: string;
    return_date?: string;
    actual_return_date?: string;
    fine_amount?: number;
    status: 'issued' | 'returned' | 'overdue';
}

// Hostel Types
export interface Hostel {
    id: number;
    name: string;
    warden_name: string;
    country_number_code: number;
    warden_phone: string;
}

export interface HostelRoom {
    id: number;
    hostel: Hostel;
    room_number: string;
    capacity: number;
    floor: number;
    type: string;
    cost_per_bed: string;
    current_occupancy?: number;
}

export interface HostelMeal {
    id: number;
    day: string;
    breakfast: string;
    lunch: string;
    dinner: string;
    category: string;
    color: string;
}

export interface HostelAdmission {
    id: number;
    student: Student;
    hostel: Hostel;
    room_no: HostelRoom;
    bed_no: string;
    admission_date: string;
    status: string;
}

// Inventory Types
export interface InventoryAsset {
    id: number;
    name: string;
    category: string;
    quantity: number;
    condition: string;
    location: string;
    purchase_date: string;
    price: string;
}

export interface InventoryVehicle {
    id: number;
    vehicle_number: string;
    model: string;
    driver_name: string;
    capacity: number;
    status: string;
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface PaginatedResponse<T> {
    results: T[];
    count: number;
    next: string | null;
    previous: string | null;
}

// Dashboard Types
export interface DashboardStats {
    totalStudents: number;
    totalTeachers: number;
    totalCourses: number;
    upcomingEvents: number;
    pendingAssignments: number;
    todayAttendance: number;
    unreadNotifications: number;
    pendingFees: number;
}

// Navigation Types
export type RootStackParamList = {
    Domain: undefined;
    Login: { domain: string; schoolId: string; schoolName?: string } | undefined;
    ForgotPassword: undefined;
    Main: undefined;
    StudentDetails: { studentId: number };
    CourseDetails: { courseId: number };
    AssignmentDetails: { assignmentId: number };
    ExamDetails: { examId: number };
    EventDetails: { eventId: number };
    BookDetails: { bookId: number };
    NotificationDetails: { notificationId: number };
    Profile: undefined;
    Settings: undefined;
};

export type MainTabParamList = {
    Dashboard: undefined;
    Academics: undefined;
    Attendance: undefined;
    Finance: undefined;
    More: undefined;
};

export type AcademicsStackParamList = {
    AcademicsHome: undefined;
    Courses: undefined;
    Assignments: undefined;
    Exams: undefined;
    ExamResults: undefined;
};
