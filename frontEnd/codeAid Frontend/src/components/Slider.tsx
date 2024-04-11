import React from 'react';
import SlickSlider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import image1 from"../assets/CodeAid__1_-removebg-preview.png"
import image2 from "../assets/banner_Img.jpg"

const ImageSlider: React.FC = () => {
  const settings: SliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <SlickSlider {...settings} className='object-contain text-white'>
      <div>
        <img src={image1} alt="Slide 1"  className='w-full   h-[150px] rounded-lg'/>
      </div>
      <div>
        <img src={image2} alt="Slide 2" className='w-full h-[150px] rounded-lg' />
      </div>
    </SlickSlider>
  );
};

interface SliderSettings {
  dots: boolean;
  infinite: boolean;
  speed: number;
  slidesToShow: number;
  slidesToScroll: number;
  autoplay: boolean;
  autoplaySpeed: number;
}
function Slider() {
  return (
    <div className='w-full bg-[#131313]'>
      <div className=' max-w-[250px] md:max-w-[600px] mx-auto py-8'>
        <ImageSlider/>
      </div>
    </div>
  )
}

export default Slider