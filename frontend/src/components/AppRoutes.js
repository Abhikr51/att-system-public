import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import Panel from '../views/layouts/Panel'

export default function AppRoutes(props) {
    const auth = useSelector(s=>s.auth)
    return (
        <Panel>
            {(['admin','teacher'].indexOf(auth.user.role) !== -1) ? <Outlet/>  : <h1>404 teacher</h1>}
        </Panel>
    )
}
