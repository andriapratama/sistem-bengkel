import { Button } from '@/components/ui/button';
import { Transaction } from '@/types';
import { Link, router } from '@inertiajs/react';
import axios from 'axios';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
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
                rs.data.transaction.map((transaction) => {
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
                <div className="flex w-full justify-end">
                    <Link href="/vehicles/create">
                        <Button type="button">Add Vehicle</Button>
                    </Link>
                </div>

                <div className="grid w-full grid-cols-2 gap-x-10 gap-y-5">
                    {[1, 2, 3, 4].map((item) => {
                        return (
                            <div
                                key={item}
                                className="flex w-full items-center justify-between border border-solid border-black p-5 text-black dark:border-white dark:text-white"
                            >
                                <div className="flex flex-col gap-1">
                                    <div>Vario 125 (DK-1204-MD)</div>
                                    <div>Honda</div>
                                    <div>Last Service: 20/03/2025</div>
                                </div>

                                <Button>Detail</Button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </UserLayout>
    );
}
