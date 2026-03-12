import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--background)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "360px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h1
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "3.5rem",
              letterSpacing: "0.1em",
              color: "var(--push)",
              margin: 0,
              lineHeight: 1,
            }}
          >
            GYMTRACK
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.9rem",
              marginTop: "8px",
            }}
          >
            Tu registro de entrenamiento
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "32px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                color: "var(--text)",
                fontSize: "1rem",
                fontWeight: "500",
                margin: 0,
              }}
            >
              Ingresá a tu cuenta
            </p>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.82rem",
                marginTop: "6px",
              }}
            >
              La primera vez que entrás, tu cuenta se crea automáticamente.
            </p>
          </div>

          <GoogleSignInButton />
        </div>
      </div>
    </div>
  );
}
