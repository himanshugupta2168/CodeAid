import React from 'react'
import { FaCode } from "react-icons/fa";
import { IoMdTimer } from "react-icons/io";
import { HiServerStack } from "react-icons/hi2";

function Subscription_promo() {
  return (
    <div className='bg-black py-8'>
        <div className='w-11/12 mx-auto flex flex-col items-center'>
            <h3 className=' text-3xl py-4 font-semibold'>Love <span className='text-purple-500'>Coding</span> with us?</h3>
            <p className='break-words  md:text-lg lg:text-xl pb-4'>Enjoy 40% off on yearly subscription. Plus, get exclusive access to advanced features. No commitments, easy cancellation.</p>
            <div className=' grid grid-cols-3 gap-8 my-8'>
                <div className='flex flex-col items-center gap-4'>
                    <div className='bg-[#323232] w-24 h-24 flex justify-center items-center text-4xl rounded-3xl'><FaCode/></div>
                    <div className='bg-[#323232] text-sm lg:text-lg px-4 py-2 rounded-xl h-[100px] md:h-auto'>Selet your Coding Language</div>
                </div>
                <div className='flex flex-col items-center gap-4'>
                    <div className='bg-[#323232] w-24 h-24 flex justify-center items-center text-4xl rounded-3xl'><IoMdTimer /></div>
                    <div className='bg-[#323232] text-sm lg:text-xl px-4 py-2 rounded-xl h-[100px] md:h-auto md:pt-2  sm:pt-6'>Choose Subscription</div>
                </div>
                <div className='flex flex-col items-center gap-4'>
                    <div className='bg-[#323232] w-24 h-24 flex justify-center items-center text-4xl rounded-3xl'><HiServerStack /></div>
                    <div className='bg-[#323232] text-sm lg:text-xl px-4 py-2 rounded-xl h-[100px] sm:pt-6 md:pt-2 md:h-auto'>Cancel Anytime</div>
                </div>
            </div>
            <button className='text-center bg-[#ab45d0] px-4 py-2 rounded-lg my-4'> Subscribe Now</button>
            <p>Already Subscribed?</p>
            <p>Update your preferences here.</p>
            <form className='w-full flex pl-4  my-4 rounded-2xl  overflow-hidden max-w-[500px]'>
                <input type="email" name="" id="" placeholder=' Subscribe newsLetter... '  className='py-3 px-4 w-[70%] bg-transparent outline-white'/>
                <button className='w-[30%] bg-[#ab45d0]' type='submit'>Subscribe</button>
            </form>
        </div>
    </div>
  )
}

export default Subscription_promo