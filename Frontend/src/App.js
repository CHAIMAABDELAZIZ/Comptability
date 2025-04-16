import './App.css';
import InterventionForm from './components/addintervention/intervention';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Chome from './pages/home/Chome/Chome';
import CList from './pages/home/Clist/Clist'
import Cnew from './pages/home/Cnew/Cnew'
import Cmodifier from './pages/home/Cmodifier/Cmodifier';
import Elist from './pages/home/Eliste/Elist';
import Enew from './pages/home/Enew/Enew';
import Emodifier from './pages/home/Emodifier/Emodifier';
import ResultInvest from './pages/resultInvest/resultInvest';

import NewIntervention from './pages/addintervention';
import Interventionlist from './pages/home/interventionlist';
import Login from './pages/login/login';
import GetIntervention from './pages/getintervention';
import ChangePassword from './pages/changepassword/changepassword';
import Cpassword from './pages/passwordpage/Cpassword';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/home" element={<Chome />} />
        <Route path="/interventionform" element={<NewIntervention  />} />
        <Route path="/adposts" element={<CList />} />
        <Route path="/equip" element={<Elist />} /> 
        <Route path="/equip/Emodifier/:id" element={<Emodifier />} />
        <Route path="/equipments/new" element={<Enew />} />
        <Route path="/adposts/Cnew" element={<Cnew />} />
        <Route path="/adposts/Cmodifier/:id" element={<Cmodifier />} />
        <Route path="/all/interventions" element={<Interventionlist />} />
        <Route path="/intervention/details/:id" element={<GetIntervention/>} />
        <Route path="/change-password" element={<Cpassword />} />
        <Route path="/result" element={<ResultInvest />} />
        
        <Route path="/result" element={<ResultInvest />} />
      </Routes>
    </Router>
  );
}

export default App;
