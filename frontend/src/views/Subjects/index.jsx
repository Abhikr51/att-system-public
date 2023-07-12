import React, { useEffect, useState } from 'react'
import FilterList from "@mui/icons-material/FilterList"
import LocalPrintshop from "@mui/icons-material/LocalPrintshop"
import TableChart from "@mui/icons-material/TableChart"
import AddCircleOutline from "@mui/icons-material/AddCircleOutline"
import Edit from "@mui/icons-material/Edit"
import RemoveRedEye from "@mui/icons-material/RemoveRedEye"
import DeleteOutline from "@mui/icons-material/DeleteOutline"
import { Link } from "react-router-dom"
import _routes from '../../_routes'
import { baseURL, subject_listURL } from '../../config/AppData'
import axios from 'axios'
import TableLoader from '../../components/TableLoader'
const Subjects = ({ icon, name }) => {
  const [spinner, setSpinner] = useState(false)
  const [subjects, setSubjects] = useState([])
  const fetchSubjects = async () => {
    setSpinner(true);
    await axios.get(baseURL + subject_listURL).then(({ data }) => {
      if (data.status) {
        setSubjects(data.data);
      }
      setSpinner(false)
    }).catch(err => {
      setSpinner(false)
      console.log("SubjectErr", err);
    })
  }
  useEffect(() => {
    fetchSubjects()
  }, [])
  return (
    <div  >
      <div className='area-heading' >{icon}&nbsp; {name}</div>
      <div className="container-fluid">
        <div className="row data-op-row">
          <span className='col-md-6 data-search'  >
            <FilterList fontSize='small' className='mx-md-3 mr-2' />
            <input placeholder='Filter table data...' type="text" />
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
                <Link to={_routes.app.urls.add_subject} className="btn btn-primary ">
                  <AddCircleOutline /> Add Subject
                </Link>
              </div>
            </div>
          </span>
        </div>
        <br />
      </div>
      <table className="table table-borderless table-sm app-data-table">
        <thead>
          <tr>
            <th width="60" >#</th>
            <th style={{textAlign  :'left'}} >Paper Name</th>
            <th width="130">code</th>
            <th width="150" >Stream</th>
            <th width="130" >Semester</th>
            <th width="130">Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            subjects.length !== 0 ? (
              subjects.map((item, index) => (
                <tr key={index} >
                  <td>{index + 1}</td>
                  <td style={{textAlign  :'left'}} >{item.name}</td>
                  <td>{item.paper_code}</td>
                  <td>{item.stream_code}</td>
                  <td>Sem - {item.semester_code}</td>
                  <td  >
                    <button className='table-btn btn btn-info text-white' ><Edit fontSize='small' /></button>
                    <button className='table-btn btn btn-warning text-white' ><RemoveRedEye fontSize='small' /></button>
                    <button className='table-btn btn btn-danger text-white' ><DeleteOutline fontSize='small' /></button>
                  </td>
                </tr>
              ))
            )
              :
              <TableLoader />
          }
          
        </tbody>
      </table>
    </div>
  )
}

export default Subjects