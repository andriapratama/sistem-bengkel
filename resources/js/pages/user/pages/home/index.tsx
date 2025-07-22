import { ArrowLeft, ArrowRight } from 'lucide-react';
import UserLayout from '../../layouts/user-layout';

export default function Index() {
    return (
        <UserLayout>
            <div className="flex w-full gap-10">
                <div className="flex w-[220px] flex-col border-r border-solid border-neutral-600 pt-10 pr-5">
                    {[
                        'Engine Parts',
                        'Oil & Lubricants',
                        'Brake Components',
                        'Suspension Parts',
                        'Electrical Parts',
                        'Air Conditioning',
                        'Transmission Parts',
                        'Filters',
                        'Tires & Wheels',
                    ].map((category) => {
                        return (
                            <button
                                key={category}
                                type="button"
                                className="cursor-pointer px-2 py-1 text-start text-sm font-normal text-white hover:bg-neutral-600"
                            >
                                {category}
                            </button>
                        );
                    })}
                </div>

                <div className="flex flex-1 justify-center pt-10">
                    <div className="flex aspect-[22/6] w-[95%] items-center justify-center overflow-hidden">
                        <img src="images/hero.webp" alt="Banner Hero" className="h-full w-full object-cover object-center" loading="lazy" />
                    </div>
                </div>
            </div>

            <div className="mt-20 flex w-full flex-col gap-10">
                <div className="flex w-full items-center justify-between">
                    <h2 className="text-3xl font-bold text-white">Best Selling Product</h2>
                    <button className="flex h-[50px] w-[150px] cursor-pointer items-center justify-center rounded-[8px] bg-white text-sm font-semibold text-black">
                        View All
                    </button>
                </div>

                <div className="grid w-full grid-cols-4 gap-9">
                    {[1, 2, 3, 4].map((product) => {
                        return (
                            <div key={product} className="flex w-full flex-col gap-1 overflow-hidden rounded shadow-2xl">
                                <div className="flex aspect-square w-full items-center justify-center overflow-hidden bg-neutral-800"></div>
                                <p className="line-clamp-1 text-sm font-semibold text-white">Oli Castrol</p>
                                <div className="flex items-center gap-3 text-base font-bold">
                                    <p>Rp. 50.000</p>
                                    <p className="text-sm text-neutral-400 line-through">Rp. 100.000</p>
                                </div>
                                <button className="mt-2 flex w-full cursor-pointer items-center justify-center bg-white py-2 text-sm font-semibold text-black">
                                    Add Cart
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-20 flex w-full items-center bg-neutral-800 pr-10 pb-5 pl-28">
                <div className="flex w-[50%] flex-col">
                    <p className="text-[50px] leading-[70px] font-semibold text-white">Trust Your Vehicle Service to the Experts</p>
                    <button type="button" className="mt-5 w-fit rounded bg-green-500 px-7 py-3 text-lg font-semibold text-white">
                        Book Now
                    </button>
                </div>

                <div className="flex-1">
                    <img src="images/mechanics.png" alt="Mechanics" className="h-full w-auto object-contain object-center" loading="lazy" />
                </div>
            </div>

            <div className="mt-20 flex w-full flex-col gap-10">
                <div className="flex w-full items-center justify-between">
                    <h2 className="text-3xl font-bold text-white">Explore Out Products</h2>
                    <div className="flex gap-2">
                        <button className="flex aspect-square w-[40px] cursor-pointer items-center justify-center rounded-full bg-neutral-800">
                            <ArrowLeft />
                        </button>
                        <button className="flex aspect-square w-[40px] cursor-pointer items-center justify-center rounded-full bg-neutral-800">
                            <ArrowRight />
                        </button>
                    </div>
                </div>

                <div className="grid w-full grid-cols-4 gap-9">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((product) => {
                        return (
                            <div key={product} className="flex w-full flex-col gap-1 overflow-hidden rounded shadow-2xl">
                                <div className="flex aspect-square w-full items-center justify-center overflow-hidden bg-neutral-800"></div>
                                <p className="line-clamp-1 text-sm font-semibold text-white">Oli Castrol</p>
                                <div className="flex items-center gap-3 text-base font-bold">
                                    <p>Rp. 50.000</p>
                                    <p className="text-sm text-neutral-400 line-through">Rp. 100.000</p>
                                </div>
                                <button className="mt-2 flex w-full cursor-pointer items-center justify-center bg-white py-2 text-sm font-semibold text-black">
                                    Add Cart
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="flex w-full justify-center">
                    <button className="flex h-[50px] w-[180px] cursor-pointer items-center justify-center rounded-[8px] bg-white text-sm font-semibold text-black">
                        View All Products
                    </button>
                </div>
            </div>
        </UserLayout>
    );
}
