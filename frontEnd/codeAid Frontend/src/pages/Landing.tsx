import Navbar from '../components/Navbar'
import Banner from '../components/Banner'
import Slider from '../components/Slider'
import Subscription_promo from '../components/Subscription_promo'
import Footer from '../components/Footer'

function Landing() {
  return (
    <div className='bg-[#323232] text-white w-full '>
        <p className='w-full text-center py-4'>Get instant coding help with CodeAid</p>
        <Navbar/>
        <Banner/>
        <Slider/>
        <Subscription_promo/>
        <Footer/>

    </div>
  )
}

export default Landing