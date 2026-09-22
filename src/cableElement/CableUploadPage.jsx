import { useState } from "react";
import "./CableUploadPage.css";

const API_BASE = "/api/cable";

export default function CableUploadPage({ uploadPassword }) {
  const [cableFile, setCableFile] = useState(null);
  const [warehouseFile, setWarehouseFile] = useState(null);
  const [indexReplaceFile, setIndexReplaceFile] = useState(null);
  const [cableWordFile, setCableWordFile] = useState(null);

  const [status, setStatus] = useState("Готово");

  const getUploadPassword = () => {
    const password = uploadPassword.trim();

    if (!password) {
      window.alert("Введите пароль загрузки");
      return null;
    }

    return password;
  };

  const uploadFile = async (url, file, code) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("code", code);

    const response = await fetch(`${API_BASE}${url}`, {
      method: "POST",
      body: formData,
    });

    const text = await response.text();

    if (!response.ok) {
      throw new Error(text);
    }

    return text;
  };

  const handleUpload = async ({
    file,
    endpoint,
    loadingMessage,
    noFileMessage,
  }) => {
    if (!file) {
      window.alert(noFileMessage);
      return;
    }

    const code = getUploadPassword();

    if (!code) {
      return;
    }

    try {
      setStatus(loadingMessage);

      const result = await uploadFile(endpoint, file, code);

      setStatus(result);
    } catch (error) {
      setStatus(`Ошибка: ${error.message}`);
    }
  };

  return (
    <details className="section cable-upload-section">
      <summary>Загрузка файлов</summary>

      <div className="section-content">

        <div className="upload-row">
          <label htmlFor="cableFile">
            Кабельная ведомость Excel:
          </label>

          <input
            type="file"
            id="cableFile"
            accept=".xlsx,.xls"
            onChange={(event) =>
              setCableFile(event.target.files?.[0] ?? null)
            }
          />

          <button
            type="button"
            onClick={() =>
              handleUpload({
                file: cableFile,
                endpoint: "/upload",
                loadingMessage:
                  "Загрузка кабельной ведомости...",
                noFileMessage: "Выберите файл",
              })
            }
          >
            Загрузить
          </button>
        </div>

        <div className="upload-row">
          <label htmlFor="warehouseFile">
            Склад Excel:
          </label>

          <input
            type="file"
            id="warehouseFile"
            accept=".xlsx,.xls"
            onChange={(event) =>
              setWarehouseFile(event.target.files?.[0] ?? null)
            }
          />

          <button
            type="button"
            onClick={() =>
              handleUpload({
                file: warehouseFile,
                endpoint: "/upload1",
                loadingMessage: "Загрузка склада...",
                noFileMessage: "Выберите файл",
              })
            }
          >
            Загрузить
          </button>
        </div>

        <div className="upload-row">
          <label htmlFor="indexReplaceFile">
            Замена индексов Excel:
          </label>

          <input
            type="file"
            id="indexReplaceFile"
            accept=".xlsx,.xls"
            onChange={(event) =>
              setIndexReplaceFile(event.target.files?.[0] ?? null)
            }
          />

          <button
            type="button"
            onClick={() =>
              handleUpload({
                file: indexReplaceFile,
                endpoint: "/upload2",
                loadingMessage:
                  "Загрузка замены индексов...",
                noFileMessage: "Выберите файл",
              })
            }
          >
            Загрузить
          </button>
        </div>

        <div className="upload-row">
          <label htmlFor="cableWordFile">
            Кабельный журнал Word:
          </label>

          <input
            type="file"
            id="cableWordFile"
            accept=".docx,.doc"
            onChange={(event) =>
              setCableWordFile(event.target.files?.[0] ?? null)
            }
          />

          <button
            type="button"
            onClick={() =>
              handleUpload({
                file: cableWordFile,
                endpoint: "/uploadCableWord",
                loadingMessage:
                  "Загрузка кабельного журнала...",
                noFileMessage: "Выберите Word-файл",
              })
            }
          >
            Загрузить
          </button>
        </div>

        <div className="cable-upload-status">
          {status}
        </div>

      </div>
    </details>
  );
}