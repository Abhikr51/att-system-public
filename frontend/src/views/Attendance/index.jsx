import React, { useState, useEffect } from 'react'
import LocalPrintshop from "@mui/icons-material/LocalPrintshop"
import TableChart from "@mui/icons-material/TableChart"
import CloudUpload from "@mui/icons-material/CloudUpload"
import FilterList from "@mui/icons-material/FilterList"
import Edit from "@mui/icons-material/Edit"
import Modal from '../../components/Modal'
import BulkUpload from '../../components/BulkUpload'
import _routes from '../../_routes'
import { baseURL ,semester_listURL, stream_listURL } from '../../config/AppData'
import axios from 'axios'
import TableLoader from '../../components/TableLoader'
import AppColors from '../../config/AppColors'
import Loader from '../../components/Loader'
const Attendance = ({ icon, name }) => {
  const [visible, setVisible] = useState(false)
  const [spinner, setSpinner] = useState(false)
  const [semesterList, setSemesterList] = useState([])
  const [streamList, setStreamList] = useState([])
  const [semester_code, setSemesterCode] = useState('III');
  const [stream_code, setStreamCode] = useState('MCA');
  const [tableSpinner , setTableSpinner] = useState(false)
  const fetchAttendance = async () => {
    // setTableSpinner(true);
    // await axios.post(baseURL + attendance_listURL, { stream_code, semester_code }).then(({ data }) => {
    //   if (data.status) {
    //     setAttendance(data.data);
    //   }
    //   setTableSpinner(false)
    // }).catch(err => {
    //   setTableSpinner(false)
    //   console.log("AttendanceErr", err);
    // })
  }
  const fetchSemesters = async () => {

    await axios.get(baseURL + semester_listURL).then(({ data }) => {
      if (data.status) {
        setSemesterList(data.data);
      }
    }).catch(err => {
      console.log("Attendance sem", err);
    })
  }
  const fetchStreams = async () => {

    await axios.get(baseURL + stream_listURL).then(({ data }) => {
      if (data.status) {
        setStreamList(data.data);
      }
      setSpinner(false)
    }).catch(err => {
      setSpinner(false)
      console.log("Attendance stream", err);
    })
  }
  const fetchAll = async () => {
    try {
      setSpinner(true);
      await fetchSemesters();
      await fetchStreams();
      setSpinner(false)
    } catch {
      setSpinner(false)
    }
  }
  useEffect(() => {
    fetchAll()
  }, [])
//   useEffect(() => {
//     fetchAttendance()
//   }, [semester_code, stream_code])
  return (
    <div  >
      <div className='area-heading' >{icon}&nbsp; {name}</div>
      {
        spinner ?
          <div className="row justify-content-center">
            <div className="col-3 py-4 text-center">
              <Loader />
            </div>
          </div>
          :
          <>
            <div className="container-fluid">
              <div className="row data-op-row">
                <span className='col-md-5 data-search'  >
                  <FilterList fontSize='small' style={{ color: AppColors.textDull }} className='mx-md-3 mr-2' />
                  <select onChange={(e) => setStreamCode(e.target.value)} value={stream_code} className='form-control  inline-select' >
                    {
                      streamList.map((item, index) => (
                        <option key={index} value={item.code}>{item.name}</option>
                      ))
                    }

                  </select>
                  <select onChange={(e) => setSemesterCode(e.target.value)} value={semester_code} className='form-control mx-3 inline-select' >
                    {
                      semesterList.map((item, index) => (
                        <option key={index} value={item.code}>{item.name}</option>
                      ))
                    }
                  </select>
                  {/* <button className="btn btn-outline-secondary btn-sm mx-3">Filter</button> */}
                </span>

                <span className='col-md-6 data-op'>
                  <div className="row justify-content-evenly align-items-center">
                    <span className='col-3 ' >
                      <LocalPrintshop fontSize='small' className='mx-md-2' />  Print
                    </span>
                    <span className='col-3 ' >
                      <TableChart fontSize='small' className='mx-md-2' />  Export
                    </span>
                    <div className="col-6 ">
                      <button disabled onClick={() => setVisible(true)} className="btn btn-primary ">
                        <CloudUpload /> Manual Attendance
                      </button>
                    </div>
                  </div>
                </span>
              </div>
              <br />
            </div>
            
          </>
      }
      <Modal style={{ height: "fit-content", width: 'fit-content' }} visible={visible} onClose={() => { setVisible(false) }} >
        <BulkUpload />
      </Modal>
    </div>
  )
}

export default Attendance