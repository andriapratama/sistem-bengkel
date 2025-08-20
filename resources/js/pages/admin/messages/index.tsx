import axios from 'axios';
import { MoreHorizontal } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Message } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Messages',
        href: '/admin/messages',
    },
];

export default function Index() {
    const [data, setData] = useState<Message[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageActive, setPageActive] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [paginations, setPaginations] = useState<number[]>([]);
    const [isShowDetail, setIsShowDetail] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);
    const [detail, setDetail] = useState<Message>({});

    const getAll = useCallback(async () => {
        try {
            const queryParams: string[] = [];

            if (page) queryParams.push(`page=${page}`);
            const rs = await axios.get(`/admin/messages/get-all?${queryParams.join('&')}`);
            if (rs.data.success) {
                const data = rs.data.messages;
                setData(data.data);
                setTotalPage(data.last_page);
                setPageActive(data.current_page);

                const newPaginations: number[] = [];
                for (let i = 1; i <= data.last_page; i++) {
                    newPaginations.push(i);
                }
                setPaginations(newPaginations);
            }
        } catch (error) {
            console.log(error);
        }
    }, [page]);

    useEffect(() => {
        getAll();
    }, [getAll]);

    const onUpdate = async (id: number) => {
        try {
            await axios.put(`/admin/messages/${id}`);
            await getAll();
        } catch (error) {
            console.log(error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Messages" />
            <div className="mx-auto flex h-full w-full max-w-[1000px] flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="m-4">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-black dark:border-white">
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Whatsaap</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item) => {
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.email}</TableCell>
                                        <TableCell>{item.phone}</TableCell>
                                        <TableCell>{item.status ? 'Opened' : 'Unopened'}</TableCell>
                                        <TableCell>
                                            <div className="flex justify-center">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            className="cursor-pointer"
                                                            onClick={() => {
                                                                setDetail({
                                                                    name: item.name,
                                                                    email: item.email,
                                                                    phone: item.phone,
                                                                    message: item.message,
                                                                    status: Boolean(item.status),
                                                                });
                                                                setTimeout(() => {
                                                                    setIsShowDetail(true);
                                                                    if (!item.status) {
                                                                        onUpdate(item.id);
                                                                    }
                                                                }, 200);
                                                            }}
                                                        >
                                                            Open
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
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

            <Sheet open={isShowDetail} onOpenChange={setIsShowDetail}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Message Detail</SheetTitle>
                    </SheetHeader>
                    <div className="grid flex-1 auto-rows-min gap-6 overflow-y-auto px-4">
                        <div className="w-full">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={detail.name} disabled className="border-black disabled:opacity-100 dark:border-white" />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" value={detail.email} disabled className="border-black disabled:opacity-100 dark:border-white" />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="phone">Whatsapp</Label>
                            <Input id="phone" value={detail.phone} disabled className="border-black disabled:opacity-100 dark:border-white" />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="message">Message</Label>
                            <div className="w-full rounded-md border border-solid border-black px-3 py-2 text-sm text-black dark:border-white dark:text-white">
                                {detail.message}
                            </div>
                        </div>
                    </div>
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button variant="outline" disabled={processing}>
                                Close
                            </Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </AppLayout>
    );
}
