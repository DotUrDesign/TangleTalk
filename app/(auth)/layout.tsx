import { Inter } from "next/font/google";
import '../globals.css';
import { ClerkProvider } from "@clerk/nextjs";

/*
In simple terms, this code defines a layout component called RootLayout. It sets up some environment related to user authentication, sets the language of the content to English, applies some styling to the body background, and then renders the child components or content that are passed into RootLayout. This helps maintain a consistent layout and potentially some shared functionality across different parts of your web app.
*/

export const metadata = {
    title: 'TangleTalk',
    description: 'A Next.js 13 Meta Threads Application'
}

// ClerkProvider allows most of the functionalities of clerk.

const inter = Inter({ subsets : ["latin"]})   // applying fonts in nextJs

export default function RootLayout({ 
    children 
} : {
    children : React.ReactNode // Type of children is being specified here...
}) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${inter.className} bg-dark-1`}>
                    {children}
                </body>
            </html>
        </ClerkProvider>
    )
}