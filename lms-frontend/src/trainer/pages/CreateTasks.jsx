import { useState } from "react";
import Sidebar from "../../shared/components/Sidebar";
import Navbar from "../../shared/components/Navbar";
import api from "../../api/axios";
import "../styles/trainer.css";
import "../../shared/styles/sidebar.css";

export default function CreateTask() {
    const [form, setForm] = useState({
        title: "",
        description: "",
        dueDate: ""
    });

    const handleCreate = async () => {
        try {
            await api.post("/api/trainer-tasks", {
                title: form.title,
                description: form.description,
                dueDate: form.dueDate
            });

            alert("Task Created Successfully");

            setForm({
                title: "",
                description: "",
                dueDate: ""
            });

        } catch (err) {
            console.log(err);
            alert("Failed to create task");
        }
    };

    return (
        <div className="trainer-layout">
            {/* Sidebar tracks its open state internally via its toggle button layer */}
            <Sidebar role="TRAINER" />

            {/* Main content area shifts fluidly based on the sibling selector (.sidebar.open + .trainer-main) */}
            <div className="trainer-main">
                <Navbar />
                
                {/* Unique scoped container class with clean layout padding */}
                <div className="trainer-content">
                    <div className="create-task-content-wrapper">
                        <h2 className="create-task-main-heading">Create Task</h2>

                        {/* Unique scoped form box */}
                        <div className="create-task-glass-card">
                            
                            {/* Title Input */}
                            <input
                                type="text"
                                className="create-task-input-field"
                                placeholder="Task Title"
                                value={form.title}
                                onChange={(e) =>
                                    setForm({ ...form, title: e.target.value })
                                }
                            />

                            {/* Description Input */}
                            <textarea
                                className="create-task-textarea-field"
                                placeholder="Description"
                                value={form.description}
                                onChange={(e) =>
                                    setForm({ ...form, description: e.target.value })
                                }
                                style={{
                                    width: "100%",
                                    minHeight: "120px",
                                    padding: "12px",
                                    border: "1px solid #cbd5e1",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    fontFamily: "inherit",
                                    boxSizing: "border-box",
                                    resize: "vertical"
                                }}
                            />

                            {/* Due Date Row */}
                            <div className="create-task-form-row">
                                <label className="create-task-field-label">Due Date:</label>
                                <input
                                    type="date"
                                    className="create-task-input-field"
                                    value={form.dueDate}
                                    onChange={(e) =>
                                        setForm({ ...form, dueDate: e.target.value })
                                    }
                                />
                            </div>

                            <button className="create-task-submit-btn" onClick={handleCreate}>
                                Create Task
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}