import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function AddThread() {

    //const API_URL = "http://localhost:8080"
    const API_URL = "/api"
    const navigate = useNavigate()
    
    const [form, setForm] = useState({
        thread: "",
        text: ""
    })

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault()

        fetch(`${API_URL}/thread/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        })
        .then(res => res.json())
        .then(data => {
            console.log("Created:", data)
            setForm({ thread: "", text: "" })
            navigate(`/thread/${data.id}`)
        })
        .catch(console.error)
    }

    return (
        <form 
            onSubmit={handleSubmit} 
            style={{ margin: 15, width: "500px", display: "flex", flexDirection: "column", gap: "10px" }}
        >
            <div style={{ display: "flex"}}>
                <input
                    type="text"
                    name="thread"
                    placeholder="Тема"
                    value={form.thread}
                    onChange={handleChange}
                    style={{ flex: 1 }}
                />

                <button type="submit">Add</button>
            </div>

            <textarea
                name="text"
                placeholder="Сообщение"
                value={form.text}
                onChange={handleChange}
                rows={5}
            />

        </form>
    )
}