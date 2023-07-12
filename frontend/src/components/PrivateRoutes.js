import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

export default function PrivateRoutes(props) {
    const auth = useSelector(s=>s.auth)
    return (
        auth.loggedIn ? <Outlet/>  : <Navigate to="/" />
    )
}
