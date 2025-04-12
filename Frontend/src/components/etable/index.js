import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import axios from 'axios';
import './etable.css'
import EquipmentDetailsModal from '../EquipmentDetailsModal/Model';
import AddIcon from '@mui/icons-material/Add';

const equipColumns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "nom_projet", headerName: "Nom du Projet", width: 200 },
  { field: "investissement", headerName: "Investissement (€)", width: 150 },
  { field: "date_debut", headerName: "Date de Début", width: 150 },
  { field: "username", headerName: "Email", width: 200 },
];

const Etable = () => {
  const [data, setData] = useState([]);
  const [currentUsername, setCurrentUsername] = useState('');
  const [userRole, setUserRole] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  // Fetch current username and role from local storage or backend
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.error('Utilisateur non authentifié.');
        return;
    }

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/${userId}`);
            setCurrentUsername(response.data.username);
            setUserRole(response.data.role);

            let equipResponse;

            // Determine the endpoint based on role
            if (response.data.role === 'admin') {
                equipResponse = await axios.get('http://localhost:8000/equipements/all/equip');
            } else {
                equipResponse = await axios.get(`http://localhost:8000/equipements/user/${response.data.username}`);
            }

            setData(equipResponse.data);

        } catch (err) {
            console.error('Erreur lors de la récupération des données utilisateur:', err);
        }
    };

    fetchUserData();
}, []);



  const handleSeeMore = (equipment) => {
    setSelectedEquipment(equipment);
    setOpenModal(true);
  };

  // Delete function
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/equipements/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setData((prevData) => prevData.filter((materials) => materials.id !== id));
      } else {
        console.error('Échec de la suppression');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "",
      width: 250,
      renderCell: (params) => (
        <div className="cellAction">
          <div className='seemoreButton' onClick={() => handleSeeMore(params.row)}>
            voir plus
          </div>
          <div className="viewButton">  
            <Link to={`/equip/Emodifier/${params.row.id}`}>
              Modifier    
            </Link>                      
          </div>
          <div className="deleteButton" onClick={() => handleDelete(params.row.id)}>
            Delete
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className='datatable'>
      <div className="datatableTitle">
        la liste des Equipements
        <Link to="/equipments/new" className="link">
          <div className='addicon'>
            <AddIcon />
            <span>Ajouter un Equipement</span>
          </div>
        </Link>
      </div>

      <DataGrid
        rows={data.map(equipment => ({
          ...equipment,
          username: equipment.username || currentUsername  // Ensure username is displayed
        }))}
        columns={equipColumns.concat(actionColumn)}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />

      <EquipmentDetailsModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        equipment={selectedEquipment}
      />
    </div>
  );
};

export default Etable;
