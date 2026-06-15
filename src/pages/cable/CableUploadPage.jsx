import { useEffect, useState } from "react"

export default function CableUploadPage() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const upload = async (endpoint) => {
    if (!file) {
      setMessage("Выберите файл");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("code", password);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const text = await response.text();
      setMessage(text);
    } catch (e) {
      setMessage(e.message);
    }
  };

  return (
    <div>
      <h1>Загрузка excel файлов </h1>

      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /> <br />

      <input
        type="file"
        accept=".xlsx,.xlsm"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /> <br />

      <button onClick={() => upload("/api/cable/upload")} >
        Загрузить Кабельный
      </button>

      <button onClick={() => upload("/api/cable/upload1")} >
        Загрузить Склад
      </button>

      <button onClick={() => upload("/api/cable/upload2")} >
        Загрузить Замену марки
      </button>

      <p>{message}</p>
    </div>
  );
}















