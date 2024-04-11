import logo from "../assets/CodeAid__1_-removebg-preview.png"
import { useNavigate } from 'react-router-dom'
function Navbar() {
  const navigate = useNavigate();

  return (
    <div className=" bg-black">
        <div className='w-11/12 mx-auto flex justify-between items-center'>
            <img src={logo} alt="logo" width="200px" height="200px"/>
            <button className='bg-[#c92dde] w-28 h-10 rounded-lg hover:bg-[#a516b8]' onClick={()=>{navigate("/signup")}}> Get Started </button>
        </div>
    </div>
  )
}

export default Navbar