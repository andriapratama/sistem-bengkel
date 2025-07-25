import { Link } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { type ReactNode } from 'react';

interface Menu {
    title: string;
    href: string;
}

interface UserLayoutProps {
    children: ReactNode;
}

export default ({ children }: UserLayoutProps) => {
    const menus: Menu[] = [
        {
            title: 'Home',
            href: '/',
        },
        {
            title: 'Products',
            href: '/products',
        },
        {
            title: 'Contact',
            href: '/contact',
        },
        {
            title: 'Login',
            href: '/login',
        },
    ];

    return (
        <main className="min-screen flex w-full flex-col">
            <header className="flex h-20 w-full flex-row justify-center border-b border-solid border-neutral-600">
                <div className="mx-10 flex w-full max-w-[1200px] flex-row items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-white">
                        Bengkel
                    </Link>

                    <div className="flex items-center gap-10">
                        {menus.map((menu) => {
                            return (
                                <Link
                                    key={menu.title}
                                    href={menu.href}
                                    className="cursor-pointer border-b border-solid border-white text-base font-normal text-white"
                                >
                                    {menu.title}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-5">
                        <button type="button">
                            <ShoppingCart />
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex w-full justify-center">
                <div className="mx-10 flex w-full max-w-[1200px] flex-col">{children}</div>
            </div>

            <footer className="mt-32 flex w-full justify-center bg-white">
                <div className="grid w-full max-w-[1200px] grid-cols-4 py-14">
                    <div className="flex w-full flex-col text-black">
                        <p className="text-base font-bold">Bengkel</p>
                    </div>
                    <div className="flex w-full flex-col text-black">
                        <p className="text-base font-bold">Support</p>
                        <div className="mt-5 flex flex-col gap-2">
                            <p className="line-clamp-2 text-base font-medium">Badung, Denpasar, Bali, Indonesia</p>
                            <p className="text-base font-medium">test@gmail.com</p>
                            <p className="text-base font-medium">+6283 239 123 230</p>
                        </div>
                    </div>
                    <div className="flex w-full flex-col text-black">
                        <p className="text-base font-bold">Account</p>
                        <div className="mt-5 flex flex-col gap-2">
                            <p className="line-clamp-2 text-base font-medium">My Account</p>
                            <p className="text-base font-medium">Login / Register</p>
                            <p className="text-base font-medium">Cart</p>
                            <p className="text-base font-medium">Book</p>
                        </div>
                    </div>
                    <div className="flex w-full flex-col text-black">
                        <p className="text-base font-bold">Quick Link</p>
                        <div className="mt-5 flex flex-col gap-2">
                            <p className="line-clamp-2 text-base font-medium">Contact</p>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
};
