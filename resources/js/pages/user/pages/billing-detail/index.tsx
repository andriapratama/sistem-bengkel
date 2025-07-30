import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Cart } from '@/types';
import { Link, usePage } from '@inertiajs/react';

import UserLayout from '../../layouts/user-layout';

type PageProps = {
    carts: Cart[];
};

export default function Index() {
    const { carts } = usePage<PageProps>().props;

    const [payment, setPayment] = useState<string>('');

    const formatPrice = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        })
            .format(number)
            .replaceAll(',00', '');
    };

    return (
        <UserLayout>
            <div className="mt-10 flex min-h-[44.5vh] w-full gap-10">
                <div className="flex h-fit flex-1 flex-col rounded border border-solid border-black p-5 dark:border-white">
                    <h1 className="mb-5 text-xl font-semibold text-black dark:text-white">Select Payment Option</h1>

                    <RadioGroup className="flex w-full flex-col gap-5" onValueChange={(e) => setPayment(e)}>
                        <div className="flex w-full flex-col rounded border border-solid border-black p-5 dark:border-white">
                            <div
                                className={`flex w-full gap-5 ${
                                    payment === 'bank' ? 'mb-5 border-b border-solid border-black pb-5 dark:border-white' : ''
                                }`}
                            >
                                <RadioGroupItem value="bank" id="r1" className="cursor-pointer border-black dark:border-white" />
                                <Label className="cursor-pointer" htmlFor="r1">
                                    Transfer Bank
                                </Label>
                            </div>

                            {payment === 'bank' ? (
                                <div className="flex w-full flex-col pl-9 text-sm text-black dark:text-white">
                                    <p>Perhatian:</p>
                                    <p>
                                        Pembayaran dilakukan secara manual melalui transfer bank. Setelah Anda menyelesaikan pembayaran, silakan
                                        unggah bukti transfer (screenshot dari mobile banking, ATM, atau teller) melalui form yang tersedia pada page
                                        berikutnya. Jika anda setuju silahkan lanjutkan pembayaran dengan metode transfer bank.
                                    </p>
                                </div>
                            ) : null}
                        </div>
                        <div className="flex w-full flex-col rounded border border-solid border-black p-5 dark:border-white">
                            <div
                                className={`flex w-full gap-5 ${
                                    payment === 'wallet' ? 'mb-5 border-b border-solid border-black pb-5 dark:border-white' : ''
                                }`}
                            >
                                <RadioGroupItem value="wallet" id="r2" className="cursor-pointer border-black dark:border-white" />
                                <Label className="cursor-pointer" htmlFor="r2">
                                    E-Wallet
                                </Label>
                            </div>

                            {payment === 'wallet' ? (
                                <div className="flex w-full flex-col pl-9 text-sm text-black dark:text-white">
                                    <p>Perhatian:</p>
                                    <p>
                                        Pembayaran dilakukan secara manual melalui E-Wallet (seperti Dana, OVO, GoPay, ShopeePay). Setelah Anda
                                        menyelesaikan pembayaran, silakan unggah bukti transfer (screenshot) melalui form yang tersedia pada page
                                        berikutnya. Jika anda setuju silahkan lanjutkan pembayaran dengan metode e-wallet.
                                    </p>
                                </div>
                            ) : null}
                        </div>
                        <div className="flex w-full flex-col rounded border border-solid border-black p-5 dark:border-white">
                            <div
                                className={`flex w-full gap-5 ${
                                    payment === 'cod' ? 'mb-5 border-b border-solid border-black pb-5 dark:border-white' : ''
                                }`}
                            >
                                <RadioGroupItem value="cod" id="r3" className="cursor-pointer border-black dark:border-white" />
                                <Label className="cursor-pointer" htmlFor="r3">
                                    Cash On Delivery
                                </Label>
                            </div>

                            {payment === 'cod' ? (
                                <div className="flex w-full flex-col pl-9 text-sm text-black dark:text-white">
                                    <p>Perhatian:</p>
                                    <p>
                                        Metode pembayaran Cash on Delivery (COD) hanya berlaku untuk area tertentu yang terjangkau oleh kurir kami.
                                        Mohon siapkan uang tunai sesuai total tagihan saat pesanan diantar. Jika anda setuju silahkan lanjutkan
                                        pembayaran dengan metode COD.
                                    </p>
                                </div>
                            ) : null}
                        </div>
                    </RadioGroup>
                </div>

                <div className="flex w-[400px] flex-col">
                    <div className="flex w-full flex-col gap-6">
                        {carts.map((cart) => {
                            return (
                                <div key={cart.id} className="flex w-full items-center justify-between">
                                    <div className="flex items-center gap-5">
                                        <div className="flex aspect-square w-[50px] items-center justify-center overflow-hidden">
                                            <img
                                                src={`/storage/${cart.product.image}`}
                                                alt={cart.product.name}
                                                className="h-full w-full object-cover object-center"
                                                loading="lazy"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1 text-sm font-light text-black dark:text-white">
                                            <p>{cart.product.name}</p>
                                            <p>Quantity: {cart.quantity}</p>
                                        </div>
                                    </div>

                                    <p className="text-sm font-light text-black dark:text-white">{formatPrice(200000)}</p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-10 flex w-[400px] flex-col gap-3 rounded text-black dark:text-white">
                        <div className="flex w-full items-center justify-between border-b border-solid border-black pb-3 text-sm dark:border-white">
                            <p>Total</p>
                            <p>{formatPrice(0)}</p>
                        </div>
                        <div className="flex w-full items-center justify-between border-b border-solid border-black pb-3 text-sm dark:border-white">
                            <p>Shipping</p>
                            <p>{formatPrice(0)}</p>
                        </div>
                        <div className="flex w-full items-center justify-between text-base font-semibold">
                            <p>Grand Total</p>
                            <p>{formatPrice(0)}</p>
                        </div>
                    </div>

                    <Link href="/payment">
                        <Button type="button" className="mt-10 w-full">
                            Pay
                        </Button>
                    </Link>
                </div>
            </div>
        </UserLayout>
    );
}
