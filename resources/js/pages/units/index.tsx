import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Megaphone, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Units',
        href: '/units',
    },
];

interface Unit {
    id: number;
    name: string;
    code: string;
}

interface PageProps {
    units: {
        data: Array<Unit>;
        current_page: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    success?: string;
}

export default function Index() {
    const { units, success } = usePage().props as PageProps;

    const [isShowSuccess, setIsShowSuccess] = useState<boolean>(true);
    const { processing, delete: destroy } = useForm();

    useEffect(() => {
        setIsShowSuccess(success ? true : false);
    }, [success]);

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Do you want to delete a unit - ${id}. ${name}`)) {
            destroy(route('units.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Units" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full flex-row justify-end">
                    <Button asChild className="w-fit">
                        <Link href="/units/add">Add Unit</Link>
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

                {units.data.length > 0 && (
                    <div className="m-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Code</TableHead>
                                    <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {units.data.map((unit) => (
                                    <TableRow key={unit.id}>
                                        <TableCell>{unit.name}</TableCell>
                                        <TableCell>{unit.code}</TableCell>
                                        <TableCell className="space-x-2 text-center">
                                            <Link href={route('units.edit', unit.id)}>
                                                <Button className="bg-slate-600 text-white hover:bg-slate-700">Edit</Button>
                                            </Link>
                                            <Button
                                                disabled={processing}
                                                onClick={() => handleDelete(unit.id, unit.name)}
                                                className="bg-red-500 text-white hover:bg-red-700"
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                    {units.links.map((link, i) => (
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
