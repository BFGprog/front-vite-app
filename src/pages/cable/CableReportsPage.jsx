import { useState } from "react";

export default function CableReportsPage() {
  const [password, setPassword] = useState("");
  const [reports, setReports] = useState([]);
  const [selected, setSelected] = useState("");

  const loadReports = async () => {
    const response = await fetch(
      `/api/cable/reports?code=${password}`
    );

    const data = await response.json();
    setReports(data);
  };

  const downloadJournal = async () => {
    const response = await fetch(
      `/api/cable/download?code=${password}`
    );

    const blob = await response.blob();

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "journal.xlsx";
    a.click();
  };

  const downloadReport = async () => {
    const response = await fetch(
      `/api/cable/dynamic/${selected}?code=${password}`
    );

    const blob = await response.blob();

    const url = URL.createObjectURL(blob);

    const report = reports.find(
      (r) => String(r.id) === String(selected)
    );

    const a = document.createElement("a");
    a.href = url;
    a.download = `${report?.name || "report"}.xlsx`;
    a.click();
  };

  return (
    <div>
      <h1>Отчёты</h1>

      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /> <br />

      <button onClick={downloadJournal}>
        Скачать Кабельный журнал
      </button>

      <br /><br />

      <button onClick={loadReports}>
        Загрузить отчёты
      </button>

      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        <option value="">Выберите отчёт</option>

        {reports.map((r) => (
          <option key={r.id} value={r.id}>
            {r.id} - {r.name}
          </option>
        ))}
      </select>

      <button onClick={downloadReport}>
        Скачать отчёт
      </button>
    </div>
  );
}