import { useState } from 'react'
import {Route, Routes} from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './page/login'
import Signup from './page/signup'

import Dashboard from './page/Dashboard'
import Interview from './page/Interview'
import Result from './page/Result'
import History from './page/History'


function App() {

  return (

    <>
    <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
       
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/interview' element={<Interview />} />
        <Route path='/result' element={<Result />} />
        <Route path="/history" element={<History />}
/>
      
      </Routes>
    </>

  )
}

export default App
