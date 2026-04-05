import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

export default function AddComment({ threadId, onAdd }) {
    //const API_URL = "http://localhost:8080"
    const API_URL = "/api"
    const navigate = useNavigate()

    const [form, setForm] = useState({
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

        fetch(`${API_URL}/thread/${threadId}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        })
        .then(res => /*res.json())*/{
            if (!res.ok) {
            throw new Error("Thread not found")
            }
            return res.json()
        })
        .then(data => {
            console.log("Created:", data)
            setForm({ text: "" })
            if (onAdd) {
                onAdd(data)
            }
        })
        .catch(err => {
            console.error(err)
            navigate("/404")
        })
    }

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
            <textarea
                name="text"
                placeholder="Комментарий"
                value={form.text}
                onChange={handleChange}
                rows={3}
                style={{ width: "100%" }}
            />
            <button type="submit">Отправить</button>
        </form>
    )
}