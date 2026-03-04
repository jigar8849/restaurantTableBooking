import { ErrorBoundary } from "react-error-boundary";

function Fallback({ error }) {
    return (
        <div role="alert" className="p-4 bg-red-50 text-red-900 h-screen flex flex-col justify-center items-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <pre className="text-sm bg-red-100 p-4 rounded overflow-auto max-w-2xl">{error.message}</pre>
            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded">Reload Page</button>
        </div>
    );
}

export default Fallback;
