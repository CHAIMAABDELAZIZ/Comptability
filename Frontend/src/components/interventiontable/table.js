import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../cFtable/cFtable.css';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import "./table.css"

const interventionColumns = [
    { field: "id", headerName: "ID", width: 70 },
    {
        field: "nature",
        headerName: "Nature",
        width: 150,
        renderCell: (params) => {
            const { nature, otherNature } = params.row;
            const natureDisplay = nature && nature.length > 0
                ? (Array.isArray(nature) ? nature.join(', ') : nature)
                : otherNature || 'Non spécifié';
            return <span>{natureDisplay}</span>;
        },
    },
    { field: "username", headerName: "Ajouté par ", width: 150 },
];

const InterventionTable = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch the user's role from local storage or API
                const userId = localStorage.getItem('userId');

                if (userId) {
                    // Get the user role from backend
                    const roleResponse = await axios.get(`http://localhost:8000/${userId}`);
                    const role = roleResponse.data.role;
                    setUserRole(role);

                    // Fetch interventions based on role
                    const endpoint = role === 'admin'
                        ? 'http://localhost:8000/intervention/all/interventions'
                        : `http://localhost:8000/intervention/user/${userId}`;

                    // Fetch interventions from the appropriate endpoint
                    const interventionResponse = await axios.get(endpoint);
                    console.log(interventionResponse.data); // Log the response to check for username
                    setData(interventionResponse.data);
                }
            } catch (error) {
                console.error('Error fetching interventions or user role:', error);
            }
        };

        fetchData();
    }, []);



    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/intervention/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setData((prevData) => prevData.filter((intervention) => intervention.id !== id));
            } else {
                console.error('Failed to delete');
            }
        } catch (error) {
            console.error('Error during deletion:', error);
        }
    };

    const actionColumn = [
        {
            field: "action",
            headerName: "Action",
            width: 200,
            renderCell: (params) => (
                <div className="cellAction">
                    <div className="viewButton">
                        <Link to={`/intervention/details/${params.row.id}`} className="link">
                            Voir plus 
                        </Link>
                    </div>
                    <div
                        className="deleteButton"
                        onClick={() => handleDelete(params.row.id)}
                    >
                        supprimer
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className='datatable'>
            <div className="datatableTitle">
                La liste des Interventions
                <Link to="/interventionform" className="link">
                <div className='addicon'>
            <AddIcon />
            <span>Ajouter une Intervention</span>
          </div>
                </Link>
            </div>
            <DataGrid
                rows={data}
                columns={interventionColumns.concat(actionColumn)}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
            />
        </div>
    );
};

export default InterventionTable;