/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        base: "#050812",
        secondary: "#080D19",
        card: "#0B1220",
        elevated: "#10182A",
        canvas: "#050812",
        "canvas-subtle": "#080D19",
        "surface-card": "#0B1220",
        "surface-raised": "#10182A",
        "text-primary": "#FFFFFF",
        "text-secondary": "#94A3B8",
        "text-tertiary": "#64748B",
        "outline-hairline": "rgba(255, 255, 255, 0.08)",
        "outline-subtle": "rgba(255, 255, 255, 0.08)",
        brand: {
          blue: "#2563FF",
          electric: "#315CFF",
          purple: "#7C3CFF",
          pink: "#D946EF",
          cyan: "#00D9FF",
        },
        success: "#19D37A",
        warning: "#FFC83D",
        pack: {
          bg: "#050812",
          card: "#0B1220",
          border: "rgba(255,255,255,0.08)",
          lime: "#C8FF00",
          purple: "#7C3CFF",
        },
        telegram: {
          DEFAULT: "#0088CC",
          dark: "#0077B5",
          light: "#E3F3FC",
          glow: "rgba(0, 136, 204, 0.25)",
        },
        electric: {
          purple: "#7C3CFF",
          blue: "#315CFF",
          cyan: "#00D9FF",
          pink: "#D946EF",
          coral: "#FF6B4A",
          orange: "#FF8A00",
          lime: "#19D37A",
        },
      },
      fontFamily: {
        sans: ["Inter", "Manrope", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "Menlo", "monospace"],
      },
      borderRadius: {
        "2xl": "20px",
        "3xl": "24px",
        "4xl": "28px",
        "5xl": "32px",
      },
      boxShadow: {
        card: "0 8px 28px rgba(0, 0, 0, 0.45)",
        cta: "0 10px 28px -6px rgba(200, 255, 0, 0.35)",
        glow: "0 0 32px rgba(200, 255, 0, 0.25)",
        "ios-card": "0 8px 28px rgba(0, 0, 0, 0.45)",
        "ios-elevated": "0 12px 36px -6px rgba(0, 0, 0, 0.5)",
        "ios-cta": "0 10px 28px -6px rgba(124, 60, 255, 0.55)",
        "ios-float": "0 20px 40px -8px rgba(0, 0, 0, 0.5)",
        "telegram-cta": "0 8px 24px -4px rgba(0, 136, 204, 0.35)",
        "lime-glow": "0 8px 20px -4px rgba(200, 255, 0, 0.3)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowDrift: {
          "0%, 100%": { opacity: "0.5", transform: "translate(0,0) scale(1)" },
          "50%": { opacity: "0.9", transform: "translate(10px,-10px) scale(1.06)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        "fade-up": "fadeUp 0.45s ease-out both",
        "glow-drift": "glowDrift 7s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
