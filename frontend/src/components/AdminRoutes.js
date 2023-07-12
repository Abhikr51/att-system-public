import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import Panel from '../views/layouts/Panel'

export default function AdminRoutes(props) {
    const auth = useSelector(s=>s.auth)
    return (
        <Panel>
            {(auth.user.role === 'admin') ? <Outlet/>  : <h1>404 admin</h1> }
        </Panel>
    )
}
