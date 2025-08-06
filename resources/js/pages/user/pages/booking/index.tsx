import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Service, Vehicle } from '@/types';
import axios from 'axios';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import UserLayout from '../../layouts/user-layout';

export default function Index() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [firstTimeList, setFirstTimeList] = useState<string[]>([]);
    const [secondTimeList, setSecondTimeList] = useState<string[]>([]);
    const [isShowBookingForm, setIsShowBookingForm] = useState<boolean>(false);
    const [vehicleList, setVehicleList] = useState<Vehicle[]>([]);
    const [vehicleId, setVehicleId] = useState<number | null>(null);
    const [serviceList, setServiceList] = useState<Service[]>([]);
    const [serviceId, setServiceId] = useState<number | null>(null);
    const [processing, setProcessing] = useState<boolean>(false);
    const [data, setData] = useState<{ queue_number: number; estimate_service_start: Date; estimate_service_end: Date }[]>([
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

    useEffect(() => {
        const start = '08:00';
        const end = '16:00';
        const interval = 5;
        const pad = (n) => n.toString().padStart(2, '0');

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
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Booking Form</SheetTitle>
                        <SheetDescription>
                            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid flex-1 auto-rows-min gap-6 px-4">
                        <div>
                            <Label htmlFor="date">Date</Label>
                            <Input id="date" value={dayjs(date).format('DD/MM/YYYY')} disabled />
                        </div>

                        <div>
                            <Label htmlFor="vehivle">Vehicle</Label>
                            <Select onValueChange={(e) => setVehicleId(parseInt(e))} value={vehicleId?.toString() ?? ''}>
                                <SelectTrigger disabled={processing} className={`w-full`}>
                                    <SelectValue placeholder="Select vehicle" />
                                </SelectTrigger>
                                <SelectContent>
                                    {vehicleList.map((item) => (
                                        <SelectItem key={item.id} value={item.id.toString()}>
                                            {item.vehicle_variant?.name} ({item.police_number})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="service">Services</Label>
                            <Select onValueChange={(e) => setServiceId(parseInt(e))} value={serviceId?.toString() ?? ''}>
                                <SelectTrigger disabled={processing} className={`w-full`}>
                                    <SelectValue placeholder="Select service" />
                                </SelectTrigger>
                                <SelectContent>
                                    {serviceList.map((item) => (
                                        <SelectItem key={item.id} value={item.id.toString()}>
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <SheetFooter>
                        <Button type="submit">Save changes</Button>
                        <SheetClose asChild>
                            <Button variant="outline">Close</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    );
}
