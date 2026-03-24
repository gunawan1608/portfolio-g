export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer style={{
            borderTop: "1px solid var(--bd)",
            background: "var(--bg-1)",
            padding: "24px 28px",
            position: "relative", overflow: "hidden",
        }}>
            {/* subtle grid overlay */}
            <div aria-hidden style={{
                position: "absolute", inset: 0,
                backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
                maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
                WebkitMaskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
                pointerEvents: "none",
            }} />

            <div style={{
                maxWidth: 1120, margin: "0 auto",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                position: "relative",
            }}>
                <p style={{
                    fontFamily: "var(--fm)", fontSize: "0.7rem",
                    letterSpacing: "0.1em", color: "var(--t4)", margin: 0,
                }}>
                    © {year} Gunawan Madia Pratama
                </p>
                <p style={{
                    fontFamily: "var(--fm)", fontSize: "0.7rem",
                    letterSpacing: "0.08em", color: "var(--t5)", margin: 0,
                }}>
                    Built with Next.js &amp; GSAP
                </p>
            </div>
        </footer>
    );
}