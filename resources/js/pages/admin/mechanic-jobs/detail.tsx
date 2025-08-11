import axios from 'axios';
import { LoaderCircle, Minus, Plus, Trash } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Product, Service, ServiceOrder, ServiceOrderDetail } from '@/types';
import { Head, usePage } from '@inertiajs/react';

type PageProps = {
    id: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mechanic Job Detail',
        href: '/admin/mechanic-jobs',
    },
];

export default function Detail() {
    const { id } = usePage<PageProps>().props;
    const [data, setData] = useState<ServiceOrder | null>(null);

    const [serviceDetail, setServiceDetail] = useState<ServiceOrderDetail[]>([]);
    const [isShowService, setIsShowService] = useState<boolean>(false);
    const [serviceList, setServiceList] = useState<Service[]>([]);
    const [serviceDetailId, setServiceDetailId] = useState<number | null>(null);
    const [isShowRemoveServiceAlert, setIsShowRemoveServiceAlert] = useState<boolean>(false);

    const [serviceDetailProduct, setServiceDetailProduct] = useState<ServiceOrderDetail[]>([]);
    const [isShowProduct, setIsShowProduct] = useState<boolean>(false);
    const [productList, setProductList] = useState<Product[]>([]);

    const [processing, setProcessing] = useState<boolean>(false);

    const getOrder = useCallback(async () => {
        try {
            setProcessing(true);
            const rs = await axios.get(`/admin/mechanic-jobs/get-one/${id}`);

            if (rs.data.success) {
                const resData = rs.data.serviceOrder;
                setData(resData);
                setServiceDetail(resData.service_order_details);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setProcessing(false);
        }
    }, [id]);

    useEffect(() => {
        getOrder();
    }, [getOrder]);

    const getServices = useCallback(async () => {
        try {
            const rs = await axios.get('/booking/services');

            if (rs.data.success) {
                setServiceList(rs.data.services);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setProcessing(false);
        }
    }, []);

    useEffect(() => {
        getServices();
    }, [getServices]);

    const getProducts = useCallback(async () => {
        try {
            const rs = await axios.get('/admin/products/get-all');

            if (rs.data.success) {
                setProductList(rs.data.products.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setProcessing(false);
        }
    }, []);

    useEffect(() => {
        getProducts();
    }, [getProducts]);

    useEffect(() => {
        console.log(productList);
    }, [productList]);

    const formatPrice = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(number);
    };

    const onAddService = async (service: Service) => {
        try {
            setProcessing((prev) => !prev);
            const data = {
                service_order_id: id,
                service_id: service.id,
            };

            await axios.post('/admin/mechanic-jobs/store-service', data);
            await getOrder();
            setIsShowService((prev) => !prev);
        } catch (error) {
            console.log(error);
        } finally {
            setProcessing(false);
        }
    };

    const onRemoveService = async () => {
        try {
            setProcessing((prev) => !prev);
            await axios.delete(`/admin/mechanic-jobs/destroy-service/${serviceDetailId}`);
            await getOrder();
            setIsShowRemoveServiceAlert((prev) => !prev);
            setServiceDetailId(null);
        } catch (error) {
            console.log(error);
        } finally {
            setProcessing(false);
        }
    };

    if (data) {
        return (
            <>
                <AppLayout breadcrumbs={breadcrumbs}>
                    <Head title="Mechanic Job Detail" />
                    <div className="flex h-full flex-1 gap-10 overflow-x-auto rounded-xl p-7">
                        <div className="flex w-full gap-10">
                            <div className="flex-1">
                                <div className="mb-10 flex flex-1 flex-col">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-black dark:border-white">
                                                <TableHead className="line-clamp-1">Service Name</TableHead>
                                                <TableHead>Estimated Price</TableHead>
                                                <TableHead className="w-[30%]">Fix Price</TableHead>
                                                <TableHead className="w-[10%] text-center">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {serviceDetail?.map((item, i) => {
                                                return (
                                                    <TableRow key={item.id} className="border-black dark:border-white">
                                                        <TableCell>{item.name}</TableCell>
                                                        <TableCell>{formatPrice(item.service?.estimated_price ?? 0)}</TableCell>
                                                        <TableCell>
                                                            <div className="relative flex items-center">
                                                                <Input id={'price' + i} className="pl-10" />
                                                                <div className="pointer-events-none absolute left-3 text-sm">Rp</div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex justify-center">
                                                                <Button
                                                                    type="button"
                                                                    size="icon"
                                                                    variant="destructive"
                                                                    className="size-8"
                                                                    onClick={() => {
                                                                        setServiceDetailId(item.id);
                                                                        setIsShowRemoveServiceAlert(true);
                                                                    }}
                                                                >
                                                                    <Trash />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                    <div className="mt-5 flex w-full justify-end">
                                        <Button type="button" onClick={() => setIsShowService(true)}>
                                            Add Service
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex flex-1 flex-col">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-black dark:border-white">
                                                <TableHead className="line-clamp-1">Product Name</TableHead>
                                                <TableHead>Price</TableHead>
                                                <TableHead className="w-[20%] text-center">Quantity</TableHead>
                                                <TableHead>Subtotal</TableHead>
                                                <TableHead className="w-[10%] text-center">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {[1]?.map((item, i) => {
                                                return (
                                                    <TableRow key={item} className="border-black dark:border-white">
                                                        <TableCell>Oli Castrol</TableCell>
                                                        <TableCell>{formatPrice(100000)}</TableCell>
                                                        <TableCell>
                                                            <div className="flex w-full items-center justify-center gap-1">
                                                                <Button
                                                                    type="button"
                                                                    className="rounded border-black dark:border-white"
                                                                    variant="outline"
                                                                >
                                                                    <Minus />
                                                                </Button>
                                                                <div className="flex h-[35px] w-[100px] items-center justify-center rounded border border-solid border-black dark:border-white">
                                                                    {1}
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    className="rounded border-black dark:border-white"
                                                                    variant="outline"
                                                                >
                                                                    <Plus />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{formatPrice(100000)}</TableCell>
                                                        <TableCell>
                                                            <div className="flex justify-center">
                                                                <Button type="button" size="icon" variant="destructive" className="size-8">
                                                                    <Trash />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                    <div className="mt-5 flex w-full justify-end">
                                        <Button type="button" onClick={() => setIsShowProduct(true)}>
                                            Add Product
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-10 flex w-[400px] flex-col gap-10 text-sm">
                                <div className="flex h-fit w-full flex-col gap-3 rounded bg-neutral-100 px-7 py-5 text-black dark:bg-neutral-900 dark:text-white">
                                    <div className="w-full text-lg font-semibold">Service Information</div>
                                    <div className="flex w-full items-center justify-between">
                                        <p>Service Number :</p>
                                        <p>{data.service_number}</p>
                                    </div>
                                    <div className="flex w-full items-center justify-between">
                                        <p>Service Type :</p>
                                        <p>{data.service_type === 'booking' ? 'Booking' : 'Walk In'}</p>
                                    </div>
                                    <div className="flex w-full items-center justify-between">
                                        <p>Queue Number :</p>
                                        <p>{data.queue_number}</p>
                                    </div>
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
                                    <div className="flex w-full items-center justify-between capitalize">
                                        <p>Payment Status</p>
                                        <div
                                            className={`flex w-[100px] items-center justify-center rounded py-[6px] text-sm font-semibold capitalize ${
                                                data?.payment_status === 'paid'
                                                    ? 'bg-green-200 text-green-800'
                                                    : data?.payment_status === 'unpaid'
                                                      ? 'bg-red-200 text-red-800'
                                                      : 'bg-transparent text-transparent'
                                            }`}
                                        >
                                            {data.payment_status}
                                        </div>
                                    </div>

                                    <Button type="button">Process Service</Button>
                                </div>
                                <div className="flex h-fit w-full flex-col gap-3 rounded bg-neutral-100 px-7 py-5 text-black dark:bg-neutral-900 dark:text-white">
                                    <div className="w-full text-lg font-semibold">Customer Information</div>
                                    <div className="flex w-full items-center justify-between">
                                        <p>Name :</p>
                                        <p>{data.user?.name}</p>
                                    </div>
                                    <div className="flex w-full items-center justify-between">
                                        <p>Whatsapp :</p>
                                        <p>{data.user?.phone ?? '-'}</p>
                                    </div>
                                    <div className="flex w-full items-center justify-between">
                                        <p>Email :</p>
                                        <p>{data.user?.email}</p>
                                    </div>
                                    <div className="flex w-full items-center justify-between">
                                        <p>Vehicle :</p>
                                        <p>{data.vehicle?.vehicle_variant?.name}</p>
                                    </div>
                                    <div className="flex w-full items-center justify-between">
                                        <p>Vehicle Brand :</p>
                                        <p>{data.vehicle?.vehicle_variant?.vehicle_brand?.name}</p>
                                    </div>
                                    <div className="flex w-full items-center justify-between">
                                        <p>Vehicle Year :</p>
                                        <p>{data.vehicle?.vehicle_year}</p>
                                    </div>
                                    <div className="flex w-full items-center justify-between">
                                        <p>Police Number :</p>
                                        <p className="uppercase">{data.vehicle?.police_number}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </AppLayout>

                <Sheet open={isShowService} onOpenChange={setIsShowService}>
                    <SheetContent className="min-w-[500px]">
                        <SheetHeader>
                            <SheetTitle>Services</SheetTitle>
                        </SheetHeader>
                        <div className="grid flex-1 auto-rows-min gap-6 overflow-y-auto px-4">
                            <div className="w-full">
                                {serviceList?.map((service) => {
                                    const check = serviceDetail.find((item) => item.service_id === service.id);

                                    return (
                                        <div
                                            key={service.id}
                                            className="flex w-full items-center gap-5 border-b border-solid border-black p-3 last:border-transparent dark:border-white"
                                        >
                                            <div className="flex flex-1 flex-col">
                                                <div className="font-semibold">{service.name}</div>
                                                <p className="line-clamp-6 text-[13px]">{service.description}</p>
                                            </div>
                                            {!check ? (
                                                <Button type="button" size="icon" className="size-8" onClick={() => onAddService(service)}>
                                                    <Plus />
                                                </Button>
                                            ) : null}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <SheetFooter>
                            <SheetClose asChild>
                                <Button variant="outline">Close</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>

                <Sheet open={isShowProduct} onOpenChange={setIsShowProduct}>
                    <SheetContent className="min-w-[500px]">
                        <SheetHeader>
                            <SheetTitle>Products</SheetTitle>
                        </SheetHeader>
                        <div className="grid flex-1 auto-rows-min gap-6 overflow-y-auto px-4">
                            <div className="w-full">
                                {productList?.map((product) => {
                                    return (
                                        <div
                                            key={product.id}
                                            className="flex w-full items-center gap-5 border-b border-solid border-black p-3 last:border-transparent dark:border-white"
                                        >
                                            <div className="flex flex-1 flex-col">
                                                <div className="font-semibold">{product.name}</div>
                                            </div>

                                            <Button type="button" size="icon" className="size-8">
                                                <Plus />
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <SheetFooter>
                            <SheetClose asChild>
                                <Button variant="outline">Close</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>

                <AlertDialog open={isShowRemoveServiceAlert} onOpenChange={setIsShowRemoveServiceAlert}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Remove Service?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to remove this service? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button type="button" variant="destructive" onClick={() => onRemoveService()}>
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
