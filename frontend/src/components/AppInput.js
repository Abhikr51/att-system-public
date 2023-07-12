import React from 'react'
import { Textbox } from 'react-inputs-validation';
const AppInput = ({
    onChange = ()=>{},
    value = "",
    onBlur = ()=>{},
    field_name = "",
    required = false,
    ...rest
}) =>{
    return (
        <Textbox
            attributesInput={rest}
            onChange={(name,e)=>onChange(e)}
            value={value}
            onBlur={onBlur} // Optional.[Func].Default: none. In order to validate the value on blur, you MUST provide a function, even if it is an empty function. Missing this, the validation on blur will not work.
            validationOption={{
                name : field_name,
                check: required,
                required: required
            }}
        />
    )
}
export default AppInput;