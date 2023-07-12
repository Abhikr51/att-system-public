import React from 'react'

const Loader = ({ size = 20, className = 'text-primary' ,animating = true, ...rest }) => {
    if (animating) {
        return <div {...rest} className={`spinner-grow ${className}`} role="status">
            &nbsp;<span className="sr-only"></span>&nbsp;
        </div>
    }
    return null
}

export default Loader