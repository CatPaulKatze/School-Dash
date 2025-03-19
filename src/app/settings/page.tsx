"use client";

import {SignedIn, SignedOut, useUser} from '@clerk/clerk-react'
import React, {useEffect, useState} from "react";
import {settingsdataint} from "../../interfaces/settings.ts";
import axios from "axios";
import Link from "next/link";
import hljs from "highlight.js/lib/core";
import css from "highlight.js/lib/languages/css";

export default function Page() {

    const settingsdefault:settingsdataint = {
        ntfy: false,
        lesson: false,
        hwreminder: false,
        examreminder: false
    }

    const {user} = useUser();
    const [settings, setsettings] = useState(settingsdefault);

    hljs.registerLanguage('default', css);

    useEffect(() => {
        async function getdata() {
            const fetch = await axios.get("/api/settings");
            const data = await fetch.data;
            setsettings(data)
        }

        getdata()
    }, []);

    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = event.target;
        const newSettings = { ...settings, [name]: checked };
        setsettings(newSettings);


        await axios.patch("/api/settings", { settings: newSettings }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    const ntfyserver = hljs.highlight(
        "https://ntfy.redstonehosting.de",
        { language: 'default' }
    ).value
    const ntfytopic = hljs.highlight(
        user?.id || "",
        { language: 'default' }
    ).value

    return (
        <>
            <div className="ml-5">
                <h1 className="text-5xl text-amber-400 mb-10">Settings</h1>

                <SignedIn>

                    <div className="">
                        <h1 className="text-4xl mb-3">NTFY <input type="checkbox" name="ntfy" className="toggle toggle-md toggle-success" checked={settings.ntfy} onChange={handleInputChange}/><br/></h1>
                        {settings.ntfy && <div>
                            <h3 className="text-xl mb-5 text-red-500">Work in Progress, currently this doesn&#39;t work</h3>
                            <h3 className="mb-1">We use the free and open source software <a className="text-blue-400 underline" href="https://ntfy.sh" target="_blank">NTFY</a> for our notifications. So you need to download the NTFY app onto your phone and listen to the URL down below.</h3>
                            Your NTFY Server is: <code>{ntfyserver}</code> <br/>
                            Your NTFY Topic is: <code>{ntfytopic}</code> <br/> <br/>
                            Lesson Changes <input type="checkbox" name="lesson" className="toggle toggle-xs toggle-success" checked={settings.lesson} onChange={handleInputChange}/><br/>
                            Exam Reminder <input type="checkbox" name="examreminder" className="toggle toggle-xs toggle-success" checked={settings.examreminder} onChange={handleInputChange}/><br/>
                            Homework Reminder <input type="checkbox" name="hwreminder" className="toggle toggle-xs toggle-success" checked={settings.hwreminder} onChange={handleInputChange}/><br/>
                            Klassenordner Mitteilung am Anfang der Woche <input type="checkbox" name="hwreminder" className="toggle toggle-xs toggle-success" disabled/><br/>
                        </div>}
                        <br/>
                        <h1 className="text-4xl mb-3">Sync your Google Calendar</h1>
                        <h3 className="text-xl mb-5 text-red-500">Work in Progress, currently this doesn&#39;t work</h3>
                        <button className="border-2">Connect with Google</button> <button className="border-2">Delete Link</button>


                    </div>
                </SignedIn>

                <SignedOut>
                    <h1 className="text-3xl">You must be logged in to view this page! <br/>
                        <Link href="/login" className="text-blue-400 underline">Goto Login Page</Link> <br/>
                        <Link href="/register" className="text-blue-400 underline">Goto Register Page</Link>
                    </h1>
                </SignedOut>
            </div>
        </>

    )
}
