import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import axios from 'axios';
import './cFtable.css';
import AddIcon from '@mui/icons-material/Add';

// Define your columns to match the data structure
const userColumns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "username", headerName: "Username", width: 150 },
    { field: "role", headerName: "Role", width: 150 },
];

const CFtable = () => {
    const [data, setData] = useState([]);  // Initialize with an empty array

    // Fetch data from backend
    useEffect(() => {
        axios.get('http://localhost:8000/all/users')
            .then(res => {
                // Set the fetched data to the state
                setData(res.data);
            })
            .catch(err => console.log(err));
    }, []);

    // Delete function
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Mettre à jour l'état pour supprimer l'utilisateur de la liste
                setData((prevData) => prevData.filter((user) => user.id !== id));
            } else {
                console.error('Échec de la suppression');
                // Gérez l'erreur (affichez un message ou autre)
            }
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    };

    // Define action column
    const actionColumn = [
        {
            field: "action",
            headerName: "Action",
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        <div className="viewButton">
                        <Link to={`/adposts/Cmodifier/${params.row.id}`} className="link">
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
                La liste des Utilisateurs
                <Link to="/adposts/Cnew" className="link">
                <div className='addicon'>
                <AddIcon />
                <span>Ajouter un Utilisateur</span> 
                </div>                   
                </Link>
            </div>
            <DataGrid
                rows={data}  // Dynamic data from the API
                columns={userColumns.concat(actionColumn)}  // Columns + action column
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}  // Pagination options
                checkboxSelection
            />
        </div>
    );
};

export default CFtable;
