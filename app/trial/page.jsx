"use client";
import { useState, useEffect} from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Dot } from 'lucide-react';

const page = () => {
  const [apartmentType, setApartmentType] = useState([]);
  const [apartmentSize, setApartmentSize] = useState([]);
  const [saleType, setSaleType] = useState("");
  const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [isMounted]);

    if (!isMounted) {
        return <div>loading...</div>
    }

  function manageApartmentSelection(str) {
    return (e) => {
      const selectedValue = str;

    if (apartmentType.includes(selectedValue)) {
 

        setApartmentType(apartmentType.filter(item => item !== selectedValue));

      } else {
      setApartmentType([...apartmentType ,selectedValue]);
      }

      console.log("Selected Apartment Type:", apartmentType);
    };
  }

    function manageApartmentSize(str) {
    return (e) => {
      const selectedValue = str;

      if (apartmentSize.includes(selectedValue)) {
        setApartmentSize(apartmentSize.filter(item => item !== selectedValue));
      } else {
        setApartmentSize([...apartmentSize, selectedValue]);
      }

      console.log("Selected Apartment Size:", apartmentSize);
    };
    }

    function manageSaleType(str) {
    return (e) => {
      const selectedValue = str;

      if (saleType === selectedValue) {
        setSaleType("");
      } else {
        setSaleType(selectedValue);
      }

      console.log("Selected Sale Type:", saleType);
    };
}

  return (
    <div className="flex justify-center bg-sky-400 rounded-full m-4 py-2">
      <DropdownMenu >
        <DropdownMenuTrigger className="m-2 text-white  text-md font-medium hover:text-sky-600 hover:bg-sky-200 transition-colors duration-300 p-2 rounded-full">Apartement Type</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="hover:bg-sky-600"  onClick={manageApartmentSelection('apartment')}>Apartment {apartmentType.includes('apartment')?(<Dot className="size-10" />):("")}</DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-sky-600"  onClick={manageApartmentSelection('independent-house')}>Indepenet House {apartmentType.includes('independent-house')?(<Dot className="size-10" />):("")}</DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-sky-600" onClick={manageApartmentSelection('plot')}>Plot {apartmentType.includes('plot')?(<Dot className="size-10" />):("")}</DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-sky-600"  onClick={manageApartmentSelection('studio')}>Studio {apartmentType.includes('studio')?(<Dot className="size-10" />):("")}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu >
        <DropdownMenuTrigger className="m-2 text-white  text-md font-medium hover:text-sky-600 hover:bg-sky-200 transition-colors duration-300 p-2 rounded-full">Apartment Size</DropdownMenuTrigger>
        <DropdownMenuContent className="">
          <DropdownMenuSeparator />
          <DropdownMenuItem className="hover:bg-sky-600"  onClick={manageApartmentSize('1rk')}>1RK {apartmentSize.includes('1rk')?(<Dot className="size-10" />):("")}</DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-sky-600"  onClick={manageApartmentSize('1bhk')}>1BHK {apartmentSize.includes('1bhk')?(<Dot className="size-10" />):("")}</DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-sky-600"  onClick={manageApartmentSize('2bhk')}>2BHK {apartmentSize.includes('2bhk')?(<Dot className="size-10" />):("")}</DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-sky-600"  onClick={manageApartmentSize('3bhk')}>3BHK {apartmentSize.includes('3bhk')?(<Dot className="size-10" />):("")}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu className="">
        <DropdownMenuTrigger className="m-2 text-white  text-md font-medium hover:text-sky-600 hover:bg-sky-200 transition-colors duration-300 p-2 rounded-full">Sale Type</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="hover:bg-sky-600"  onClick={manageSaleType('new-booking')}>New booking {saleType==="new-booking"?(<Dot className="size-10"/>):("")} </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-sky-600"  onClick={manageSaleType('resale')}>Resale {saleType==="resale"?(<Dot className="size-10"/>):("")}</DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>


    </div>
  );
};

export default page;
