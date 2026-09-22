import { useState } from "react";
import "./CableReportsPage.css";

const API_BASE = "/api/cable";

const REPORT_INITIAL_FORM = {
  name: "",
  num: "",
  type: "",
  query: "",
};  




const PARAM_INITIAL_FORM = {
  code: "",
  name: "",
  num: "",
  type: "1",
};

export default function CableReportsPage() {
  

  const [reportPassword, setReportPassword] = useState("");
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedParam, setSelectedParam] = useState(null);
  

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportEditMode, setReportEditMode] = useState(false);
  const [reportForm, setReportForm] = useState(REPORT_INITIAL_FORM);
  

  const [showParamModal, setShowParamModal] = useState(false);
  const [paramEditMode, setParamEditMode] = useState(false);
  const [paramForm, setParamForm] = useState(PARAM_INITIAL_FORM);
  

  const [paramValues, setParamValues] = useState({});

  
  const [status, setStatus] = useState("");
  const [loadingReports, setLoadingReports] = useState(false);
  const [savingReport, setSavingReport] = useState(false);
  const [deletingReport, setDeletingReport] = useState(false);
  const [savingParam, setSavingParam] = useState(false);
  const [deletingParam, setDeletingParam] = useState(false);
  const [downloadingReport, setDownloadingReport] = useState(false);
  

  const getPassword = () => {
    const password = reportPassword.trim();

    if (!password) {
      window.alert("Введите пароль отчета");
      return null;
    }

    return password;
  };

  const setReportField = (field, value) => {
    setReportForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const setParamField = (field, value) => {
    setParamForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getErrorMessage = async (response) => {
    try {
      const text = await response.text();

      if (text) {
        return text;
      }
    } catch {
      
    }

    return `HTTP ${response.status}`;
  };

  const getFilenameFromResponse = (response, defaultFilename) => {
    const disposition = response.headers.get("Content-Disposition");

    if (!disposition) {
      return defaultFilename;
    }

    const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);

    if (utf8Match) {
      try {
        return decodeURIComponent(utf8Match[1]);
      } catch {
        return utf8Match[1];
      }
    }

    const filenameMatch = disposition.match(/filename="?([^"]+)"?/i);

    if (filenameMatch) {
      return filenameMatch[1];
    }

    return defaultFilename;
  };

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  
  const loadReports = async (preserveReportId = null) => {
    const password = getPassword();

    if (!password) {
      return false;
    }

    setLoadingReports(true);
    setStatus("Загрузка отчетов...");

    try {
      const response = await fetch(
        `${API_BASE}/reports?code=${encodeURIComponent(password)}`
      );

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const data = await response.json();

      setReports(data);

      const reportIdToPreserve =
        preserveReportId ?? selectedReport?.id ?? null;

      if (reportIdToPreserve !== null) {
        const newSelectedReport = data.find(
          (report) => report.id === reportIdToPreserve
        );

        setSelectedReport(newSelectedReport ?? null);
      } else {
        setSelectedReport(null);
      }

      setSelectedParam(null);
      setParamValues({});

      setStatus("Отчеты загружены");

      return true;
    } catch (error) {
      setStatus(`Ошибка: ${error.message}`);
      return false;
    } finally {
      setLoadingReports(false);
    }
  };

  
  const handleSelectReport = (report) => {
    setSelectedReport(report);
    setSelectedParam(null);
    setParamValues({});
  };

  
  const handleAddReport = () => {
    setReportEditMode(false);
    setReportForm(REPORT_INITIAL_FORM);
    setShowReportModal(true);
  };

  const handleEditReport = () => {
    if (!selectedReport) {
      window.alert("Выберите отчет");
      return;
    }

    setReportEditMode(true);

    setReportForm({
      name: selectedReport.name ?? "",
      num: selectedReport.num ?? "",
      type: selectedReport.type ?? "",
      query: selectedReport.query ?? "",
    });

    setShowReportModal(true);
  };

  const handleCancelReport = () => {
    setShowReportModal(false);
    setReportForm(REPORT_INITIAL_FORM);
  };

  const handleSaveReport = async () => {
    const name = reportForm.name.trim();
    const num = String(reportForm.num).trim();
    const type = String(reportForm.type).trim();
    const query = reportForm.query.trim();

    if (!name || !query) {
      window.alert("Заполните все поля Наименования и Запроса");
      return;
    }

    const password = getPassword();

    if (!password) {
      return;
    }

    setSavingReport(true);

    try {
      const isEdit = reportEditMode;

      const url = isEdit
        ? `${API_BASE}/reports/${selectedReport.id}?code=${encodeURIComponent(
            password
          )}`
        : `${API_BASE}/reports?code=${encodeURIComponent(password)}`;

      const response = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          num: Number(num),
          type: Number(type),
          query,
        }),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const reportId = isEdit ? selectedReport.id : null;

      setShowReportModal(false);
      setReportForm(REPORT_INITIAL_FORM);

      setStatus(isEdit ? "Отчет изменен" : "Отчет добавлен");

      await loadReports(reportId);
    } catch (error) {
      setStatus(`Ошибка: ${error.message}`);
    } finally {
      setSavingReport(false);
    }
  };

  const handleDeleteReport = async () => {
    if (!selectedReport) {
      window.alert("Выберите отчет");
      return;
    }

    const confirmed = window.confirm(
      `Удалить отчет "${selectedReport.name}"?`
    );

    if (!confirmed) {
      return;
    }

    const password = getPassword();

    if (!password) {
      return;
    }

    setDeletingReport(true);

    try {
      const response = await fetch(
        `${API_BASE}/reports/${
          selectedReport.id
        }?code=${encodeURIComponent(password)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const responseText = await response.text();

      setSelectedReport(null);
      setSelectedParam(null);
      setParamValues({});

      setStatus(responseText || "Отчет удален");

      await loadReports();
    } catch (error) {
      setStatus(`Ошибка: ${error.message}`);
    } finally {
      setDeletingReport(false);
    }
  };

  
  const handleAddParam = () => {
    if (!selectedReport) {
      window.alert("Выберите отчет");
      return;
    }

    setParamEditMode(false);
    setParamForm(PARAM_INITIAL_FORM);
    setShowParamModal(true);
  };

  const handleEditParam = () => {
    if (!selectedReport) {
      window.alert("Выберите отчет");
      return;
    }

    if (!selectedParam) {
      window.alert("Выберите параметр");
      return;
    }

    setParamEditMode(true);

    setParamForm({
      code: selectedParam.code ?? "",
      name: selectedParam.name ?? "",
      num: selectedParam.num ?? "",
      type: String(selectedParam.type ?? 1),
    });

    setShowParamModal(true);
  };

  const handleCancelParam = () => {
    setShowParamModal(false);
    setParamForm(PARAM_INITIAL_FORM);
  };

  const handleSaveParam = async () => {
    if (!selectedReport) {
      window.alert("Выберите отчет");
      return;
    }

    const code = paramForm.code.trim();
    const name = paramForm.name.trim();
    const num = String(paramForm.num).trim();
    const type = Number(paramForm.type);

    if (!code || !name || !num) {
      window.alert("Заполните все поля");
      return;
    }

    if (!Number.isInteger(type) || type < 1 || type > 6) {
      window.alert("Тип параметра должен быть от 1 до 6");
      return;
    }

    const password = getPassword();

    if (!password) {
      return;
    }

    setSavingParam(true);

    try {
      const isEdit = paramEditMode;

      const url = isEdit
        ? `${API_BASE}/reports/${selectedReport.id}/param/${
            selectedParam.id
          }?code=${encodeURIComponent(password)}`
        : `${API_BASE}/reports/${
            selectedReport.id
          }/param?code=${encodeURIComponent(password)}`;

      const response = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          name,
          num: Number(num),
          type,
        }),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      setShowParamModal(false);
      setParamForm(PARAM_INITIAL_FORM);
      setSelectedParam(null);

      setStatus(isEdit ? "Параметр изменен" : "Параметр добавлен");

      await loadReports(selectedReport.id);
    } catch (error) {
      setStatus(`Ошибка: ${error.message}`);
    } finally {
      setSavingParam(false);
    }
  };

  const handleDeleteParam = async () => {
    if (!selectedReport) {
      window.alert("Выберите отчет");
      return;
    }

    if (!selectedParam) {
      window.alert("Выберите параметр");
      return;
    }

    const confirmed = window.confirm(
      `Удалить параметр "${selectedParam.name}"?`
    );

    if (!confirmed) {
      return;
    }

    const password = getPassword();

    if (!password) {
      return;
    }

    setDeletingParam(true);

    try {
      const response = await fetch(
        `${API_BASE}/reports/${selectedReport.id}/param/${
          selectedParam.id
        }?code=${encodeURIComponent(password)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const responseText = await response.text();

      setSelectedParam(null);

      setStatus(responseText || "Параметр удален");

      await loadReports(selectedReport.id);
    } catch (error) {
      setStatus(`Ошибка: ${error.message}`);
    } finally {
      setDeletingParam(false);
    }
  };

  
  const handleParamValueChange = (paramId, value) => {
    setParamValues((prev) => ({
      ...prev,
      [paramId]: value,
    }));
  };

  
  const handleDownloadReport = async () => {
    if (!selectedReport) {
      window.alert("Выберите отчет");
      return;
    }

    const password = getPassword();

    if (!password) {
      return;
    }

    setDownloadingReport(true);
    setStatus("Формирование отчета...");

    try {
      const params = {};

      const reportParams = selectedReport.params ?? [];

      reportParams.forEach((param) => {
        params[param.code] = paramValues[param.id] ?? "";
      });

      const response = await fetch(
        `${API_BASE}/dynamic?code=${encodeURIComponent(password)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            queryId: selectedReport.id,
            params,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const blob = await response.blob();

      const filename = getFilenameFromResponse(
        response,
        `${selectedReport.name || "report"}.xlsx`
      );

      downloadBlob(blob, filename);

      setStatus("Отчет сформирован");
    } catch (error) {
      setStatus(`Ошибка: ${error.message}`);
    } finally {
      setDownloadingReport(false);
    }
  };

  
  const selectedReportParams = selectedReport?.params ?? [];

  return (
    <section className="cable-reports section">
      <div className="reports-header">
        <h2>Отчеты</h2>

        <input
          type="password"
          className="report-password"
          placeholder="Пароль отчета"
          value={reportPassword}
          onChange={(event) => setReportPassword(event.target.value)}
        />

        <button
          type="button"
          onClick={() => loadReports()}
          disabled={loadingReports}
        >
          {loadingReports ? "Загрузка..." : "Загрузить"}
        </button>
      </div>

      <div className="reports-layout">
        {/* 
            Левая часть — список отчетов
            Старый HTML: .reports-left
         */}

        <div className="reports-left">
          <div className="report-buttons">
            <button
              type="button"
              className="primary"
              onClick={handleAddReport}
            >
              Добавить отчет
            </button>

            <button
              type="button"
              onClick={handleEditReport}
              disabled={!selectedReport}
            >
              Изменить отчет
            </button>

            <button
              type="button"
              className="danger"
              onClick={handleDeleteReport}
              disabled={!selectedReport || deletingReport}
            >
              {deletingReport ? "Удаление..." : "Удалить отчет"}
            </button>
          </div>

          <div className="report-list">
            {reports.length === 0 ? (
              <div className="empty-message">
                {loadingReports
                  ? "Загрузка..."
                  : "Отчеты отсутствуют"}
              </div>
            ) : (
              reports.map((report) => (
                <div
                  key={report.id}
                  className={`report-item ${
                    selectedReport?.id === report.id ? "selected" : ""
                  }`}
                  onClick={() => handleSelectReport(report)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      handleSelectReport(report);
                    }
                  }}
                >
                  <div className="report-num">
                    {report.num}
                  </div>

                  <div className="report-name">
                    {report.name}
                  </div>

                  <div className="report-type">
                    {report.type}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 
            Правая часть — выбранный отчет и параметры
            Старый HTML: .reports-right
         */}

        <div className="reports-right">
          <div className="selected-report-title">
            {selectedReport
              ? `Параметры: ${selectedReport.name || ""}`
              : "Отчет не выбран"}
          </div>

          <div className="download-row">
            <button
              type="button"
              className="primary"
              onClick={handleDownloadReport}
              disabled={!selectedReport || downloadingReport}
            >
              {downloadingReport
                ? "Формирование..."
                : "Скачать выбранный отчет"}
            </button>
          </div>

          <div className="params-toolbar">
            <button
              type="button"
              onClick={handleAddParam}
              disabled={!selectedReport}
            >
              Добавить параметр
            </button>

            <button
              type="button"
              onClick={handleEditParam}
              disabled={!selectedParam}
            >
              Изменить параметр
            </button>

            <button
              type="button"
              className="danger"
              onClick={handleDeleteParam}
              disabled={!selectedParam || deletingParam}
            >
              {deletingParam ? "Удаление..." : "Удалить параметр"}
            </button>
          </div>

          <div className="params-list">
            {!selectedReport ? (
              <div className="empty-message">
                Выберите отчет
              </div>
            ) : selectedReportParams.length === 0 ? (
              <div className="empty-message">
                У отчета нет параметров
              </div>
            ) : (
              selectedReportParams.map((param) => (
                <div
                  key={param.id}
                  className={`param-item ${
                    selectedParam?.id === param.id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedParam(param)}
                >
                  <div className="param-num">
                    {param.num}
                  </div>

                  <div className="param-code">
                    {param.code}
                  </div>

                  <div
                    className="param-name"
                    title={param.name}
                  >
                    {param.name}
                  </div>

                  <div className="param-type">
                    {param.type}
                  </div>

                  <input
                    type="text"
                    className="param-value"
                    placeholder="Значение"
                    value={paramValues[param.id] ?? ""}
                    onChange={(event) =>
                      handleParamValueChange(
                        param.id,
                        event.target.value
                      )
                    }
                    onClick={(event) => event.stopPropagation()}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {status && (
        <div className="status">
          {status}
        </div>
      )}

      {/* 
          Модальное окно отчета
       */}

      {showReportModal && (
        <div
          className="modal show"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCancelReport();
            }
          }}
        >
          <div className="modal-content">
            <h2>
              {reportEditMode
                ? "Изменить отчет"
                : "Добавить отчет"}
            </h2>

            <div className="modal-form">
              <label htmlFor="reportName">
                Название:
              </label>

              <input
                id="reportName"
                type="text"
                value={reportForm.name}
                onChange={(event) =>
                  setReportField("name", event.target.value)
                }
                autoFocus
              />

              <label htmlFor="reportNum">
                Номер:
              </label>

              <input
                id="reportNum"
                type="number"
                value={reportForm.num}
                onChange={(event) =>
                  setReportField("num", event.target.value)
                }
              />

              <label htmlFor="reportType">
                Тип:
              </label>

              <input
                id="reportType"
                type="number"
                value={reportForm.type}
                onChange={(event) =>
                  setReportField("type", event.target.value)
                }
              />

              <label htmlFor="reportQuery">
                SQL запрос:
              </label>

              <textarea
                id="reportQuery"
                value={reportForm.query}
                onChange={(event) =>
                  setReportField("query", event.target.value)
                }
              />
            </div>

            <div className="modal-buttons">
              <button
                type="button"
                onClick={handleCancelReport}
                disabled={savingReport}
              >
                Отмена
              </button>

              <button
                type="button"
                className="primary"
                onClick={handleSaveReport}
                disabled={savingReport}
              >
                {savingReport
                  ? "Сохранение..."
                  : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 
          Модальное окно параметра
       */}

      {showParamModal && (
        <div
          className="modal show"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCancelParam();
            }
          }}
        >
          <div className="modal-content">
            <h2>
              {paramEditMode
                ? "Изменить параметр"
                : "Добавить параметр"}
            </h2>

            <div className="modal-form">
              <label htmlFor="paramCode">
                Код:
              </label>

              <input
                id="paramCode"
                type="text"
                value={paramForm.code}
                onChange={(event) =>
                  setParamField("code", event.target.value)
                }
                autoFocus
              />

              <label htmlFor="paramName">
                Название:
              </label>

              <input
                id="paramName"
                type="text"
                value={paramForm.name}
                onChange={(event) =>
                  setParamField("name", event.target.value)
                }
              />

              <label htmlFor="paramNum">
                Номер:
              </label>

              <input
                id="paramNum"
                type="number"
                value={paramForm.num}
                onChange={(event) =>
                  setParamField("num", event.target.value)
                }
              />

              <label htmlFor="paramType">
                Тип:
              </label>

              <select
                id="paramType"
                value={paramForm.type}
                onChange={(event) =>
                  setParamField("type", event.target.value)
                }
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
            </div>

            <div className="modal-buttons">
              <button
                type="button"
                onClick={handleCancelParam}
                disabled={savingParam}
              >
                Отмена
              </button>

              <button
                type="button"
                className="primary"
                onClick={handleSaveParam}
                disabled={savingParam}
              >
                {savingParam
                  ? "Сохранение..."
                  : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


