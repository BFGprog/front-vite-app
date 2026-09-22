import { useState } from "react";
import "./CableDocumentPage.css";

const API_BASE = "/api/cable";

const EMPTY_SHIP = {
  id: null,
  name: "",
  num: "",
  projectNum: "",
  projectName: "",
};

const EMPTY_DOCUMENT = {
  id: null,
  journalNum: "",
  notice: "",
  noticeDate: "",
  actualStatus: 0,
  documentType: 1,
  documentApprovalStage: "BEFORE_APPROVAL",
};

export default function CableDocumentPage({
    uploadPassword,
    setUploadPassword,
  }) {
    

  // Заказы
  // Старый JS:
  // let selectedShipId = null;

  const [ships, setShips] = useState([]);
  const [selectedShip, setSelectedShip] = useState(EMPTY_SHIP);
  const [shipNotFound, setShipNotFound] = useState(false);

  // Документы
  // Старый JS:
  // let selectedDocumentId = null;

  const [journals, setJournals] = useState([]);
  const [selectedDocument, setSelectedDocument] =
    useState(EMPTY_DOCUMENT);
  const [documentNotFound, setDocumentNotFound] = useState(false);

  // Файл подготовленной ведомости

  const [preparedCableFile, setPreparedCableFile] =
    useState(null);

  // UI state

  const [status, setStatus] = useState("Готово");
  const [loadingShips, setLoadingShips] = useState(false);
  const [loadingJournals, setLoadingJournals] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);

  // Helpers

  const getUploadPassword = () => {
    const password = uploadPassword.trim();

    if (!password) {
      window.alert("Введите пароль загрузки");
      return null;
    }

    return password;
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

  // Режим заказа

  const handleShipManualMode = (manual) => {
    setShipNotFound(manual);

    if (manual) {
      setSelectedShip(EMPTY_SHIP);
    }
  };

  // Режим документа

  const handleDocumentManualMode = (manual) => {
    setDocumentNotFound(manual);

    if (manual) {
      setSelectedDocument(EMPTY_DOCUMENT);
    }
  };

  // Загрузка заказов
  //
  // Старый JS:
  // GET /download/ship?code=...

  const handleLoadShips = async () => {
    const code = getUploadPassword();

    if (!code) {
      return;
    }

    setLoadingShips(true);
    setStatus("Загрузка заказов...");

    try {
      const response = await fetch(
        `${API_BASE}/download/ship?code=${encodeURIComponent(code)}`
      );

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const data = await response.json();

      setShips(data);

      // Аналогично старому:
      // select.innerHTML = '<option value="">Выберите заказ</option>';

      setSelectedShip(EMPTY_SHIP);
      setShipNotFound(false);

      setStatus(`Заказы загружены: ${data.length}`);
    } catch (error) {
      setStatus(
        `Ошибка загрузки заказов: ${error.message}`
      );
    } finally {
      setLoadingShips(false);
    }
  };

  // Загрузка документов
  //
  // Старый JS:
  // GET /download/journal?code=...

  const handleLoadCableJournals = async () => {
    const code = getUploadPassword();

    if (!code) {
      return;
    }

    setLoadingJournals(true);
    setStatus("Загрузка документов...");

    try {
      const response = await fetch(
        `${API_BASE}/download/journal?code=${encodeURIComponent(
          code
        )}`
      );

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const data = await response.json();

      setJournals(data);

      setSelectedDocument(EMPTY_DOCUMENT);
      setDocumentNotFound(false);

      setStatus(`Документы загружены: ${data.length}`);
    } catch (error) {
      setStatus(
        `Ошибка загрузки документов: ${error.message}`
      );
    } finally {
      setLoadingJournals(false);
    }
  };

  // Выбор заказа
  //
  // Старый JS:
  // shipSelect.addEventListener("change", ...)

  const handleShipChange = (event) => {
    const shipId = event.target.value;

    if (!shipId) {
      setSelectedShip(EMPTY_SHIP);
      return;
    }

    const ship = ships.find(
      (item) => String(item.id ?? "") === String(shipId)
    );

    if (!ship) {
      return;
    }

    setShipNotFound(false);

    setSelectedShip({
      id: ship.id ?? null,
      name: ship.name ?? "",
      num: ship.num ?? "",
      projectNum: ship.projectNum ?? "",
      projectName: ship.projectName ?? "",
    });
  };

  // Выбор документа
  //
  // Старый JS:
  // journalSelect.addEventListener("change", ...)

  const handleJournalChange = (event) => {
    const journalId = event.target.value;

    if (!journalId) {
      setSelectedDocument(EMPTY_DOCUMENT);
      return;
    }

    const journal = journals.find(
      (item) =>
        String(item.id ?? "") === String(journalId)
    );

    if (!journal) {
      return;
    }

    setDocumentNotFound(false);

    setSelectedDocument({
      id: journal.id ?? null,
      journalNum: journal.journalNum ?? "",
      notice: journal.notice ?? "",
      noticeDate: journal.noticeDate ?? "",
      actualStatus: journal.actualStatus ?? 0,

      documentType: 1,

      documentApprovalStage:
        journal.documentApprovalStage ??
        "BEFORE_APPROVAL",
    });
  };


  // Загрузка подготовленной ведомости
  //
  // Старый JS:
  // POST /uploadCableDocument
  //
  // multipart/form-data:
  //   file
  //   code
  //   parameters

  const handleUploadPreparedCable = async () => {
    if (!preparedCableFile) {
      window.alert("Выберите Excel-файл");
      return;
    }

    const code = getUploadPassword();

    if (!code) {
      return;
    }

    const parameters = {
      documentId: selectedDocument.id,

      documentNum: selectedDocument.journalNum,

      notice: selectedDocument.notice,

      noticeDate: selectedDocument.noticeDate,

      actualStatus: Number(
        selectedDocument.actualStatus || 0
      ),

      documentType: Number(
        selectedDocument.documentType || 1
      ),

      documentApprovalStage:
        selectedDocument.documentApprovalStage,

      incomingShip: {
        shipId: selectedShip.id,

        name: selectedShip.name,

        num: selectedShip.num,

        projectNum: selectedShip.projectNum,

        projectName: selectedShip.projectName,
      },
    };

    const formData = new FormData();

    formData.append("file", preparedCableFile);

    formData.append("code", code);

    formData.append(
      "parameters",
      new Blob(
        [JSON.stringify(parameters)],
        {
          type: "application/json",
        }
      )
    );

    setUploadingDocument(true);
    setStatus("Загрузка ведомости кабельной...");

    try {
      const response = await fetch(
        `${API_BASE}/uploadCableDocument`,
        {
          method: "POST",
          body: formData,
        }
      );

      const text = await response.text();

      if (!response.ok) {
        throw new Error(text);
      }

      setStatus(text);
    } catch (error) {
      setStatus(`Ошибка: ${error.message}`);
    } finally {
      setUploadingDocument(false);
    }
  };

  // Render

  return (
    <details className="cable-document section">
      <summary>Ведомость кабельная</summary>

      <div className="section-content">
        <h2>Ведомость кабельная</h2>

        {/* Пароль загрузки */}

        <div className="upload-password-row">
          <label htmlFor="uploadPassword">
            Пароль загрузки:
          </label>

          <input
            id="uploadPassword"
            type="password"
            placeholder="Пароль загрузки"
            value={uploadPassword}
            onChange={(event) =>
              setUploadPassword(event.target.value)
            }
          />
        </div>

        {/* Кнопки загрузки данных */}

        <div className="upload-row">
          <button
            type="button"
            onClick={handleLoadShips}
            disabled={loadingShips}
          >
            {loadingShips
              ? "Загрузка..."
              : "Загрузить заказы"}
          </button>

          <button
            type="button"
            onClick={handleLoadCableJournals}
            disabled={loadingJournals}
          >
            {loadingJournals
              ? "Загрузка..."
              : "Загрузить документы"}
          </button>
        </div>

        <div className="cable-form">
          {/* Заказ */}

          <div className="form-block">
            <h3>Заказ</h3>

            <div className="order-fields">
              <label htmlFor="shipSelect">
                Загруженные заказы:
              </label>

              <select
                id="shipSelect"
                value={
                  shipNotFound
                    ? ""
                    : selectedShip.id ?? ""
                }
                disabled={shipNotFound}
                onChange={handleShipChange}
              >
                <option value="">
                  Выберите заказ
                </option>

                {ships.map((ship) => (
                  <option
                    key={ship.id}
                    value={ship.id ?? ""}
                  >
                    {[
                      ship.num,
                      ship.name,
                      ship.projectNum,
                      ship.projectName,
                    ]
                      .filter(
                        (value) =>
                          value != null &&
                          value !== ""
                      )
                      .join(" | ")}
                  </option>
                ))}
              </select>

              <label className="manual-toggle">
                <input
                  type="checkbox"
                  checked={shipNotFound}
                  onChange={(event) =>
                    handleShipManualMode(
                      event.target.checked
                    )
                  }
                />

                Нет подходящего
              </label>

              <label htmlFor="shipName">
                Название:
              </label>

              <input
                id="shipName"
                type="text"
                value={selectedShip.name}
                disabled={!shipNotFound}
                onChange={(event) =>
                  setSelectedShip((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
              />

              <label htmlFor="shipNum">
                Номер:
              </label>

              <input
                id="shipNum"
                type="text"
                value={selectedShip.num}
                disabled={!shipNotFound}
                onChange={(event) =>
                  setSelectedShip((prev) => ({
                    ...prev,
                    num: event.target.value,
                  }))
                }
              />

              <label htmlFor="projectNum">
                Номер проекта:
              </label>

              <input
                id="projectNum"
                type="text"
                value={selectedShip.projectNum}
                disabled={!shipNotFound}
                onChange={(event) =>
                  setSelectedShip((prev) => ({
                    ...prev,
                    projectNum: event.target.value,
                  }))
                }
              />

              <label htmlFor="projectName">
                Проектное наименование:
              </label>

              <input
                id="projectName"
                type="text"
                value={selectedShip.projectName}
                disabled={!shipNotFound}
                onChange={(event) =>
                  setSelectedShip((prev) => ({
                    ...prev,
                    projectName: event.target.value,
                  }))
                }
              />
            </div>
          </div>

          {/* Документ */}

          <div className="form-block">
            <h3>Документ</h3>

            <div className="document-fields">
              <label htmlFor="journalSelect">
                Загруженные документы:
              </label>

              <select
                id="journalSelect"
                value={
                  documentNotFound
                    ? ""
                    : selectedDocument.id ?? ""
                }
                disabled={documentNotFound}
                onChange={handleJournalChange}
              >
                <option value="">
                  Выберите документ
                </option>

                {journals.map((journal) => (
                  <option
                    key={journal.id}
                    value={journal.id ?? ""}
                  >
                    {[
                      journal.journalNum,
                      journal.notice,
                      journal.noticeDate,
                    ]
                      .filter(
                        (value) =>
                          value != null &&
                          value !== ""
                      )
                      .join(" | ")}
                  </option>
                ))}
              </select>

              <label className="manual-toggle">
                <input
                  type="checkbox"
                  checked={documentNotFound}
                  onChange={(event) =>
                    handleDocumentManualMode(
                      event.target.checked
                    )
                  }
                />

                Нет подходящего
              </label>

              <label htmlFor="documentNum">
                Номер документа:
              </label>

              <input
                id="documentNum"
                type="text"
                value={selectedDocument.journalNum}
                disabled={!documentNotFound}
                onChange={(event) =>
                  setSelectedDocument((prev) => ({
                    ...prev,
                    journalNum: event.target.value,
                  }))
                }
              />

              <label htmlFor="notice">
                Номер извещения:
              </label>

              <input
                id="notice"
                type="text"
                value={selectedDocument.notice}
                disabled={!documentNotFound}
                onChange={(event) =>
                  setSelectedDocument((prev) => ({
                    ...prev,
                    notice: event.target.value,
                  }))
                }
              />

              <label htmlFor="noticeDate">
                Дата извещения:
              </label>

              <input
                id="noticeDate"
                type="date"
                value={selectedDocument.noticeDate}
                disabled={!documentNotFound}
                onChange={(event) =>
                  setSelectedDocument((prev) => ({
                    ...prev,
                    noticeDate: event.target.value,
                  }))
                }
              />

              <label htmlFor="actualStatus">
                Статус:
              </label>

              <select
                id="actualStatus"
                type="number"
                value={selectedDocument.actualStatus}
                disabled={!documentNotFound}
                onChange={(event) =>
                  setSelectedDocument((prev) => ({
                    ...prev,
                    actualStatus: event.target.value,
                  }))
                }
              >
                <option value="1">Актуальный</option>
                <option value="2">Не актуальный</option>
              </select>

              <label htmlFor="documentType">
                Тип документа:
              </label>

              <select
                id="documentType"
                value={selectedDocument.documentType}
                disabled={!documentNotFound}
                onChange={(event) =>
                  setSelectedDocument((prev) => ({
                    ...prev,
                    documentType: event.target.value,
                  }))
                }
              >
                <option value="1">Весь</option>
                <option value="2">Часть</option>
              </select>

              <label htmlFor="documentApprovalStage">
                Согласование:
              </label>

              <select
                id="documentApprovalStage"
                value={
                  selectedDocument.documentApprovalStage
                }
                disabled={!documentNotFound}
                onChange={(event) =>
                  setSelectedDocument((prev) => ({
                    ...prev,
                    documentApprovalStage:
                      event.target.value,
                  }))
                }
              >
                <option value="BEFORE_APPROVAL">
                  До согласования
                </option>

                <option value="AFTER_APPROVAL">
                  После согласования
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Подготовленная ведомость */}

        <div className="prepared-file-row">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(event) =>
              setPreparedCableFile(
                event.target.files?.[0] ?? null
              )
            }
          />

          <button
            type="button"
            onClick={handleUploadPreparedCable}
            disabled={uploadingDocument}
          >
            {uploadingDocument
              ? "Загрузка..."
              : "Загрузить ведомость кабельную"}
          </button>
        </div>

        {/* Status */}

        <div className="cable-document-status">
          {status}
        </div>
      </div>
    </details>
  );
}