import CableUploadPage from "../../cableElement/CableUploadPage";
import CableReportsPage from "../../cableElement/CableReportsPage";
import CableDocumentPage from "../../cableElement/CableDocumentPage";

export default function CableMainPage() {
  return (
    <div>
      <CableUploadPage />

      <CableDocumentPage />

      <CableReportsPage />
    </div>
  );
}