
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Subscription from './pages/Subscription'
import Test from "./pages/Test"
import Room from "./pages/Room"
function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route path='/signup' element={<Auth signin={false}/>}/>
        <Route path='/signin' element={<Auth signin={true}/>}/>
        <Route path="/memberships" element={<Subscription/>}/>
        <Route path='/room/:id' element={<Room/>}/>
        <Route path='/test' element={<Test/>}/>
      </Routes>
    </div>
  )
}

export default App