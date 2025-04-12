import "../../pages/home/Clist/Clist.css"
import CsideMenu from "../../components/Csidemenu"
import Cnavbar from "../../components/Cnavbar"
import InterventionForm from "../../components/addintervention/intervention"

const NewIntervention = () => {
    return (
        <div className="list">
            <CsideMenu />
            <div className="listContainer">
                <Cnavbar />
                <InterventionForm />
            </div>
        </div>
    )
}

export default NewIntervention