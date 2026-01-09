import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    this.setState({ info });
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    const { error, info } = this.state;

    if (error) {
      return (
        <div style={{
          minHeight: "100vh",
          boxSizing: "border-box",
          padding: 24,
          fontFamily: "Inter, system-ui, Arial, sans-serif",
          background: "var(--bg)",
          color: "var(--text)"
        }}>
          <div style={{ maxWidth: 980, margin: "24px auto" }}>
            <h1 style={{ color: "#dc2626", margin: 0 }}>Something went wrong</h1>
            <p style={{ color: "var(--muted)", marginTop: 8 }}>
              The application hit an error — the UI was stopped to avoid a blank screen.
              Below are details that will help us fix it.
            </p>

            <div style={{
              marginTop: 18,
              background: "rgba(255,245,245,0.9)",
              border: "1px solid rgba(220,38,38,0.08)",
              padding: 14,
              borderRadius: 10,
              color: "#3b0b0b",
              whiteSpace: "pre-wrap",
              fontSize: 13
            }}>
              <strong>Error:</strong>
              <div style={{ marginTop: 8 }}>{String(error && error.toString())}</div>

              <div style={{ marginTop: 12 }}>
                <strong>Component Stack / Info:</strong>
                <div style={{ marginTop: 6, color: "#4b4b4b", fontSize: 12 }}>
                  {info?.componentStack || "No component stack available"}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: 8,
                  cursor: "pointer"
                }}
              >
                Reload page
              </button>

              <button
                onClick={() => {
                  const payload = `Error: ${String(error)}\n\nStack: ${info?.componentStack || "none"}`;
                  navigator.clipboard?.writeText(payload).then(() => {
                    alert("Error details copied to clipboard — paste them here for help.");
                  }, () => {
                    alert("Failed to copy to clipboard — open console to see error details.");
                  });
                }}
                style={{
                  background: "#f3f4f6",
                  border: "1px solid #e5e7eb",
                  color: "var(--text)",
                  padding: "8px 12px",
                  borderRadius: 8,
                  cursor: "pointer"
                }}
              >
                Copy error details
              </button>
            </div>

            <div style={{ marginTop: 22, color: "var(--muted)", fontSize: 13 }}>
              Tip: if you share the error text or console output with me I will fix the exact line.
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
