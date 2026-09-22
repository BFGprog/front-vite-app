import { useState } from "react";

import CableUploadPage from "../../cableElement/CableUploadPage";
import CableReportsPage from "../../cableElement/CableReportsPage";
import CableDocumentPage from "../../cableElement/CableDocumentPage";

export default function CableMainPage() {
  const [uploadPassword, setUploadPassword] = useState("");

  return (
    <div>
      <CableUploadPage 
        uploadPassword={uploadPassword}
     />

      <CableDocumentPage 
        uploadPassword={uploadPassword}
        setUploadPassword={setUploadPassword}
     />

      <CableReportsPage />
    </div>
  );
}