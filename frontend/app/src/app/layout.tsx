import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";
import { LoadingPageWrapper } from "@/wrappers/LoadingPageWrapper";
import { AuthProvider } from "@/providers/AuthProvider";
import { NextUIProvider } from "@/providers/NextUIProvider";
import { SnackbarProvider } from "@/providers/SnackbarProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Jardín Botánico de Ushuaia",
  description: "Sitio web insitucional del Jardín Botánico de Ushuaia",
  author: "Lautaro Barba",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <ThemeProvider>
          <NextUIProvider>
            <SnackbarProvider>
              <LanguageProvider>
                <AuthProvider>
                  <LoadingPageWrapper>{children}</LoadingPageWrapper>
                </AuthProvider>
              </LanguageProvider>
            </SnackbarProvider>
          </NextUIProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
