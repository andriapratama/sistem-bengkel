import { Image } from 'lucide-react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import UserLayout from '@/pages/user/layouts/user-layout';

export default function Index() {
    const formatPrice = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        })
            .format(number)
            .replaceAll(',00', '');
    };

    return (
        <UserLayout>
            <div className="mt-10 flex min-h-[calc(100vh-524px)] w-full flex-col gap-5 bg-neutral-100 p-7 text-black dark:bg-neutral-900 dark:text-white">
                <div className="mb-5 flex w-full items-center justify-between">
                    <div className="text-xl font-semibold">Invoice Number: TRS123101231</div>
                    <div className="flex items-center justify-center bg-green-600 px-3 py-1 text-base font-semibold text-white uppercase">
                        Delivered
                    </div>
                </div>

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
                        {['1', '2'].map((cart, i) => {
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

                <div className="flex w-full flex-col gap-3 border-b border-solid border-black pb-5 dark:border-white">
                    <div className="text-xl font-semibold">Information Detail</div>
                    <div className="flex w-full items-center">
                        <div className="w-[200px]">Name:</div>
                        <div>Made</div>
                    </div>
                    <div className="flex w-full items-center">
                        <div className="w-[200px]">Address:</div>
                        <div>Kloengkoeng</div>
                    </div>
                    <div className="flex w-full items-center">
                        <div className="w-[200px]">Whatsapp:</div>
                        <div>086726837982</div>
                    </div>
                    <div className="flex w-full items-center">
                        <div className="w-[200px]">Payment Method:</div>
                        <div>Bank Transfer</div>
                    </div>
                </div>

                <div className="flex w-full flex-col gap-3">
                    <div className="flex w-full items-center justify-end">
                        <div>Total:</div>
                        <div className="w-[200px] text-end">{formatPrice(100000)}</div>
                    </div>
                    <div className="flex w-full items-center justify-end">
                        <div>Discount:</div>
                        <div className="w-[200px] text-end">{formatPrice(0)}</div>
                    </div>
                    <div className="flex w-full items-center justify-end text-xl font-semibold">
                        <div>Grand Total:</div>
                        <div className="w-[200px] text-end">{formatPrice(100000)}</div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
