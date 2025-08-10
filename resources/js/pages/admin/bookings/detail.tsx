import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Transaction } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import dayjs from 'dayjs';
import { LoaderCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

type PageProps = {
    id: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Booking Detail',
        href: '/admin/bookings',
    },
];

export default function Detail() {
    const { id } = usePage<PageProps>().props;
    const [data, setData] = useState<Transaction | null>(null);
    const [isShowAlertStatus, setIsShowAlertStatus] = useState<boolean>(false);
    const [isShowAlertStatusCancel, setIsShowAlertStatusCancel] = useState<boolean>(false);

    const [processing, setProcessing] = useState<boolean>(false);

    const getBooking = useCallback(async () => {
        try {
            const rs = await axios.get(`/admin/bookings/get-one/${id}`);

            if (rs.data.success) {
                const resData = rs.data.booking;
                setData(resData);
            }
        } catch (error) {
            console.log(error);
        }
    }, [id]);

    useEffect(() => {
        getBooking();
    }, [getBooking]);

    const updateStatus = async (status: string) => {
        try {
            setProcessing((prev) => !prev);
            const rs = await axios.put(`/admin/bookings/update/${id}`, { status });

            if (rs) {
                await getBooking();
                setIsShowAlertStatus(false);
                setIsShowAlertStatusCancel(false);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setProcessing((prev) => !prev);
        }
    };

    if (data) {
        return (
            <>
                <AppLayout breadcrumbs={breadcrumbs}>
                    <Head title="Booking Detail" />
                    <div className="flex h-full flex-1 gap-10 overflow-x-auto rounded-xl p-7">
                        <div className="flex-1">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-black dark:border-white">
                                        <TableHead>Service</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.booking_service_detail?.map((item, i) => {
                                        return (
                                            <TableRow key={item.id} className="border-black dark:border-white">
                                                <TableCell>{item.service.name}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                            {data.note ? (
                                <div className="mt-5 flex w-full items-start gap-5 text-sm">
                                    <div className="font-semibold">Note:</div>
                                    <div>{data.note}</div>
                                </div>
                            ) : null}

                            <div className="grid grid-cols-2 gap-5">
                                <div className="my-10 flex w-full flex-col gap-3 bg-neutral-100 px-7 py-5 text-sm text-black dark:bg-neutral-900 dark:text-white">
                                    <div className="w-full text-lg font-semibold">Customer Information</div>
                                    <div className="flex w-full items-start">
                                        <div className="w-[150px]">Name</div>
                                        <div>{data.user?.name}</div>
                                    </div>
                                    <div className="flex w-full items-start">
                                        <div className="w-[150px]">Whatsapp</div>
                                        <div>{data.user?.phone ?? '-'}</div>
                                    </div>
                                    <div className="flex w-full items-start">
                                        <div className="w-[150px]">Email</div>
                                        <div>{data.user?.email}</div>
                                    </div>
                                    <div className="flex w-full items-start">
                                        <div className="w-[150px]">Vehicle</div>
                                        <div>{data.vehicle.vehicle_variant.name}</div>
                                    </div>
                                    <div className="flex w-full items-start">
                                        <div className="w-[150px]">Vehicle Brand</div>
                                        <div>{data.vehicle.vehicle_variant.vehicle_brand.name}</div>
                                    </div>
                                    <div className="flex w-full items-start">
                                        <div className="w-[150px]">Vehicle Year</div>
                                        <div>{data.vehicle.vehicle_year}</div>
                                    </div>
                                    <div className="flex w-full items-start">
                                        <div className="w-[150px]">Police Number</div>
                                        <div className="uppercase">{data.vehicle.police_number}</div>
                                    </div>
                                </div>
                                <div className="my-10 flex w-full flex-col gap-3 bg-neutral-100 px-7 py-5 text-sm text-black dark:bg-neutral-900 dark:text-white">
                                    <div className="w-full text-lg font-semibold">Booking Information</div>
                                    <div className="flex w-full items-start">
                                        <div className="w-[150px]">Date</div>
                                        <div>{dayjs(data.date_booking).format('YYYY-MM-DD')}</div>
                                    </div>
                                    <div className="flex w-full items-start">
                                        <div className="w-[150px]">Queue Number</div>
                                        <div>{data.queue_number}</div>
                                    </div>
                                    <div className="flex w-full items-start">
                                        <div className="w-[150px]">Estimated Start</div>
                                        <div>{dayjs(data.estimated_service_start).format('hh:mm')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-10 flex w-[450px] flex-col gap-10">
                            <div className="flex h-fit w-full flex-col gap-5 rounded bg-neutral-100 px-7 py-5 text-sm text-black dark:bg-neutral-900 dark:text-white">
                                <div className="w-full text-lg font-semibold">Booking Status</div>
                                <div className="flex w-full items-center justify-between capitalize">
                                    <p>Status</p>
                                    <div
                                        className={`flex w-[100px] items-center justify-center rounded py-[6px] text-sm font-semibold capitalize ${
                                            data?.status === 'pending'
                                                ? 'bg-yellow-200 text-yellow-800'
                                                : data?.status === 'processing'
                                                  ? 'bg-blue-200 text-blue-800'
                                                  : data?.status === 'accepted'
                                                    ? 'bg-indigo-200 text-indigo-800'
                                                    : data?.status === 'completed'
                                                      ? 'bg-green-200 text-green-800'
                                                      : data?.status === 'canceled'
                                                        ? 'bg-red-200 text-red-800'
                                                        : 'bg-transparent text-transparent'
                                        }`}
                                    >
                                        {data.status}
                                    </div>
                                </div>

                                <div className="flex w-full flex-col gap-2">
                                    {data.status === 'pending' ? (
                                        <Button type="button" onClick={() => setIsShowAlertStatus(true)}>
                                            Accept Booking
                                        </Button>
                                    ) : null}

                                    {data.status !== 'canceled' && data.status !== 'completed' ? (
                                        <Button type="button" variant="destructive" onClick={() => setIsShowAlertStatusCancel(true)}>
                                            Cancel Booking
                                        </Button>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </AppLayout>

                <AlertDialog open={isShowAlertStatus} onOpenChange={setIsShowAlertStatus}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Booking Acceptance</AlertDialogTitle>
                            <AlertDialogDescription>
                                Please confirm if you wish to proceed with accepting this booking. Click "Continue" to finalize the process.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => updateStatus('accepted')}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={isShowAlertStatusCancel} onOpenChange={setIsShowAlertStatusCancel}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Booking Cancellation</AlertDialogTitle>
                            <AlertDialogDescription>
                                Please confirm if you wish to cancel this booking. Click "Continue" to proceed with the cancellation process.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button type="button" variant="destructive" onClick={() => updateStatus('canceled')}>
                                Continue
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {processing ? (
                    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 dark:bg-white/40">
                        <LoaderCircle className="h-14 w-14 animate-spin" />
                    </div>
                ) : null}
            </>
        );
    }
}
