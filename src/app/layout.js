import { Poppins, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata = {
  title: "Portal de Viajes | Firentur",
  description: "Itinerario, fotos y calendario de tu viaje, en un solo lugar.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`h-full antialiased ${poppins.variable} ${bricolage.variable}`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
