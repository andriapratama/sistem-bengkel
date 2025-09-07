import axios from 'axios';
import dayjs from 'dayjs';
import { Clock, LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bank, Ewallet, Transaction } from '@/types';
import { router, usePage } from '@inertiajs/react';

import { showToast } from '../../../../lib/utils/toast';
import UserLayout from '../../layouts/user-layout';

type PageProps = {
    transaction: Transaction;
};

export default function Index() {
    const { transaction } = usePage<PageProps>().props;

    const startTime = new Date(transaction.created_at).getTime(); // created_at dalam ms
    const endTime = startTime + 24 * 60 * 60 * 1000; // tambahkan 24 jam (ms)
    const now = Date.now();
    const initialSecondsLeft = Math.floor((endTime - now) / 1000); // dalam detik
    const [timeLeft, setTimeLeft] = useState(initialSecondsLeft > 0 ? initialSecondsLeft : 0);

    const [image, setImage] = useState<File | null>(null);
    const [processing, setProcessing] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    const [banks, setBanks] = useState<Bank[]>([]);
    const [ewallets, setEwallets] = useState<Ewallet[]>([]);

    const formatPrice = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        })
            .format(number)
            .replaceAll(',00', '');
    };

    useEffect(() => {
        if (timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

    const getTimeParts = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return {
            hours: hrs.toString().padStart(2, '0'),
            minutes: mins.toString().padStart(2, '0'),
            seconds: secs.toString().padStart(2, '0'),
        };
    };

    const { hours: h, minutes: m, seconds: s } = getTimeParts(timeLeft);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!image) {
            showToast('Image payment is required.', 'error');
            setIsError(true);
            return;
        }

        const formData = new FormData();
        formData.append('image', image);

        try {
            setProcessing(true);
            await axios.post(`/payment/${transaction.invoice_number}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            router.visit('/payment/success');
        } catch (error: any) {
            showToast(error.response.data.message, 'error');
            console.log(error);
        } finally {
            setProcessing(false);
        }
    };

    const getBanks = async () => {
        try {
            const rs = await axios.get('/payment/banks');

            if (rs) {
                setBanks(rs.data.banks);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getEwallets = async () => {
        try {
            const rs = await axios.get('/payment/ewallets');

            if (rs) {
                setEwallets(rs.data.ewallets);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getBanks();
        getEwallets();
    }, []);

    return (
        <UserLayout>
            <div className="mt-10 flex min-h-[44.5vh] w-full gap-10">
                <div className="flex h-fit flex-1 flex-col rounded border border-solid border-black p-5 dark:border-white">
                    <h1 className="mb-4 text-xl font-semibold text-black dark:text-white">Cara Transfer</h1>

                    {transaction.payment_method === 'bank_transfer' ? (
                        <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                            {banks?.map((item, i) => {
                                return (
                                    <AccordionItem key={item.id} value={`item-${i}`} className="border-black dark:border-white">
                                        <AccordionTrigger>{item.name}</AccordionTrigger>
                                        <AccordionContent className="flex flex-col gap-4 text-balance">
                                            <ul className="flex list-decimal flex-col gap-1 pl-4 text-sm font-light text-black dark:text-white">
                                                <li>Buka aplikasi mobile banking Anda</li>
                                                <li>
                                                    Pilih menu transfer ke <span className="font-bold">{item.name}</span>
                                                </li>
                                                <li>
                                                    Masukkan nomor rekening: <span className="font-bold">{item.number}</span>
                                                </li>
                                                <li>
                                                    Nama penerima: <span className="font-bold">{item.user_name}</span>
                                                </li>
                                                <li>
                                                    Masukkan nominal: <span className="font-bold">{formatPrice(transaction.grand_total)}</span>
                                                </li>
                                                <li>Mohon masukkan nominal sesuai dengan diatas, digit terakhir merupakan code transaksi.</li>
                                                <li>Lakukan transfer, lalu upload bukti di bawah ini.</li>
                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>
                                );
                            })}
                        </Accordion>
                    ) : (
                        <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                            {ewallets?.map((item, i) => {
                                return (
                                    <AccordionItem key={item.id} value={`item-${i}`} className="border-black dark:border-white">
                                        <AccordionTrigger>{item.name}</AccordionTrigger>
                                        <AccordionContent className="flex flex-col gap-4 text-balance">
                                            <ul className="flex list-decimal flex-col gap-1 pl-4 text-sm font-light text-black dark:text-white">
                                                <li>Buka aplikasi e-wallet Anda</li>
                                                <li>
                                                    Pilih menu transfer ke <span className="font-bold">{item.name}</span>
                                                </li>
                                                <li>
                                                    Masukkan nomor wallet: <span className="font-bold">{item.number}</span>
                                                </li>
                                                <li>
                                                    Nama penerima: <span className="font-bold">{item.user_name}</span>
                                                </li>
                                                <li>
                                                    Masukkan nominal: <span className="font-bold">{formatPrice(transaction.grand_total)}</span>
                                                </li>
                                                <li>Mohon masukkan nominal sesuai dengan diatas, digit terakhir merupakan code transaksi.</li>
                                                <li>Lakukan transfer, lalu upload bukti di bawah ini.</li>
                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>
                                );
                            })}
                        </Accordion>
                    )}

                    <div className="mt-10 flex flex-col gap-2">
                        <Label htmlFor="image">Upload Image</Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setIsError(false);
                                    setImage(e.target.files[0]);
                                }
                            }}
                            disabled={processing}
                            className={`w-[300px] ${isError ? 'border-red-500' : 'border-black dark:border-white'}`}
                        />
                    </div>
                </div>

                <div className="flex w-[400px] flex-col">
                    <div className="mb-5 flex w-full justify-center">
                        <Clock className="size-10 font-semibold text-black dark:text-white" />
                    </div>
                    <div className="w-full text-center text-xl font-semibold text-black dark:text-white">Waiting for Your Payment</div>

                    <div className="mb-7 flex w-full items-center justify-center gap-5 border-b border-solid border-black pb-7 dark:border-white">
                        <div className="flex items-center gap-2 text-center">
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-bold">{h}</span>
                            </div>
                            <span className="text-2xl font-bold">:</span>
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-bold">{m}</span>
                            </div>
                            <span className="text-2xl font-bold">:</span>
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-bold">{s}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex w-full flex-col gap-3">
                        <div className="flex w-full items-center justify-between text-sm font-normal text-black dark:text-white">
                            <p>Time/Date</p>
                            <p>{dayjs(transaction.created_at).format('DD-MM-YYYY, HH.mm')}</p>
                        </div>
                        <div className="flex w-full items-center justify-between text-sm font-normal text-black dark:text-white">
                            <p>Invoice Number</p>
                            <p>{transaction.invoice_number}</p>
                        </div>
                        <div className="flex w-full items-center justify-between text-sm font-normal text-black dark:text-white">
                            <p>Payment Method</p>
                            <p>
                                {transaction.payment_method === 'bank_transfer'
                                    ? 'Bank Transfer'
                                    : transaction.payment_method === 'ewallet'
                                      ? 'E-Wallet'
                                      : 'Cash on Delivery'}
                            </p>
                        </div>
                        <div className="flex w-full items-center justify-between text-sm font-normal text-black dark:text-white">
                            <p>Member Name</p>
                            <p>{transaction.user.name}</p>
                        </div>
                        <div className="flex w-full items-center justify-between text-sm font-normal text-black dark:text-white">
                            <p>Amount Transfer</p>
                            <p>{formatPrice(transaction.grand_total)}</p>
                        </div>
                    </div>

                    <Button type="button" className="mt-10 w-full" onClick={onSubmit} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Complete Payment
                    </Button>
                </div>
            </div>
        </UserLayout>
    );
}
