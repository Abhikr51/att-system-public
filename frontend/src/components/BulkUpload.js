import React, { useState } from 'react'
import AppColors from '../config/AppColors'
import CloudUpload from '@mui/icons-material/CloudUpload'
import { sheetUploader } from '../config/lib'
import Loader from './Loader'
const BulkUpload = ({ format_url = "", upload_url = "", onComplete = ()=>{},...rest }) => {
  const [sheet, setSheet] = React.useState({ name: null })
  const [spinner, setSpinner] = React.useState(false)
  const [errors, setErrors] = React.useState([])
  const [msg, setMsg] = React.useState('')
  const [success, setSuccess] = React.useState(false)
  const onSelectFle = (event) => {
    try{
      if(event.target.files.length !== 0){
        setSheet(event.target.files[0])
      }
    }catch(err){
      console.log(err);
    }
  }
  const onUploadFile = () => {
    if (sheet.name !== null) {
      setSpinner(true)
      sheetUploader(sheet, upload_url).then(({ data }) => {
        setSuccess(data.status)
        if (data.status) {
          // console.log(data);
          onComplete();
        } else {
          setErrors(data.error)
        }
        setMsg(data.msg)
        setSpinner(false)
      }).catch(err => {
        alert('Something went wrong !!')
        setSpinner(false)
        console.log("Uploader Error : ", err);
      })
    } else {
      alert("Please choost sheet first")
    }
  }
  return (
    <div align='center' style={{
      padding: "30px",
      maxWidth: '900px',
    }}>
      <div className="row align-items-center ">
        {
          msg !== '' ?
            <div className="col-md-12">
              <div style={{ textAlign: 'left' }} className={` alert m-0 alert-${success ? "info" : "danger"}`} role="alert">
                <h5 className='m-0' > {msg}</h5>
                {
                  errors.length !== 0 && 
                  <>
                    <br />
                    <table className='table ' >
                      {
                        errors.map((item, index) => (
                          <tr key={index} >
                            <td width={70} >Sl no. {item.sl_no}</td>
                            <td>
                              {item.msg}
                            </td>
                          </tr>
                        ))
                      }
                    </table>
                  </>
                }
              </div>
            </div> : null
        }

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }} className={`col-md-12`}>
          <p className='m-4 text-primary ' style={{ cursor: "pointer" }} > <a href={format_url} download={true} > Download CSV format</a> </p>
          <label htmlFor='sheet-uploader' style={{
            padding: "30px",
            borderRadius: "10px",
            background: AppColors.cardBack,
            cursor: 'pointer'
          }}><CloudUpload />&nbsp; {sheet.name ?? "Choose your CSV file"}</label>
          <input onChange={onSelectFle} type="file" name="" id="sheet-uploader" className="d-none" />
          <button disabled={spinner} type='button' onClick={onUploadFile} className="btn btn-secondary m-4 ">{spinner ? <span className='text-white d-flex align-items-center'><Loader className='text-white' />&nbsp; Uploading sheet</span> : "Upload & Proceed"} </button>

        </div>
      </div>
      {/* <div style={{ width: "400px" }} >
      </div> */}

    </div>
  )
}

export default BulkUpload