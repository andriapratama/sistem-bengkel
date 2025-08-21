import axios from 'axios';
import dayjs from 'dayjs';
import { Image } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Transaction } from '@/types';
import { router } from '@inertiajs/react';

import UserLayout from '../../layouts/user-layout';

export default function Index() {
    const [shippingStatus, setShippingStatus] = useState<string>('all');
    const [data, setData] = useState<Transaction[]>([]);

    const toDetail = (invoice: string) => {
        router.visit(`/my-orders/${invoice}`);
    };

    const toPayment = (invoice: string) => {
        router.visit(`/payment/${invoice}`);
    };

    const getAll = useCallback(async () => {
        try {
            const rs = await axios.get(`/my-orders/get-all?shipping_status=${shippingStatus}`);

            if (rs.data.success) {
                const newData: Transaction[] = [];
                rs.data.transaction.map((transaction: Transaction) => {
                    const dataTmp = { ...transaction, isImageError: false };
                    newData.push(dataTmp);
                });
                setData(newData);
            } else {
                console.log(rs);
            }
        } catch (error) {
            console.log(error);
        }
    }, [shippingStatus]);

    useEffect(() => {
        getAll();
    }, [shippingStatus, getAll]);

    const formatPrice = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(number);
    };

    const formatDate = (created_at: Date) => {
        return dayjs(created_at).format('DD/MM/YYYY, HH.mm');
    };

    return (
        <UserLayout>
            <div className="mt-10 flex min-h-[calc(100vh-524px)] w-full flex-col gap-5">
                <div className="flex w-full items-center">
                    {['all', 'pending', 'processing', 'shipped', 'delivered', 'canceled'].map((item) => {
                        return (
                            <button
                                key={item}
                                type="button"
                                className={`mr-5 cursor-pointer border-r border-solid border-black pr-5 text-base text-black capitalize outline-none last:border-none dark:border-white dark:text-white ${
                                    item === shippingStatus ? 'font-semibold' : 'font-normal'
                                }`}
                                onClick={() => setShippingStatus(item)}
                            >
                                {item}
                            </button>
                        );
                    })}
                </div>

                {data.map((transaction, i) => {
                    return (
                        <div key={transaction.id} className="flex w-full flex-col rounded border border-solid border-black p-5 dark:border-white">
                            <div className="mb-5 flex w-full items-center justify-between">
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

                            <div className="mb-5 flex w-full items-center justify-between border-b border-solid border-black pb-5 text-sm text-black dark:border-white dark:text-white">
                                <div className="flex gap-5">
                                    <div className="border-r border-solid border-black pr-5 dark:border-white">
                                        {formatDate(transaction.created_at)}
                                    </div>
                                    <div>Invoice No: {transaction.invoice_number}</div>
                                </div>

                                <div>
                                    Total: <span className="text-xl font-semibold">{formatPrice(transaction.grand_total)}</span>
                                </div>
                            </div>

                            <div className="flex w-full items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="flex aspect-square w-[100px] items-center justify-center overflow-hidden bg-neutral-200">
                                        <img
                                            src={`/storage/${transaction.transaction_items[0].product.image}`}
                                            alt={transaction.transaction_items[0].product.name}
                                            className={`h-full w-full object-cover object-center ${transaction.isImageError ? 'opacity-0' : 'opacity-100'}`}
                                            loading="lazy"
                                            onError={() => {
                                                setData((prev) => prev.map((item, index) => (index === i ? { ...item, isImageError: true } : item)));
                                            }}
                                        />
                                        <Image
                                            className={`absolute size-[50px] text-black dark:text-white ${transaction.isImageError ? 'opacity-100' : 'opacity-0'}`}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <div className="text-base font-semibold">{transaction.transaction_items[0].product.name}</div>
                                        <div>
                                            {formatPrice(transaction.transaction_items[0].price)} x {transaction.transaction_items[0].quantity}
                                        </div>
                                    </div>
                                </div>

                                {transaction.shipping_status === 'pending' ? (
                                    <Button type="button" onClick={() => toPayment(transaction.invoice_number)}>
                                        Pay
                                    </Button>
                                ) : (
                                    <Button type="button" onClick={() => toDetail(transaction.invoice_number)}>
                                        Order Detail
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </UserLayout>
    );
}
