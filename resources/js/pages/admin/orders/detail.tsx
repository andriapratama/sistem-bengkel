import { Image } from 'lucide-react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Orders Detail',
        href: '/admin/orders',
    },
];

export default function Detail() {
    const formatPrice = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(number);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders Detail" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-7">
                <div className="mb-5 w-full text-2xl font-semibold">Invoice Number: TRS0202302001</div>

                <div className="flex w-full gap-10">
                    <div className="h-[400px] flex-1">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-black dark:border-white">
                                    <TableHead>Product</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead className="w-[12%]">Subtotal</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {['1', '2'].map((product, i) => {
                                    return (
                                        <TableRow key={i} className="border-black dark:border-white">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex aspect-square w-[50px] items-center justify-center overflow-hidden">
                                                        {/* <img
                                                    src=""
                                                    alt={cart}
                                                    className={`h-full w-full object-cover object-center ${cart.isImageError ? 'opacity-0' : 'opacity-100'}`}
                                                    loading="lazy"
                                                /> */}
                                                        <Image className={`absolute size-[50px] text-black dark:text-white`} />
                                                    </div>

                                                    <p className="text-sm font-light text-black dark:text-white">Oli Castrol</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>{formatPrice(10000)}</TableCell>
                                            <TableCell>2</TableCell>
                                            <TableCell>{formatPrice(20000)}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="h-[400px] w-[400px] rounded bg-neutral-100"></div>
                </div>
            </div>
        </AppLayout>
    );
}
