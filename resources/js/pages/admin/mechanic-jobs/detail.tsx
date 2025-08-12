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
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Product, Service, ServiceOrder, ServiceOrderDetail, ServiceOrderDetailProduct } from '@/types';
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

    const [serviceDetailProduct, setServiceDetailProduct] = useState<ServiceOrderDetailProduct[]>([]);
    const [isShowProduct, setIsShowProduct] = useState<boolean>(false);
    const [productList, setProductList] = useState<Product[]>([]);
    const [productPage, setProductPage] = useState<number>(1);
    const [productPageActive, setProductPageActive] = useState<number>(1);
    const [productTotalPage, setProductTotalPage] = useState<number>(1);
    const [productPaginations, setProductPaginations] = useState<number[]>([]);
    const [productSearch, setProductSearch] = useState<string>('');
    const [productId, setProductId] = useState<number | null>(null);
    const [isShowRemoveProductAlert, setIsShowRemoveProductAlert] = useState<boolean>(false);

    const [grandTotal, setGrandTotal] = useState<number>(0);

    const [isShowProcess, setIsShowProcess] = useState<boolean>(false);
    const [isShowComplete, setIsShowComplete] = useState<boolean>(false);
    const [isShowCancel, setIsShowCancel] = useState<boolean>(false);

    const [processing, setProcessing] = useState<boolean>(false);

    const getOrder = useCallback(
        async (isLoading: boolean = false) => {
            try {
                setProcessing(isLoading);
                const rs = await axios.get(`/admin/mechanic-jobs/get-one/${id}`);

                if (rs.data.success) {
                    const resData = rs.data.serviceOrder;
                    setData(resData);
                    setServiceDetail(resData.service_order_details);
                    setServiceDetailProduct(resData.service_order_detail_products);

                    let total = 0;
                    if (resData.service_order_details && resData.service_order_details.length > 0) {
                        resData.service_order_details.map((item: ServiceOrderDetail) => {
                            total += parseFloat(item.price?.toString() ?? '0');
                        });
                    }

                    if (resData.service_order_detail_products && resData.service_order_detail_products.length > 0) {
                        resData.service_order_detail_products.map((item: ServiceOrderDetailProduct) => {
                            total += parseFloat(item.sub_total?.toString() ?? '0');
                        });
                    }
                    setGrandTotal(total);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setProcessing(false);
            }
        },
        [id],
    );

    useEffect(() => {
        getOrder(true);
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
            const queryParams: string[] = [];

            if (productPage) queryParams.push(`page=${productPage}`);
            if (productSearch) queryParams.push(`search=${productSearch.toLowerCase()}`);

            const rs = await axios.get(`/admin/products/get-all?${queryParams.join('&')}`);

            if (rs.data.success) {
                const products = rs.data.products;
                setProductList(products.data);
                setProductTotalPage(products.last_page);
                setProductPageActive(products.current_page);

                const newPaginations: number[] = [];
                for (let i = 1; i <= products.last_page; i++) {
                    newPaginations.push(i);
                }
                setProductPaginations(newPaginations);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setProcessing(false);
        }
    }, [productPage, productSearch]);

    useEffect(() => {
        getProducts();
    }, [getProducts]);

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
            await getOrder(true);
            setIsShowService((prev) => !prev);
        } catch (error) {
            console.log(error);
        } finally {
            setProcessing(false);
        }
    };

    const onUpdateService = async (service: ServiceOrderDetail) => {
        try {
            const data = {
                price: service.price,
            };
            await axios.put(`/admin/mechanic-jobs/update-service/${service.id}`, data);
            await getOrder(false);
        } catch (error) {
            console.log(error);
        }
    };

    const onRemoveService = async () => {
        try {
            setProcessing((prev) => !prev);
            await axios.delete(`/admin/mechanic-jobs/destroy-service/${serviceDetailId}`);
            await getOrder(true);
            setIsShowRemoveServiceAlert((prev) => !prev);
            setServiceDetailId(null);
        } catch (error) {
            console.log(error);
        } finally {
            setProcessing(false);
        }
    };

    const onAddProduct = async (product: Product) => {
        try {
            setProcessing((prev) => !prev);
            const data = {
                service_order_id: id,
                product_id: product.id,
            };

            await axios.post('/admin/mechanic-jobs/store-product', data);
            await getOrder(true);
            setIsShowProduct((prev) => !prev);
        } catch (error) {
            console.log(error);
        } finally {
            setProcessing(false);
        }
    };

    const onUpdateProduct = async (product: ServiceOrderDetailProduct, type: 'increase' | 'decrease') => {
        try {
            setProcessing((prev) => !prev);

            await axios.put(`/admin/mechanic-jobs/update-product/${product.id}`, { type });
            await getOrder(true);
        } catch (error) {
            console.log(error);
        } finally {
            setProcessing(false);
        }
    };

    const onRemoveProduct = async () => {
        try {
            setProcessing((prev) => !prev);
            await axios.delete(`/admin/mechanic-jobs/destroy-product/${productId}`);
            await getOrder(true);
            setIsShowRemoveProductAlert((prev) => !prev);
            setProductId(null);
        } catch (error) {
            console.log(error);
        } finally {
            setProcessing(false);
        }
    };

    const onUpdateStatus = async (status: 'pending' | 'processing' | 'completed' | 'canceled') => {
        try {
            setProcessing(true);
            await axios.put(`/admin/mechanic-jobs/update-status/${id}`, { status });
            await getOrder(true);
            setIsShowProcess(false);
            setIsShowComplete(false);
            setIsShowCancel(false);
            setProductId(null);
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
                                <div className="text mb-10 flex w-full items-center justify-between rounded bg-neutral-100 p-10 text-3xl font-bold text-black dark:bg-neutral-900 dark:text-white">
                                    <h1>Total</h1>
                                    <h1>{formatPrice(grandTotal ?? 0)}</h1>
                                </div>
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
                                                                <Input
                                                                    id={'price' + i}
                                                                    className="border-black pl-10 dark:border-white"
                                                                    value={item.price?.toString().replace('.00', '') ?? '0'}
                                                                    onChange={(e) => {
                                                                        setServiceDetail((prev) => {
                                                                            return prev.map((svc, ii) => {
                                                                                if (i === ii) {
                                                                                    return { ...svc, price: parseFloat(e.target.value) || 0 };
                                                                                }
                                                                                return svc;
                                                                            });
                                                                        });
                                                                    }}
                                                                    onBlur={() => onUpdateService(item)}
                                                                    disabled={data.status !== 'processing'}
                                                                />
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
                                                                    disabled={data.status !== 'processing'}
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
                                        <Button type="button" disabled={data.status !== 'processing'} onClick={() => setIsShowService(true)}>
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
                                            {serviceDetailProduct?.map((item) => {
                                                return (
                                                    <TableRow key={item.id} className="border-black dark:border-white">
                                                        <TableCell>{item.name}</TableCell>
                                                        <TableCell>{formatPrice(item.price ?? 0)}</TableCell>
                                                        <TableCell>
                                                            <div className="flex w-full items-center justify-center gap-1">
                                                                <Button
                                                                    type="button"
                                                                    className="rounded border-black dark:border-white"
                                                                    variant="outline"
                                                                    disabled={data.status !== 'processing'}
                                                                    onClick={() => {
                                                                        if (item.quantity && item.quantity > 1) {
                                                                            onUpdateProduct(item, 'decrease');
                                                                        }
                                                                    }}
                                                                >
                                                                    <Minus />
                                                                </Button>
                                                                <div className="flex h-[35px] w-[100px] items-center justify-center rounded border border-solid border-black dark:border-white">
                                                                    {item.quantity ?? 0}
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    className="rounded border-black dark:border-white"
                                                                    variant="outline"
                                                                    disabled={data.status !== 'processing'}
                                                                    onClick={() => onUpdateProduct(item, 'increase')}
                                                                >
                                                                    <Plus />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{formatPrice(item.sub_total ?? 0)}</TableCell>
                                                        <TableCell>
                                                            <div className="flex justify-center">
                                                                <Button
                                                                    type="button"
                                                                    size="icon"
                                                                    variant="destructive"
                                                                    className="size-8"
                                                                    disabled={data.status !== 'processing'}
                                                                    onClick={() => {
                                                                        setProductId(item.id);
                                                                        setIsShowRemoveProductAlert(true);
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
                                        <Button
                                            type="button"
                                            disabled={data.status !== 'processing'}
                                            onClick={() => {
                                                setIsShowProduct(true);
                                                setProductSearch('');
                                                setProductPage(1);
                                            }}
                                        >
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

                                    {data.status === 'pending' ? (
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                setIsShowProcess(true);
                                            }}
                                        >
                                            Process Service
                                        </Button>
                                    ) : null}
                                    {data.status === 'processing' ? (
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                setIsShowComplete(true);
                                            }}
                                        >
                                            Service Complete
                                        </Button>
                                    ) : null}

                                    {data.status === 'processing' || data.status === 'pending' ? (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() => {
                                                setIsShowCancel(true);
                                            }}
                                        >
                                            Cancel Service
                                        </Button>
                                    ) : null}
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
                            <Input
                                placeholder="Search product"
                                className="border-black dark:border-white"
                                value={productSearch}
                                onChange={(e) => {
                                    setProductSearch(e.target.value);
                                    setProductPage(1);
                                }}
                            />
                            <div className="w-full">
                                {productList?.map((product) => {
                                    const check = serviceDetailProduct.find((item) => item.product_id === product.id);

                                    return (
                                        <div
                                            key={product.id}
                                            className="flex w-full items-center gap-5 border-b border-solid border-black p-3 last:border-transparent dark:border-white"
                                        >
                                            <div className="flex flex-1 flex-col">
                                                <div className="font-semibold">{product.name}</div>
                                            </div>

                                            {!check ? (
                                                <Button type="button" size="icon" className="size-8" onClick={() => onAddProduct(product)}>
                                                    <Plus />
                                                </Button>
                                            ) : null}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {productTotalPage > 1 ? (
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <Button
                                            type="button"
                                            onClick={() => setProductPage((prev) => prev - 1)}
                                            disabled={productPage === 1}
                                            variant="ghost"
                                        >
                                            Prev
                                        </Button>
                                    </PaginationItem>
                                    {productPaginations.map((item) => {
                                        const isActive = item === productPageActive ? true : false;
                                        return (
                                            <PaginationItem key={item}>
                                                <Button
                                                    type="button"
                                                    onClick={() => setProductPage(item)}
                                                    variant={isActive ? 'outline' : 'ghost'}
                                                    className="border-black dark:border-white"
                                                >
                                                    {item}
                                                </Button>
                                            </PaginationItem>
                                        );
                                    })}
                                    <PaginationItem>
                                        <Button
                                            type="button"
                                            onClick={() => setProductPage((prev) => prev + 1)}
                                            disabled={productPage === productTotalPage}
                                            variant="ghost"
                                        >
                                            Next
                                        </Button>
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        ) : null}

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

                <AlertDialog open={isShowRemoveProductAlert} onOpenChange={setIsShowRemoveProductAlert}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Remove Product?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to remove this product? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button type="button" variant="destructive" onClick={() => onRemoveProduct()}>
                                Continue
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={isShowProcess} onOpenChange={setIsShowProcess}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Process Service?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to process this service? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button type="button" onClick={() => onUpdateStatus('processing')}>
                                Continue
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={isShowComplete} onOpenChange={setIsShowComplete}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Service Completion Confirmation</AlertDialogTitle>
                            <AlertDialogDescription>
                                Has this service job been completed? Please confirm before updating the job status to "Completed".
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button type="button" onClick={() => onUpdateStatus('completed')}>
                                Yes, Completed
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={isShowCancel} onOpenChange={setIsShowCancel}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Cancel Service?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to cancel this service? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button type="button" variant="destructive" onClick={() => onUpdateStatus('canceled')}>
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
