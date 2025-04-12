import "../../pages/home/Clist/Clist.css"
import CsideMenu from "../../components/Csidemenu"
import Cnavbar from "../../components/Cnavbar"
import InterventionDetails from "../../components/InterventionDetails/index"

const GetIntervention = () => {
    return (
        <div className="list">
            <CsideMenu />
            <div className="listContainer">
                <Cnavbar />
                <InterventionDetails />
            </div>
        </div>
    )
}

export default GetIntervention