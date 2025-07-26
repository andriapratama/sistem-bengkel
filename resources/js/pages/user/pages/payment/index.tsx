import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from '@inertiajs/react';
import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import UserLayout from '../../layouts/user-layout';

export default function Index() {
    const [hours, setHours] = useState<number>(24);
    const [payment, setPayment] = useState<string>('');
    const [timeLeft, setTimeLeft] = useState(hours * 60 * 60);
    const [image, setImage] = useState<File | null>(null);

    const formatPrice = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        })
            .format(number)
            .replaceAll(',00', '');
    };

    useEffect(() => {
        if (timeLeft <= 0) {
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
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

    return (
        <UserLayout>
            <div className="mt-10 flex min-h-[44.5vh] w-full gap-10">
                <div className="flex h-fit flex-1 flex-col rounded border border-solid border-black p-5 dark:border-white">
                    <h1 className="mb-4 text-xl font-semibold text-black dark:text-white">Cara Transfer</h1>

                    <ul className="flex list-decimal flex-col gap-1 pl-4 text-sm font-light text-black dark:text-white">
                        <li>Buka aplikasi mobile banking Anda</li>
                        <li>
                            Pilih menu transfer ke <span className="font-bold">BCA</span>
                        </li>
                        <li>
                            Masukkan nomor rekening: <span className="font-bold">1234567890</span>
                        </li>
                        <li>
                            Nama penerima: <span className="font-bold">Owner Bengkel</span>
                        </li>
                        <li>
                            Masukkan nominal: <span className="font-bold">{formatPrice(200001)}</span>
                        </li>
                        <li>Mohon masukkan nominal sesuai dengan diatas, digit terakhir merupakan code transaksi.</li>
                        <li>Lakukan transfer, lalu upload bukti di bawah in</li>
                    </ul>

                    <div className="mt-10 flex flex-col gap-2">
                        <Label htmlFor="image">Upload Image</Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setImage(e.target.files[0]);
                                }
                            }}
                            className="w-[300px] border-black dark:border-white"
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
                            <p>26-07-2025, 19.14</p>
                        </div>
                        <div className="flex w-full items-center justify-between text-sm font-normal text-black dark:text-white">
                            <p>Ref Number</p>
                            <p>2507260001</p>
                        </div>
                        <div className="flex w-full items-center justify-between text-sm font-normal text-black dark:text-white">
                            <p>Payment Method</p>
                            <p>Transfer Bank</p>
                        </div>
                        <div className="flex w-full items-center justify-between text-sm font-normal text-black dark:text-white">
                            <p>Member Name</p>
                            <p>Test Member</p>
                        </div>
                        <div className="flex w-full items-center justify-between text-sm font-normal text-black dark:text-white">
                            <p>Amount Transfer</p>
                            <p>{formatPrice(200001)}</p>
                        </div>
                    </div>

                    <Link href="/payment/success">
                        <Button type="button" className="mt-10 w-full">
                            Finish
                        </Button>
                    </Link>
                </div>
            </div>
        </UserLayout>
    );
}
