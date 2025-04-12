import React from 'react'
import Cnavbar from '../../components/Cnavbar'
import ChangePassword from '../changepassword/changepassword'
import CsideMenu from '../../components/Csidemenu'
import './Cpassword.css'

const Cpassword = () => {
  return (
    <div className="home">
    <CsideMenu />
    <div className='homeContainer'>
        <Cnavbar />
        <ChangePassword/>
      
    </div>

</div>
  )
}

export default Cpassword