import "./Clist.css"
import CsideMenu from "../../../components/Csidemenu"
import Cnavbar from "../../../components/Cnavbar"
import CFtable from "../../../components/cFtable"

const CList = () => {
    return (
        <div className="list">
            <CsideMenu />
            <div className="listContainer">
                <Cnavbar />
                <CFtable />
            </div>
        </div>
    )
}

export default CList