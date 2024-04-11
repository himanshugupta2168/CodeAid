
import { useNavigate } from "react-router-dom"
import banner_img from "../assets/banner_Img.jpg" 
function Banner() {
  const navigate= useNavigate()
  return (
    <div className='flex flex-col-reverse p-6 md:flex-row md:items-center lg:h-[500px] lg:pl-14 lg:py-0 lg:pr-0'>
        <div className="mt-4 w-full md:w-1/2">
            <h3 className='text-2xl md:text-3xl lg:text-[50px] lg:font-bold  font-semibold text-purple-500'>Welcome to CodeAid!</h3>
            <p className='pt-4 md:text-lg lg:mt-6 lg:text-[20px] lg:leading-loose '>Experience real-time doubt solving and coding collaboration. Connect with experts and peers to enhance your coding skills.</p>
            <button className='text-center bg-[#b93cd7] w-44 h-14 mt-8 rounded-3xl' onClick={()=>{navigate("/signup")}}>Connect Now </button>
        </div>
        <div className=" md:w-1/2 h-full">
            <img src={banner_img} alt="Banner" className='h-full w-full ' />
        </div>
    </div>
  )
}

export default Banner