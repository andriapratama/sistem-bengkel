import axios from 'axios';
import { Image } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import {
    AlertDialog,
    AlertDialogAction,
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Transaction } from '@/types';
import { Head, usePage } from '@inertiajs/react';

import { showToast } from '../../../lib/utils/toast';

type PageProps = {
    id: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Orders Detail',
        href: '/admin/orders',
    },
];

export default function Detail() {
    const { id } = usePage<PageProps>().props;
    const [data, setData] = useState<Transaction | null>(null);
    const [isErrorImages, setIsErrorImages] = useState<boolean[]>([]);
    const [isShowShippingDialog, setIsShowShippingDialog] = useState<boolean>(false);
    const [isShowDeliveredDialog, setIsShowDeliveredDialog] = useState<boolean>(false);

    const [image, setImage] = useState<File | null>(null);
    const [isErrorUploadImage, setIsErrorUploadImage] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);

    const [isPaymentImageError, setIsPaymentImageError] = useState<boolean>(false);
    const [isShippingImageError, setIsShippingImageError] = useState<boolean>(false);

    const getAll = useCallback(async () => {
        try {
            const rs = await axios.get(`/admin/orders/get-one/${id}`);

            if (rs.data.success) {
                const resData = rs.data.transaction;
                setData(resData);

                const newError = [];
                for (let i = 0; i < resData.transaction_items.length; i++) {
                    newError.push(false);
                }
                setIsErrorImages(newError);
            } else {
                console.log(rs);
            }
        } catch (error) {
            console.log(error);
        }
    }, [id]);

    useEffect(() => {
        getAll();
    }, [getAll]);

    const updateShippingStatus = async (status: string) => {
        try {
            const rs = await axios.put(`/admin/orders/update/${id}`, { shipping_status: status });

            if (rs) {
                console.log(rs);
                await getAll();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const formatPrice = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(number);
    };

    const onUploadImage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!image) {
            showToast('Shipping image is required.', 'error');
            setIsErrorUploadImage(true);
            return;
        }

        const formData = new FormData();
        formData.append('image', image);

        try {
            setProcessing(true);
            const rs = await axios.post(`/admin/orders/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (rs) {
                console.log(rs);
                await getAll();
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
                    <Head title="Orders Detail" />
                    <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-7">
                        <div className="mb-5 w-full text-xl font-semibold">Invoice Number: {data.invoice_number}</div>

                        <div className="flex w-full gap-10">
                            <div className="h-[400px] flex-1">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-black dark:border-white">
                                            <TableHead>Product</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead className="w-[12%]">Subtotal</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.transaction_items?.map((item, i) => {
                                            return (
                                                <TableRow key={item.id} className="border-black dark:border-white">
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex aspect-square w-[50px] items-center justify-center overflow-hidden">
                                                                <img
                                                                    src={`/storage/${item.product.image}`}
                                                                    alt={item.product.name}
                                                                    className={`h-full w-full object-cover object-center ${isErrorImages[i] ? 'opacity-0' : 'opacity-100'}`}
                                                                    loading="lazy"
                                                                    onError={() =>
                                                                        setIsErrorImages((prev) => {
                                                                            const newError = [...prev];
                                                                            newError[i] = true;
                                                                            return newError;
                                                                        })
                                                                    }
                                                                />
                                                                <Image
                                                                    className={`absolute size-[50px] text-black dark:text-white ${isErrorImages[i] ? 'opacity-100' : 'opacity-0'}`}
                                                                />
                                                            </div>

                                                            <p className="line-clamp-2 text-sm font-light text-black dark:text-white">
                                                                {item.product.name}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{formatPrice(item.price)}</TableCell>
                                                    <TableCell>{item.quantity}</TableCell>
                                                    <TableCell>{formatPrice(item.subtotal)}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>

                                <div className="my-10 flex w-full flex-col gap-5 bg-neutral-100 px-7 py-5 text-black dark:bg-neutral-900 dark:text-white">
                                    <div className="w-full text-xl font-semibold">Customer Information</div>
                                    <div className="flex w-full items-start">
                                        <div className="w-[200px]">Name</div>
                                        <div>{data.user?.name}</div>
                                    </div>
                                    <div className="flex w-full items-start">
                                        <div className="w-[200px]">Whatsapp</div>
                                        <div>{data.user?.phone}</div>
                                    </div>
                                    <div className="flex w-full items-start">
                                        <div className="w-[200px]">Shipping Address</div>
                                        <div className="flex-1">{data.shipping_address}</div>
                                    </div>
                                </div>

                                <div className="grid w-full grid-cols-2 items-center gap-10 pb-10">
                                    {data.payment_method !== 'cod' ? (
                                        <div className="flex h-fit w-full flex-col gap-5 bg-neutral-100 px-7 py-5 text-black dark:bg-neutral-900 dark:text-white">
                                            <div className="w-full text-xl font-semibold">Payment Image</div>
                                            <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden">
                                                <img
                                                    src={`/storage/${data.payment_image}`}
                                                    alt="Payment Image"
                                                    className={`h-full w-full object-contain object-center ${isPaymentImageError ? 'opacity-0' : 'opacity-100'}`}
                                                    loading="lazy"
                                                    onError={() => setIsPaymentImageError((prev) => !prev)}
                                                />
                                                <Image
                                                    className={`absolute size-[100px] text-black dark:text-white ${isPaymentImageError ? 'opacity-100' : 'opacity-0'}`}
                                                />
                                            </div>
                                        </div>
                                    ) : null}
                                    <div className="flex h-fit w-full flex-col gap-5 bg-neutral-100 px-7 py-5 text-black dark:bg-neutral-900 dark:text-white">
                                        <div className="w-full text-xl font-semibold">Shipping Image</div>
                                        <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden">
                                            <img
                                                src={`/storage/${data.shipping_image}`}
                                                alt="Shipping Image"
                                                className={`h-full w-full object-contain object-center ${isShippingImageError ? 'opacity-0' : 'opacity-100'}`}
                                                loading="lazy"
                                                onError={() => setIsShippingImageError((prev) => !prev)}
                                            />
                                            <Image
                                                className={`absolute size-[100px] text-black dark:text-white ${isShippingImageError ? 'opacity-100' : 'opacity-0'}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-10 flex w-[450px] flex-col gap-10">
                                <div className="flex h-fit w-full flex-col gap-5 rounded bg-neutral-100 px-7 py-5 text-black dark:bg-neutral-900 dark:text-white">
                                    <div className="w-full text-xl font-semibold">Summary</div>
                                    <div className="flex w-full items-center justify-between">
                                        <p>Total Price :</p>
                                        <p>{formatPrice(data.total_price ?? 0)}</p>
                                    </div>
                                    <div className="flex w-full items-center justify-between">
                                        <p>Discount :</p>
                                        <p>{formatPrice(data.discount_amount ?? 0)}</p>
                                    </div>
                                    <div className="flex w-full items-center justify-between border-t border-solid border-white pt-5 text-lg font-semibold">
                                        <p>Grand Total :</p>
                                        <p>{formatPrice(data.grand_total ?? 0)}</p>
                                    </div>
                                </div>

                                <div className="flex h-fit w-full flex-col gap-5 rounded bg-neutral-100 px-7 py-5 text-black dark:bg-neutral-900 dark:text-white">
                                    <div className="w-full text-xl font-semibold">Order Status</div>
                                    <div className="flex w-full items-center justify-between">
                                        <p>Payment Method</p>
                                        <p>
                                            {data.payment_method === 'bank_transfer'
                                                ? 'Bank Transfer'
                                                : data.payment_method === 'ewallet'
                                                  ? 'e-Wallet'
                                                  : 'Cash on Delivery'}
                                        </p>
                                    </div>
                                    <div className="flex w-full items-center justify-between capitalize">
                                        <p>Payment Status</p>
                                        <div
                                            className={`flex w-[100px] items-center justify-center rounded py-[6px] text-sm font-semibold capitalize ${
                                                data.payment_status === 'pending'
                                                    ? 'bg-yellow-200 text-yellow-800'
                                                    : data.payment_status === 'paid'
                                                      ? 'bg-green-200 text-green-800'
                                                      : 'bg-red-200 text-red-800'
                                            }`}
                                        >
                                            {data.payment_status}
                                        </div>
                                    </div>
                                    <div className="flex w-full items-center justify-between capitalize">
                                        <p>Shipping Status</p>
                                        <div
                                            className={`flex w-[100px] items-center justify-center rounded py-[6px] text-sm font-semibold capitalize ${
                                                data.shipping_status === 'pending'
                                                    ? 'bg-yellow-200 text-yellow-800'
                                                    : data.shipping_status === 'processing'
                                                      ? 'bg-blue-200 text-blue-800'
                                                      : data.shipping_status === 'shipped'
                                                        ? 'bg-indigo-200 text-indigo-800'
                                                        : data.shipping_status === 'delivered'
                                                          ? 'bg-green-200 text-green-800'
                                                          : data.shipping_status === 'canceled'
                                                            ? 'bg-gray-200 text-gray-800'
                                                            : 'bg-red-200 text-red-800'
                                            }`}
                                        >
                                            {data.shipping_status}
                                        </div>
                                    </div>

                                    {data.shipping_status === 'processing' ? (
                                        <Button type="button" onClick={() => setIsShowShippingDialog(true)}>
                                            Ship Product
                                        </Button>
                                    ) : null}

                                    {data.shipping_status === 'shipped' ? (
                                        <Button type="button" onClick={() => setIsShowDeliveredDialog(true)}>
                                            Delivery Complete
                                        </Button>
                                    ) : null}

                                    {data.shipping_status === 'delivered' && !data.shipping_image ? (
                                        <div className="flex w-full flex-col gap-4">
                                            <div className="flex flex-col gap-2">
                                                <Label htmlFor="image" className="text-base font-normal">
                                                    Upload Shipping Image
                                                </Label>
                                                <Input
                                                    id="image"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            setIsErrorUploadImage(false);
                                                            setImage(e.target.files[0]);
                                                        }
                                                    }}
                                                    disabled={processing}
                                                    className={`w-full ${isErrorUploadImage ? 'border-red-500' : 'border-black dark:border-white'}`}
                                                />
                                            </div>

                                            <Button type="button" onClick={onUploadImage}>
                                                Upload Image
                                            </Button>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </AppLayout>

                <AlertDialog open={isShowShippingDialog} onOpenChange={setIsShowShippingDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to ship this product?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Please double-check the product details and ensure everything is complete before proceeding with the shipment.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => updateShippingStatus('shipped')}>Yes, Ship Now</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={isShowDeliveredDialog} onOpenChange={setIsShowDeliveredDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Product Receipt</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure the customer has received this product? Marking this order as received will complete the transaction and
                                cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => updateShippingStatus('delivered')}>Yes, Mark as Received</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </>
        );
    }
}
