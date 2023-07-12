import React from 'react'
import CloseIcon from "@mui/icons-material/Close"
const Modal = ({
    children = <h1 align="center">Insert Component</h1>,
    visible = false,
    onClose = () => { },
    style = { },
    className = "",
    ...rest
}) => {

    return (
        <div>
            {
                (visible) ?
                    <div style={{
                        position: "fixed",
                        top: "0px",
                        left: "0px",
                        width: "100%",
                        bottom:0,
                        right: 0,
                        height: "100%",
                        background: "#00000029",
                        zIndex: "850",
                        backdropFilter: "blur(3px)",
                        overflow: "hidden",
                    }} className="overlay-modal">
                        <div style={{...{
                            background: "rgb(255, 255, 255)",
                            position: "fixed",
                            width: "565px",
                            top: 0,
                            zIndex: "900",
                            overflow: "auto",
                            borderRadius: "5px",
                            boxShadow: "0 0 8px 2px rgba(0, 0, 0, 0.369)",
                            bottom: 0,
                            right: 0,
                            left: 0,
                            margin: "auto",
                            width: `${"70%"}`, height: "90%"
                        },...style}}  {...rest}  className={"modal-body  " + className}>
                        <div className="container-fluid">
                                    <button style={{float  :'right', position: "absolute", right: 0,top: "-8px"}} className="btn btn-danger text-white mt-2 btn-sm " onClick={() => { onClose() }}> <CloseIcon/> </button>
                            <div className="row">
                                {/* <div className="col-md-12 mb-2 ">
                                </div> */}
                                <div className="col-md-12 mb-2">

                                    <div style={{display : 'flex' , width : "100%"}} >
                                        {(children !== null) ?

                                            React.cloneElement(children, { closemodal: onClose })
                                            : null
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div> : null
}
        </div >
    )
}

export default Modal;