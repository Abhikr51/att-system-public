import React from 'react'
import Loader from './Loader'

const TableLoader = () => {
    return (
        <tr >
            <td className='text-center p-5' colSpan={6} >
                <span>
                    <Loader /><br />
                    Loading data...
                </span>
            </td>
        </tr>
    )
}

export default TableLoader