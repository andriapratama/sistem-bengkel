import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import UserLayout from '../../layouts/user-layout';

export default function Index() {
    const [search, setSearch] = useState<string>('');
    const [category, setCategory] = useState<string>('');

    useEffect(() => {
        console.log(category);
    }, [category]);

    return (
        <UserLayout>
            <div className="mt-10 flex min-h-[44.5vh] w-full flex-col gap-10">
                <div className="flex aspect-[22/6] w-full items-center justify-center overflow-hidden">
                    <img src="images/hero.webp" alt="Banner Hero" className="h-full w-full object-cover object-center" loading="lazy" />
                </div>

                <div className="flex w-full items-center justify-start gap-5">
                    <div className="w-[300px]">
                        <Input
                            id="search"
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search product"
                            className="!border-white"
                        />
                    </div>

                    <div className="w-[300px]">
                        <Select onValueChange={(e) => setCategory(e)} value={String(category)}>
                            <SelectTrigger className="w-full !border-white">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
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
                                ].map((category) => (
                                    <SelectItem key={category} value={String(category)}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex w-full flex-col">
                    <div className="grid w-full grid-cols-4 gap-9">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((product) => {
                            return (
                                <div key={product} className="flex w-full flex-col gap-1 overflow-hidden rounded shadow-2xl">
                                    <Link
                                        href={`/products/${product}`}
                                        className="flex aspect-square w-full items-center justify-center overflow-hidden bg-neutral-800"
                                    >
                                        <img src="/images/oli-castrol.jpg" alt="Oli Castrol" className="h-full w-full object-cover object-center" />
                                    </Link>
                                    <p className="line-clamp-1 text-sm font-semibold text-white">Oli Castrol</p>
                                    <div className="flex items-center gap-3 text-base font-bold">
                                        <p>Rp. 50.000</p>
                                        <p className="text-sm text-neutral-400 line-through">Rp. 100.000</p>
                                    </div>
                                    <Button
                                        type="button"
                                        className="mt-2 flex w-full cursor-pointer items-center justify-center bg-white py-2 text-sm font-semibold text-black"
                                    >
                                        Add Cart
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex w-full items-center justify-center gap-3">
                    <div className="flex aspect-square w-[30px] cursor-pointer items-center justify-center rounded border border-solid border-white">
                        <ChevronLeft />
                    </div>
                    {[1, 2, 3, 4].map((item) => {
                        return (
                            <div
                                key={item}
                                className="flex aspect-square w-[30px] cursor-pointer items-center justify-center rounded border border-solid border-white"
                            >
                                {item}
                            </div>
                        );
                    })}
                    <div className="flex aspect-square w-[30px] cursor-pointer items-center justify-center rounded border border-solid border-white">
                        <ChevronRight />
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
