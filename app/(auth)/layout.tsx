


const AuthLayout = ({
    children
}: {
     children : React.ReactNode
}) => {
    return (
        <div className="h-screen flex">
            <div className="flex-1">
                {children}
            </div>
            <div className="hidden md:block md:w-1/2 lg:w-1/2 xl:w-2/5 bg-primary">
                asd
            </div>
        </div>
    );
}
 
export default AuthLayout;