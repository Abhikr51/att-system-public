import React, { useEffect, useState } from 'react'
import AddCircleOutline from "@mui/icons-material/AddCircleOutline"
import Addchart from "@mui/icons-material/Addchart"
import StackedLineChart from "@mui/icons-material/StackedLineChart"
import Loader from '../../components/Loader'
import { baseURL, get_student_wise_attendanceURL, student_by_id } from '../../config/AppData'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import AppInput from '../../components/AppInput'
import moment from 'moment'
import { att_percentage_calc } from '../../config/lib'
import Chart, { plugins } from "chart.js/auto";
import { Doughnut } from 'react-chartjs-2';
const ViewStudentAttendance = () => {
  const [visible, setVisible] = useState(false)
  const [student, setStudent] = useState({})
  const [spinner, setSpinner] = useState(false)
  const [date_from, setDateFrom] = useState()
  const [date_to, setDateTo] = useState()
  const [analyzing, setAnalyzing] = useState(false)
  const [attendance, setAttendance] = useState({})
  const [totalPresent, setTotalPresent] = useState(0)
  const [totalAbsent, setTotalAbsent] = useState(0)
  const [totalPercentage, setTotalPercentage] = useState(0)
  const { id } = useParams()
  const fetchStudent = async () => {
    setSpinner(true);
    await axios.post(baseURL + student_by_id, { id }).then(({ data }) => {
      if (data.status) {
        setStudent(data.data);
      }
      setSpinner(false)
    }).catch(err => {
      setSpinner(false)
      console.log("StudentErr", err);
    })
  }
  const getAttendance = async (e) => {
    e.preventDefault();
    if (date_from && date_to) {
      setAnalyzing(true);
      await axios.post(baseURL + get_student_wise_attendanceURL, {
        date_from: date_from,
        date_to: date_to,
        id,
        semester_code: student.semester_code,
        stream_code: student.stream_code
      }).then(({ data }) => {
        if (data.status) {
          // console.log("Entries",Object.values(data.data))
          setAttendance(Object.values(data.data));
          var p = 0, c = 0, a = 0, t = 0;
          for (var i of Object.values(data.data)) {
            p += i.present;
            a += i.absent;
            c += i.cancelled;
          }
        }
        setTotalPercentage(att_percentage_calc(p, a))
        setTotalAbsent(a);
        setTotalPresent(p);
        setAnalyzing(false)
      }).catch(err => {
        setAnalyzing(false)
        console.log("Student Analyzing err", err);
      })
    } else {
      alert("Please fill the fields first !")
    }
  }
  // const attendance_status_color =(is_cancelled,is_attend)=>{
  //   if(is_cancelled){
  //     return 'secondary'
  //   }else if(is_attend){
  //     return 'success'
  //   }else{
  //     return 'danger'
  //   }
  // }
  useEffect(() => {
    fetchStudent()
  }, [])
  if (Object.keys(student) == 0) {
    return <div className="row justify-content-center">
      <div className="col-3 py-4 text-center">
        <Loader />
      </div>
    </div>
  }
  return (
    <div>
      <br />
      <div className="container-fluid">
        <div className="row align-items-center">

          <div className="col-md-3">
            <div className="card ">
              <h5 className="card-header bg-primary">Student details</h5>
              <div className="card-body p-4">
                <table>
                  <tbody>

                    <tr>
                      <td width={100}>Name</td>
                      <td width={20}>:</td>
                      <td>{student.name}</td>
                    </tr>
                    <tr>
                      <td>Stream</td>
                      <td>:</td>
                      <td>{student.stream_code}</td>
                    </tr>
                    <tr >
                      <td >Semester</td>
                      <td>:</td>
                      <td>{student.semester_code}</td>
                    </tr>
                    <tr>
                      <td>Contact</td>
                      <td>:</td>
                      <td>{student.phone}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-md-3 ">
            <form onSubmit={getAttendance}>
              <div>
                <label className='m-0' >Date From : </label>
                <AppInput type="date" className="form-control" value={date_from} onChange={(e) => setDateFrom(e.target.value)} />
              </div>
              <div>
                <label>Date To : </label>
                <AppInput type="date" className="form-control" value={date_to} onChange={(e) => setDateTo(e.target.value)} />
              </div>
              <button className="btn btn-primary btn-block mt-2">Search</button>
            </form>
          </div>
          <div className="col-md-2 att-indicator">
            <div>
              <span className='bg-success' ></span> Present
            </div>
            <div>
              <span className='bg-danger' ></span> Absent
            </div>
            <div>
              <span className='bg-grey' ></span> Cancelled
            </div>
          </div>
          <div className="col-md-4 chart-center-text">
            <div style={{ width : "270px" ,marginTop:"-50px" }} className='chart-center-text' >

              <Doughnut
                options={{
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
                data={{
                  labels: [
                    'Present',
                    'Absent'
                  ],
                  datasets: [{
                    label: 'Student Attendance',
                    data: [totalPresent, totalAbsent],
                    backgroundColor: [
                      'rgb(54, 162, 235)',
                      'rgb(255, 99, 132)',
                    ],
                    hoverOffset: 4,
                    cutout: "70%",
                    circumference: 180,
                    rotation: 270
                  }]

                }} />
              <span style={{bottom : "70px"}} >{totalPercentage}%</span>
            </div>
          </div>
        </div>
        {
          analyzing ?
            <div className="row justify-content-center">
              <div style={{ paddingTop: "100px" }} className="col-3 text-center">
                <h4 style={{ whiteSpace: "nowrap" }}  >Analyzing Data</h4>
                <Loader />
              </div>
            </div>
            :
            (Object.keys(attendance).length !== 0) ?
              <div className="row py-3">
                {
                  attendance.map((item, index) => (
                    <div key={index} >
                      <h6 className='m-0 u-line-style' >{item.name} &nbsp; [{(att_percentage_calc(item.present, item.absent))}%] </h6>
                      {
                        Object.keys(item.att).map((key, ki) => (
                          <div key={ki} >
                            <label  >{moment(key + "-01").format("MMMM YYYY")}</label>
                            <div className="attendance-container">
                              {
                                [...item.att[key], ...item.att[key], ...item.att[key], ...item.att[key], ...item.att[key], ...item.att[key], ...item.att[key], ...item.att[key], ...item.att[key], ...item.att[key], ...item.att[key], ...item.att[key], ...item.att[key], ...item.att[key], ...item.att[key], ...item.att[key], ...item.att[key], ...item.att[key], ...item.att[key], ...item.att[key],].map((ai, aki) => (
                                  // item.att[key].map((ai,aki)=>(
                                  <div key={aki} className={`attendance-items bg-${ai.is_cancelled ? 'grey' : ai.is_attend ? "success" : "danger"}`}>
                                    <div>{ai.date}</div>
                                    <div>{ai.is_cancelled ? "C" : ai.is_attend ? "P" : "A"}</div>
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  ))
                }
              </div>
              :
              <p style={{ paddingTop: "100px" }} className='text-dull text-center' >No Attendance Record</p>
        }
      </div>
    </div>
  )
}

export default ViewStudentAttendance