import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { Input } from '@/components/ui/input';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Product, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

import { ProductComponent } from '../../components/product';
import UserLayout from '../../layouts/user-layout';

type PageProps = {
    products: {
        data: Array<Product>;
        current_page: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
};

export default function Index() {
    const page = usePage<SharedData>();
    const { auth } = page.props;

    const { products } = usePage<PageProps>().props;

    const [search, setSearch] = useState<string>('');
    const [category, setCategory] = useState<string>('');

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
                            className="!border-black dark:!border-white"
                        />
                    </div>

                    <div className="w-[300px]">
                        <Select onValueChange={(e) => setCategory(e)} value={String(category)}>
                            <SelectTrigger className="w-full !border-black dark:!border-white">
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
                        {products.data.map((product) => {
                            return <ProductComponent key={product.id} product={product} user={auth.user}></ProductComponent>;
                        })}
                    </div>
                </div>

                <div className="flex w-full items-center justify-center gap-3">
                    <div className="flex aspect-square w-[30px] cursor-pointer items-center justify-center rounded border border-solid border-black dark:border-white">
                        <ChevronLeft />
                    </div>
                    {[1, 2, 3, 4].map((item) => {
                        return (
                            <div
                                key={item}
                                className="flex aspect-square w-[30px] cursor-pointer items-center justify-center rounded border border-solid border-black dark:border-white"
                            >
                                {item}
                            </div>
                        );
                    })}
                    <div className="flex aspect-square w-[30px] cursor-pointer items-center justify-center rounded border border-solid border-black dark:border-white">
                        <ChevronRight />
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
