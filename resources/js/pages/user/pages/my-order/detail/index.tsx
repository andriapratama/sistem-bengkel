import { Image } from 'lucide-react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import UserLayout from '@/pages/user/layouts/user-layout';
import { Transaction } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type PageProps = {
    transaction: Transaction;
};

export default function Index() {
    const { transaction } = usePage<PageProps>().props;
    const [isImageErrors, setIsImageErrors] = useState<boolean[]>([]);

    useEffect(() => {
        if (transaction) {
            const errorList: boolean[] = [];
            transaction.transaction_items.map((item) => {
                errorList.push(false);
            });
            setIsImageErrors(errorList);
        }
    }, [transaction]);

    const formatPrice = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(number);
    };

    return (
        <UserLayout>
            <div className="mt-10 flex min-h-[calc(100vh-524px)] w-full flex-col gap-5 bg-neutral-100 p-7 text-black dark:bg-neutral-900 dark:text-white">
                <div className="mb-5 flex w-full items-center justify-between">
                    <div className="text-xl font-semibold">Invoice Number: {transaction.invoice_number}</div>
                    <div
                        className={`flex items-center justify-center px-3 py-1 text-base font-semibold uppercase ${
                            transaction.shipping_status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : transaction.shipping_status === 'processing'
                                  ? 'bg-blue-100 text-blue-800'
                                  : transaction.shipping_status === 'shipped'
                                    ? 'bg-indigo-100 text-indigo-800'
                                    : transaction.shipping_status === 'delivered'
                                      ? 'bg-green-100 text-green-800'
                                      : transaction.shipping_status === 'canceled'
                                        ? 'bg-gray-100 text-gray-800'
                                        : 'bg-red-100 text-red-800'
                        }`}
                    >
                        {transaction.shipping_status}
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
                        {transaction.transaction_items.map((item, i) => {
                            return (
                                <TableRow key={i} className="border-black dark:border-white">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex aspect-square w-[50px] items-center justify-center overflow-hidden">
                                                <img
                                                    src={`/storage/${item.product.image}`}
                                                    alt={item.product.name}
                                                    className={`h-full w-full object-cover object-center ${isImageErrors[i] ? 'opacity-0' : 'opacity-100'}`}
                                                    loading="lazy"
                                                    onError={() => {
                                                        setIsImageErrors((prev) => prev.map((item, index) => (index === i ? true : item)));
                                                    }}
                                                />
                                                <Image
                                                    className={`absolute size-[50px] text-black dark:text-white ${isImageErrors[i] ? 'opacity-100' : 'opacity-0'}`}
                                                />
                                            </div>

                                            <p className="text-sm font-light text-black dark:text-white">{item.product.name}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatPrice(item.price)}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{formatPrice(item.subtotal)}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>

                <div className="flex w-full flex-col gap-3 border-b border-solid border-black pb-5 dark:border-white">
                    <div className="text-xl font-semibold">Information Detail</div>
                    <div className="flex w-full items-center">
                        <div className="w-[200px]">Name:</div>
                        <div>{transaction.user.name}</div>
                    </div>
                    <div className="flex w-full items-center">
                        <div className="w-[200px]">Address:</div>
                        <div>{transaction.shipping_address}</div>
                    </div>
                    <div className="flex w-full items-center">
                        <div className="w-[200px]">Whatsapp:</div>
                        <div>{transaction.user.phone}</div>
                    </div>
                    <div className="flex w-full items-center">
                        <div className="w-[200px]">Payment Method:</div>
                        <div>
                            {transaction.payment_method === 'bank_transfer'
                                ? 'Bank Transfer'
                                : transaction.payment_method === 'ewallet'
                                  ? 'e-Wallet'
                                  : 'Cash on Delivery'}
                        </div>
                    </div>
                </div>

                <div className="flex w-full flex-col gap-3">
                    <div className="flex w-full items-center justify-end">
                        <div>Total:</div>
                        <div className="w-[200px] text-end">{formatPrice(transaction.total_price)}</div>
                    </div>
                    <div className="flex w-full items-center justify-end">
                        <div>Discount:</div>
                        <div className="w-[200px] text-end">{formatPrice(transaction.discount_amount ?? 0)}</div>
                    </div>
                    <div className="flex w-full items-center justify-end text-xl font-semibold">
                        <div>Grand Total:</div>
                        <div className="w-[200px] text-end">{formatPrice(transaction.grand_total)}</div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
