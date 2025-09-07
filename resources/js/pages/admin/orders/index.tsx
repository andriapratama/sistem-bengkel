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
import { BreadcrumbItem, Transaction } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Orders',
        href: '/admin/orders',
    },
];

export default function Index() {
    const [data, setData] = useState<Transaction[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<string>('');
    const [paymentStatus, setPaymentStatus] = useState<string>('');
    const [shippingStatus, setShippingStatus] = useState<string>('');
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
        return dayjs(created_at).format('DD/MM/YYYY, HH.mm');
    };

    const getAll = useCallback(async () => {
        try {
            const queryParams: string[] = [];

            if (page) queryParams.push(`page=${page}`);
            if (shippingStatus) queryParams.push(`shipping_status=${shippingStatus}`);
            if (paymentMethod) queryParams.push(`payment_method=${paymentMethod}`);
            if (paymentStatus) queryParams.push(`payment_status=${paymentStatus}`);
            const rs = await axios.get(`/admin/orders/get-all?${queryParams.join('&')}`);

            if (rs.data.success) {
                const data = rs.data.transaction;
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
    }, [shippingStatus, paymentMethod, paymentStatus, page]);

    useEffect(() => {
        getAll();
    }, [getAll]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full items-end gap-4 px-5">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="paymentStatus">Payment Status</Label>
                        <Select
                            onValueChange={(e) => {
                                setPaymentStatus(e);
                                setPage(1);
                            }}
                            value={paymentStatus ?? ''}
                        >
                            <SelectTrigger className="w-[200px] border-black capitalize dark:border-white">
                                <SelectValue placeholder="Select payment status" />
                            </SelectTrigger>
                            <SelectContent>
                                {['pending', 'paid', 'failed'].map((item) => (
                                    <SelectItem key={item} value={item} className="capitalize">
                                        {item}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="shippingStatus">Shipping Status</Label>
                        <Select
                            onValueChange={(e) => {
                                setShippingStatus(e);
                                setPage(1);
                            }}
                            value={shippingStatus ?? ''}
                        >
                            <SelectTrigger className="w-[200px] border-black capitalize dark:border-white">
                                <SelectValue placeholder="Select shipping status" />
                            </SelectTrigger>
                            <SelectContent>
                                {['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'failed'].map((item) => (
                                    <SelectItem key={item} value={item} className="capitalize">
                                        {item}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="paymentMethod">Payment Method</Label>
                        <Select
                            onValueChange={(e) => {
                                setPaymentMethod(e);
                                setPage(1);
                            }}
                            value={paymentMethod ?? ''}
                        >
                            <SelectTrigger className="w-[200px] border-black capitalize dark:border-white">
                                <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                                {[
                                    { name: 'Bank Transfer', value: 'bank_transfer' },
                                    { name: 'e-Wallet', value: 'ewallet' },
                                    { name: 'Cash on Delivery', value: 'cod' },
                                ].map((item) => (
                                    <SelectItem key={item.value} value={item.value} className="capitalize">
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                            setPaymentMethod('');
                            setPaymentStatus('');
                            setShippingStatus('');
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
                                <TableHead>Invoice Number</TableHead>
                                <TableHead>Member</TableHead>
                                <TableHead className="text-center">Payment Status</TableHead>
                                <TableHead className="text-center">Shipping Status</TableHead>
                                <TableHead>Payment Method</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((order) => (
                                <TableRow key={order.id} className="border-black dark:border-white">
                                    <TableCell>{formatDate(order.created_at)}</TableCell>
                                    <TableCell>{order.invoice_number}</TableCell>
                                    <TableCell>{order.user.name}</TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <div
                                                className={`flex w-[100px] items-center justify-center rounded py-[6px] text-xs font-semibold capitalize ${
                                                    order.payment_status === 'pending'
                                                        ? 'bg-yellow-200 text-yellow-800'
                                                        : order.payment_status === 'paid'
                                                          ? 'bg-green-200 text-green-800'
                                                          : 'bg-red-200 text-red-800'
                                                }`}
                                            >
                                                {order.payment_status}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <div
                                                className={`flex w-[100px] items-center justify-center rounded py-[6px] text-xs font-semibold capitalize ${
                                                    order.shipping_status === 'pending'
                                                        ? 'bg-yellow-200 text-yellow-800'
                                                        : order.shipping_status === 'processing'
                                                          ? 'bg-blue-200 text-blue-800'
                                                          : order.shipping_status === 'shipped'
                                                            ? 'bg-indigo-200 text-indigo-800'
                                                            : order.shipping_status === 'delivered'
                                                              ? 'bg-green-200 text-green-800'
                                                              : order.shipping_status === 'canceled'
                                                                ? 'bg-gray-200 text-gray-800'
                                                                : 'bg-red-200 text-red-800'
                                                }`}
                                            >
                                                {order.shipping_status}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {order.payment_method === 'bank_transfer'
                                            ? 'Bank Transfer'
                                            : order.payment_method === 'ewallet'
                                              ? 'e-Wallet'
                                              : 'Cash on Delivery'}
                                    </TableCell>
                                    <TableCell>{formatPrice(order.grand_total)}</TableCell>
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
                                                    <Link href={route('admin.orders.detail', order.id)}>Detail</Link>
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
