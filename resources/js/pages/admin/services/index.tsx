import { MoreHorizontal } from 'lucide-react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { showToast } from '@/lib/utils/toast';
import { BreadcrumbItem, Service } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Services',
        href: '/services',
    },
];

type PageProps = {
    services: {
        data: Array<Service>;
        current_page: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    success?: string;
};

export default function Index() {
    const { services, success } = usePage<PageProps>().props;

    const { processing, delete: destroy } = useForm();

    useEffect(() => {
        if (success) {
            showToast(success);
        }
    }, [success]);

    useEffect(() => {
        console.log(services);
    }, [services]);

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Do you want to delete a service - ${id}. ${name}`)) {
            destroy(route('admin.services.destroy', id));
        }
    };

    const formatPrice = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(number);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Services" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full flex-row justify-end">
                    <Button asChild className="w-fit">
                        <Link href="/admin/services/add">Add Service</Link>
                    </Button>
                </div>

                {services.data.length > 0 && (
                    <div className="m-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Estimated Duration</TableHead>
                                    <TableHead>Estimated Price</TableHead>
                                    <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {services.data.map((service) => (
                                    <TableRow key={service.id}>
                                        <TableCell>{service.name}</TableCell>
                                        <TableCell>{service.estimated_duration ?? 0} Minutes</TableCell>
                                        <TableCell>{formatPrice(service.estimated_price ?? 0)}</TableCell>
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
                                                        Detail
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="cursor-pointer" asChild>
                                                        <Link href={route('admin.services.edit', service.id)}>Edit</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="cursor-pointer"
                                                        onClick={() => handleDelete(service.id, service.name)}
                                                    >
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                    {services.links.map((link, i) => (
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
                </div>
            </div>
        </AppLayout>
    );
}
