import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { ChevronDownIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const [totalTransactionAmount, setTotalTransactionAmount] = useState(0);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [totalServiceAmount, setTotalServiceAmount] = useState(0);
    const [totalServices, setTotalServices] = useState(0);
    const [topProducts, setTopProducts] = useState([]);
    const [topServices, setTopServices] = useState([]);
    const [topServiceProducts, setTopServiceProducts] = useState([]);
    const [totalTransactionPerPayment, setTotalTransactionPerPayment] = useState([]);
    const [totalServicePerType, setTotalServicePerType] = useState([]);
    const [openStart, setOpenStart] = useState(false);
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [openEnd, setOpenEnd] = useState(false);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);

    useEffect(() => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        setStartDate(start);
        setEndDate(end);
    }, []);

    const getAll = useCallback(async () => {
        try {
            const queryParams: string[] = [];

            if (startDate) queryParams.push(`start-date=${startDate.toISOString()}`);
            if (endDate) queryParams.push(`end-date=${endDate.toISOString()}`);

            const rs = await axios.get(`/admin/dashboard/get-all?${queryParams.join('&')}`);

            if (rs.data.success) {
                const data = rs.data;
                setTotalTransactionAmount(data.totalAmountTransaction);
                setTotalTransactions(data.totalTransactions);
                setTotalServiceAmount(data.totalAmountService);
                setTotalServices(data.totalServices);
                setTopProducts(data.topProducts);
                setTopServices(data.topServices);
                setTopServiceProducts(data.topServiceProducts);
                setTotalTransactionPerPayment(data.totalTransactionPerPayment);
                setTotalServicePerType(data.totalServicePerType);
            }
        } catch (error) {
            console.log(error);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        getAll();
    }, [getAll]);

    const formatPrice = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(number);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex w-full items-center gap-5 px-10 pt-10">
                <div className="flex flex-col gap-1">
                    <Label htmlFor="paymentStatus">Start Date</Label>
                    <Popover open={openStart} onOpenChange={setOpenStart}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" id="date" className="w-[250px] justify-between border-black font-normal dark:border-white">
                                {startDate ? startDate.toLocaleDateString() : 'Select date'}
                                <ChevronDownIcon />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={startDate}
                                captionLayout="dropdown"
                                onSelect={(startDate) => {
                                    setStartDate(startDate);
                                    setOpenStart(false);
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex flex-col gap-1">
                    <Label htmlFor="paymentStatus">End Date</Label>
                    <Popover open={openEnd} onOpenChange={setOpenEnd}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" id="date" className="w-[250px] justify-between border-black font-normal dark:border-white">
                                {endDate ? endDate.toLocaleDateString() : 'Select date'}
                                <ChevronDownIcon />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={endDate}
                                captionLayout="dropdown"
                                onSelect={(endDate) => {
                                    setEndDate(endDate);
                                    setOpenEnd(false);
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div className="grid w-full grid-cols-4 gap-5 p-10">
                <div className="relative flex h-[170px] w-full flex-col rounded-lg bg-black text-white dark:bg-white dark:text-black">
                    <div className="line-clamp-1 flex w-full flex-1 flex-col items-center justify-center text-3xl font-semibold">
                        {formatPrice(totalTransactionAmount)}
                    </div>
                    <div className="absolute bottom-0 left-0 px-5 py-2 text-lg font-medium">Total Transaction Amount</div>
                </div>
                <div className="relative flex h-[170px] w-full flex-col rounded-lg bg-black text-white dark:bg-white dark:text-black">
                    <div className="line-clamp-1 flex w-full flex-1 flex-col items-center justify-center text-3xl font-semibold">
                        {totalTransactions}
                    </div>
                    <div className="absolute bottom-0 left-0 px-5 py-2 text-lg font-medium">Total Transaction</div>
                </div>
                <div className="relative flex h-[170px] w-full flex-col rounded-lg bg-black text-white dark:bg-white dark:text-black">
                    <div className="line-clamp-1 flex w-full flex-1 flex-col items-center justify-center text-3xl font-semibold">
                        {formatPrice(totalServiceAmount)}
                    </div>
                    <div className="absolute bottom-0 left-0 px-5 py-2 text-lg font-medium">Total Service Amount</div>
                </div>
                <div className="relative flex h-[170px] w-full flex-col rounded-lg bg-black text-white dark:bg-white dark:text-black">
                    <div className="line-clamp-1 flex w-full flex-1 flex-col items-center justify-center text-3xl font-semibold">{totalServices}</div>
                    <div className="absolute bottom-0 left-0 px-5 py-2 text-lg font-medium">Total Service</div>
                </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-10 px-10 pb-10">
                <div className="flex h-fit w-full flex-col gap-5 rounded-lg bg-neutral-100 p-5 dark:bg-neutral-900">
                    <h2 className="text-xl font-semibold text-black dark:text-white">Top Product Sold</h2>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-black dark:border-white">
                                <TableHead className="w-[10%]">No</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className="w-[20%] text-center">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topProducts.map((item, index) => (
                                <TableRow key={item.product_id} className="border-black dark:border-white">
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.product.name}</TableCell>
                                    <TableCell className="text-center">{item.total_sold}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex h-fit w-full flex-col gap-5 rounded-lg bg-neutral-100 p-5 dark:bg-neutral-900">
                    <h2 className="text-xl font-semibold text-black dark:text-white">Top Services</h2>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-black dark:border-white">
                                <TableHead className="w-[10%]">No</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className="w-[20%] text-center">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topServices.map((item, index) => (
                                <TableRow key={item.service_id} className="border-black dark:border-white">
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.service.name}</TableCell>
                                    <TableCell className="text-center">{item.total_used}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex h-fit w-full flex-col gap-5 rounded-lg bg-neutral-100 p-5 dark:bg-neutral-900">
                    <h2 className="text-xl font-semibold text-black dark:text-white">Top Service Products</h2>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-black dark:border-white">
                                <TableHead className="w-[10%]">No</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className="w-[20%] text-center">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topServiceProducts.map((item, index) => (
                                <TableRow key={item.product_id} className="border-black dark:border-white">
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.product.name}</TableCell>
                                    <TableCell className="text-center">{item.total_sold}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex h-fit w-full flex-col gap-5 rounded-lg bg-neutral-100 p-5 dark:bg-neutral-900">
                    <h2 className="text-xl font-semibold text-black dark:text-white">Total Transaction per Payment</h2>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-black dark:border-white">
                                <TableHead className="w-[10%]">No</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className="w-[20%] text-center">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {totalTransactionPerPayment.map((item, index) => (
                                <TableRow key={index} className="border-black dark:border-white">
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        {item.payment_method === 'bank_transfer'
                                            ? 'Bank Transfer'
                                            : item.payment_method === 'ewallet'
                                              ? 'e-Wallet'
                                              : 'COD'}
                                    </TableCell>
                                    <TableCell className="text-center">{item.total_transactions}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex h-fit w-full flex-col gap-5 rounded-lg bg-neutral-100 p-5 dark:bg-neutral-900">
                    <h2 className="text-xl font-semibold text-black dark:text-white">Total Service per Type</h2>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-black dark:border-white">
                                <TableHead className="w-[10%]">No</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className="w-[20%] text-center">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {totalServicePerType.map((item, index) => (
                                <TableRow key={index} className="border-black dark:border-white">
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.service_type === 'booking' ? 'Booking' : 'Walk In'}</TableCell>
                                    <TableCell className="text-center">{item.total_service}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            {/* <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div> */}
        </AppLayout>
    );
}
