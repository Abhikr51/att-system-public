const express = require("express")
const colors = require('colors');
const cors = require("cors")
const AuthController = require("./controllers/AuthController");
const HomeController = require("./controllers/HomeController");
const { auth_verify, auth_required, admin_role, teacher_role } = require("./middlewares/AuthMiddleware");
const TeacherController = require("./controllers/TeacherController");
const { file_uploader } = require("./helper/library");
const StudentController = require("./controllers/StudentController");
const StreamController = require("./controllers/StreamController");
const CourseController = require("./controllers/CourseController");
const SemseterController = require("./controllers/SemesterController");
const PeriodController = require("./controllers/PeriodController");
const RoutineController = require("./controllers/RoutineController");
const SubjectController = require("./controllers/SubjectController");
const AttendanceController = require("./controllers/AttendanceController");
// const port = 8001
const app = express();

// ======== configs ========
const version = "/v1"
const endpoint = "/api" + version



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(auth_verify)
app.use(cors({
    origin : "*"
}))
app.use('/public', express.static('public'))
// app.use(cors())
// ======== configs ========



//========= routes =========

//global routes
const global = express.Router()

global.post("/login",AuthController.login)
global.get("/logout",AuthController.logout)
// global.post("/create-user",AuthController.register)
global.get("/get-user",auth_required,AuthController.getUser)
global.post("/student/create",file_uploader("image"),StudentController.createStudent)
global.get("/mail", AttendanceController.send_mail)
global.get("/test", (req,res)=>{
    res.send({
        status:true,
        data : "Welcome to backend"
    })
})
global.get("/semester/list",SemseterController.getSemester)
global.get("/stream/list",StreamController.getStream)
//teacher Routes
const teacher = express.Router()
teacher.get("/list",TeacherController.getTeacherList)
teacher.post("/create",file_uploader("image"),TeacherController.createTeacher)
teacher.post("/create-bulk",file_uploader("sheet",["csv"]), TeacherController.createBulkTeachers)
teacher.post("/update",TeacherController.updateTeacher)
teacher.post("/delete",TeacherController.deleteTeacher)


//teacher Routes
const student = express.Router()
student.get("/list",StudentController.getStudentList)
student.post("/byid",StudentController.getStudentById)
// student.post("/create",file_uploader("image"),StudentController.createStudent)
student.post("/create-bulk",file_uploader("sheet",["csv"]), StudentController.createBulkStudents)
student.post("/update",StudentController.updateStudent)
student.post("/delete",StudentController.deleteStudent)

//stream routes
const stream = express.Router()

stream.post("/add",StreamController.addStream)
stream.post("/add-bulk",file_uploader("sheet",["csv"]),StreamController.bulkAddStream)
stream.post("/update",StreamController.updateStream)
stream.post("/delete",StreamController.deleteStream)

//course routes
const course = express.Router()
course.get("/list",CourseController.getCourse)
course.post("/add",CourseController.addCourse)
course.post("/add-bulk",file_uploader("sheet",["csv"]),CourseController.bulkAddCourse)
course.post("/update",CourseController.updateCourse)
course.post("/delete",CourseController.deleteCourse)

//semester routes
const semester = express.Router()

semester.post("/add",SemseterController.addSemester)
// semester.post("/add-bulk",file_uploader("sheet",["csv"]),SemseterController.bulkAddSemester)
semester.post("/update",SemseterController.updateSemester)
semester.post("/delete",SemseterController.deleteSemester)

//period routes
const period = express.Router()
period.get("/list",PeriodController.getPeriod)
period.post("/add",PeriodController.addPeriod)
// period.post("/add-bulk",file_uploader("sheet",["csv"]),PeriodController.bulkAddPeriod)
period.post("/update",PeriodController.updatePeriod)
period.post("/delete",PeriodController.deletePeriod)

//subject routes
const subject = express.Router()
subject.get("/list",SubjectController.getSubject)
subject.post("/add",SubjectController.addSubject)
subject.post("/add-bulk",file_uploader("sheet",["csv"]),SubjectController.bulkAddSubject)
subject.post("/update",SubjectController.updateSubject)
subject.post("/delete",SubjectController.deleteSubject)

//Routines
const routine = express.Router()
routine.post("/list",RoutineController.getRoutine)
routine.post("/upload",file_uploader("sheet",["csv"]),RoutineController.uploadRoutine)
routine.post("/delete",RoutineController.deleteRoutine)


//attendance routes
const attendance = express.Router()
// attendance.post("/make-attendance",AttendanceController.make_attendance)
attendance.post("/list",AttendanceController.getAttendance)
attendance.post("/student-wise-list",AttendanceController.getStudentWiseAtt)


//admin routes
const admin = express.Router()
admin.get("/",HomeController.home)



//Register a route
app.use(endpoint + "/teacher" ,teacher_role, teacher)
app.use(endpoint + "/" , global)
app.use(endpoint + "/student" , auth_required , student)
app.use(endpoint + "/admin" , admin_role ,admin)
app.use(endpoint + "/stream" , teacher_role ,stream)
app.use(endpoint + "/course" , teacher_role ,course)
app.use(endpoint + "/semester" , teacher_role ,semester)
app.use(endpoint + "/period" , teacher_role ,period)
app.use(endpoint + "/routine" , teacher_role ,routine)
app.use(endpoint + "/subject" , teacher_role ,subject)
app.use(endpoint + "/att" , auth_required ,attendance)

//4O4 page
app.get(endpoint+"/*",(_,res)=>{
    res.send("4O4 - not found ")
})
//========= routes =========



// ========= server =========
app.listen(
    process.env.PORT,
    process.env.HOST,
    ()=>console.log(`Backend started at port http://${process.env.HOST}:${process.env.PORT}`.blue)
)