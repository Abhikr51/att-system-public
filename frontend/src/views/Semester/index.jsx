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
import { baseURL, semester_listURL } from '../../config/AppData'
import axios from 'axios'
import TableLoader from '../../components/TableLoader'
const Semesters = ({ icon, name }) => {
  const [spinner, setSpinner] = useState(false)
  const [semesters, setSemeseters] = useState([])
  const fetchSemeseters = async () => {
    setSpinner(true);
    await axios.get(baseURL + semester_listURL).then(({ data }) => {
      if (data.status) {
        setSemeseters(data.data);
      }
      setSpinner(false)
    }).catch(err => {
      setSpinner(false)
      console.log("SemesterErr", err);
    })
  }
  useEffect(() => {
    fetchSemeseters()
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
                <Link to={_routes.app.urls.add_semester} className="btn btn-primary ">
                  <AddCircleOutline /> Add Semester
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
            <th width="60" >Sl. no.</th>
            <th >Semester Name</th>
            <th>code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            semesters.length !== 0 ? (
              semesters.map((item, index) => (
                <tr key={index} >
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.code}</td>
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

export default Semesters