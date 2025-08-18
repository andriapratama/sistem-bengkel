import axios from 'axios';
import { CircleCheckBig, LoaderCircle, Minus, Plus, Trash } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Product, Service, ServiceOrder, ServiceOrderDetail, ServiceOrderDetailProduct } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

type PageProps = {
    id: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cashier Detail',
        href: '/admin/cashier',
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

    const [total, setTotal] = useState<number>(0);
    const [discountPercentage, setDiscountPercentage] = useState<number>(0);
    const [discountAmount, setDiscountAmount] = useState<number>(0);
    const [grandTotal, setGrandTotal] = useState<number>(0);
    const [paymentAmount, setPaymentAmount] = useState<number>(0);
    const [change, setChange] = useState<number>(0);

    const [isShowPay, setIsShowPay] = useState<boolean>(false);
    const [isShowPayAlert, setIsShowPayAlert] = useState<boolean>(false);
    const [isShowSuccessAlert, setIsShowSuccessAlert] = useState<boolean>(false);

    const [errors, setErrors] = useState<{ payment: string }>({ payment: '' });

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
                    setTotal(total);
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

    useEffect(() => {
        if (discountAmount) {
            setGrandTotal(total - discountAmount);
        } else {
            setGrandTotal(total);
        }
    }, [discountAmount, total]);

    useEffect(() => {
        if (paymentAmount) {
            const change = paymentAmount - grandTotal;
            setChange(change);
        } else {
            setChange(grandTotal);
        }
    }, [grandTotal, paymentAmount]);

    const onPay = () => {
        if (!paymentAmount || paymentAmount <= 0) {
            setErrors({ payment: 'Payment amount is required' });
        } else if (paymentAmount < grandTotal) {
            setErrors({ payment: 'Payment amount cannot be less than the grand total.' });
        } else {
            setErrors({ payment: '' });
            setIsShowPayAlert(true);
        }
    };

    const updatePay = async () => {
        try {
            setProcessing(true);

            const data = {
                payment_amount: paymentAmount,
                discount_percentage: discountPercentage ?? 0,
                discount_amount: discountAmount ?? 0,
            };

            const rs = await axios.put(`/admin/cashiers/${id}`, data);

            if (rs) {
                await getOrder();
                setIsShowPayAlert(false);
                setIsShowPay(false);
                setIsShowSuccessAlert(true);
            }
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
                                    <h1>{formatPrice(total ?? 0)}</h1>
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
                                                                    disabled={data.payment_status === 'paid'}
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
                                                                    disabled={data.payment_status === 'paid'}
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
                                        <Button type="button" disabled={data.payment_status === 'paid'} onClick={() => setIsShowService(true)}>
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
                                                                    disabled={data.payment_status === 'paid'}
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
                                                                    disabled={data.payment_status === 'paid'}
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
                                                                    disabled={data.payment_status === 'paid'}
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
                                            disabled={data.payment_status === 'paid'}
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
                                        <p>{data.queue_number ?? '-'}</p>
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

                                    {data.status === 'completed' && data.payment_status === 'unpaid' ? (
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                setIsShowPay(true);
                                            }}
                                        >
                                            Payment
                                        </Button>
                                    ) : null}
                                </div>
                                <div className="flex h-fit w-full flex-col gap-3 rounded bg-neutral-100 px-7 py-5 text-black dark:bg-neutral-900 dark:text-white">
                                    <div className="w-full text-lg font-semibold">Customer Information</div>
                                    <div className="flex w-full items-center justify-between">
                                        <p>Name :</p>
                                        <p>{data.user?.name ?? '-'}</p>
                                    </div>
                                    <div className="flex w-full items-center justify-between">
                                        <p>Whatsapp :</p>
                                        <p>{data.user?.phone ?? '-'}</p>
                                    </div>
                                    <div className="flex w-full items-center justify-between">
                                        <p>Email :</p>
                                        <p>{data.user?.email ?? '-'}</p>
                                    </div>
                                    <div className="flex w-full items-center justify-between">
                                        <p>Vehicle :</p>
                                        <p>{data.vehicle_variant?.name ?? '-'}</p>
                                    </div>
                                    <div className="flex w-full items-center justify-between">
                                        <p>Vehicle Brand :</p>
                                        <p>{data.vehicle_variant?.vehicle_brand?.name ?? '-'}</p>
                                    </div>
                                    <div className="flex w-full items-center justify-between">
                                        <p>Vehicle Year :</p>
                                        <p>{data.vehicle_year ?? '-'}</p>
                                    </div>
                                    <div className="flex w-full items-center justify-between">
                                        <p>Police Number :</p>
                                        <p className="uppercase">{data.police_number ?? '-'}</p>
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

                <Sheet open={isShowPay} onOpenChange={setIsShowPay}>
                    <SheetContent className="min-w-[500px]">
                        <SheetHeader>
                            <SheetTitle>Payment Detail</SheetTitle>
                        </SheetHeader>
                        <div className="grid flex-1 auto-rows-min gap-6 overflow-y-auto px-4">
                            <div className="w-full">
                                <Label htmlFor="total">Total</Label>
                                <Input type="text" id="total" value={formatPrice(total)} disabled className="disabled:opacity-90" />
                            </div>
                            <div className="w-full">
                                <Label htmlFor="discount_percentage">Discount Percentage</Label>
                                <div className="relative flex items-center">
                                    <Input
                                        type="text"
                                        id="discount_percentage"
                                        value={discountPercentage}
                                        onChange={(e) => {
                                            if (e.target.value > '100') {
                                                const percentage = 100;
                                                const amount = (total / 100) * percentage;
                                                setDiscountPercentage(percentage);
                                                setDiscountAmount(amount);
                                            } else if (parseInt(e.target.value) < 1) {
                                                const percentage = 0;
                                                const amount = (total / 100) * percentage;
                                                setDiscountPercentage(percentage);
                                                setDiscountAmount(amount);
                                            } else {
                                                const percentage = parseInt(e.target.value);
                                                const amount = (total / 100) * percentage;
                                                setDiscountPercentage(percentage);
                                                setDiscountAmount(amount);
                                            }
                                        }}
                                    />
                                    <div className="pointer-events-none absolute right-5 text-black dark:text-white">%</div>
                                </div>
                            </div>
                            <div className="w-full">
                                <Label htmlFor="discount_amount">Discount Amount</Label>
                                <div className="relative flex items-center">
                                    <Input
                                        type="text"
                                        id="discount_amount"
                                        className="pl-10"
                                        value={discountAmount}
                                        onChange={(e) => {
                                            setDiscountPercentage(0);
                                            if (parseFloat(e.target.value) > total) {
                                                setDiscountAmount(total);
                                            } else {
                                                setDiscountAmount(e.target.value ? parseFloat(e.target.value ?? '0') : 0);
                                            }
                                        }}
                                    />
                                    <div className="pointer-events-none absolute left-3 text-black dark:text-white">Rp</div>
                                </div>
                            </div>
                            <div className="w-full">
                                <Label htmlFor="grand_total">Grand Total</Label>
                                <Input type="text" id="grand_total" value={formatPrice(grandTotal)} disabled className="disabled:opacity-90" />
                            </div>
                            <div className="w-full">
                                <Label htmlFor="payment_amount">Payment Amount</Label>
                                <div className="relative flex w-full items-center">
                                    <Input
                                        type="text"
                                        id="payment_amount"
                                        className="pl-10"
                                        value={paymentAmount}
                                        onChange={(e) => {
                                            setErrors({ payment: '' });
                                            if (e.target.value) {
                                                setPaymentAmount(parseFloat(e.target.value));
                                            } else {
                                                setPaymentAmount(0);
                                            }
                                        }}
                                    />
                                    <div className="pointer-events-none absolute left-3">Rp</div>
                                </div>
                                {errors.payment && <p className="text-sm text-red-500">{errors.payment}</p>}
                            </div>
                            <div className="w-full">
                                <Label htmlFor="change">Change</Label>
                                <Input type="text" id="change" value={formatPrice(change)} disabled className="disabled:opacity-90" />
                            </div>
                        </div>
                        <SheetFooter>
                            <Button type="button" onClick={() => onPay()}>
                                Pay
                            </Button>
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

                <AlertDialog open={isShowPayAlert} onOpenChange={setIsShowPayAlert}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Pay Confirmation.</AlertDialogTitle>
                            <AlertDialogDescription>
                                Has this service job been paying? Please confirm before updating the job status to "Pay".
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button type="button" onClick={() => updatePay()}>
                                Yes, Pay
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <div
                    className={`fixed inset-0 flex h-screen w-full items-center justify-center bg-white/50 dark:bg-black/50 ${
                        isShowSuccessAlert ? 'z-[99] opacity-100' : '-z-10 opacity-0 delay-300'
                    }`}
                >
                    <div
                        className={`w-[300px] rounded bg-black transition-all duration-300 ease-in-out dark:bg-white ${
                            isShowSuccessAlert ? 'scale-100' : 'scale-75'
                        }`}
                    >
                        <div className="flex w-full items-center justify-center p-5">
                            <CircleCheckBig className="size-[80px] text-white dark:text-black" />
                        </div>
                        <div className="w-full px-5 text-center text-xl font-semibold text-white dark:text-black">Payment Successfully!</div>
                        <div className="flex w-full items-center justify-between p-5 font-medium text-white dark:text-black">
                            <div>Change</div>
                            <div>{formatPrice(data.change ?? 0)}</div>
                        </div>

                        <div className="flex w-full justify-center px-5 pb-5">
                            <Link href="/admin/cashiers">
                                <Button
                                    type="button"
                                    className="bg-white text-black hover:opacity-90 dark:bg-black dark:text-white"
                                    onClick={() => {
                                        setTimeout(() => {
                                            setIsShowSuccessAlert(false);
                                        }, 500);
                                    }}
                                >
                                    Close
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {processing ? (
                    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 dark:bg-white/40">
                        <LoaderCircle className="h-14 w-14 animate-spin" />
                    </div>
                ) : null}
            </>
        );
    }
}
