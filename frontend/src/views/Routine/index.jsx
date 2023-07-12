import React, { useState, useEffect } from 'react'
import LocalPrintshop from "@mui/icons-material/LocalPrintshop"
import TableChart from "@mui/icons-material/TableChart"
import CloudUpload from "@mui/icons-material/CloudUpload"
import DeleteOutline from "@mui/icons-material/DeleteOutline"
import FilterList from "@mui/icons-material/FilterList"
import Edit from "@mui/icons-material/Edit"
import Modal from '../../components/Modal'
import BulkUpload from '../../components/BulkUpload'
import _routes from '../../_routes'
import { baseURL, period_listURL, public_url, routine_deleteURL, routine_listURL, routine_uploadURL, semester_listURL, stream_listURL } from '../../config/AppData'
import axios from 'axios'
import TableLoader from '../../components/TableLoader'
import AppColors from '../../config/AppColors'
import Loader from '../../components/Loader'
const Routine = ({ icon, name }) => {
  const [visible, setVisible] = useState(false)
  const [spinner, setSpinner] = useState(false)
  const [tableSpinner, setTableSpinner] = useState(false)
  const [routine, setRoutine] = useState([])
  const [semesterList, setSemesterList] = useState([])
  const [streamList, setStreamList] = useState([])
  const [semester_code, setSemesterCode] = useState('III');
  const [stream_code, setStreamCode] = useState('MCA');
  const [periods, setPeriods] = useState([])
  const fetchRoutine = async () => {
    setTableSpinner(true);
    await axios.post(baseURL + routine_listURL, { stream_code, semester_code }).then(({ data }) => {
      if (data.status) {
        setRoutine(data.data);
      }
      setTableSpinner(false)
    }).catch(err => {
      setTableSpinner(false)
      console.log("RoutineErr", err);
    })
  }
  const fetchPeriods = async () => {

    await axios.get(baseURL + period_listURL).then(({ data }) => {
      if (data.status) {
        setPeriods(data.data);
      }
    }).catch(err => {
      console.log("Rourine period", err);
    })
  }
  const fetchSemesters = async () => {

    await axios.get(baseURL + semester_listURL).then(({ data }) => {
      if (data.status) {
        setSemesterList(data.data);
      }
    }).catch(err => {
      console.log("Routine sem", err);
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
      console.log("Routine stream", err);
    })
  }
  const fetchAll = async () => {
    try {
      setSpinner(true);
      await fetchPeriods();
      await fetchSemesters();
      await fetchStreams();
      setSpinner(false)
    } catch {
      setSpinner(false)
    }
  }
  const onDeleteRoutine = async() => {
    if (window.confirm("Are you sure want to deltete routine")) {
      setTableSpinner(true)
      await axios.post(baseURL + routine_deleteURL,{semester_code,stream_code}).then(({ data }) => {
        if (data.status) {
          setRoutine([])
          alert(data.msg)
        }
        setTableSpinner(false)
      }).catch(err => {
        setTableSpinner(false)
        console.log("Delete routine Err", err);
      })
    } else {
      alert('failed')
    }
  }
  useEffect(() => {
    fetchAll()
  }, [])
  useEffect(() => {
    // setSpinner(true)
    fetchRoutine()  
  }, [semester_code, stream_code])
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
                  <div className="row justify-content-end align-items-center">
                    {/* <span className='col-3 ' >
                    </span> */}
                    <span className='col-md-5 float-right ' >
                      <LocalPrintshop fontSize='small' className='mx-md-2' />  Print
                      &nbsp;&nbsp;
                      <TableChart fontSize='small' className='mx-md-2' />  Export
                    </span>
                    <div className="col-md-5">
                      <button disabled={routine.length== 0 || tableSpinner} onClick={onDeleteRoutine} className="btn btn-danger text-white">
                        <DeleteOutline /> Delete routine
                      </button>
                    </div>
                  </div>
                </span>

              </div>
              <br />
            </div>
            {
              (routine.length !== 0 || tableSpinner) ?
                <table id="routine-box" className="table table-bordered table-sm">
                  <tbody>
                    {
                      (!tableSpinner) ? (
                        <>
                          <tr>
                            <th>Day</th>
                            {
                              periods.map((per, pi) => {
                                if (pi == 2) {
                                  return <>
                                    <th>{per.start_time} <br />- <br />{per.end_time}</th>
                                    <th width="30px" rowSpan={6} >
                                    </th>
                                  </>
                                }
                                return <th>{per.start_time} <br />- <br />{per.end_time}</th>
                              })
                            }
                          </tr>
                          {
                            routine.map((rou, ri) => (
                              <tr key={ri}>
                                <td>{rou.day}</td>
                                {
                                  rou.periods.map((per, pi) => {
                                    if (per.qr_code.paper_code) {
                                      return <td key={pi} className='qr-area' ><span>{per.qr_code.paper_code}  ({per.qr_code.teacher_short_name})</span></td>
                                    }
                                    return <td key={pi} ></td>
                                  }
                                  )
                                }
                              </tr>
                            ))
                          }
                        </>
                      ) : <TableLoader />
                    }
                  </tbody>
                </table>
                :
                <div className='row align-items-center justify-content-center' style={{ height: "300px" }}>
                  <div className="col-md-6">
                    <center>
                      <h3 className='text-muted'>No routins uploaded .</h3>
                      <button onClick={() => setVisible(true)} className="btn btn-primary ">
                        <CloudUpload /> Upload Routine
                      </button>
                    </center>
                  </div>
                </div>
            }
          </>
      }
      <Modal style={{ height: "fit-content", width: 'fit-content' }} visible={visible} onClose={() => { setVisible(false) }} >
        <BulkUpload onComplete={fetchRoutine} format_url={public_url + "/routine_data_format.csv"} upload_url={baseURL + routine_uploadURL} />
      </Modal>
    </div>
  )
}

export default Routine