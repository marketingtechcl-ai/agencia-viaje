import "./globals.css";

export const metadata = {
  title: "Portal de Viajes",
  description: "Itinerario, fotos y calendario de tu viaje, en un solo lugar.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
