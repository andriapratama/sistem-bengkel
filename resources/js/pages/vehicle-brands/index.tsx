import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type VehicleBrand } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Megaphone, MoreHorizontal, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Vehicle Brands',
        href: '/vehicle-brands',
    },
];

interface PageProps {
    vehicleBrands: {
        data: Array<VehicleBrand>;
        current_page: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    success?: string;
}

export default function Index() {
    const { vehicleBrands, success } = usePage().props as PageProps;

    const [isShowSuccess, setIsShowSuccess] = useState<boolean>(true);
    const { processing, delete: destroy } = useForm();

    useEffect(() => {
        setIsShowSuccess(success ? true : false);
    }, [success]);

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Do you want to delete a vechicle brand - ${id}. ${name}`)) {
            destroy(route('vehicle-brands.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vehicle Brands" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full flex-row justify-end">
                    <Button asChild className="w-fit">
                        <Link href="/vehicle-brands/add">Add Brand</Link>
                    </Button>
                </div>

                {isShowSuccess && (
                    <Alert className="m-4">
                        <Megaphone className="h-4 w-4" />
                        <AlertTitle>Success.</AlertTitle>
                        <AlertDescription>{success}</AlertDescription>
                        <Button
                            type="button"
                            size="icon"
                            className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer bg-transparent hover:bg-transparent"
                            onClick={() => setIsShowSuccess((prev) => !prev)}
                        >
                            <X className="h-4 w-4 text-white" />
                        </Button>
                    </Alert>
                )}

                {vehicleBrands.data.length > 0 && (
                    <div className="m-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vehicleBrands.data.map((brand) => (
                                    <TableRow key={brand.id}>
                                        <TableCell>{brand.name}</TableCell>
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
                                                        <Link href={route('vehicle-brands.edit', brand.id)}>Edit</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="cursor-pointer" onClick={() => handleDelete(brand.id, brand.name)}>
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
                    {vehicleBrands.links.map((link, i) => (
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
