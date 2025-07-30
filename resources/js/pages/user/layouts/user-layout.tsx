import { CircleUser, LogOut, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Toaster } from '@/components/ui/sonner';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

interface Menu {
    title: string;
    href: string;
}

interface UserLayoutProps {
    children: ReactNode;
}

export default ({ children }: UserLayoutProps) => {
    const { url } = usePage();
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const [menus, setMenus] = useState<Menu[]>([]);

    useEffect(() => {
        setMenus([
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
        ]);

        if (!auth.user) {
            setMenus((prev) => [
                ...prev,
                {
                    title: 'Login',
                    href: '/login',
                },
            ]);
        } else {
            setMenus((prev) => [
                ...prev,
                {
                    title: 'Booking',
                    href: '/booking',
                },
            ]);
        }
    }, [auth]);

    return (
        <main className="min-screen font-poppins flex w-full flex-col">
            <Toaster position="top-right" />
            <header className="flex h-20 w-full flex-row justify-center border-b border-solid border-neutral-600">
                <div className="mx-10 flex w-full max-w-[1200px] flex-row items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-white">
                        Bengkel
                    </Link>

                    <div className="flex items-center gap-10">
                        {menus
                            ? menus.map((menu) => {
                                  const routeActive = url.split('/')[1];
                                  const href = menu.href.split('/')[1];
                                  const active: boolean = routeActive === href;
                                  return (
                                      <Link
                                          key={menu.title}
                                          href={menu.href}
                                          className={`cursor-pointer border-b border-solid text-base font-normal text-white ${
                                              active ? 'border-black dark:border-white' : 'border-transparent'
                                          }`}
                                      >
                                          {menu.title}
                                      </Link>
                                  );
                              })
                            : null}
                    </div>

                    <div className="flex items-center gap-5">
                        <Link href="/carts">
                            <ShoppingCart />
                        </Link>

                        {auth.user ? (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button type="button" className="cursor-pointer">
                                        <CircleUser />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[250px] bg-neutral-800">
                                    <div className="flex flex-col gap-3">
                                        <Link href="/" className="flex items-center gap-4 text-sm">
                                            <User className="size-5" />
                                            <span>Manage My Account</span>
                                        </Link>
                                        <Link href="/" className="flex items-center gap-4 text-sm">
                                            <ShoppingBag className="size-5" />
                                            <span>My Order</span>
                                        </Link>
                                        <Link className="flex items-center gap-4 bg-transparent text-sm" method="post" href={route('logout')}>
                                            <LogOut className="size-5 rotate-180" />
                                            <span>Log Out</span>
                                        </Link>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        ) : null}
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
