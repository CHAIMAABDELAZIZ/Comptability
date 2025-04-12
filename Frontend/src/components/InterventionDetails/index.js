import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import './intervention.scss';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import * as XLSX from 'xlsx';



const InterventionDetails = () => {
    const { id } = useParams(); // Récupère l'ID de l'URL
    const [intervention, setIntervention] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchIntervention = async () => {
            try {
                const response = await fetch(`http://localhost:8000/intervention/${id}`);
                if (!response.ok) throw new Error('Erreur lors de la récupération des détails');
                const data = await response.json();
                setIntervention(data);
            } catch (error) {
                setError(error.message);
            }
        };
        fetchIntervention();
    }, [id]);

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text('Détails de l\'Intervention', 10, 10);
        doc.text(`Nature de l'intervention: ${intervention.nature || intervention.otherNature || 'Non spécifié'}`, 10, 20);
        doc.text(`Matériel affecté: ${intervention.equipment || intervention.otherEquipment || 'Non spécifié'}`, 10, 30);
        doc.text(`Solution utilisée: ${intervention.solution}`, 10, 40);
        doc.text(`Brand: ${intervention.brand}`, 10, 50);
        doc.text(`NS/IMMO: ${intervention.assetNumber}`, 10, 60);

        // Ajouter le rapport ligne par ligne
        const reportLines = intervention.report.split('\n'); // Divise le rapport par lignes
        reportLines.forEach((line, index) => {
            doc.text(line, 10, 70 + (index * 10)); // Positionne chaque ligne avec un espacement
        });

        doc.save('intervention-details.pdf');
    };



    const downloadWord = () => {
        const doc = new Document();

        doc.addSection({
            children: [
                new Paragraph({
                    children: [
                        new TextRun('Détails de l\'Intervention'),
                        new TextRun('\n'),
                    ],
                }),
                new Paragraph(`Nature de l'intervention: ${intervention.nature || intervention.otherNature || 'Non spécifié'}`),
                new Paragraph(`Matériel affecté: ${intervention.equipment || intervention.otherEquipment || 'Non spécifié'}`),
                new Paragraph(`Solution utilisée: ${intervention.solution}`),
                new Paragraph(`Brand: ${intervention.brand}`),
                new Paragraph(`NS/IMMO: ${intervention.assetNumber}`),
                new Paragraph(`Compte rendu:`),
                ...intervention.report.split('\n').map(line => new Paragraph(line)), // Ajoute chaque ligne du rapport
            ],
        });

        Packer.toBlob(doc).then(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'intervention-details.docx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    };


    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet([{
            'Détails de l\'Intervention': '',
            'Nature de l\'intervention': intervention.nature || intervention.otherNature || 'Non spécifié',
            'Matériel affecté': intervention.equipment || intervention.otherEquipment || 'Non spécifié',
            'Solution utilisée': intervention.solution,
            'Brand': intervention.brand,
            'NS/IMMO': intervention.assetNumber,
            'Compte rendu': intervention.report
        }]);

        // Formate le rapport pour qu'il soit écrit ligne par ligne
        const reportLines = intervention.report.split('\n');
        reportLines.forEach((line, index) => {
            XLSX.utils.sheet_add_aoa(worksheet, [[line]], { origin: `A${index + 8}` }); // Commence à la ligne 8 pour laisser de l'espace
        });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Intervention');

        XLSX.writeFile(workbook, 'intervention-details.xlsx');
    };


    if (error) return <div>{error}</div>;
    if (!intervention) return <div>Loading...</div>;

    return (
        <div className="">
          <div className="intervention-details">
            <h1>Détails de l'Intervention</h1>

            <div>
                <h3>Nature de l'intervention:</h3>
                <p>
                    {intervention.nature ? (
                        Array.isArray(intervention.nature)
                            ? intervention.nature.join(', ')
                            : intervention.nature
                    ) : (
                        intervention.otherNature || 'Non spécifié'
                    )}
                </p>
            </div>

            <div>
                <h3>Matériel affecté:</h3>
                <p>
                    {intervention.equipment ? (
                        Array.isArray(intervention.equipment)
                            ? intervention.equipment.join(', ')
                            : intervention.equipment
                    ) : (
                        intervention.otherEquipment || 'Non spécifié'
                    )}
                </p>
            </div>

            <div>
                <h3>Solution utilisée:</h3>
                <p>{Array.isArray(intervention.solution) ? intervention.solution.join(', ') : intervention.solution}</p>
            </div>

            <div>
                <h3>Brand:</h3>
                <p>{intervention.brand}</p>
            </div>

            <div>
                <h3>NS/IMMO:</h3>
                <p>{intervention.assetNumber}</p>
            </div>

            <div>
                <h3>Compte rendu:</h3>
                <p>{intervention.report}</p>
            </div>
         </div>
            <div className="button-container">
                <button onClick={downloadPDF}>Télécharger en PDF</button>
                <button onClick={downloadWord}>Télécharger en Word</button>
                <button onClick={downloadExcel}>Télécharger en Excel</button>
            </div>
        </div>
    );
};

export default InterventionDetails;