import axios from 'axios';
import dayjs from 'dayjs';
import { MoreHorizontal } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BookingService, BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Bookings',
        href: '/admin/bookings',
    },
];

export default function Index() {
    const [data, setData] = useState<BookingService[]>([]);
    const [status, setStatus] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [pageActive, setPageActive] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [paginations, setPaginations] = useState<number[]>([]);

    const formatPrice = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(number);
    };

    const formatDate = (created_at: Date) => {
        return dayjs(created_at).format('DD/MM/YYYY');
    };

    const getAll = useCallback(async () => {
        try {
            const queryParams: string[] = [];

            if (page) queryParams.push(`page=${page}`);
            if (status) queryParams.push(`status=${status}`);
            const rs = await axios.get(`/admin/bookings/get-all?${queryParams.join('&')}`);

            if (rs.data.success) {
                const data = rs.data.bookings;
                setData(data.data);
                setTotalPage(data.last_page);
                setPageActive(data.current_page);

                const newPaginations: number[] = [];
                for (let i = 1; i <= data.last_page; i++) {
                    newPaginations.push(i);
                }
                setPaginations(newPaginations);
            } else {
                console.log(rs);
            }
        } catch (error) {
            console.log(error);
        }
    }, [status, page]);

    useEffect(() => {
        getAll();
    }, [getAll]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full items-end gap-4 px-5">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="paymentMethod">Status</Label>
                        <Select
                            onValueChange={(e) => {
                                setStatus(e);
                                setPage(1);
                            }}
                            value={status ?? ''}
                        >
                            <SelectTrigger className="w-[200px] border-black capitalize dark:border-white">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {['pending', 'accepted', 'processing', 'completed', 'canceled'].map((item) => (
                                    <SelectItem key={item} value={item} className="capitalize">
                                        {item}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                            setStatus('');
                            setPage(1);
                        }}
                    >
                        Clear
                    </Button>
                </div>
                <div className="m-4">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-black dark:border-white">
                                <TableHead>Date</TableHead>
                                <TableHead>Member</TableHead>
                                <TableHead>Vehicle</TableHead>
                                <TableHead>Police Number</TableHead>
                                <TableHead>Queue</TableHead>
                                <TableHead>Estimated Start</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((booking, i) => (
                                <TableRow key={booking.id} className="border-black dark:border-white">
                                    <TableCell>{formatDate(booking.date_booking)}</TableCell>
                                    <TableCell>{booking.user?.name}</TableCell>
                                    <TableCell>{booking.vehicle?.vehicle_variant?.name}</TableCell>
                                    <TableCell className="uppercase">{booking.vehicle?.police_number}</TableCell>
                                    <TableCell>{booking.queue_number}</TableCell>
                                    <TableCell>{dayjs(booking.estimated_service_start).format('hh:mm')}</TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <div
                                                className={`flex w-[100px] items-center justify-center rounded py-[6px] text-xs font-semibold capitalize ${
                                                    booking?.status === 'pending'
                                                        ? 'bg-yellow-200 text-yellow-800'
                                                        : booking?.status === 'processing'
                                                          ? 'bg-blue-200 text-blue-800'
                                                          : booking?.status === 'accepted'
                                                            ? 'bg-indigo-200 text-indigo-800'
                                                            : booking?.status === 'completed'
                                                              ? 'bg-green-200 text-green-800'
                                                              : booking?.status === 'canceled'
                                                                ? 'bg-red-200 text-red-800'
                                                                : 'bg-transparent text-transparent'
                                                }`}
                                            >
                                                {booking.status}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="space-x-2 text-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="cursor-pointer" asChild>
                                                    <Link href={route('admin.bookings.detail', booking.id)}>Detail</Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {totalPage > 1 ? (
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <Button type="button" onClick={() => setPage((prev) => prev - 1)} disabled={page === 1} variant="ghost">
                                    Prev
                                </Button>
                            </PaginationItem>
                            {paginations.map((item) => {
                                const isActive = item === pageActive ? true : false;
                                return (
                                    <PaginationItem key={item}>
                                        <Button
                                            type="button"
                                            onClick={() => setPage(item)}
                                            variant={isActive ? 'outline' : 'ghost'}
                                            className="border-black dark:border-white"
                                        >
                                            {item}
                                        </Button>
                                    </PaginationItem>
                                );
                            })}
                            <PaginationItem>
                                <Button type="button" onClick={() => setPage((prev) => prev + 1)} disabled={page === totalPage} variant="ghost">
                                    Next
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                ) : null}
            </div>
        </AppLayout>
    );
}
