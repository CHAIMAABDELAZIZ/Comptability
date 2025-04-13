import React from 'react'

import "./Chome.css"
import Featured from '../../../components/featured'

import CsideMenu from '../../../components/Csidemenu'

import Cnavbar from '../../../components/Cnavbar'
import Cwidget from '../../../components/Cwidget'
import Featured2 from '../../../components/featured2/featured'
import Graph1 from '../../../components/graph1/graph1'
import Graph2 from '../../../components/Graph2/graph2'
/*import Chart from '../../components/chart'*/


const Chome = () => {
    return (

        <div className="home">
            <CsideMenu />
            <div className='homeContainer'>
                <Cnavbar />
              

                <div className='widgets'>
                    <Cwidget type="places" />
                    <Cwidget type="Users" />
                </div>
                <div className="charts">
                    <Graph1 />
                    <Graph2 />

                </div>

                <div className="charts">
                    <Featured />
                    <Featured2 />


                </div>


            </div>

        </div>
    )
}

export default Chome;
