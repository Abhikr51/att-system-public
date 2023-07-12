import React, { useState } from 'react'
import AddCircleOutline from "@mui/icons-material/AddCircleOutline"
import Addchart from "@mui/icons-material/Addchart"
import _routes from '../../_routes'
import { Link } from 'react-router-dom'
import { Formik } from 'formik'
import * as Yup from 'yup';
import AppInput from '../../components/AppInput'
import ErrorMessage from '../../components/ErrorMessage'
import AppColors from '../../config/AppColors'
import { Radiobox } from 'react-inputs-validation'
import Modal from '../../components/Modal'
import BulkUpload from '../../components/BulkUpload'
import Required from '../../components/Required'
import { sheetUploader } from '../../config/lib'
import { baseURL, public_url, teacher_create_bulkURL } from '../../config/AppData'
const validationRules = Yup.object().shape({
  title: Yup.string().required("Title required"),
  first_name: Yup.string().required("First name is required"),
  middle_name: Yup.string(),
  last_name: Yup.string().required("Last name is required"),
  short_name: Yup.string().required("Required"),
  dob: Yup.string().required("Please choose a date"),
  gender: Yup.string().required("Please choose a gender"),
  designation: Yup.string(),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().length(10).required().label("Phone"),
})
const AddTeacher = () => {
  const [visible , setVisible] =useState(false)
  const submitForm = (values) => {

  }
  return (
    <div>
      <br />
      <div className="container-fluid">
        <div className="row data-op-row ">
          <span className='col-md-9 d-flex align-items-center p-2'  >
            <AddCircleOutline /> &nbsp; <span style={{ fontSize: "20px" }} >Add Teacher</span>
          </span>
          <div className="col-md-3 ">
            <button onClick={()=>setVisible(true)} className="btn btn-primary ">
              <Addchart /> Add Bulk Teachers
            </button>
          </div>
        </div>
        <br />
        <Formik
          initialValues={{
            title: "Mr.",
            first_name: "",
            middle_name: "",
            last_name: "",
            short_name: "",
            dob: "1980-01-01",
            gender: "Male",
            designation: "",
            email: "",
            phone: "",
          }}
          onSubmit={(values) => { submitForm(values) }}
          validationSchema={validationRules}
        >
          {({ handleChange, handleSubmit, setFieldTouched, errors, touched, values, isValid, setFieldValue }) => (
            <>
              <div className="">
                <label >Enter your name <Required /> </label>
                <div className="row">
                  <div className="col-md-2 form-group">
                    <select value={values.title} className='form-control' onBlur={() => { setFieldTouched('title') }} onChange={(e) => { console.log(e.target.value);; setFieldValue('title', e.target.value) }}>
                      {/* <option selected={values.title == ""} value="">Select Title</option> */}
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Dr.">Dr.</option>
                    </select>
                    <ErrorMessage error={errors.title} touched={touched.title} />
                  </div>
                  <div className="col-md-4 form-group">
                    <AppInput
                      field_name='First name' type='text' placeholder='firstname'
                      onChange={(name, e) => setFieldValue('first_name', e.target.value)}
                      value={values.first_name}
                      onBlur={(e) => { setFieldTouched('first_name') }}
                    />
                    <ErrorMessage error={errors.first_name} touched={touched.first_name} />
                  </div>
                  <div className="col-md-3 form-group">
                    <AppInput
                      field_name='Middle name' type='text' placeholder='middlename (optional)'
                      onChange={(name, e) => setFieldValue('middle_name', e.target.value)}
                      value={values.middle_name}
                      onBlur={(e) => { setFieldTouched('middle_name') }}
                    />
                    <ErrorMessage error={errors.middle_name} touched={touched.middle_name} />
                  </div>
                  <div className="col-md-3 form-group">
                    <AppInput
                      field_name='last name' type='text' placeholder='lastname'
                      onChange={(name, e) => setFieldValue('last_name', e.target.value)}
                      value={values.last_name}
                      onBlur={(e) => { setFieldTouched('last_name') }}
                    />
                    <ErrorMessage error={errors.last_name} touched={touched.last_name} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-2 form-group">
                    <label >Short name <Required /> </label>
                    <AppInput type="text" placeholder="eg : AK" value={values.short_name} name='short_name' onChange={handleChange} onBlur={(e) => { setFieldTouched('short_name') }} />
                    <ErrorMessage error={errors.short_name} touched={touched.short_name} />
                  </div>
                  <div className="col-md-4 form-group">
                    <label >Date of birth <Required /> </label>
                    <AppInput type="date" className="form-control" value={values.dob} name='dob' onChange={handleChange} onBlur={(e) => { setFieldTouched('dob') }} />
                    <ErrorMessage error={errors.dob} touched={touched.dob} />
                  </div>
                  <div className="col-md-6 form-group">
                    <label >Gender <Required /> </label>
                    <Radiobox
                      value={values.gender}
                      optionList={[
                        { id: 'Male', name: <span style={{ marginLeft: "-10px", marginRight: '10px' }}>Male</span> },
                        { id: 'Female', name: <span style={{ marginLeft: "-10px", marginRight: '10px' }}>Female</span> },
                        { id: 'Others', name: <span style={{ marginLeft: "-10px", marginRight: '10px' }}>Others</span> }
                      ]}
                      customStyleContainer={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        margin: "12px 0px"
                      }}
                      // customStyleOptionListItem={{marginRight : "10px",marginLeft : "-10px" ,justifyContent:'center'}}
                      onChange={(res, e) => {
                        setFieldValue('gender', res.id)
                      }}
                      onBlur={(e) => { setFieldTouched('gender') }}
                      validationOption={{ check: false, required: false }}
                    />
                    <ErrorMessage error={errors.gender} touched={touched.gender} />
                  </div>

                </div>
                <div className="row">
                  <div className="col-md-4 form-group">
                    <label >Email <Required /> </label>
                    <AppInput type="text" placeholder="eg: example@mail.com" value={values.email} name='email' onChange={handleChange} onBlur={(e) => { setFieldTouched('email') }} />
                    <ErrorMessage error={errors.email} touched={touched.email} />
                  </div>
                  <div className="col-md-4 form-group">
                    <label >Phone <Required /> </label>
                    <AppInput type="text" placeholder="eg : 1234567890" maxLength={10} value={values.phone} name='phone' onChange={handleChange} onBlur={(e) => { setFieldTouched('phone') }} />
                    <ErrorMessage error={errors.phone} touched={touched.phone} />
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
        <BulkUpload format_url={public_url +"/teacher_data_format.csv"}  upload_url={baseURL + teacher_create_bulkURL} />
      </Modal>
    </div>
  )
}

export default AddTeacher