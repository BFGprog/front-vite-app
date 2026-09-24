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
      throw new Error(text || "Ошибка загрузки файла");
    }

    return text;
  };

  
  const uploadCableWord = async (file, code) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("code", code);

    const response = await fetch(
      `${API_BASE}/uploadCableWord`,
      {
        method: "POST",
        body: formData,
      }
    );

    
    if (!response.ok) {
      const text = await response.text();

      throw new Error(
        text || "Ошибка обработки кабельного журнала"
      );
    }

    
    const blob = await response.blob();

    
    let fileName = "cable_journal.xlsx";

    const disposition =
      response.headers.get("Content-Disposition");

    if (disposition) {
      
      const utf8Match = disposition.match(
        /filename\*=UTF-8''([^;]+)/i
      );

      if (utf8Match) {
        try {
          fileName = decodeURIComponent(
            utf8Match[1]
          );
        } catch {
          fileName = utf8Match[1];
        }
      } else {
        
        const normalMatch =
          disposition.match(
            /filename="?([^"]+)"?/i
          );

        if (normalMatch) {
          fileName = normalMatch[1];
        }
      }
    }

    
    const downloadUrl =
      window.URL.createObjectURL(blob);

      
    const link =
      document.createElement("a");

    link.href = downloadUrl;
    link.download = fileName;
    link.style.display = "none";

    document.body.appendChild(link);

    
    link.click();

    
    document.body.removeChild(link);

    
    setTimeout(() => {
      window.URL.revokeObjectURL(downloadUrl);
    }, 1000);

    return "Кабельный журнал обработан. Excel-файл скачан.";
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

      const result =
        await uploadFile(
          endpoint,
          file,
          code
        );

      setStatus(result);
    } catch (error) {
      console.error(error);

      setStatus(
        `Ошибка: ${
          error?.message ||
          "Неизвестная ошибка"
        }`
      );
    }
  };

  
  const handleCableWordUpload = async () => {
    if (!cableWordFile) {
      window.alert("Выберите Word-файл");
      return;
    }

    const code = getUploadPassword();

    if (!code) {
      return;
    }

    try {
      setStatus(
        "Загрузка кабельного журнала..."
      );

      const result =
        await uploadCableWord(
          cableWordFile,
          code
        );

      setStatus(result);
    } catch (error) {
      console.error(error);

      setStatus(
        `Ошибка: ${
          error?.message ||
          "Ошибка обработки кабельного журнала"
        }`
      );
    }
  };

  return (
    <details className="section cable-upload-section">
      <summary>Загрузка файлов</summary>

      <div className="section-content">

        {/* ========================= */}
        {/* КАБЕЛЬНАЯ ВЕДОМОСТЬ */}
        {/* ========================= */}

        <div className="upload-row">
          <label htmlFor="cableFile">
            Кабельная ведомость Excel:
          </label>

          <input
            type="file"
            id="cableFile"
            accept=".xlsx,.xls"
            onChange={(event) =>
              setCableFile(
                event.target.files?.[0] ?? null
              )
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
                noFileMessage:
                  "Выберите файл",
              })
            }
          >
            Загрузить
          </button>
        </div>

        {/* ========================= */}
        {/* СКЛАД */}
        {/* ========================= */}

        <div className="upload-row">
          <label htmlFor="warehouseFile">
            Склад Excel:
          </label>

          <input
            type="file"
            id="warehouseFile"
            accept=".xlsx,.xls"
            onChange={(event) =>
              setWarehouseFile(
                event.target.files?.[0] ?? null
              )
            }
          />

          <button
            type="button"
            onClick={() =>
              handleUpload({
                file: warehouseFile,
                endpoint: "/upload1",
                loadingMessage:
                  "Загрузка склада...",
                noFileMessage:
                  "Выберите файл",
              })
            }
          >
            Загрузить
          </button>
        </div>

        {/* ========================= */}
        {/* ЗАМЕНА ИНДЕКСОВ */}
        {/* ========================= */}

        <div className="upload-row">
          <label htmlFor="indexReplaceFile">
            Замена индексов Excel:
          </label>

          <input
            type="file"
            id="indexReplaceFile"
            accept=".xlsx,.xls"
            onChange={(event) =>
              setIndexReplaceFile(
                event.target.files?.[0] ?? null
              )
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
                noFileMessage:
                  "Выберите файл",
              })
            }
          >
            Загрузить
          </button>
        </div>

        {/* ========================= */}
        {/* WORD → EXCEL */}
        {/* ========================= */}

        <div className="upload-row">
          <label htmlFor="cableWordFile">
            Кабельный журнал Word:
          </label>

          <input
            type="file"
            id="cableWordFile"
            accept=".docx,.doc"
            onChange={(event) =>
              setCableWordFile(
                event.target.files?.[0] ?? null
              )
            }
          />

          <button
            type="button"
            onClick={handleCableWordUpload}
          >
            Загрузить
          </button>
        </div>

        {/* ========================= */}
        {/* СТАТУС */}
        {/* ========================= */}

        <div className="cable-upload-status">
          {status}
        </div>

      </div>
    </details>
  );
}