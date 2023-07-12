import React, { useState } from 'react'
import AddCircleOutline from "@mui/icons-material/AddCircleOutline"
import Addchart from "@mui/icons-material/Addchart"
import _routes from '../../_routes'
import { Formik } from 'formik'
import * as Yup from 'yup';
import AppInput from '../../components/AppInput'
import ErrorMessage from '../../components/ErrorMessage'
import { Radiobox } from 'react-inputs-validation'
import Modal from '../../components/Modal'
import BulkUpload from '../../components/BulkUpload'
import Required from '../../components/Required'
import { baseURL, public_url, subject_add_bulkURL } from '../../config/AppData'
const validationRules = Yup.object().shape({
  subject_name: Yup.string().required().label("Name"),
  paper_code: Yup.string().required().label("Paper code"),
  stream: Yup.string().required().label("Stream"),
  semester: Yup.string().required().label("Semester"),
})
const AddSubject = () => {
  const [visible , setVisible] =useState(false)
  const submitForm = (values) => {

  }
  return (
    <div>
      <br />
      <div className="container-fluid">
        <div className="row data-op-row ">
          <span className='col-md-9 d-flex align-items-center p-2'  >
            <AddCircleOutline /> &nbsp; <span style={{ fontSize: "20px" }} >Add Subject</span>
          </span>
          <div className="col-md-3 ">
            <button onClick={()=>setVisible(true)} className="btn btn-primary ">
              <Addchart /> Add Bulk Subjects
            </button>
          </div>
        </div>
        <br />
        <Formik
          initialValues={{
            subject_name : '',
            paper_code : '',
            stream : '',
            semester : '',
          }}
          onSubmit={(values) => { submitForm(values) }}
          validationSchema={validationRules}
        >
          {({ handleChange, handleSubmit, setFieldTouched, errors, touched, values, isValid, setFieldValue }) => (
            <>
              <div className="">
                <div className="row py-2">
                  <div className="col-md-12 form-group">
                    <label >Paper name <Required /> </label>
                    <AppInput type="text" placeholder="eg : Networks" value={values.subject_name} name='subject_name' onChange={handleChange} onBlur={(e) => { setFieldTouched('subject_name') }} />
                    <ErrorMessage error={errors.subject_name} touched={touched.subject_name} />
                  </div>
                  <div className="col-md-4 form-group">
                    <label >Paper Code <Required /> </label>
                    <AppInput type="text" placeholder="eg : MCA - 103" value={values.paper_code} name='paper_code' onChange={handleChange} onBlur={(e) => { setFieldTouched('paper_code') }} />
                    <ErrorMessage error={errors.paper_code} touched={touched.paper_code} />
                  </div>
                  <div className="col-md-4 form-group">
                    <label >Stream <Required /> </label>
                    <select value={values.stream} className='form-control' onBlur={() => { setFieldTouched('stream') }} onChange={(e) => {setFieldValue('stream', e.target.value) }}>
                      <option value="">Select Stream</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                    <ErrorMessage error={errors.stream} touched={touched.stream} />
                  </div>
                  <div className="col-md-4 form-group">
                  <label >Semester<Required /> </label>
                    <select value={values.semester} className='form-control' onBlur={() => { setFieldTouched('semester') }} onChange={(e) => {setFieldValue('semester', e.target.value) }}>
                      <option value="">Select Semester</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                    <ErrorMessage error={errors.semester} touched={touched.semester} />
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="col-4">
                    <button style={{margin: "30px 0",width:"100%" }} onClick={handleSubmit} className="btn btn-secondary text-white">Add</button>
                  </div>
                </div>
              </div>
              
            </>
          )}
        </Formik>
      </div>
      <Modal style={{height : "fit-content" , width : 'fit-content'}} visible={visible} onClose={()=>{setVisible(false)}} >
        <BulkUpload format_url={public_url +"/subject_data_format.csv"}  upload_url={baseURL + subject_add_bulkURL} />
      </Modal>
    </div>
  )
}

export default AddSubject