import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import PatientRegister from './Patient/Pages/PatientRegister';
import PatientLogin from './Patient/Pages/PatientLogin';
import NurseLogin from './Nurse/Pages/NurseLogin';
import PatientHome from './Patient/Pages/PatientHome';
import NurseHome from './Nurse/Pages/NurseHome';
import NursePatientDetails from './Nurse/Pages/NursePatientDetails';
import Games from './Patient/Pages/Games';
import Game from './Patient/Pages/Game';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='registerpatient' exact element={<PatientRegister/>} />
          <Route path='loginpatient' exact element={<PatientLogin/>} />
          <Route path='/homepatient' exact element={<PatientHome/>} />
          <Route path='/' exact element={<PatientHome/>} />
          <Route path='/games' exact element={<Games/>} />
          <Route path='/game/:gameid' exact element={<Game/>} />

          <Route path='loginnurse' exact element={<NurseLogin/>} />
          <Route path='homenurse' exact element={<NurseHome/>} />
          <Route path='patient/:patientid' exact element={<NursePatientDetails/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
