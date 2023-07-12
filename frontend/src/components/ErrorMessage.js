import React from 'react'
import AppColors from '../config/AppColors'

const ErrorMessage = ({error,touched}) => {
  return ((touched && (error !== null)) && error !== "") && <p style={{color : AppColors.danger, margin :5,fontSize:"13px"}} >{error}</p>
}

export default ErrorMessage