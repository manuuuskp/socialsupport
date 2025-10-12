import Header from "../components/Header";
import SocialSupportForm from "./SocialSupportForm";

const Layout = () => {
    return (
        <div className="flex flex-col h-screen mobile-viewport-fix">
            <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
                <Header />
            </header>
            <main className="flex-1 pt-16 overflow-y-auto mobile-scroll">
                <SocialSupportForm />
            </main>
        </div>
    )
}

export default Layout;