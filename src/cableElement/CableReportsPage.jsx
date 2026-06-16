import { useState } from "react";

export default function CableReportsPage() {
  const [password, setPassword] = useState("");
  const [reports, setReports] = useState([]);
  const [selected, setSelected] = useState("");

  const [loadingReports, setLoadingReports] = useState(false);
  const [downloadingJournal, setDownloadingJournal] = useState(false);
  const [downloadingReport, setDownloadingReport] = useState(false);

  const loadReports = async () => {
    try {
      setLoadingReports(true);

      const response = await fetch(
        `/api/cable/reports?code=${password}`
      );

      const data = await response.json();
      setReports(data);
    } finally {
      setLoadingReports(false);
    }
  };

  const downloadJournal = async () => {
    try {
      setDownloadingJournal(true);

      const response = await fetch(
        `/api/cable/download?code=${password}`
      );

      const blob = await response.blob();

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "Кабельный журнал.xlsx";
      a.click();

      URL.revokeObjectURL(url);
    } finally {
      setDownloadingJournal(false);
    }
  };

  const downloadReport = async () => {
    if (!selected) return;

    try {
      setDownloadingReport(true);

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

      URL.revokeObjectURL(url);
    } finally {
      setDownloadingReport(false);
    }
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

      <br />
      <br />

      <button
        onClick={downloadJournal}
        disabled={downloadingJournal}
      >
        {downloadingJournal
          ? "Загрузка..."
          : "Скачать Кабельный журнал"}
      </button>

      <br />
      <br />

      <button
        onClick={loadReports}
        disabled={loadingReports}
      >
        {loadingReports
          ? "Загрузка..."
          : "Загрузить отчёты"}
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

      <button
        onClick={downloadReport}
        disabled={!selected || downloadingReport}
      >
        {downloadingReport
          ? "Загрузка..."
          : "Скачать отчёт"}
      </button>
    </div>
  );
}