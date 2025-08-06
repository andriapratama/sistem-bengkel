import axios from 'axios';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Vehicle } from '@/types';
import { Link, router } from '@inertiajs/react';

import UserLayout from '../../layouts/user-layout';

export default function Index() {
    const [data, setData] = useState<Vehicle[]>([]);

    const toDetail = (invoice: string) => {
        router.visit(`/my-orders/${invoice}`);
    };

    const getAll = useCallback(async () => {
        try {
            const rs = await axios.get('/vehicles/get-all');

            if (rs.data.success) {
                setData(rs.data.vehicles);
            } else {
                console.log(rs);
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        getAll();
    }, [getAll]);

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
                    {data.map((item) => {
                        return (
                            <div
                                key={item.id}
                                className="flex w-full items-center justify-between border border-solid border-black p-5 text-black dark:border-white dark:text-white"
                            >
                                <div className="flex flex-col gap-1">
                                    <div>
                                        {item.vehicle_variant?.name} ({item.police_number})
                                    </div>
                                    <div>{item.vehicle_variant?.vehicle_brand?.name}</div>
                                    <div>Last Service: {item.last_service_date ? formatDate(item.last_service_date) : '-'}</div>
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
