import React, { useState } from 'react'
import AddCircleOutline from "@mui/icons-material/AddCircleOutline"
import Addchart from "@mui/icons-material/Addchart"
import { Formik } from 'formik'
import * as Yup from 'yup';
import AppInput from '../../components/AppInput'
import ErrorMessage from '../../components/ErrorMessage'
import { Radiobox } from 'react-inputs-validation'
import Modal from '../../components/Modal'
import BulkUpload from '../../components/BulkUpload'
import Required from '../../components/Required';
import { baseURL, public_url, student_create_bulkURL, teacher_create_bulkURL } from '../../config/AppData';
const validationRules = Yup.object().shape({
  first_name: Yup.string().required("First name is required"),
  middle_name: Yup.string(),
  last_name: Yup.string().required("Last name is required"),
  dob: Yup.string().required("Please choose a date"),
  gender: Yup.string().required("Please choose a gender"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().length(10).required().label("Phone"),
  father_name: Yup.string().required().label("Father name"),
  guardian_name: Yup.string().required().label('Gaurdian name'),
  alternate_phone: Yup.string().length(10).label('Alternate phone'),
  course: Yup.string().required().label("Course"),
  semester: Yup.string().required().label("Semester"),
  category: Yup.string().required().label("Category"),
  address: Yup.string().required().label("Address"),
})
const AddStudent = () => {
  const [visible, setVisible] = useState(false)
  const submitForm = (values) => {

  }
  return (
    <div>
      <br />
      <div className="container-fluid">
        <div className="row data-op-row ">
          <span className='col-md-9 d-flex align-items-center p-2 '  >
            <AddCircleOutline /> &nbsp; <span style={{ fontSize: "20px" }} >Add Student</span>
          </span>
          <div className="col-md-3 ">
            <button onClick={() => setVisible(true)} className="btn btn-primary ">
              <Addchart /> Add Bulk Students
            </button>
          </div>
        </div>
        <br />
        <Formik
          initialValues={{
            first_name: "",
            middle_name: "",
            last_name: "",
            dob: "1980-01-01",
            gender: "Male",
            email: "",
            phone: "",
            father_name: "",
            guardian_name: "",
            alternate_phone: "",
            course: "",
            semester: "",
            category: "",
            address: "",
          }}
          onSubmit={(values) => { submitForm(values) }}
          validationSchema={validationRules}
        >
          {({ handleChange, handleSubmit, setFieldTouched, errors, touched, values, isValid, setFieldValue }) => (
            <>
              <div className="">
                <div className="row">
                  <div className="col-md-8">
                    <div className="row">
                      <label >Enter your name <Required  /> </label>
                      <div className="col-md-4 form-group">
                        <AppInput
                          field_name='First name' type='text' placeholder='firstname'
                          onChange={(name, e) => setFieldValue('first_name', e.target.value)}
                          value={values.first_name}
                          onBlur={(e) => { setFieldTouched('first_name') }}
                        />
                        <ErrorMessage error={errors.first_name} touched={touched.first_name} />
                      </div>
                      <div className="col-md-4 form-group">
                        <AppInput
                          field_name='Middle name' type='text' placeholder='middlename (optional)'
                          onChange={(name, e) => setFieldValue('middle_name', e.target.value)}
                          value={values.middle_name}
                          onBlur={(e) => { setFieldTouched('middle_name') }}
                        />
                        <ErrorMessage error={errors.middle_name} touched={touched.middle_name} />
                      </div>
                      <div className="col-md-4 form-group">
                        <AppInput
                          field_name='last name' type='text' placeholder='lastname'
                          onChange={(name, e) => setFieldValue('last_name', e.target.value)}
                          value={values.last_name}
                          onBlur={(e) => { setFieldTouched('last_name') }}
                        />
                        <ErrorMessage error={errors.last_name} touched={touched.last_name} />
                      </div>

                    </div>
                  </div>
                  <div className="col-md-2 form-group">
                    <label >Course <Required /> </label>
                    <select value={values.course} className='form-control' onBlur={() => { setFieldTouched('course') }} onChange={(e) => { console.log(e.target.value);; setFieldValue('course', e.target.value) }}>
                      <option value="">Select course</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                    <ErrorMessage error={errors.course} touched={touched.course} />
                  </div>
                  <div className="col-md-2 form-group">
                    <label >Semester <Required /> </label>
                    <select value={values.semester} className='form-control' onBlur={() => { setFieldTouched('semester') }} onChange={(e) => { console.log(e.target.value);; setFieldValue('semester', e.target.value) }}>
                      <option value="">Select semester</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                    <ErrorMessage error={errors.semester} touched={touched.semester} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-2 form-group">
                    <label >Date of birth <Required /> </label>
                    <AppInput type="date" className="form-control" value={values.dob} name='dob' onChange={handleChange} onBlur={(e) => { setFieldTouched('dob') }} />
                    <ErrorMessage error={errors.dob} touched={touched.dob} />
                  </div>

                  <div className="col-md-4 form-group">
                    <label >Father Name <Required /> </label>
                    <AppInput type="text" value={values.father_name} name='father_name' onChange={handleChange} onBlur={(e) => { setFieldTouched('father_name') }} />
                    <ErrorMessage error={errors.father_name} touched={touched.father_name} />
                  </div>
                  <div className="col-md-3 form-group">
                    <label >Gaurdian Name <Required /> </label>
                    <AppInput type="text" value={values.guardian_name} name='guardian_name' onChange={handleChange} onBlur={(e) => { setFieldTouched('guardian_name') }} />
                    <ErrorMessage error={errors.guardian_name} touched={touched.guardian_name} />
                  </div>
                  <div className="col-md-3 form-group">
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
                  <div className="col-md-2 form-group">
                    <label >Category <Required /> </label>
                    <select value={values.category} className='form-control' onBlur={() => { setFieldTouched('category') }} onChange={(e) => { console.log(e.target.value);; setFieldValue('category', e.target.value) }}>
                      <option value="">Select category</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                    <ErrorMessage error={errors.category} touched={touched.category} />
                  </div>

                  <div className="col-md-4 form-group">
                    <label >Email <Required /> </label>
                    <AppInput type="text" placeholder="eg: example@mail.com" value={values.email} name='email' onChange={handleChange} onBlur={(e) => { setFieldTouched('email') }} />
                    <ErrorMessage error={errors.email} touched={touched.email} />
                  </div>
                  <div className="col-md-3 form-group">
                    <label >Phone <Required /> </label>
                    <AppInput type="text" placeholder="eg : 1234567890" maxLength={10} value={values.phone} name='phone' onChange={handleChange} onBlur={(e) => { setFieldTouched('phone') }} />
                    <ErrorMessage error={errors.phone} touched={touched.phone} />
                  </div>
                  <div className="col-md-3 form-group">
                    <label >Alternative Phone </label>
                    <AppInput type="text" placeholder="(optional)" maxLength={10} value={values.alternate_phone} name='alternate_phone' onChange={handleChange} onBlur={(e) => { setFieldTouched('alternate_phone') }} />
                    <ErrorMessage error={errors.alternate_phone} touched={touched.alternate_phone} />
                  </div>
                  <div className="col-md-6 form-group">
                    <label >Address <Required /> </label>
                    <textarea className='form-control' rows={3} type="text" placeholder="Enter your address" maxLength={10} value={values.address} name='address' onChange={handleChange} onBlur={(e) => { setFieldTouched('address') }} ></textarea>
                    <ErrorMessage error={errors.address} touched={touched.address} />
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="col-md-6">
                    <button style={{ margin: "30px 0", width: "100%" }} onClick={handleSubmit} className="btn btn-secondary text-white">Add</button>
                  </div>
                </div>
              </div>

            </>
          )}
        </Formik>
      </div>
      <Modal style={{ height: "fit-content", width: 'fit-content' }} visible={visible} onClose={() => { setVisible(false) }} >
        <BulkUpload format_url={public_url +"/student_data_format.csv"}  upload_url={baseURL + student_create_bulkURL} />
      </Modal>
    </div>
  )
}

export default AddStudent