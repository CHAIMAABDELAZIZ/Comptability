import React, { useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { userColumns, userRows } from "../../cdatasrc";
import { Link } from "react-router-dom";
import { useState } from "react";
import './tttable.css';
import axios from 'axios';

const Ttable = () => {

    const [users, setuser] = useState([]);
    
    useEffect(()=>{
        axios.get('http://localhost:8082/adposts/')
        .then(res => console.log(res))
        .catch(err => console.log(err));
    },
    []);


    const handleDelete = (id) => {
        setuser(users.filter((item) => item.id !== id));
    };
    const actionColumn = [
        {
            field: "action",
            headerName: "Action",
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        <div className="viewButton">
                            <Link to="/adposts/Cmodifier" className="link">
                                Modifier
                            </Link>
                        </div>
                        <div
                            className="deleteButton"
                            onClick={() => handleDelete(params.row.id)}
                        >
                            Delete
                        </div>
                    </div>
                );
            },
        },
    ];

    return (
        <div className='datatable'>
            <div className="datatableTitle">
                Les utilisateurs
                <Link to="/adposts/Cnew" className="link">
                    Add New
                </Link>
            </div>
            <DataGrid
                rows={users}
                columns={userColumns.concat(actionColumn)}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
            />
        </div>
    )
}
export default Ttable
