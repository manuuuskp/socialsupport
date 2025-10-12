
const ApplicationForm = ({children}: {children: React.ReactNode}) => {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-full">
            <div className="max-w-4xl mx-auto px-3 py-3 sm:px-4 sm:py-4 sm:pb-8 md:px-6 md:py-6 lg:px-8 lg:py-8">
                {children}
            </div>
        </div>

    )
}

export default ApplicationForm