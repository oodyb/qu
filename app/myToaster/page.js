import { Toaster } from "react-hot-toast";

export default function MyToaster() {
    return (
        <>
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: "#333",
                        color: "#fff",
                        fontSize: "1rem",
                        padding: "12px 16px",
                        borderRadius: "8px",
                    },
                    success: {
                        iconTheme: {
                            primary: "#4CAF50",
                            secondary: "#fff",
                        },
                        style: {
                            background: "#4CAF50",
                            color: "white",
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: "#f44336",
                            secondary: "#fff",
                        },
                        style: {
                            background: "#f44336",
                            color: "white",
                        },
                    },
                }}
            />
        </>
    );
}