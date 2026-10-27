import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { SiteContentProvider, loadPublished } from "./editable.jsx";
import { SECTION_TYPES, STYLE_FIELDS } from "./sections.jsx";
import { BUILTINS, FIELDS, GROUPS } from "./site-fields.js";
import "./concept.css";
import "./styles.css";

// The client's published edits (from the portal editor) are laid over the built-in content
loadPublished().then((initial) => {
  createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <SiteContentProvider
        fields={FIELDS}
        groups={GROUPS}
        builtins={BUILTINS}
        sectionTypes={SECTION_TYPES}
        styleFields={STYLE_FIELDS}
        initial={initial}
      >
        <App />
      </SiteContentProvider>
    </React.StrictMode>
  );
});
