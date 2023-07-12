import { createRoute } from "./config/lib";
import Speed from '@mui/icons-material/Speed';
import PermIdentity from '@mui/icons-material/PermIdentity';
import PeopleAltOutlined from '@mui/icons-material/PeopleAltOutlined';
import ListAlt from '@mui/icons-material/ListAlt';
import StackedLineChart from '@mui/icons-material/StackedLineChart';
import SubjectIcon from '@mui/icons-material/Subject';
import NotificationsNone from '@mui/icons-material/NotificationsNone';
import Filter6 from '@mui/icons-material/Filter6';
import Feed from '@mui/icons-material/Feed';
import Dashboard from "./views/Dashboard"
import Teachers from "./views/Teachers";
import AddTeacher from "./views/Teachers/AddTeacher";
import AddStudent from "./views/Students/AddStudent";
import Students from "./views/Students";
import AddSubject from "./views/Subjects/AddSubject";
import Subjects from "./views/Subjects";
import AddSemester from "./views/Semester/AddSemester";
import Semesters from "./views/Semester";
import Routine from "./views/Routine";
import AddPeriod from "./views/Periods/AddPeriod";
import Periods from "./views/Periods";
import Attendance from "./views/Attendance";
import ViewStudentAttendance from "./views/Students/ViewStudentAttendance";
const app_sidebar = createRoute([
    {
        name : "Dashboard",
        icon : <Speed  /> ,
        path : "/dashboard",
        element : <Dashboard/>
    },
    {
        name : "Teachers",
        icon : <PermIdentity  />  ,
        path : "/teachers",
        element : <Teachers/>
    },
    {
        name : "Students",
        icon : <PeopleAltOutlined  /> ,
        path : "/students",
        element : <Students />
    },
    {
        name : "Attendance",
        icon : <StackedLineChart  /> ,
        path : "/attendance",
        element : <Attendance />
    },
    {
        name : "Subjects",
        icon : <SubjectIcon  /> ,
        path : "/subjects",
        element : <Subjects />
    },
    {
        name : "Semester",
        icon : <Filter6  /> ,
        path : "/semesters",
        element : <Semesters />
    },
    {
        name : "Routine",
        icon : <ListAlt  /> ,
        path : "/routine",
        element : <Routine />
    },
    {
        name : "Periods",
        icon : <Feed /> ,
        path : "/periods",
        element : <Periods/>
    },
    {
        name : "Notifications",
        icon : <NotificationsNone  /> ,
        path : "/notifications",
        element : <h2>Under Development</h2>
    },
],['admin','teacher'])
const app = createRoute([
    {
        name : "Add Teacher",
        path : "/teacher/add",
        element : <AddTeacher/>
    },
    {
        name : "Add Student",
        path : "/student/add",
        element : <AddStudent/>
    },
    {
        name : "View Student Attendance",
        path : "/student/attendance/:id",
        element : <ViewStudentAttendance />
    },
    {
        name : "Add Subject",
        path : "/subject/add",
        element : <AddSubject />
    },
    {
        name : "Add Semester",
        path : "/semester/add",
        element : <AddSemester/>
    },
    {
        name : "Add Period",
        path : "/period/add",
        element : <AddPeriod/>
    },
],['admin','teacher'])
const admin_sidebar = createRoute([
    {
        icon : <div></div>,
        name : "test",
        path : "/test",
        element : <h1>Test route</h1>
    },
],['admin'])
const _routes ={
    app_sidebar,
    app,
    admin_sidebar
}
export default _routes;