import axios from 'axios';
import { LoaderCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BookingService, BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { z } from 'zod';
import { showToast } from '../../../lib/utils/toast';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'e-Wallets',
        href: '/admin/ewallets',
    },
];

const walletSchema = z.object({
    name: z.string().min(1, 'Name wallet is required'),
    number: z.string().min(1, 'Number wallet is required'),
    status: z.boolean(),
});

type WalletFormValues = z.infer<typeof walletSchema>;

export default function Index() {
    const [data, setData] = useState<BookingService[]>([]);
    const [status, setStatus] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [pageActive, setPageActive] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [paginations, setPaginations] = useState<number[]>([]);
    const [form, setForm] = useState<WalletFormValues>({ name: '', number: '', status: false });
    const [isShowCreate, setIsShowCreate] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);
    const [errors, setErrors] = useState<Partial<Record<keyof WalletFormValues, string>>>({});

    const getAll = useCallback(async () => {
        try {
            const queryParams: string[] = [];

            if (page) queryParams.push(`page=${page}`);
            if (status) queryParams.push(`status=${status}`);
            const rs = await axios.get(`/admin/ewallets/get-all?${queryParams.join('&')}`);
            if (rs.data.success) {
                const data = rs.data.data;
                console.log(data);
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
    }, [status, page]);

    useEffect(() => {
        getAll();
    }, [getAll]);

    const onCreate = async () => {
        try {
            const result = walletSchema.safeParse(form);
            if (!result.success) {
                const flatErrors = result.error.flatten().fieldErrors;
                setErrors({
                    name: flatErrors.name?.[0],
                    number: flatErrors.number?.[0],
                });
                return;
            }

            setProcessing(true);

            await axios.post('/admin/ewallets', form);
            showToast('e-Wallet created successfully.');
            setIsShowCreate(false);
        } catch (error) {
            console.log(error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full justify-end gap-4 px-5">
                    <Button
                        type="button"
                        onClick={() => {
                            setIsShowCreate(true);
                            setForm({ name: '', number: '', status: false });
                        }}
                    >
                        Add e-Wallet
                    </Button>
                </div>
                <div className="m-4">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-black dark:border-white">
                                <TableHead>Name</TableHead>
                                <TableHead>Number Wallet</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item) => {
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.number}</TableCell>
                                        <TableCell>{item.status ? 'Active' : 'Inactive'}</TableCell>
                                        <TableCell></TableCell>
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

            <Sheet open={isShowCreate} onOpenChange={setIsShowCreate}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Add e-Wallet</SheetTitle>
                    </SheetHeader>
                    <div className="grid flex-1 auto-rows-min gap-6 overflow-y-auto px-4">
                        <div className="w-full">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="ex. Dana, Ovo, Gopay"
                                value={form.name}
                                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                                disabled={processing}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div className="w-full">
                            <Label htmlFor="number">Number</Label>
                            <Input
                                id="number"
                                placeholder="ex. 1234567xxx"
                                value={form.number}
                                onChange={(e) => setForm((prev) => ({ ...prev, number: e.target.value }))}
                                disabled={processing}
                            />
                            {errors.number && <p className="text-sm text-red-500">{errors.number}</p>}
                        </div>

                        <div className="flex items-center gap-5">
                            <Label htmlFor="status">Status</Label>
                            <Switch
                                checked={form.status}
                                onCheckedChange={(e) => setForm((prev) => ({ ...prev, status: e }))}
                                disabled={processing}
                            />
                        </div>
                    </div>
                    <SheetFooter>
                        <Button type="button" onClick={() => onCreate()} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Save
                        </Button>
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
