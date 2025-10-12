const ModalWrapper = ({ children, title, description }: { children: React.ReactNode, title: string, description: string }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto flex flex-col overflow-hidden">
                {(title || description) && <div className="p-4 border-b">
                    {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
                    {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
                </div>}
                {children}
            </div>
        </div>
    )
}

export default ModalWrapper;