import { useState ,} from "react";
import { Link } from "react-router-dom";

interface AuthProps {
  signin: boolean;
}
interface UserDetails{
    fullName?:string,
    username:string,
    password:string,
}


function Auth({ signin }: AuthProps) {
    const [user, setUser]= useState<UserDetails>({
        fullName:"",
        username:"",
        password:"",
    });

    const handleInputChanges = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]:value
        })
    };
      
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        console.log(user);
        setUser({
            fullName:"",
            username:"",
            password:""
        })
    }

    return (
        <div className="flex flex-row">
            <div className="w-full h-screen flex flex-col justify-center items-center bg-[#323232] text-white md:w-1/2">
                <div className="py-4">
                    <h3 className="text-2xl font-semibold text-purple-500">{`${signin ? 'Welcome Back ' : 'Welcome to CodeAid!'}`}</h3>
                    {!signin && <p>Enhance your Coding Experience</p>}
                </div>
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 w-3/4 md:w-1/2 px-4 py-2">
                    {!signin && <input type="text" name="fullName" placeholder="Full Name" onChange={handleInputChanges} value={user.fullName} className="w-full h-[31px] px-4 py-2 bg-transparent border border-slate-500 rounded-lg" />}
                    <input type="email" name="username" placeholder="Username" onChange={handleInputChanges} value={user.username} className="w-full h-[31px] px-4 py-2 bg-transparent border border-slate-500 rounded-lg" />
                    <input type="password" name="password" placeholder="Password" onChange={handleInputChanges} value={user.password} className="w-full h-[31px] px-4 py-2 bg-transparent border border-slate-500 rounded-lg" />
                    {signin?<div>Don't have an account? <Link to="/signup" className="px-2 text-[#9727b2]">Create One</Link> </div>:<div> Already have an account<Link to="/signin" className=" px-2 text-[#9727b2]">Login Now </Link></div>}
                    <button type="submit" className="w-full bg-[#9727b2] rounded-lg px-4 py-2 font-semibold">{`${signin ? 'Login' : 'Signup'}`}</button>
                </form>
            </div>
            <div className="hidden md:flex flex-col bg-black w-1/2 text-purple-500 justify-center items-start px-10 text-2xl font-semibold">
                <h3>Collaboration is the best way to work. It's the only way to work, really. Everyone's there because they have a set of skills to offer across the board....</h3>
                <p className="font-bold text-purple-300">~ Antony Starr</p>
            </div>
        </div>
    );
}

export default Auth;
