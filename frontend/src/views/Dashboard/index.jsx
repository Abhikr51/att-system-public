import React, { useEffect , useState} from 'react'
import PeopleOutline from "@mui/icons-material/PeopleOutline"
import PersonOutlined from "@mui/icons-material/PersonOutlined"
import ListAlt from "@mui/icons-material/ListAlt"
import axios from 'axios'
import {baseURL, subject_listURL, student_listURL, teacher_listURL} from "../../config/AppData"
const Dashboard = ({icon}) => {
  const [spinner , setSpinner] = useState(false);
  const [teachers ,setTeachers] = useState([]);
  const [students ,setStudents] = useState([]);
  const [subjects ,setSubjects] = useState([]);
  const fetchStudents = async()=>{
    await axios.get(baseURL+student_listURL).then(({data})=>{
      if(data.status){
        setStudents(data.data);
      }
    })
    
  }
  const fetchTeachers = async()=>{
    await axios.get(baseURL+teacher_listURL).then(({data})=>{
      if(data.status){
        setTeachers(data.data);
      }
    })
  }
  const fetchSubjects = async()=>{
    await axios.get(baseURL+subject_listURL).then(({data})=>{
      if(data.status){
        setSubjects(data.data);
      }
    })
  }
  const fetchAll =async()=>{
    setSpinner(true)
    try{
      let stu = fetchStudents();
      let tea = fetchTeachers();
      let sub = fetchSubjects();
      Promise.all([stu,tea,sub]).then(()=>{
        setSpinner(false)
      })
    }catch(err){
      console.log("DashboardErr" , err);
      setSpinner(false)
    }
  }
  useEffect(()=>{
    fetchAll();
  },[])
  return (
    <div className="">
      <div className='area-heading' >{icon}&nbsp; Dashboard</div>
      <div className="row justify-content-center">
        <div className="col-md-3">
          <div className="dash-cards">
            <div className="dash-icon-box dash-icon-green">
              <PeopleOutline />
            </div>
            <div className="dash-content">
              <div className="dash-heading">Students</div>
              {students.length}
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="dash-cards">
            <div className="dash-icon-box dash-icon-orange">
              <PersonOutlined />
            </div>
            <div className="dash-content">
              <div className="dash-heading">Teachers</div>
              {teachers.length}
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="dash-cards">
            <div className="dash-icon-box dash-icon-purple">
              <ListAlt />
            </div>
            <div className="dash-content">
              <div className="dash-heading">Subjects </div>
              {subjects.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard