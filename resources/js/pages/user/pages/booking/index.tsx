import axios from 'axios';
import dayjs from 'dayjs';
import { LoaderCircle, Plus, Trash } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
    Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle
} from '@/components/ui/sheet';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Service, Vehicle } from '@/types';

import UserLayout from '../../layouts/user-layout';

export default function Index() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [firstTimeList, setFirstTimeList] = useState<string[]>([]);
    const [secondTimeList, setSecondTimeList] = useState<string[]>([]);
    const [isShowBookingForm, setIsShowBookingForm] = useState<boolean>(false);
    const [isShowService, setIsShowService] = useState<boolean>(false);

    const [vehicleList, setVehicleList] = useState<Vehicle[]>([]);
    const [vehicleId, setVehicleId] = useState<number | null>(null);
    const [serviceList, setServiceList] = useState<Service[]>([]);
    const [serviceListSelected, setServiceListSelected] = useState<Service[]>([]);
    const [serviceListSelectedTmp, setServiceListSelectedTmp] = useState<Service[]>([]);
    const [totalEstimatedDuration, setTotalEstimatedDuration] = useState<number>(0);
    const [totalEstimatedDurationTmp, setTotalEstimatedDurationTmp] = useState<number>(0);
    const [totalEstimatedPrice, setTotalEstimatedPrice] = useState<number>(0);
    const [totalEstimatedPriceTmp, setTotalEstimatedPriceTmp] = useState<number>(0);
    const [processing, setProcessing] = useState<boolean>(false);
    const [note, setNote] = useState<string>('');
    const [data, setData] = useState<{ queue_number: number; estimate_service_start: string; estimate_service_end: string }[]>([
        {
            queue_number: 1,
            estimate_service_start: '2025-08-06 08:00:00',
            estimate_service_end: '2025-08-06 08:30:00',
        },
        {
            queue_number: 2,
            estimate_service_start: '2025-08-06 08:35:00',
            estimate_service_end: '2025-08-06 09:00:00',
        },
    ]);

    const [errors, setErrors] = useState<{ vehicle?: string; service?: string }>({ vehicle: undefined, service: undefined });

    useEffect(() => {
        const start = '08:00';
        const end = '16:00';
        const interval = 5;
        const pad = (n: any) => n.toString().padStart(2, '0');

        const [startHour, startMinute] = start.split(':').map(Number);
        const [endHour, endMinute] = end.split(':').map(Number);

        const slots = [];
        const current = new Date();
        current.setHours(startHour, startMinute, 0, 0);

        const endTime = new Date();
        endTime.setHours(endHour, endMinute, 0, 0);

        while (current <= endTime) {
            const h = pad(current.getHours());
            const m = pad(current.getMinutes());
            slots.push(`${h}.${m}`);
            current.setMinutes(current.getMinutes() + interval);
        }

        const half = Math.ceil(slots.length / 2);
        const firstList = slots.slice(0, half);
        const secondList = slots.slice(half);

        setFirstTimeList(firstList);
        setSecondTimeList(secondList);
    }, []);

    const getVehicle = useCallback(async () => {
        try {
            const rs = await axios.get('/vehicles/get-all');

            if (rs.data.success) {
                setVehicleList(rs.data.vehicles);
            } else {
                console.log(rs);
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        getVehicle();
    }, [getVehicle]);

    const getServices = useCallback(async () => {
        try {
            const rs = await axios.get('/booking/get-all/services');

            if (rs.data.success) {
                setServiceList(rs.data.services);
            } else {
                console.log(rs);
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        getServices();
    }, [getServices]);

    const formatPrice = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(number);
    };

    useEffect(() => {
        if (serviceListSelectedTmp.length > 0) {
            const duration = serviceListSelectedTmp.reduce((sum: number, service) => sum + (service.estimated_duration ?? 0), 0);
            const price = serviceListSelectedTmp.reduce((sum: number, service) => sum + parseFloat(service.estimated_price?.toString() ?? '0'), 0);
            setTotalEstimatedDurationTmp(duration);
            setTotalEstimatedPriceTmp(price);
        } else {
            setTotalEstimatedDurationTmp(0);
            setTotalEstimatedPriceTmp(0);
        }
    }, [serviceListSelectedTmp]);

    useEffect(() => {
        if (serviceListSelected.length > 0) {
            const duration = serviceListSelected.reduce((sum: number, service) => sum + (service.estimated_duration ?? 0), 0);
            const price = serviceListSelected.reduce((sum: number, service) => sum + parseFloat(service.estimated_price?.toString() ?? '0'), 0);
            setTotalEstimatedDuration(duration);
            setTotalEstimatedPrice(price);
        } else {
            setTotalEstimatedDuration(0);
            setTotalEstimatedPrice(0);
        }
    }, [serviceListSelected]);

    const onBooking = async () => {
        let error = false;

        if (!vehicleId) {
            error = true;
            setErrors((prev) => ({ ...prev, vehicle: 'Vehicle is required.' }));
        }

        if (serviceListSelected.length <= 0) {
            error = true;
            setErrors((prev) => ({ ...prev, service: 'Service is required.' }));
        }

        if (error) {
            return null;
        }

        try {
            setProcessing(true);
            const data = {
                date: date?.toISOString() || new Date().toISOString(),
                vehicle_id: vehicleId,
                services: serviceListSelected.map((service) => service.id),
                note: note,
                estimated_duration: totalEstimatedDuration,
                estimated_price: totalEstimatedPrice,
            };

            const res = await axios.post('/booking', data);

            if (res) {
                console.log(res);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setProcessing(false);
        }
    };
    return (
        <>
            <UserLayout>
                <div className="mt-10 flex min-h-[calc(100vh-524px)] w-full items-start justify-center gap-5">
                    <div className="flex flex-col gap-5">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="h-fit rounded-md border shadow-sm"
                            captionLayout="dropdown"
                        />
                        <p className="text-sm">Last queue number: 2</p>
                        <p className="text-sm">Last queue time: 09:00</p>
                        <Button type="button" onClick={() => setIsShowBookingForm(true)}>
                            Booking Now
                        </Button>
                    </div>
                    <div className="w-[250px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Queue</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {firstTimeList.map((timeItem) => {
                                    const currentTime = dayjs(`2025-08-06 ${timeItem.replace('.', ':')}:00`);

                                    const matched = data.find((entry) => {
                                        const start = dayjs(entry.estimate_service_start);
                                        const end = dayjs(entry.estimate_service_end);
                                        return (
                                            currentTime.isSame(start) ||
                                            (currentTime.isAfter(start) && currentTime.isSame(end)) ||
                                            currentTime.isBefore(end)
                                        );
                                    });

                                    return (
                                        <TableRow key={timeItem}>
                                            <TableCell>{timeItem}</TableCell>
                                            <TableCell className={matched ? 'bg-yellow-500' : ''}>
                                                {matched ? `Queue ${matched.queue_number}` : ''}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="w-[250px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Queue</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {secondTimeList.map((timeItem) => {
                                    const currentTime = dayjs(`2025-08-06 ${timeItem.replace('.', ':')}:00`);

                                    const matched = data.find((entry) => {
                                        const start = dayjs(entry.estimate_service_start);
                                        const end = dayjs(entry.estimate_service_end);
                                        return (
                                            currentTime.isSame(start) ||
                                            (currentTime.isAfter(start) && currentTime.isSame(end)) ||
                                            currentTime.isBefore(end)
                                        );
                                    });

                                    return (
                                        <TableRow key={timeItem}>
                                            <TableCell>{timeItem}</TableCell>
                                            <TableCell className={matched ? 'bg-yellow-500' : ''}>
                                                {matched ? `Queue ${matched.queue_number}` : ''}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </UserLayout>

            <Sheet open={isShowBookingForm} onOpenChange={setIsShowBookingForm}>
                <SheetContent className="min-w-[500px]">
                    <SheetHeader>
                        <SheetTitle>Booking Form</SheetTitle>
                    </SheetHeader>
                    <div className="grid flex-1 auto-rows-min gap-6 overflow-y-auto px-4">
                        <div>
                            <Label htmlFor="date">Date</Label>
                            <Input id="date" value={dayjs(date).format('DD/MM/YYYY')} disabled />
                        </div>

                        <div>
                            <Label htmlFor="vehicle">Vehicle</Label>
                            <Select
                                onValueChange={(e) => {
                                    setVehicleId(parseInt(e));
                                    setErrors((prev) => ({ ...prev, vehicle: undefined }));
                                }}
                                value={vehicleId?.toString() ?? ''}
                            >
                                <SelectTrigger disabled={processing} className={`w-full ${errors.vehicle ? '!border-red-500' : ''}`}>
                                    <SelectValue placeholder="Select vehicle" />
                                </SelectTrigger>
                                <SelectContent>
                                    {vehicleList.map((item) => (
                                        <SelectItem key={item.id} value={item.id.toString()}>
                                            {item.vehicle_variant?.name} <span className="uppercase">({item.police_number})</span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.vehicle && <p className="text-sm text-red-500">{errors.vehicle}</p>}
                        </div>

                        {serviceListSelected.length > 0 ? (
                            <div className="w-full">
                                <Label htmlFor="service">Service</Label>
                                {serviceListSelected.map((service) => (
                                    <div
                                        key={service.id}
                                        className="flex w-full items-center gap-5 border-b border-solid border-black p-3 dark:border-white"
                                    >
                                        <div className="flex flex-1 flex-col">
                                            <div className="font-semibold">{service.name}</div>
                                        </div>
                                        <Button
                                            type="button"
                                            size="icon"
                                            className="size-8"
                                            variant="destructive"
                                            onClick={() => {
                                                setServiceListSelected((prev) => {
                                                    return prev.filter((item) => item.id !== service.id);
                                                });
                                            }}
                                        >
                                            <Trash />
                                        </Button>
                                    </div>
                                ))}

                                <p className="mt-5 text-sm">Total Estimated Duration: {totalEstimatedDuration ?? 0} Minutes</p>
                                <p className="text-sm">Total Estimated Price: {formatPrice(totalEstimatedPrice ?? 0)}</p>
                            </div>
                        ) : null}

                        <div className="flex w-full flex-col">
                            <Button
                                type="button"
                                onClick={() => {
                                    setIsShowService(true);
                                    setServiceListSelectedTmp(serviceListSelected);
                                }}
                            >
                                Select Service
                            </Button>
                            {errors.service && <p className="text-sm text-red-500">{errors.service}</p>}
                        </div>

                        <div>
                            <Label htmlFor="note">Note</Label>
                            <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} />
                        </div>
                    </div>
                    <SheetFooter>
                        <Button type="button" onClick={() => onBooking()}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Booking
                        </Button>
                        <SheetClose asChild>
                            <Button variant="outline">Close</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            <Sheet open={isShowService} onOpenChange={setIsShowService}>
                <SheetContent className="min-w-[500px]">
                    <SheetHeader>
                        <SheetTitle>Services</SheetTitle>
                    </SheetHeader>
                    <div className="grid flex-1 auto-rows-min gap-6 overflow-y-auto px-4">
                        {serviceListSelectedTmp.length > 0 ? (
                            <div className="w-full">
                                <div className="text-sm font-semibold">Service Selected</div>
                                {serviceListSelectedTmp.map((service) => (
                                    <div
                                        key={service.id}
                                        className="flex w-full items-center gap-5 border-b border-solid border-black p-3 dark:border-white"
                                    >
                                        <div className="flex flex-1 flex-col">
                                            <div className="font-semibold">{service.name}</div>
                                        </div>
                                        <Button
                                            type="button"
                                            size="icon"
                                            className="size-8"
                                            variant="destructive"
                                            onClick={() => {
                                                setServiceListSelectedTmp((prev) => {
                                                    return prev.filter((item) => item.id !== service.id);
                                                });
                                            }}
                                        >
                                            <Trash />
                                        </Button>
                                    </div>
                                ))}

                                <p className="mt-5 text-sm">Total Estimated Duration: {totalEstimatedDurationTmp ?? 0} Minutes</p>
                                <p className="text-sm">Total Estimated Price: {formatPrice(totalEstimatedPriceTmp ?? 0)}</p>
                            </div>
                        ) : null}

                        <div className="w-full">
                            <div className="text-sm font-semibold">Service List</div>
                            {serviceList.map((service) => (
                                <div
                                    key={service.id}
                                    className="flex w-full items-center gap-5 border-b border-solid border-black p-3 last:border-transparent dark:border-white"
                                >
                                    <div className="flex flex-1 flex-col">
                                        <div className="font-semibold">{service.name}</div>
                                        <p className="line-clamp-6 text-[13px]">{service.description}</p>
                                        <p className="text-sm">Estimated Duration: {service.estimated_duration ?? 0} Minutes</p>
                                        <p className="text-sm">Estimated Price: {formatPrice(service.estimated_price ?? 0)}</p>
                                    </div>
                                    <Button
                                        type="button"
                                        size="icon"
                                        className="size-8"
                                        onClick={() => {
                                            setServiceListSelectedTmp((prev) =>
                                                prev.some((item) => item.id === service.id) ? prev : [...prev, service],
                                            );
                                        }}
                                    >
                                        <Plus />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <SheetFooter>
                        <Button
                            type="button"
                            onClick={() => {
                                setServiceListSelected(serviceListSelectedTmp);
                                setTotalEstimatedDuration(totalEstimatedDurationTmp);
                                setTotalEstimatedPrice(totalEstimatedPriceTmp);
                                setIsShowService(false);
                                setErrors((prev) => ({ ...prev, service: undefined }));
                            }}
                        >
                            Save Services
                        </Button>
                        <SheetClose asChild>
                            <Button variant="outline">Close</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    );
}
