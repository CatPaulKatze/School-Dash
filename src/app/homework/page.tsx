"use client";

import axios from "axios";
import {homeworkdataint} from "../../interfaces/homeworkdata.ts";
import {useEffect, useState} from "react";
import unix from "../../components/unix"
import {SignedIn, SignedOut, useUser} from "@clerk/nextjs";
import {hasPerms} from "../../components/auth.ts";
import {Role, User} from "../../interfaces/authint.ts";
import {FaRegEdit} from "react-icons/fa";
import {MdOutlineDeleteOutline} from "react-icons/md";
import { IconContext } from "react-icons";

export default function Page() {

    const defaulthomework:homeworkdataint[] = [
        {
            _id: "",
            subject: "",
            deadline: 0,
            description: ""
        }
    ]

    const [homework, sethomework] = useState(defaulthomework);
    const [loading, setLoading] = useState(true);
    const sortedHomework = [...homework].sort((a, b) => a.deadline - b.deadline);
    const {user} = useUser();
    const userrole: User = { id: user?.id ?? "", roles: (user?.publicMetadata.roles as Role[]) ?? [] }
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
    const [editModal, setEditModal] = useState(false);
    const [editFormData, setEditFormData] = useState<homeworkdataint>({
        _id: '',
        subject: '',
        deadline: 0,
        description: ''
    });
    const [createModal, setCreateModal] = useState(false);
    const [newHomework, setNewHomework] = useState<homeworkdataint>({
        subject: '',
        deadline: Math.floor(new Date().setHours(12, 0, 0, 0) / 1000),
        description: ''
    });

    useEffect(() => {
        async function getdata() {
            try {
                const fetch = await axios.get("/api/homework")
                const data = await fetch.data;
                if (!data.error) {
                    sethomework(data)
                } else {
                }
                setLoading(false)
            } catch {
                setLoading(false)
            }
        }

        getdata()
    }, []);

    const handleEdit = (index: number) => {
        const sortedItem = sortedHomework[index];
        const originalIndex = homework.findIndex(item => item._id === sortedItem._id);
        const hw = homework[originalIndex];

        const deadlineDate = new Date(hw.deadline * 1000);
        deadlineDate.setHours(12, 0, 0, 0);

        setEditFormData({
            ...hw,
            deadline: Math.floor(deadlineDate.getTime() / 1000)
        });
        setEditModal(true);
    };

    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: name === 'deadline' ? Number(value) : value
        }));
    };

    const confirmEdit = async () => {
        try {
            await axios.patch(`/api/homework/${editFormData._id}`, editFormData);
            sethomework(prevHw => prevHw.map(item =>
                item._id === editFormData._id ? editFormData : item
            ));
            setEditModal(false);
        } catch (error) {
            console.error('Failed to update homework:', error);
        }
    };

    const handleDelete = (index: number) => {
        const sortedItem = sortedHomework[index];
        const originalIndex = homework.findIndex(item => item._id === sortedItem._id);
        setDeleteIndex(originalIndex);
        setDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (deleteIndex === null) return;

        try {
            const hw = homework[deleteIndex];
            await axios.delete(`/api/homework/${hw._id}`);
            sethomework(prevHw => prevHw.filter((_, i) => i !== deleteIndex));
        } catch (error) {
            console.error('Failed to delete homework:', error);
        }

        setDeleteModal(false);
        setDeleteIndex(null);
    };

    const handleCreate = async () => {
        try {
            const response = await axios.post('/api/homework', newHomework);
            sethomework(prevHw => [...prevHw, response.data]);
            setCreateModal(false);
            setNewHomework({
                subject: '',
                deadline: Math.floor(new Date().setHours(12, 0, 0, 0) / 1000),
                description: ''
            });
        } catch (error) {
            console.error('Failed to create homework:', error);
        }
    };


    if(!loading && hasPerms(userrole, "homework", "view")) {
        return (
            <div className="ml-5 mr-5">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-5xl text-amber-400">Homework</h1>
                    {hasPerms(userrole, "homework", "create") && (
                        <button className="btn btn-primary" onClick={() => setCreateModal(true)}>
                            Create Homework
                        </button>
                    )}
                </div>

                <IconContext.Provider value={{ color: "white", className: "w-5 h-5" }}>
                    <table className="table-fixed w-full pr-14">
                        <thead>
                        <tr>
                            <th className="w-[5%]">Priority</th>
                            <th className="w-[10%]">Subject</th>
                            <th className="w-[15%]">Deadline</th>
                            <th className="w-[40%]">Description</th>
                            {hasPerms(userrole, "homework", "create") && (
                                <th className="w-[10%]">Actions</th>
                            )}
                        </tr>
                        </thead>
                        <tbody>
                        {sortedHomework.map((hwi, index) => (
                            <tr key={index} className="bg-base-200 text-center">
                                <td>{index + 1}</td>
                                <td>{hwi.subject}</td>
                                <td>{unix(hwi.deadline)}</td>
                                <td>{hwi.description}</td>
                                {hasPerms(userrole, "homework", "create") && (
                                    <td className="flex m-auto text-center justify-center">
                                        <a className="cursor-pointer mr-2" onClick={() => handleEdit(index)}>
                                            <FaRegEdit/>
                                        </a>
                                        <a className="cursor-pointer" onClick={() => handleDelete(index)}>
                                            <MdOutlineDeleteOutline/>
                                        </a>
                                    </td>
                                )}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </IconContext.Provider>
                {deleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-base-300 p-6 rounded-lg">
                            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
                            <p>Are you sure you want to delete this homework?</p>
                            <div className="modal-action mt-4">
                                <button className="btn btn-error" onClick={confirmDelete}>
                                    Delete
                                </button>
                                <button className="btn" onClick={() => setDeleteModal(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {editModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-base-300 p-6 rounded-lg w-96">
                            <h3 className="text-lg font-bold mb-4">Edit Homework</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block mb-1">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={editFormData.subject}
                                        onChange={handleEditFormChange}
                                        className="input input-bordered w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1">Deadline</label>
                                    <input
                                        type="date"
                                        name="deadline"
                                        value={new Date(editFormData.deadline * 1000).toISOString().split('T')[0]}
                                        onChange={e => {
                                            const date = new Date(e.target.value);
                                            date.setHours(12, 0, 0, 0);
                                            setEditFormData(prev => ({
                                                ...prev,
                                                deadline: Math.floor(date.getTime() / 1000)
                                            }));
                                        }}
                                        className="input input-bordered w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={editFormData.description}
                                        onChange={handleEditFormChange}
                                        className="textarea textarea-bordered w-full"
                                    />
                                </div>
                                <div className="modal-action">
                                    <button className="btn btn-primary" onClick={confirmEdit}>
                                        Save
                                    </button>
                                    <button className="btn" onClick={() => setEditModal(false)}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {createModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-base-300 p-6 rounded-lg w-96">
                            <h3 className="text-lg font-bold mb-4">Create Homework</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block mb-1">Subject</label>
                                    <input
                                        type="text"
                                        value={newHomework.subject}
                                        onChange={e => setNewHomework(prev => ({
                                            ...prev,
                                            subject: e.target.value
                                        }))}
                                        className="input input-bordered w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1">Deadline</label>
                                    <input
                                        type="date"
                                        value={new Date(newHomework.deadline * 1000).toISOString().split('T')[0]}
                                        onChange={e => {
                                            const date = new Date(e.target.value);
                                            date.setHours(12, 0, 0, 0);
                                            setNewHomework(prev => ({
                                                ...prev,
                                                deadline: Math.floor(date.getTime() / 1000)
                                            }));
                                        }}
                                        className="input input-bordered w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1">Description</label>
                                    <textarea
                                        value={newHomework.description}
                                        onChange={e => setNewHomework(prev => ({
                                            ...prev,
                                            description: e.target.value
                                        }))}
                                        className="textarea textarea-bordered w-full"
                                    />
                                </div>
                                <div className="modal-action">
                                    <button className="btn btn-primary" onClick={handleCreate}>
                                        Create
                                    </button>
                                    <button className="btn" onClick={() => setCreateModal(false)}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    } else if(loading) {
        return (
            <div className="min-w-full w-full ml-5">
                <h1 className="text-5xl text-amber-400 mb-10">Homework</h1>
                <h1 className="text-3xl">Loading...</h1>
            </div>
        )
    } else if (!hasPerms(userrole, "homework", "view")) {
        return (
            <>
                <div className="min-w-full w-full ml-5">
                    <h1 className="text-5xl text-amber-400 mb-10">Dashboard</h1>
                    <h1 className="text-3xl">Access restricted</h1>
                </div>
            </>
        )
    } else {
        return (
            <>
                <div className="min-w-full w-full ml-5">
                    <h1 className="text-5xl text-amber-400 mb-10">Dashboard</h1>
                    <SignedIn>
                        <h1 className="text-3xl">An error accorded</h1>
                    </SignedIn>
                    <SignedOut>
                        <h1 className="text-3xl">Access restricted</h1>
                    </SignedOut>
                </div>
            </>
        )
    }
}