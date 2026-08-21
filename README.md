# School Management System Mobile Application

A modern React Native mobile application for the School Management System Education Management System, built with Expo and TypeScript.

## 🚀 Features

### 📊 Dashboard
- Personalized greeting with user profile
- Quick overview statistics (Students, Teachers, Attendance, Courses)
- Quick action buttons for fast navigation
- Upcoming events display
- Recent notifications feed

### 📚 Academics
- **Courses** - View enrolled courses with details
- **Assignments** - Track assignments with due dates and status
- **Exams** - View exam schedules with date, time, and room info

### ✅ Attendance
- Attendance rate overview card
- Weekly calendar view
- Today's classes with status
- Monthly attendance statistics
- Status legend (Present, Absent, Late, Holiday)

### 💰 Finance
- Fee summary with total, paid, and pending amounts
- Quick pay functionality
- Fee details list
- Transaction history
- Multiple payment methods

### 📖 Library
- Browse books by category
- Search functionality
- Borrowed books tracking with due dates
- Borrowing history
- Book availability status

### 📅 Events
- Calendar view with month navigation
- Event details with location and organizer
- Upcoming events list
- Event type badges (Sports, Meeting, Exam, etc.)

### 📝 Results
- Semester-wise results
- Overall performance with SGPA
- Subject-wise grades
- Best/Needs Focus subject analysis
- Overview and detailed views

### ⏰ Schedule
- Week day selector
- Current period card with live progress
- Timeline-based schedule view
- Class summary statistics

### 🔔 Notifications
- Stats cards (Total, Unread, Today)
- Filter tabs (All, Unread, Read)
- Mark as read functionality
- Notification type badges

### 👤 Profile
- Personal information management
- Academic details
- Contact information
- Quick stats (Attendance, Grade, Rank, Points)
- Edit mode for updating info

### ⚙️ Settings
- Notification preferences
- Appearance settings (Dark mode)
- Security options (Biometric, 2FA)
- Data & storage management
- Help & support

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation v6
- **Styling**: StyleSheet + expo-linear-gradient
- **Icons**: @expo/vector-icons (Ionicons)
- **Storage**: expo-secure-store
- **HTTP Client**: Axios
- **Date Handling**: date-fns

## 📋 Requirements

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator
- Expo Go app (for physical device testing)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-repo/school_management_system_mobile.git
cd school_management_system_mobile
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_URL=http://localhost:8000/api
EXPO_PUBLIC_APP_NAME=school_management_system_mobile
```

### 4. Start the development server

```bash
npx expo start
```

### 5. Run on device/simulator

- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app for physical device

## 📁 Project Structure

```
school_management_system_mobile/
├── assets/                 # App assets (icons, splash)
├── src/
│   ├── components/        # Reusable components
│   │   ├── ui/           # UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Input.tsx
│   │   └── index.ts
│   ├── constants/         # App constants
│   │   ├── apiPaths.ts
│   │   └── colors.ts
│   ├── hooks/             # Custom hooks
│   │   └── useAppStore.ts
│   ├── navigation/        # Navigation configuration
│   │   ├── AuthNavigator.tsx
│   │   ├── MainTabNavigator.tsx
│   │   ├── MainStackNavigator.tsx
│   │   ├── RootNavigator.tsx
│   │   └── index.ts
│   ├── screens/           # Screen components
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── ForgotPasswordScreen.tsx
│   │   ├── main/
│   │   │   ├── DashboardScreen.tsx
│   │   │   ├── AcademicsScreen.tsx
│   │   │   ├── AttendanceScreen.tsx
│   │   │   ├── FinanceScreen.tsx
│   │   │   ├── MoreScreen.tsx
│   │   │   ├── NotificationsScreen.tsx
│   │   │   ├── EventsScreen.tsx
│   │   │   ├── LibraryScreen.tsx
│   │   │   ├── ScheduleScreen.tsx
│   │   │   ├── ResultsScreen.tsx
│   │   │   ├── ProfileScreen.tsx
│   │   │   └── SettingsScreen.tsx
│   │   └── index.ts
│   ├── services/          # API services
│   │   ├── api.ts
│   │   └── dataService.ts
│   ├── store/             # Redux store
│   │   ├── slices/
│   │   │   └── authSlice.ts
│   │   └── index.ts
│   └── types/             # TypeScript types
│       └── index.ts
├── App.tsx                # Root component
├── app.json               # Expo configuration
├── babel.config.js
├── package.json
└── tsconfig.json
```

## 📱 Screens Overview

| Tab | Screen | Description |
|-----|--------|-------------|
| Dashboard | `DashboardScreen` | Home screen with overview |
| Academics | `AcademicsScreen` | Courses, Assignments, Exams |
| Attendance | `AttendanceScreen` | Attendance tracking |
| Finance | `FinanceScreen` | Fee management |
| More | `MoreScreen` | Additional features menu |

### Stack Screens (Accessible from More)

| Screen | Description |
|--------|-------------|
| `NotificationsScreen` | All notifications |
| `EventsScreen` | Events calendar |
| `LibraryScreen` | Library books |
| `ScheduleScreen` | Class timetable |
| `ResultsScreen` | Exam results |
| `ProfileScreen` | User profile |
| `SettingsScreen` | App settings |

## 🎨 Design System

### Colors
The app uses a dark theme with a carefully crafted color palette:
- **Primary**: Indigo (#6366F1)
- **Secondary**: Cyan (#06B6D4)
- **Background**: Dark gradients
- **Glass**: Glassmorphism effects

### Components
- **Card** - Glass/Gradient variants
- **Button** - Primary/Secondary/Outline
- **Input** - With icons and validation
- **StatCard** - For displaying statistics
- **FeatureCard** - For quick actions

## 🔐 Authentication

- JWT token-based authentication
- Secure token storage with expo-secure-store
- Auto-refresh token mechanism
- Protected navigation routes

## 📲 Building for Production

### iOS

```bash
npx expo build:ios
# or with EAS
eas build --platform ios
```

### Android

```bash
npx expo build:android
# or with EAS
eas build --platform android
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run with coverage
npm run test:coverage
```

## 📦 Publishing

### Expo Updates

```bash
npx expo publish
```

### App Store / Play Store

Use EAS Submit:

```bash
eas submit --platform ios
eas submit --platform android
```

## 🔧 Configuration

### app.json

Key configurations:
- App name and slug
- Bundle identifiers
- Splash screen
- App icons
- Permissions

### Expo Plugins

- expo-secure-store
- expo-notifications
- expo-blur

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributors

- Development Team

---

© 2026 EduPortal. All rights reserved.
