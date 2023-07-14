// const base = "http://13.231.246.144:8001"
// const base = "http://192.168.29.39" //home
// const base = "http://192.168.0.184" //Mess
const base = "http://192.168.29.237" //Me
// const base = "http://192.168.2.37" //CS 1st Floor
// const base = "http://192.168.142.48" //RM+
// const base = "http://localhost:8000"
export const hostURL  =  `${base}:8000`;
export const public_url = hostURL + '/public'
export const socketURL  = `${base}:8080`;
export const baseURL = hostURL + "/api/v1"



// routes

export const loginURL  = "/login"
export const getUserURL  = "/get-user"
export const create_userURL  = "/create-user"

//teacher
export const teacher_listURL = "/teacher/list"
export const teacher_createURL = "/teacher/create"
export const teacher_create_bulkURL = "/teacher/create-bulk"
export const teacher_updateURL = "/teacher/update"
export const teacher_deleteURL = "/teacher/delete"

//student
export const student_listURL = "/student/list"
export const student_by_id = "/student/byid"
export const student_createURL = "/student/create"
export const student_create_bulkURL = "/student/create-bulk"
export const student_updateURL = "/student/update"
export const student_deleteURL = "/student/delete"

//stream
export const stream_listURL = "/stream/list"
export const stream_addURL = "/stream/add"
export const stream_add_bulkURL = "/stream/add-bulk"
export const stream_updateURL = "/stream/update"
export const stream_deleteURL = "/stream/delete"
//semester
export const semester_listURL = "/semester/list"
export const semester_addURL = "/semester/add"
export const semester_add_bulkURL = "/semester/add-bulk"
export const semester_updateURL = "/semester/update"
export const semester_deleteURL = "/semester/delete"
//subject
export const subject_listURL = "/subject/list"
export const subject_addURL = "/subject/add"
export const subject_add_bulkURL = "/subject/add-bulk"
export const subject_updateURL = "/subject/update"
export const subject_deleteURL = "/subject/delete"
//period
export const period_listURL = "/period/list"
export const period_addURL = "/period/add"
// export const period_add_bulkURL = "/period/add-bulk"
export const period_updateURL = "/period/update"
export const period_deleteURL = "/period/delete"

//subject
export const routine_listURL = "/routine/list"
export const routine_uploadURL = "/routine/upload"
export const routine_deleteURL = "/routine/delete"

//attendance
export const get_student_wise_attendanceURL = "/att/student-wise-list"
