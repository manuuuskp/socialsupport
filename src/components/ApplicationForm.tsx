
const ApplicationForm = ({children}: {children: React.ReactNode}) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="max-w-4xl mx-auto py-2 px-4 sm:px-6 sm:py-4 lg:px-8">
                {children}
            </div>
        </div>

    )
}

export default ApplicationForm