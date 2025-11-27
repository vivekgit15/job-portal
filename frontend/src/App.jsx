import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import EmployerDashboard from './pages/EmployerDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import JobDetails from './pages/JobDetails'
import Applicants from "./pages/Applicants";

import MyApplications from "./pages/MyApplications";

import Navbar from './components/Navbar'
import PostJob from './components/PostJob'
import Profile from './pages/Profile'

const App = () => {
  return (
    
    <BrowserRouter>
    <Navbar />
      <Routes>

        <Route path='/' element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
  path="/job/:id"
  element={
    <ProtectedRoute>
      <JobDetails />
    </ProtectedRoute>
  }
/>
        <Route path="/dashboard" element={
          <ProtectedRoute>
          <Dashboard />
          </ProtectedRoute>
          } />

          <Route
  path="/employer/job/:jobId/applicants"
  element={
    <ProtectedRoute>
      <Applicants />
    </ProtectedRoute>
  }
/>


          <Route
  path="/applications/my"
  element={
    <ProtectedRoute>
      <MyApplications />
    </ProtectedRoute>
  }
/>

        <Route path="/employer" element={<EmployerDashboard />} />

       <Route path='/post-job' element={
        <ProtectedRoute>
        <PostJob />
        </ProtectedRoute>
        }/>
       <Route path='/profile' element={
        <ProtectedRoute>
        <Profile />
        </ProtectedRoute>
        }/>


      </Routes >


    </BrowserRouter>
  )
}

export default App