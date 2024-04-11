import Logo from "../assets/CodeAid__1_-removebg-preview.png"
import { FaFacebook , FaLinkedin, FaGithub, FaGlobe} from "react-icons/fa";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <div className="w-11/12 mx-auto mt-4 pb-10">
      <div>
        <img src={Logo} alt="CodeAid" className="w-[250px] h-[100px]"/>
        <div className="flex flex-row justify-between w-[250px]  px-4 py-4">
            <Link to="#" className="text-2xl"><FaFacebook /></Link>
            <Link to="#" className="text-2xl"><FaLinkedin /></Link>
            <Link to="#" className="text-2xl"><FaGithub/></Link>
            <Link to="#" className="text-2xl"><FaGlobe /></Link>
        </div>
      </div>
      <div className="links flex flex-row justify-between max-w-[500px]">
        <div className="support">
          <h3 className="font-bold">Support</h3>
          <ul>
            <li><Link to="#" className="hover:underline">Help Desk</Link></li>
            <li><Link to="#" className="hover:underline">Live Assistance</Link></li>
            <li><Link to="#" className="hover:underline">Tutorials</Link></li>
            <li><Link to="#" className="hover:underline">Get in Touch</Link></li>
          </ul>
        </div>

        <div className="support">
          <h3 className="font-bold">Resources</h3>
          <ul>
            <li><Link to="#" className="hover:underline">Terms of Service</Link></li>
            <li><Link to="#" className="hover:underline">Site Navigation</Link></li>
            <li><Link to="#" className="hover:underline">Membership</Link></li>
          </ul>
        </div>


      </div>
    </div>
  )
}

export default Footer