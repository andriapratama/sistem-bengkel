import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Orders',
        href: '/admin/orders',
    },
];

export default function Index() {
    const formatPrice = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(number);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="m-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Invoice Number</TableHead>
                                <TableHead>Member</TableHead>
                                <TableHead className="text-center">Payment Status</TableHead>
                                <TableHead className="text-center">Shipping Status</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[1, 2, 3].map((order, i) => (
                                <TableRow key={i}>
                                    <TableCell>1 Augstus 2025</TableCell>
                                    <TableCell>TRS2032230001</TableCell>
                                    <TableCell>Made</TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <div className="flex w-[150px] items-center justify-center rounded bg-green-600 py-[6px] text-xs font-semibold text-white">
                                                Paid
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <div className="flex w-[150px] items-center justify-center rounded bg-yellow-600 py-[6px] text-xs font-semibold text-white">
                                                Pending
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatPrice(100000)}</TableCell>
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
                                                    <Link href={route('admin.orders.detail', 1)}>Detail</Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* <div id="pagination" className="mt-4 flex flex-wrap gap-2">
                    {products.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url || ''}
                            preserveScroll
                            className={`rounded border px-3 py-1 ${
                                link.active ? 'bg-blue-600 text-white' : link.url ? 'hover:bg-blue-100' : 'cursor-not-allowed text-gray-400'
                            }`}
                            disabled={!link.url}
                        >
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        </Link>
                    ))}
                </div> */}
            </div>
        </AppLayout>
    );
}
