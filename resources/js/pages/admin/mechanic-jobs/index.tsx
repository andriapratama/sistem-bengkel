import axios from 'axios';
import dayjs from 'dayjs';
import { ChevronDownIcon, MoreHorizontal } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, ServiceOrder, VehicleBrand, VehicleVariant } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

const vehicleSchema = z.object({
    vehicle_year: z.string().min(1, 'Vehicle year is required').max(4, 'Vehicle year maximal 4 characters.'),
    police_number: z.string().min(3, 'Police number minimum 3 characters').max(12, 'police number maximal 12 characters'),
    vehicle_variant_id: z.coerce.number().min(1, 'Vehicle type is required'),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mechanic Jobs',
        href: '/admin/mechanic-jobs',
    },
];

export default function Index() {
    const [data, setData] = useState<ServiceOrder[]>([]);
    const [status, setStatus] = useState<string>('');
    const [paymentStatus, setPaymentStatus] = useState<string>('');
    const [serviceType, setServiceType] = useState<string>('');
    const [date, setDate] = useState<string>(dayjs(new Date()).format('YYYY-MM-DD'));
    const [isShowDate, setIsShowDate] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [pageActive, setPageActive] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [paginations, setPaginations] = useState<number[]>([]);

    const [isShowNewService, setIsShowNewService] = useState<boolean>(false);
    const [errors, setErrors] = useState<Partial<Record<keyof VehicleFormValues, string>>>({});
    const [vehicleBrandId, setVehicleBrandId] = useState<number | null>(null);
    const [vehicleBrands, setVehicleBrands] = useState<VehicleBrand[]>([]);
    const [vehicleVariants, setVehicleVariants] = useState<VehicleVariant[]>([]);
    const [vehicleVariantsTmp, setVehicleVariantsTmp] = useState<VehicleVariant[]>([]);
    const [years, setYears] = useState<string[]>([]);
    const [processing, setProcessing] = useState<boolean>(false);

    const [newService, setNewService] = useState<VehicleFormValues>({
        vehicle_year: '',
        police_number: '',
        vehicle_variant_id: 0,
    });

    const getAll = useCallback(async () => {
        try {
            const queryParams: string[] = [];

            if (page) queryParams.push(`page=${page}`);
            if (date) queryParams.push(`service_date=${date}`);
            if (status) queryParams.push(`status=${status}`);
            if (paymentStatus) queryParams.push(`payment_status=${paymentStatus}`);
            if (serviceType) queryParams.push(`service_type=${serviceType}`);
            const rs = await axios.get(`/admin/mechanic-jobs/get-all?${queryParams.join('&')}`);

            if (rs.data.success) {
                const data = rs.data.serviceOrders;
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
    }, [status, date, paymentStatus, page, serviceType]);

    useEffect(() => {
        getAll();
    }, [getAll]);

    const getAllVehicle = useCallback(async () => {
        try {
            const rs = await axios.get(`/vehicles/get-all/vehicle-brands`);

            if (rs.data.success) {
                setVehicleBrands(rs.data.vehicleBrands);
                setVehicleVariants(rs.data.vehicleVariants);
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        getAllVehicle();
    }, [getAllVehicle]);

    useEffect(() => {
        if (vehicleBrandId) {
            const filter = vehicleVariants.filter((item) => item.vehicle_brand_id === vehicleBrandId);
            setVehicleVariantsTmp(filter);
        }
    }, [vehicleBrandId, vehicleVariants]);

    useEffect(() => {
        const yearList: string[] = [];
        const year = new Date().getFullYear();

        for (let i = year; i > 1940; i--) {
            yearList.push(`${i}`);
        }

        setYears(yearList);
    }, []);

    const onCreateService = async () => {
        const result = vehicleSchema.safeParse(newService);
        if (!result.success) {
            const flatErrors = result.error.flatten().fieldErrors;
            setErrors({
                vehicle_year: flatErrors.vehicle_year?.[0],
                police_number: flatErrors.police_number?.[0],
                vehicle_variant_id: flatErrors.vehicle_variant_id?.[0],
            });
            return;
        }

        try {
            setProcessing(true);
            const res = await axios.post('/admin/mechanic-jobs/store-new-service', newService);

            if (res.data.success) {
                const serviceOrder = res.data.data;
                router.visit(`/admin/mechanic-jobs/${serviceOrder.id}`);
                setIsShowNewService(false);
            }
        } catch (error: any) {
            const errors = error.response.data.errors;
            setErrors({
                vehicle_year: errors.vehicle_year?.[0],
                police_number: errors.police_number?.[0],
                vehicle_variant_id: errors.vehicle_variant_id?.[0],
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mechanic Jobs" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full items-end gap-4 px-5">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="date" className="px-1">
                            Date of birth
                        </Label>
                        <Popover open={isShowDate} onOpenChange={setIsShowDate}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" id="date" className="w-[200px] justify-between border-black font-normal dark:border-white">
                                    {date ? dayjs(date).format('DD/MM/YYYY') : 'Select date'}
                                    <ChevronDownIcon />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={new Date(date)}
                                    captionLayout="dropdown"
                                    onSelect={(date) => {
                                        setDate(dayjs(date).format('YYYY-MM-DD'));
                                        setIsShowDate(false);
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="status">Status</Label>
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
                                {['pending', 'processing', 'completed', 'canceled'].map((item) => (
                                    <SelectItem key={item} value={item} className="capitalize">
                                        {item}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="serviceType">Service Type</Label>
                        <Select
                            onValueChange={(e) => {
                                setServiceType(e);
                                setPage(1);
                            }}
                            value={serviceType ?? ''}
                        >
                            <SelectTrigger className="w-[200px] border-black capitalize dark:border-white">
                                <SelectValue placeholder="Select service type" />
                            </SelectTrigger>
                            <SelectContent>
                                {['booking', 'walk_in'].map((item) => (
                                    <SelectItem key={item} value={item} className="capitalize">
                                        {item}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
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
                                {['unpaid', 'paid'].map((item) => (
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
                            setPaymentStatus('');
                            setStatus('');
                            setServiceType('');
                            setDate(dayjs(new Date()).format('YYYY-MM-DD'));
                            setPage(1);
                        }}
                    >
                        Clear
                    </Button>

                    <Button
                        type="button"
                        onClick={() => {
                            setIsShowNewService(true);
                            setVehicleBrandId(null);
                            setNewService({
                                vehicle_year: '',
                                police_number: '',
                                vehicle_variant_id: 0,
                            });
                        }}
                    >
                        New Service
                    </Button>
                </div>
                <div className="m-4">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-black dark:border-white">
                                <TableHead>Date</TableHead>
                                <TableHead>Service Number</TableHead>
                                <TableHead>Member</TableHead>
                                <TableHead>Vehicle</TableHead>
                                <TableHead>Police Number</TableHead>
                                <TableHead>Queue</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-center">Payment Status</TableHead>
                                <TableHead>Service Type</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((order, i) => (
                                <TableRow key={order.id} className="border-black dark:border-white">
                                    <TableCell>{dayjs(order.service_date).format('DD/MM/YYYY')}</TableCell>
                                    <TableCell>{order.service_number}</TableCell>
                                    <TableCell>{order.user?.name ?? '-'}</TableCell>
                                    <TableCell>{order.vehicle_variant?.name ?? '-'}</TableCell>
                                    <TableCell className="uppercase">{order.police_number ?? '-'}</TableCell>
                                    <TableCell>{order.queue_number ?? '-'}</TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <div
                                                className={`flex w-[100px] items-center justify-center rounded py-[6px] text-xs font-semibold capitalize ${
                                                    order?.status === 'pending'
                                                        ? 'bg-yellow-200 text-yellow-800'
                                                        : order?.status === 'accepted'
                                                          ? 'bg-indigo-200 text-indigo-800'
                                                          : order?.status === 'processing'
                                                            ? 'bg-blue-200 text-blue-800'
                                                            : order?.status === 'completed'
                                                              ? 'bg-green-200 text-green-800'
                                                              : order?.status === 'canceled'
                                                                ? 'bg-red-200 text-red-800'
                                                                : 'bg-transparent text-transparent'
                                                }`}
                                            >
                                                {order.status}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <div
                                                className={`flex w-[100px] items-center justify-center rounded py-[6px] text-xs font-semibold capitalize ${
                                                    order?.payment_status === 'paid'
                                                        ? 'bg-green-200 text-green-800'
                                                        : order?.payment_status === 'unpaid'
                                                          ? 'bg-red-200 text-red-800'
                                                          : 'bg-transparent text-transparent'
                                                }`}
                                            >
                                                {order.payment_status}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{order.service_type === 'booking' ? 'Booking' : 'Walk In'}</TableCell>
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
                                                    <Link href={route('admin.mechanic-jobs.detail', order.id)}>Detail</Link>
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

            <Sheet open={isShowNewService} onOpenChange={setIsShowNewService}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>New Service</SheetTitle>
                    </SheetHeader>
                    <div className="grid flex-1 auto-rows-min gap-6 overflow-y-auto px-4">
                        <div className="w-full">
                            <Label htmlFor="vehicle_brand">Vehicle Brand</Label>
                            <Select onValueChange={(e) => setVehicleBrandId(parseInt(e))} value={vehicleBrandId?.toString() ?? ''}>
                                <SelectTrigger disabled={processing} className={`w-full`}>
                                    <SelectValue placeholder="Select vehicle brand" />
                                </SelectTrigger>
                                <SelectContent>
                                    {vehicleBrands.map((item) => (
                                        <SelectItem key={item.id} value={item.id.toString()}>
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full">
                            <Label htmlFor="vehicle_variant">Vehicle Type</Label>
                            <Select
                                onValueChange={(e) => {
                                    setNewService((prev) => ({ ...prev, vehicle_variant_id: parseInt(e) }));
                                    if (errors.vehicle_variant_id) {
                                        setErrors((prev) => ({ ...prev, vehicle_variant_id: undefined }));
                                    }
                                }}
                                value={newService?.vehicle_variant_id > 0 ? newService?.vehicle_variant_id.toString() : ''}
                            >
                                <SelectTrigger
                                    disabled={processing || !vehicleBrandId}
                                    className={`w-full ${errors.vehicle_variant_id ? 'border-red-500' : ''}`}
                                >
                                    <SelectValue placeholder="Select vehicle type" />
                                </SelectTrigger>
                                {vehicleVariantsTmp && vehicleVariantsTmp.length > 0 ? (
                                    <SelectContent>
                                        {vehicleVariantsTmp.map((item) => (
                                            <SelectItem key={item.id} value={item.id.toString()}>
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                ) : null}
                            </Select>
                            {errors.vehicle_variant_id && <p className="text-sm text-red-500">{errors.vehicle_variant_id}</p>}
                        </div>
                        <div className="w-full">
                            <Label htmlFor="vehicle_year">Vehicle Year</Label>
                            <Select
                                onValueChange={(e) => {
                                    setNewService((prev) => ({ ...prev, vehicle_year: e }));
                                    if (errors.vehicle_year) {
                                        setErrors((prev) => ({ ...prev, vehicle_year: undefined }));
                                    }
                                }}
                                value={newService?.vehicle_year}
                            >
                                <SelectTrigger disabled={processing} className={`w-full ${errors.vehicle_year ? 'border-red-500' : ''}`}>
                                    <SelectValue placeholder="Select vehicle year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map((year) => (
                                        <SelectItem key={year} value={year}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.vehicle_year && <p className="text-sm text-red-500">{errors.vehicle_year}</p>}
                        </div>
                        <div className="w-full">
                            <Label htmlFor="police_number">Police Number</Label>
                            <Input
                                id="police_number"
                                value={newService?.police_number}
                                disabled={processing}
                                placeholder="ex: DK 1212 MD"
                                onChange={(e) => {
                                    setNewService((prev) => ({ ...prev, police_number: e.target.value }));

                                    if (errors.police_number) {
                                        setErrors((prev) => ({ ...prev, police_number: undefined }));
                                    }
                                }}
                                className={errors.police_number ? 'border-red-500' : ''}
                            />
                            {errors.police_number && <p className="text-sm text-red-500">{errors.police_number}</p>}
                        </div>
                    </div>
                    <SheetFooter>
                        <Button type="button" onClick={() => onCreateService()}>
                            New Service Order
                        </Button>
                        <SheetClose asChild>
                            <Button variant="outline">Close</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </AppLayout>
    );
}
