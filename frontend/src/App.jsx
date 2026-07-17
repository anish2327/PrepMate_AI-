import { useState } from 'react'
import {Route, Routes} from 'react-router-dom'
import Login from './page/login'
import Signup from './page/signup'
import Chat from './page/chat'
import Home from './page/home'
import Dashboard from './page/Dashboard'
import Interview from './page/Interview'
import Result from './page/Result'
import History from './page/History'


function App() {

  return (

    <>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/chat' element={<Chat/>} />
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
