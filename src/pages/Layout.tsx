import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import SuccessPage from "./SuccessPage";
import NotFound from "./NotFound";

const SocialSupportForm = lazy(() => import("./SocialSupportForm"));

const Layout = () => {
    return (
        <div className="flex flex-col h-[100dvh] min-h-screen">
            <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
                <Header />
            </header>
            <main className="flex-1 pt-16 overflow-y-auto mobile-scroll">
                <Suspense fallback={
                    <div className="flex justify-center items-center min-h-[50vh]" role="status" aria-label="Loading application form">
                        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" aria-hidden="true"></div>
                    </div>
                }>
                    <Routes>
                        <Route path="/" element={<SocialSupportForm />} />
                        <Route path="/success/:applicationId" element={<SuccessPage />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
            </main>
        </div>
    )
}

export default Layout;