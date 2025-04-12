import "./Elist.css"
import CsideMenu from "../../../components/Csidemenu"
import Cnavbar from "../../../components/Cnavbar"
import Etable from "../../../components/etable"


const Elist = () => {
    return (
        <div className="list">
            <CsideMenu />
            <div className="listContainer">
                <Cnavbar />
                <Etable/>

            </div>
        </div>
    )
}

export default Elist