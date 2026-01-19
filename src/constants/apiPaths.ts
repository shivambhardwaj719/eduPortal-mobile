import { Platform } from 'react-native';
const LOCAL_IP = '192.168.2.191';

export const API_BASE_URL = Platform.select({
    web: 'http://localhost:8000/api/v1',
    default: `http://${LOCAL_IP}:8000/api/v1`,
}) as string;

// Web Portal API Paths structure
export const apiPaths = {
    auth: {
        login: '/logins',
        logOut: '/logouts',
        refreshToken: '/refreshtokens',
        checkDomain: '/check-domains',
        forgotPassword: '/send-reset-password-emails',
        resetPassword: '/setpassword',
        userProfile: '/user-profiles',
        setMPIN: '/set-mpins',
        checkMPIN: '/check-mpins',
        verifyPassword: '/verify-passwords',
    },
    dashboard: {
        stats: '/stats',
    },
    users: {
        create: '/users',
        list: '/users',
        permissions: '/permissions',
        managePermissions: '/manage-permissions',
        status: '/user-status',
        update: '/user',
        profiles: '/profiles',
        profileDetail: '/profile-detail',
        profilePermissionsUpdate: '/profile-permissions-update',
        manageProfile: '/manage-profile',
        enabledUsers: '/enabled-users',
        profileStatusUpdate: '/profile-status-update',
        enabledProfileList: '/enabled-profile-list',
        delete: '/users',
        deleteProfile: '/profiles',
    },
    students: {
        create: '/students',
        list: '/students',
        delete: '/students',
        update: '/students',
    },
    studentClasses: {
        create: '/student-classes',
        list: '/student-classes',
        delete: '/student-classes',
        update: '/student-classes',
    },
    faculties: {
        create: '/faculties',
        list: '/faculties',
        delete: '/faculties',
        update: '/faculties',
        enabledList: '/enable-faculty-list',
    },
    grades: {
        create: '/grades',
        list: '/grades',
        delete: '/grades',
        update: '/grades',
    },
    courses: {
        create: '/courses',
        list: '/courses',
        delete: '/courses',
        update: '/courses',
        enabledList: '/list-enabled-courses',
    },
    scheduleSlots: {
        create: '/schedule-slots',
        list: '/schedule-slots',
        delete: '/schedule-slots',
        update: '/schedule-slots',
    },
    assignments: {
        create: '/assignments',
        list: '/assignments',
        delete: '/assignments',
        update: '/assignments',
    },
    attendance: {
        list: '/student-attendances',
        create: '/student-attendances',
        update: '/student-attendances',
        studentList: '/enable-student-list',
    },
    exams: {
        create: '/exams',
        list: '/exams',
        delete: '/exams',
        update: '/exams',
    },
    examResults: {
        create: '/exam-results',
        list: '/exam-results',
        delete: '/exam-results',
        update: '/exam-results',
    },
    library: {
        create: '/books',
        list: '/books',
        delete: '/books',
        update: '/books',
        updateCopies: '/update-books-copies',
        issueBook: '/book-issues',
        listIssues: '/book-issues',
        deleteIssues: '/book-issues',
        updateIssue: '/book-issues',
        bookReturn: '/book-return',
    },
    finance: {
        listFees: '/student-fees',
        createFee: '/student-fees',
        listStructures: '/fee-structures',
        listExpenses: '/school-expanses',
        listScholarships: '/scholarships',
    },
    events: {
        create: '/events',
        list: '/events',
        delete: '/events',
        update: '/events',
    },
    notifications: {
        list: '/notifications',
        send: '/notifications',
        stats: '/stats',
    },
    hostels: {
        create: '/hostels',
        list: '/hostels',
        delete: '/hostels',
        update: '/hostels',
    },
    hostelRooms: {
        create: '/hostel-rooms',
        list: '/hostel-rooms',
        delete: '/hostel-rooms',
        update: '/hostel-rooms',
        availableBeds: '/available-rooms-bed',
    },
    hostelMeals: {
        create: '/hostel-meals',
        list: '/hostel-meals',
        delete: '/hostel-meals',
        update: '/hostel-meals',
    },
    hostelAdmissions: {
        create: '/hostel-admission',
        list: '/hostel-admission',
        delete: '/hostel-admission',
        update: '/hostel-admission',
    },
    inventory: {
        vehicles: {
            create: '/vehicles',
            list: '/vehicles',
            delete: '/vehicles',
            update: '/vehicles',
            enabledList: '/list-enabled-vehicles',
        },
        assets: {
            create: '/assets',
            list: '/assets',
            delete: '/assets',
            update: '/assets',
        },
        maintenance: {
            create: '/maintenance-logs',
            list: '/maintenance-logs',
            delete: '/maintenance-logs',
            update: '/maintenance-logs',
        },
        dashboard: {
            stats: '/inventory-dashboard-stats',
            distribution: '/asset-category-distribution',
        }
    },
    settings: {
        system: '/system',
        school: '/school',
    }
};
