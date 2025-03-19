"use client";

import {LuBookText} from "react-icons/lu";
import {IconContext} from "react-icons";
import {IoSettingsOutline} from "react-icons/io5";
import {MdOutlineSpaceDashboard} from "react-icons/md";
import {GoChecklist} from "react-icons/go";
import {SignedIn, SignedOut, UserButton} from '@clerk/nextjs'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import Image from "next/image";
/*
import { useEffect } from "react";
import {useSchool} from "./syncedVars.tsx";
 */

export default function Sidebar() {

    const pathname = usePathname()
    /* Todo: Implement different Schools and Classes
    const { selectedSchool, setSelectedSchool, selectedClass, setSelectedClass } = useSchool();

    if (!selectedSchool) {
        setSelectedSchool("htl-hl")
    }
    if (!selectedClass) {
        setSelectedClass("1AHITS")
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (selectedSchool) {
                localStorage.setItem("selectedSchool", selectedSchool);
            }
            if (selectedClass) {
                localStorage.setItem("selectedClass", selectedClass);
            }
        }
    }, [selectedSchool, selectedClass]);

    function selectSchool(school: string) {
        setSelectedSchool(school);
    }
    function selectClass(classroom: string) {
        setSelectedClass(classroom);
    }
     */

    return (
        <>
            <IconContext.Provider value={{ color: "white", className: "w-5 h-5" }}>
                <aside className="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
                    <Link href="/" className="flex text-amber-400">
                        <Image className="w-auto h-8 sm:h-9" src="/school.svg" alt="" width="1" height="1"/> <h1 className="mx-4 text-2xl">School Dash</h1>
                    </Link>

                    <div className="flex flex-col justify-between flex-1 mt-6">
                        <nav>
                            {/*
                            <select className= "select mb-5 w-full max-w-xs flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md dark:bg-gray-800 dark:text-gray-200"
                                    value={selectedSchool}
                                    onChange={(e) => selectSchool(e.target.value)}>
                                <option disabled>Select your school</option>
                                <option value="htl-hl">HTL-HL</option>
                                <option value="other">other</option>
                            </select>

                            <select className= "select mb-5 w-full max-w-xs flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md dark:bg-gray-800 dark:text-gray-200"
                                    value={selectedClass}
                                    onChange={(e) => selectClass(e.target.value)}>
                                <option disabled>Select your Class</option>
                                <option value="1AHITS">1AHITS</option>
                                <option value="1BHITS">1BHITS</option>
                            </select>
                            */}

                            <Link href="/"
                                  className={pathname == "/" ? "flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md dark:bg-gray-800 dark:text-gray-200" : "flex items-center px-4 py-2 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"}>
                                <h1 className="w-5 h-5"><MdOutlineSpaceDashboard/></h1>
                                <span className="mx-4 font-medium">Dashboard</span>
                            </Link>

                            <Link href="/homework"
                                  className={pathname == "/homework" ? "flex items-center px-4 py-2 mt-5 text-gray-700 bg-gray-100 rounded-md dark:bg-gray-800 dark:text-gray-200" : "flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"}>
                                <h1 className="w-5 h-5"><LuBookText/></h1>
                                <span className="mx-4 font-medium">Homework</span>
                            </Link>

                            <Link href="/exams"
                                  className={pathname == "/exams" ? "flex items-center px-4 py-2 mt-5 text-gray-700 bg-gray-100 rounded-md dark:bg-gray-800 dark:text-gray-200" : "flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"}>
                                <h1 className="w-5 h-5"><GoChecklist/></h1>
                                <span className="mx-4 font-medium">Exams</span>
                            </Link>

                            <hr className="my-6 border-gray-200 dark:border-gray-600"/>

                            <Link href="/settings"
                                  className={pathname == "/settings" ? "flex items-center px-4 py-2 mt-5 text-gray-700 bg-gray-100 rounded-md dark:bg-gray-800 dark:text-gray-200" : "flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"}>
                                <h1 className="w-5 h-5"><IoSettingsOutline/></h1>

                                <span className="mx-4 font-medium">Settings</span>
                            </Link>
                        </nav>

                        <h1 className="flex items-center px-4 -mx-2 accent-white">
                            <SignedIn>
                                <UserButton appearance={{
                                    elements: {
                                        userButtonBox: {
                                            flexDirection: "row-reverse"
                                        },
                                    },
                                }}
                                showName
                                />
                            </SignedIn>
                            <SignedOut>
                                <Link href="/login" className="cursor-pointer mr-0">
                                    <span className="mx-4 font-medium ml-0 mr-0 text-blue-400 underline">Login</span>
                                </Link>
                                <span className="mx-4 font-medium mr-3 ml-3">or</span>
                                <Link href="/register" className="cursor-pointer ml-0">
                                    <span className="mx-4 font-medium mr-0 ml-0 text-blue-400 underline">Register</span>
                                </Link>
                            </SignedOut>
                        </h1>
                    </div>
                </aside>
            </IconContext.Provider>
        </>
    );
}