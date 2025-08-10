import axios from 'axios';
import dayjs from 'dayjs';
import { LoaderCircle, Plus, Trash } from 'lucide-react';
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
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { showToast } from '@/lib/utils/toast';
import { BookingService, Service, Vehicle } from '@/types';
import { Link } from '@inertiajs/react';

import UserLayout from '../../layouts/user-layout';

export default function Index() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [timeList, setTimeList] = useState<string[]>([]);
    const [isShowBookingForm, setIsShowBookingForm] = useState<boolean>(false);
    const [isShowService, setIsShowService] = useState<boolean>(false);

    const [isShowVehicleAlertDialog, setIsShowVehicleAlertDialog] = useState<boolean>(false);
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
    const [bookingList, setBookingList] = useState<BookingService[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ vehicle?: string; service?: string }>({ vehicle: undefined, service: undefined });
    const [userBookingList, setUserBookingList] = useState<BookingService[]>([]);

    const [isOpenBooking, setIsOpenBooking] = useState<boolean>(false);
    const [vehicleName, setVehicleName] = useState<string>('');

    const [isShowAlertCancel, setIsShowAlertCancel] = useState<boolean>(false);
    const [bookingId, setBookingId] = useState<number | null>(null);

    const [isHideBooking, setIsHideBooking] = useState<boolean>(false);

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
            slots.push(`${h}:${m}`);
            current.setMinutes(current.getMinutes() + interval);
        }

        setTimeList(slots);
    }, []);

    useEffect(() => {
        if (date) {
            const today = dayjs(new Date()).format('YYYY-MM-DD');
            setIsHideBooking(dayjs(date).isBefore(today) ? true : false);
        }
    }, [date, setIsHideBooking, isHideBooking]);

    const getVehicle = useCallback(async () => {
        try {
            const rs = await axios.get('/vehicles/get-all');

            if (rs.data.success) {
                const filter = rs.data.vehicles.filter((item: Vehicle) => !item.status_booking);
                setVehicleList(filter);
                if (rs.data.vehicles.length <= 0) {
                    setIsShowVehicleAlertDialog(true);
                }
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
            const rs = await axios.get('/booking/services');

            if (rs.data.success) {
                setServiceList(rs.data.services);
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
                date: dayjs(date).format('YYYY-MM-DD'),
                vehicle_id: vehicleId,
                services: serviceListSelected.map((service) => service.id),
                note: note,
                estimated_duration: totalEstimatedDuration,
                estimated_price: totalEstimatedPrice,
            };

            const res = await axios.post('/booking', data);

            if (res) {
                showToast('Booking successfully');
                setIsShowBookingForm(false);
                await getAllBookings();
                await getVehicle();
                await getUserBooking();
                setVehicleId(null);
                setServiceListSelected([]);
                setNote('');
                setTotalEstimatedDuration(0);
                setTotalEstimatedPrice(0);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setProcessing(false);
        }
    };

    const getAllBookings = useCallback(async () => {
        try {
            setIsLoading(true);
            const formatDate = dayjs(date).format('YYYY-MM-DD');
            const rs = await axios.get(`/booking/get-all/${formatDate}`);

            if (rs.data.success) {
                setBookingList(rs.data.bookings);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }, [date]);

    useEffect(() => {
        getAllBookings();
    }, [getAllBookings]);

    const getUserBooking = useCallback(async () => {
        try {
            setIsLoading(true);
            const rs = await axios.get(`/booking/get-one`);

            if (rs.data.success) {
                setUserBookingList(rs.data.bookings);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getUserBooking();
    }, [getUserBooking]);

    const onOpenBooking = (booking: BookingService) => {
        setIsOpenBooking(true);
        setDate(booking.date_booking);
        setVehicleName(`${booking.vehicle?.vehicle_variant?.name} (${booking.vehicle?.police_number.toUpperCase()})`);
        setNote(booking.note);

        const newService: Service[] = [];
        booking.booking_service_detail?.map((item) => {
            const findService = serviceList.find((svc) => svc.id === item.service_id);
            if (findService) newService.push(findService);
        });
        setServiceListSelected(newService);
    };

    const onCancelBooking = async () => {
        try {
            setIsLoading(true);
            await axios.put(`/booking/cancel/${bookingId}`);
            setIsShowAlertCancel(false);
            await getAllBookings();
            await getVehicle();
            await getUserBooking();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <UserLayout>
                <div className="mt-10 flex min-h-[calc(100vh-524px)] w-full flex-col items-start justify-center gap-5">
                    <div className="flex w-full items-start justify-center gap-5">
                        <div className="flex flex-col gap-5">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="h-fit rounded-md border shadow-sm"
                                captionLayout="dropdown"
                            />
                        </div>

                        {userBookingList.map((item) => (
                            <div
                                key={item.id}
                                className="relative flex w-[250px] flex-col items-center gap-1 overflow-hidden rounded-lg border border-solid p-3 text-black shadow dark:text-white"
                            >
                                <div
                                    className={`absolute top-0 left-0 flex items-center justify-center rounded-br-lg p-2 text-[10px] font-semibold capitalize ${
                                        item?.status === 'pending'
                                            ? 'bg-yellow-200 text-yellow-800'
                                            : item?.status === 'processing'
                                              ? 'bg-blue-200 text-blue-800'
                                              : item?.status === 'accepted'
                                                ? 'bg-indigo-200 text-indigo-800'
                                                : item?.status === 'completed'
                                                  ? 'bg-green-200 text-green-800'
                                                  : item?.status === 'canceled'
                                                    ? 'bg-red-200 text-red-800'
                                                    : 'bg-transparent text-transparent'
                                    }`}
                                >
                                    {item.status}
                                </div>
                                <div className="text-sm">Queue</div>
                                <div className="my-4 text-7xl font-semibold">{item.queue_number}</div>
                                <div className="flex w-full items-center justify-between gap-5 text-sm">
                                    <div>Vehicle</div>
                                    <div className="line-clamp-1">{item.vehicle?.vehicle_variant?.name}</div>
                                </div>
                                <div className="flex w-full items-center justify-between gap-5 text-sm">
                                    <div>Polic Number</div>
                                    <div className="line-clamp-1">{item.vehicle?.police_number}</div>
                                </div>
                                <div className="flex w-full items-center justify-between gap-5 text-sm">
                                    <div>Date</div>
                                    <div className="line-clamp-1">{item.date_booking.toString()}</div>
                                </div>
                                <div className="flex w-full items-center justify-between gap-5 text-sm">
                                    <div>Estimated</div>
                                    <div className="line-clamp-1">{dayjs(item.estimated_service_start).format('hh:mm')}</div>
                                </div>
                                <Button type="button" className="w-full" onClick={() => onOpenBooking(item)}>
                                    Open
                                </Button>
                                <Button
                                    type="button"
                                    className="w-full"
                                    variant="destructive"
                                    onClick={() => {
                                        setIsShowAlertCancel(true);
                                        setBookingId(item.id);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div className="mx-auto flex w-auto flex-col gap-5">
                        <div className="flex w-auto items-center justify-between rounded-lg bg-black px-4 py-2 dark:bg-white">
                            <p className="text-sm text-white dark:text-black">
                                Last queue number: {bookingList[bookingList.length - 1]?.queue_number ?? 0}
                            </p>
                            <p className="text-sm text-white dark:text-black">
                                Last queue time:{' '}
                                {bookingList[bookingList.length - 1]?.estimated_service_end
                                    ? dayjs(bookingList[bookingList.length - 1].estimated_service_end).format('hh:mm')
                                    : '08:00'}
                            </p>
                            {!isHideBooking ? (
                                <Button
                                    type="button"
                                    className="bg-white text-black hover:bg-white/90 dark:bg-black dark:text-white dark:hover:bg-black/90"
                                    onClick={() => {
                                        setIsShowBookingForm(true);
                                        setServiceListSelected([]);
                                        setNote('');
                                        setVehicleId(null);
                                    }}
                                >
                                    Booking Now
                                </Button>
                            ) : null}
                        </div>
                        <div className="mx-auto grid grid-flow-col grid-rows-17 gap-x-5 gap-y-1">
                            {timeList.map((timeItem) => {
                                const currentDate = dayjs(date).format('YYYY-MM-DD');
                                const currentTime = dayjs(`${currentDate} ${timeItem}:00`);

                                const matched = bookingList.find((entry) => {
                                    const start = dayjs(entry.estimated_service_start);

                                    const end = dayjs(entry.estimated_service_end);
                                    return (
                                        currentTime.isSame(start) ||
                                        (currentTime.isAfter(start) && currentTime.isSame(end)) ||
                                        currentTime.isBefore(end)
                                    );
                                });

                                return (
                                    <div
                                        key={timeItem}
                                        className="flex items-center border-b border-solid border-black text-sm text-black dark:border-white dark:text-white"
                                    >
                                        <div className="flex w-[60px] items-center justify-start p-2">{timeItem}</div>
                                        <div
                                            className={`flex w-[80px] items-center justify-start p-2 ${
                                                matched?.status === 'pending'
                                                    ? 'bg-yellow-200 text-yellow-800'
                                                    : matched?.status === 'processing'
                                                      ? 'bg-blue-200 text-blue-800'
                                                      : matched?.status === 'accepted'
                                                        ? 'bg-indigo-200 text-indigo-800'
                                                        : matched?.status === 'completed'
                                                          ? 'bg-green-200 text-green-800'
                                                          : matched?.status === 'canceled'
                                                            ? 'bg-red-200 text-red-800'
                                                            : 'bg-transparent text-transparent'
                                            } `}
                                        >
                                            {matched ? `Queue ${matched.queue_number}` : ''}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
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
                            {serviceList?.map((service) => (
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

            <Sheet open={isOpenBooking} onOpenChange={setIsOpenBooking}>
                <SheetContent className="min-w-[500px]">
                    <SheetHeader>
                        <SheetTitle>Booking Detail</SheetTitle>
                    </SheetHeader>
                    <div className="grid flex-1 auto-rows-min gap-6 overflow-y-auto px-4">
                        <div>
                            <Label htmlFor="date-booking">Date</Label>
                            <Input id="date-booking" value={dayjs(date).format('DD/MM/YYYY')} disabled />
                        </div>

                        <div>
                            <Label htmlFor="vehicle-booking">Vehicle</Label>
                            <Input id="vehicle-booking" value={vehicleName} disabled />
                        </div>

                        {serviceListSelected.length > 0 ? (
                            <div className="w-full">
                                <Label htmlFor="service">Service</Label>
                                {serviceListSelected.map((service) => (
                                    <div
                                        key={service.id}
                                        className="flex w-full items-center gap-5 border-b border-solid border-black p-2 text-sm dark:border-white"
                                    >
                                        <div className="flex flex-1 flex-col">
                                            <div className="font-semibold">{service.name}</div>
                                        </div>
                                    </div>
                                ))}

                                <p className="mt-5 text-sm">Total Estimated Duration: {totalEstimatedDuration ?? 0} Minutes</p>
                                <p className="text-sm">Total Estimated Price: {formatPrice(totalEstimatedPrice ?? 0)}</p>
                            </div>
                        ) : null}

                        <div>
                            <Label htmlFor="note-booking">Note</Label>
                            <Textarea id="note-booking" value={note} disabled />
                        </div>
                    </div>
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button variant="outline">Close</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            <AlertDialog open={isShowAlertCancel} onOpenChange={setIsShowAlertCancel}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
                        <AlertDialogDescription>Are you sure you want to cancel this booking? This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button type="button" variant="destructive" onClick={() => onCancelBooking()}>
                            Continue
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={isShowVehicleAlertDialog} onOpenChange={setIsShowVehicleAlertDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Booking Unavailable</AlertDialogTitle>
                        <AlertDialogDescription>
                            You are unable to proceed with the booking because you have not registered your vehicle. Please register your vehicle
                            first to continue.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Link href="/vehicles">
                            <Button type="button">To Vehicle</Button>
                        </Link>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {isLoading ? (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 dark:bg-white/40">
                    <LoaderCircle className="h-14 w-14 animate-spin" />
                </div>
            ) : null}
        </>
    );
}
