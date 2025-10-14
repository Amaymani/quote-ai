"use client";
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const { data: session, status } = useSession();


  return (
    <div className="flex justify-between  bg-primary p-2 rounded-full m-4 mx-12">
      <div className="flex justify-center items-center font-black text-white text-2xl ml-6">Quote.ai</div>
      <div className="flex justify-center items-center">
        <Link href={"/"} className="p-2 px-4 m-2 hover:bg-secondary transition-colors duration-300 text-white font-medium hover:text-secondary-foreground rounded-full">
          Home
        </Link>
        <Link href={"make-quote"} className="p-2 px-4 m-2 hover:bg-secondary transition-colors duration-300 text-white font-medium hover:text-secondary-foreground rounded-full">
          Create a Quote
        </Link>
        <Link href={"/dashboard"} className="p-2 px-4 m-2 hover:bg-secondary transition-colors duration-300 text-white font-medium hover:text-secondary-foreground rounded-full">
          Dashboard
        </Link>
        <Link href={"/inventory"} className="p-2 px-4 m-2 hover:bg-secondary transition-colors duration-300 text-white font-medium hover:text-secondary-foreground rounded-full">
          Inventory
        </Link>
        {status === "authenticated" ? (
          <button onClick={()=>{signOut()}} className="p-2 px-4 m-2 bg-secondary transition-colors duration-300 text-primary font-medium hover:text-secondary-foreground rounded-full">
            Sign Out
          </button>
        ) : (
          <Link href={"/login"} className="p-2 px-4 m-2 bg-secondary transition-colors duration-300 text-primary font-medium hover:text-secondary-foreground rounded-full">
            Login
          </Link>
        )}


      </div>
    </div>
  );
};

export default Navbar;
