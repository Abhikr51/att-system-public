import React, { useState } from 'react'
import AddCircleOutline from "@mui/icons-material/AddCircleOutline"
import Addchart from "@mui/icons-material/Addchart"
import _routes from '../../_routes'
import { Formik } from 'formik'
import * as Yup from 'yup';
import AppInput from '../../components/AppInput'
import ErrorMessage from '../../components/ErrorMessage'
import Modal from '../../components/Modal'
import BulkUpload from '../../components/BulkUpload'
import Required from '../../components/Required'
const validationRules = Yup.object().shape({
    period_name: Yup.string().required(),
    code: Yup.string().required(),
})
const AddPeriod = () => {
  const [visible , setVisible] =useState(false)
  const submitForm = (values) => {

  }
  return (
    <div>
      <br />
      <div className="container-fluid">
        <div className="row data-op-row ">
          <span className='col-md-9 d-flex align-items-center p-2'  >
            <AddCircleOutline /> &nbsp; <span style={{ fontSize: "20px" }} >Add Period</span>
          </span>
          <div className="col-md-3 ">
            {/* <button onClick={()=>setVisible(true)} className="btn btn-primary ">
              <Addchart /> Add Bulk Periods
            </button> */}
          </div>
        </div>
        <br />
        <Formik
          initialValues={{
            period_name : "",
            code : "",
          }}
          onSubmit={(values) => { submitForm(values) }}
          validationSchema={validationRules}
        >
          {({ handleChange, handleSubmit, setFieldTouched, errors, touched, values, isValid, setFieldValue }) => (
            <>
              <div className="">
                <div className="row py-2">
                  <div className="col-md-8 form-group">
                    <label >Period name <Required /> </label>
                    <AppInput type="text" placeholder="eg : Sem 3" value={values.period_name} name='period_name' onChange={handleChange} onBlur={(e) => { setFieldTouched('period_name') }} />
                    <ErrorMessage error={errors.period_name} touched={touched.period_name} />
                  </div>
                  <div className="col-md-4 form-group">
                    <label >Code <Required /> </label>
                    <AppInput type="text" placeholder="eg : III" value={values.code} name='code' onChange={handleChange} onBlur={(e) => { setFieldTouched('code') }} />
                    <ErrorMessage error={errors.code} touched={touched.code} />
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
        <BulkUpload />
      </Modal>
    </div>
  )
}

export default AddPeriod