(function () {
  function serializeForm(form) {
    const data = new FormData(form);
    const lines = [];
    lines.push("BOUKE website form export");
    lines.push("Generated locally in the browser — not submitted to a server.");
    lines.push("Date: " + new Date().toISOString());
    lines.push("Form: " + (form.id || "untitled"));
    lines.push("");
    for (const [key, value] of data.entries()) {
      lines.push(key + ":");
      lines.push(String(value || "(blank)"));
      lines.push("");
    }
    return lines.join("\n");
  }

  function downloadText(filename, text) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function wireForm(formId, statusId, filename) {
    const form = document.getElementById(formId);
    const status = document.getElementById(statusId);
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (formId === "help-form") {
        const need = form.elements.namedItem("need_help_with");
        if (need && !String(need.value || "").trim()) {
          status.textContent = "Please fill in “I need help with…” before downloading.";
          need.focus();
          return;
        }
      }
      const text = serializeForm(form);
      downloadText(filename, text);
      status.textContent =
        "Downloaded a .txt note on this device. Nothing was emailed or uploaded. Paste it to BOUKE when you have a contact channel.";
    });
  }

  document.querySelectorAll("[data-copy]").forEach(function (button) {
    button.addEventListener("click", async function () {
      const formId = button.getAttribute("data-copy");
      const form = document.getElementById(formId);
      const status = document.getElementById(formId === "help-form" ? "help-status" : "biz-status");
      if (!form) return;
      const text = serializeForm(form);
      try {
        await navigator.clipboard.writeText(text);
        if (status) {
          status.textContent =
            "Copied to clipboard. Nothing was sent to a server. Paste when you are ready.";
        }
      } catch (err) {
        if (status) {
          status.textContent =
            "Clipboard blocked in this browser. Use Download instead. Nothing was sent.";
        }
      }
    });
  });

  wireForm("help-form", "help-status", "bouke-need-help.txt");
  wireForm("biz-form", "biz-status", "bouke-business-questionnaire.txt");
})();
