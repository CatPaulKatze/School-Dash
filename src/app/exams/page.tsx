"use client";

import axios from "axios";
import {examdataint} from "../../interfaces/examdata.ts";
import {useEffect, useState} from "react";
import unix from "../../components/unix.ts"
import { IconContext } from "react-icons";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useUser } from "@clerk/nextjs";
import { hasPerms } from "../../components/auth";
import { Role, User } from "../../interfaces/authint";

export default function Homework() {

    const defaultexam:examdataint[] = [
        {
            _id: "",
            subject: "",
            type: "",
            day: 0,
            description: ""
        }
    ]

    const [exam, setexam] = useState(defaultexam);
    const [access, setaccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const sortedExams = [...exam].sort((a, b) => a.day - b.day);
    const {user} = useUser();
    const userrole: User = { id: user?.id ?? "", roles: (user?.publicMetadata.roles as Role[]) ?? [] }
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
    const [editModal, setEditModal] = useState(false);
    const [editFormData, setEditFormData] = useState<examdataint>({
        _id: '',
        subject: '',
        type: '',
        day: Math.floor(new Date().setHours(12, 0, 0, 0) / 1000),
        description: ''
    });
    const [createModal, setCreateModal] = useState(false);
    const [newExam, setNewExam] = useState<examdataint>({
        subject: '',
        type: '',
        day: Math.floor(new Date().setHours(12, 0, 0, 0) / 1000),
        description: ''
    });

    useEffect(() => {
        async function getdata() {
            const fetch = await axios.get("/api/exams")
            const data = await fetch.data;
            if (!data.error) {
                setaccess(true);
                setexam(data)
            } else {
                setaccess(false);
            }
            setLoading(false)
        }

        getdata()
    }, []);

    const handleEdit = (index: number) => {
        const sortedItem = sortedExams[index];
        const originalIndex = exam.findIndex(item => item._id === sortedItem._id);
        const examItem = exam[originalIndex];

        const dayDate = new Date(examItem.day * 1000);
        dayDate.setHours(12, 0, 0, 0);

        setEditFormData({
            ...examItem,
            day: Math.floor(dayDate.getTime() / 1000)
        });
        setEditModal(true);
    };

    const handleDelete = (index: number) => {
        const sortedItem = sortedExams[index];
        const originalIndex = exam.findIndex(item => item._id === sortedItem._id);
        setDeleteIndex(originalIndex);
        setDeleteModal(true);
    };

    const confirmEdit = async () => {
        try {
            await axios.patch(`/api/exams/${editFormData._id}`, editFormData);
            setexam(prevExam => prevExam.map(item =>
                item._id === editFormData._id ? editFormData : item
            ));
            setEditModal(false);
        } catch (error) {
            console.error('Failed to update exam:', error);
        }
    };

    const confirmDelete = async () => {
        if (deleteIndex === null) return;

        try {
            const examItem = exam[deleteIndex];
            await axios.delete(`/api/exams/${examItem._id}`);
            setexam(prevExam => prevExam.filter((_, i) => i !== deleteIndex));
        } catch (error) {
            console.error('Failed to delete exam:', error);
        }

        setDeleteModal(false);
        setDeleteIndex(null);
    };

    const handleCreate = async () => {
        try {
            const response = await axios.post('/api/exams', newExam);
            setexam(prevExam => [...prevExam, response.data]);
            setCreateModal(false);
            setNewExam({
                subject: '',
                type: '',
                day: Math.floor(new Date().setHours(12, 0, 0, 0) / 1000),
                description: ''
            });
        } catch (error) {
            console.error('Failed to create exam:', error);
        }
    };


            if (access) {
        return (
            <div className="ml-5 mr-5">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-5xl text-amber-400">Exams</h1>
                    {hasPerms(userrole, "exams", "create") && (
                        <button className="btn btn-primary" onClick={() => setCreateModal(true)}>
                            Create Exam
                        </button>
                    )}
                </div>

                <IconContext.Provider value={{ color: "white", className: "w-5 h-5" }}>
                    <table className="table-fixed w-full pr-14">
                        <thead>
                        <tr>
                            <th className="w-[7%]">Priority</th>
                            <th className="w-[13%]">Subject</th>
                            <th className="w-[10%]">Type</th>
                            <th className="w-[20%]">Day</th>
                            <th className="w-[40%]">Description</th>
                            {hasPerms(userrole, "exams", "create") && (
                                <th className="w-[10%]">Actions</th>
                            )}
                        </tr>
                        </thead>
                        <tbody>
                        {sortedExams.map((exami, index) => (
                            <tr key={index} className="bg-base-200 text-center">
                                <td>{index + 1}</td>
                                <td>{exami.subject}</td>
                                <td>{exami.type}</td>
                                <td>{unix(exami.day)}</td>
                                <td>{exami.description}</td>
                                {hasPerms(userrole, "exams", "create") && (
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
                            <p>Are you sure you want to delete this exam?</p>
                            <div className="modal-action mt-4">
                                <button className="btn btn-error" onClick={confirmDelete}>Delete</button>
                                <button className="btn" onClick={() => setDeleteModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                {editModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-base-300 p-6 rounded-lg w-96">
                            <h3 className="text-lg font-bold mb-4">Edit Exam</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block mb-1">Subject</label>
                                    <input
                                        type="text"
                                        value={editFormData.subject}
                                        onChange={e => setEditFormData(prev => ({...prev, subject: e.target.value}))}
                                        className="input input-bordered w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1">Type</label>
                                    <input
                                        type="text"
                                        value={editFormData.type}
                                        onChange={e => setEditFormData(prev => ({...prev, type: e.target.value}))}
                                        className="input input-bordered w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1">Day</label>
                                    <input
                                        type="date"
                                        value={new Date(editFormData.day * 1000).toISOString().split('T')[0]}
                                        onChange={e => {
                                            const date = new Date(e.target.value);
                                            date.setHours(12, 0, 0, 0);
                                            setEditFormData(prev => ({
                                                ...prev,
                                                day: Math.floor(date.getTime() / 1000)
                                            }));
                                        }}
                                        className="input input-bordered w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1">Description</label>
                                    <textarea
                                        value={editFormData.description}
                                        onChange={e => setEditFormData(prev => ({...prev, description: e.target.value}))}
                                        className="textarea textarea-bordered w-full"
                                    />
                                </div>
                                <div className="modal-action">
                                    <button className="btn btn-primary" onClick={confirmEdit}>Save</button>
                                    <button className="btn" onClick={() => setEditModal(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {createModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-base-300 p-6 rounded-lg w-96">
                            <h3 className="text-lg font-bold mb-4">Create Exam</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block mb-1">Subject</label>
                                    <input
                                        type="text"
                                        value={newExam.subject}
                                        onChange={e => setNewExam(prev => ({...prev, subject: e.target.value}))}
                                        className="input input-bordered w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1">Type</label>
                                    <input
                                        type="text"
                                        value={newExam.type}
                                        onChange={e => setNewExam(prev => ({...prev, type: e.target.value}))}
                                        className="input input-bordered w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1">Day</label>
                                    <input
                                        type="date"
                                        value={new Date(newExam.day * 1000).toISOString().split('T')[0]}
                                        onChange={e => {
                                            const date = new Date(e.target.value);
                                            date.setHours(12, 0, 0, 0);
                                            setNewExam(prev => ({
                                                ...prev,
                                                day: Math.floor(date.getTime() / 1000)
                                            }));
                                        }}
                                        className="input input-bordered w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1">Description</label>
                                    <textarea
                                        value={newExam.description}
                                        onChange={e => setNewExam(prev => ({...prev, description: e.target.value}))}
                                        className="textarea textarea-bordered w-full"
                                    />
                                </div>
                                <div className="modal-action">
                                    <button className="btn btn-primary" onClick={handleCreate}>Create</button>
                                    <button className="btn" onClick={() => setCreateModal(false)}>Cancel</button>
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
                <h1 className="text-5xl text-amber-400 mb-10">Exams</h1>
                <h1 className="text-3xl">Loading...</h1>
            </div>
        )
    } else {
        return (
            <div className="min-w-full w-full ml-5">
                <h1 className="text-5xl text-amber-400 mb-10">Exams</h1>
                <h1 className="text-3xl">Access restricted</h1>
            </div>
        )
    }
}