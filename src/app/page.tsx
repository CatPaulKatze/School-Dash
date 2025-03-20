"use client";

import {useEffect, useState} from "react";
import axios from "axios";
import {homeworkdataint} from "../interfaces/homeworkdata.ts";
import {examdataint} from "../interfaces/examdata.ts";
import {useUser} from "@clerk/nextjs";
import {Role, User} from "../interfaces/authint.ts";
import {hasPerms} from "../components/auth.ts";
import unix from "../components/unix.ts";

export default function Page() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const {user} = useUser();
    const userrole: User = { id: user?.id ?? "", roles: (user?.publicMetadata.roles as Role[]) ?? [] }
    const [homework, sethomework] = useState<homeworkdataint[]>([
            {
                _id: "",
                subject: "",
                description: "",
                deadline: 0
            }
    ])
    const [exam, setexam] = useState<examdataint[]>([
        {
            _id: "",
            subject: "",
            type: "",
            day: 0,
            description: ""
        }
    ])
    const sortedHomework = [...homework].sort((a, b) => a.deadline - b.deadline);
    const sortedExams = [...exam].sort((a, b) => a.day - b.day);

    useEffect(() => {
        async function getdata() {
            const fetchhw = await axios.get("/api/dashboard")
            const {homework, exams} = await fetchhw.data;
            if (homework && exams) {
                sethomework(homework)
                setexam(exams)
            } else {
                setError(true)
            }
            setLoading(false)
        }
        if(hasPerms(userrole, "homework", "view") && hasPerms(userrole, "exams", "view")) {
            getdata()
        }
    }, []);

    if (!loading && hasPerms(userrole, "exams", "view") && hasPerms(userrole, "homework", "view")) {
        return (
            <>
                <div className="min-w-full w-full ml-5">
                    <h1 className="text-5xl text-amber-400 mb-10">Dashboard</h1>

                    <div className="grid-cols-3 w-full flex flex-row gap-10">
                        <div className="col-span-1">
                            <h1 className="text-3xl">Homework</h1>
                            {sortedHomework.map((hw, index) => (
                                <div key={index} className="card w-96 bg-base-200 card-md shadow-sm mt-4 mb-4">
                                    <div className="card-body">
                                        <h2 className="card-title">{hw.subject} | {unix(hw.deadline)}</h2>
                                        <p>{hw.description && hw.description} {!hw.description && "No Description"}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="col-span-1">
                            <h1 className="text-3xl">Exams</h1>
                            {sortedExams.map((exams, index) => (
                                <div key={index} className="card w-96 bg-base-200 card-md shadow-sm mt-4 mb-4">
                                    <div className="card-body">
                                        <h2 className="card-title">{exams.subject} | {unix(exams.day)}</h2>
                                        <p>{exams.description && (exams.description)} {exams.description == " " && ("No Description")}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="col-span-1">
                            <h1 className="text-3xl">Klassenordner</h1>
                            <h1 className="text-xl mb-5 text-emerald-300">Work in Progress</h1>
                        </div>
                    </div>

                </div>
            </>
        )
    } else if (loading) {
        return (
            <>
                <div className="min-w-full w-full ml-5">
                    <h1 className="text-5xl text-amber-400 mb-10">Dashboard</h1>
                    <h1 className="text-3xl">Loading...</h1>
                </div>
            </>
        )
    } else if (!hasPerms(userrole, "exams", "view") && hasPerms(userrole, "homework", "view")) {
        return (
            <>
                <div className="min-w-full w-full ml-5">
                    <h1 className="text-5xl text-amber-400 mb-10">Dashboard</h1>
                    <h1 className="text-3xl">Access restricted</h1>
                </div>
            </>
        )
    } else if (error) {
        return (
            <>
                <div className="min-w-full w-full ml-5">
                    <h1 className="text-5xl text-amber-400 mb-10">Dashboard</h1>
                    <h1 className="text-3xl">An error accorded</h1>
                </div>
            </>
        )
    } else {
        return (
            <>
                <div className="min-w-full w-full ml-5">
                    <h1 className="text-5xl text-amber-400 mb-10">Dashboard</h1>
                    <h1 className="text-3xl"></h1>
                </div>
            </>
        )
    }

}