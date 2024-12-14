import "../styles/globals.css";
import Header from "../components/Header";

function MyApp({ Component, pageProps }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="p-4">
                <Component {...pageProps} />
            </main>
        </div>
    );
}

export default MyApp;
