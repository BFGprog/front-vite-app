import CableUploadPage from "../../cableElement/CableUploadPage";
import CableReportsPage from "../../cableElement/CableReportsPage";

export default function CableMainPage() {
  return (
    <div>
      <CableUploadPage />

      <hr />

      <CableReportsPage />
    </div>
  );
}