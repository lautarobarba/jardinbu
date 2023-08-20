import { ConfigMenu } from "@/components/config-button/ConfigMenu";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const year: string = new Date().getFullYear().toString();
    return (
        <div className="antialiased bg-light dark:bg-dark h-screen">
            <ConfigMenu type="theme" />
            <main className="flex flex-row">
                {/* Imagen */}
                <div className="hidden lg:flex justify-center items-center h-screen bg-light w-4/6">
                    <img
                        loading='lazy'
                        src="/assets/images/registration.svg"
                        title="welcome-garden"
                        alt="welcome-garden"
                        style={{ maxHeight: '100%', maxWidth: '95%' }}
                    />
                </div>
                {/* Páginas */}
                <div className="flex flex-col justify-between items-center h-screen w-6/6 lg:w-2/6 shadow-lg">
                    {children}
                    <footer id='footer'>
                        <hr />
                        <p className="text-dark dark:text-light my-4">{year} - Jardín Botánico Ushuaia</p>
                    </footer>
                </div>
            </main>
        </div>
    );
}
