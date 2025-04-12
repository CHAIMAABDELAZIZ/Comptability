import "../Clist/Clist.css"
import CsideMenu from "../../../components/Csidemenu"
import Cnavbar from "../../../components/Cnavbar"
import InterventionTable from "../../../components/interventiontable/table"

const Interventionlist = () => {
    return (
        <div className="list">
            <CsideMenu />
            <div className="listContainer">
                <Cnavbar />
                <InterventionTable />
            </div>
        </div>
    )
}

export default Interventionlist