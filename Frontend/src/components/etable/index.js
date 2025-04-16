import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import './etable.css';
import EquipmentDetailsModal from '../EquipmentDetailsModal/Model';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate, Link } from 'react-router-dom';

const equipColumns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "nom_projet", headerName: "Nom du Projet", width: 200 },
  { field: "description", headerName: "Description du Projet", width: 200 },
  { field: "date_debut", headerName: "Date de Début", width: 150 },
  { field: "investissement", headerName: "Investissement (€)", width: 150 },
  {
    field: "rentable",
    headerName: "Rentable",
    width: 130,
    renderCell: (params) => (
      <span style={{ color: params.value ? "green" : "red", fontWeight: "bold" }}>
        {params.value ? "✅ Oui" : "❌ Non"}
      </span>
    ),
  },
];

const Etable = () => {
  const [data, setData] = useState([]);
  const [currentUsername, setCurrentUsername] = useState('');
  const [userRole, setUserRole] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  const navigate = useNavigate();

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
    navigate('/result', { state: { projetId: equipment.id } });
  };

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
        La liste des Projets
        <Link to="/equipments/new" className="link">
          <div className='addicon'>
            <AddIcon />
            <span>Ajouter un Projet</span>
          </div>
        </Link>
      </div>

      <DataGrid
        rows={data.map(equipment => ({
          ...equipment,
          username: equipment.username || currentUsername,
          rentable: equipment.van > 0, // calcul de rentabilité ici
        }))}
        columns={equipColumns.concat(actionColumn)}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 8 },
          },
        }}
        pageSizeOptions={[8, 10]}
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
