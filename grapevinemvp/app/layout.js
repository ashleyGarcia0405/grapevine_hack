import './globals.css'
import { SessionProvider } from "next-auth/react"
import Navbar from './components/Navbar'

// app/layout.js
import { Providers } from "./providers";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}