import React from 'react'
import './Featured.css'
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Featured = () => {
    return (
        <div className='featured'>
            <div className='top'>
                <h1 className='title '>Statistiques  </h1>
                <MoreVertIcon fontSize="small" />
            </div>
            <div className='bottom'>
                <div className="featuredChart">
                    <CircularProgressbar value={70} text={"70%"} strokeWidth={5} />
                </div>
                <p className="title"> Total des equipements hors-Sevice </p>
            </div>

        </div>
    )
}

export default Featured
