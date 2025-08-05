import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router, useForm } from '@inertiajs/react';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { z } from 'zod';
import { showToast } from '../../../../lib/utils/toast';
import { VehicleBrand, VehicleVariant } from '../../../../types';

import UserLayout from '../../layouts/user-layout';

const vehicleSchema = z.object({
    vehicle_year: z.string().min(1, 'Vehicle year is required').max(4, 'Vehicle year maximal 4 characters.'),
    police_number: z.string().min(3, 'Police number minimum 3 characters').max(12, 'police number maximal 12 characters'),
    vehicle_variant_id: z.coerce.number().min(1, 'Vehicle type is required'),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

export default function Create() {
    const [errors, setErrors] = useState<Partial<Record<keyof VehicleFormValues, string>>>({});
    const [vehicleBrandId, setVehicleBrandId] = useState<number | null>(null);
    const [vehicleBrands, setVehicleBrands] = useState<VehicleBrand[]>([]);
    const [vehicleVariants, setVehicleVariants] = useState<VehicleVariant[]>([]);
    const [vehicleVariantsTmp, setVehicleVariantsTmp] = useState<VehicleVariant[]>([]);
    const [years, setYears] = useState<string[]>([]);
    const [processing, setProcessing] = useState<boolean>(false);

    const { data, setData } = useForm<VehicleFormValues>({
        vehicle_year: '',
        police_number: '',
        vehicle_variant_id: 0,
    });

    const getAll = useCallback(async () => {
        try {
            const rs = await axios.get(`/vehicles/get-all/vehicle-brands`);

            if (rs.data.success) {
                setVehicleBrands(rs.data.vehicleBrands);
                setVehicleVariants(rs.data.vehicleVariants);
            } else {
                console.log(rs);
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        getAll();
    }, [getAll]);

    useEffect(() => {
        if (vehicleBrandId) {
            const filter = vehicleVariants.filter((item) => item.vehicle_brand_id === vehicleBrandId);
            setVehicleVariantsTmp(filter);
        }
    }, [vehicleBrandId, vehicleVariants]);

    useEffect(() => {
        const yearList: string[] = [];
        const year = new Date().getFullYear();

        for (let i = year; i > 1940; i--) {
            yearList.push(`${i}`);
        }

        setYears(yearList);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = vehicleSchema.safeParse(data);

        if (!result.success) {
            const flatErrors = result.error.flatten().fieldErrors;
            setErrors({
                vehicle_year: flatErrors.vehicle_year?.[0],
                police_number: flatErrors.police_number?.[0],
                vehicle_variant_id: flatErrors.vehicle_variant_id?.[0],
            });
            return;
        }

        try {
            setProcessing(true);
            const res = await axios.post('/vehicles', data);

            if (res.data.success) {
                showToast(res.data.message);

                setTimeout(() => {
                    router.visit('/vehicles');
                }, 1000);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <UserLayout>
            <div className="mx-auto mt-10 flex min-h-[calc(100vh-524px)] w-1/2 flex-col gap-5">
                <form onSubmit={handleSubmit} className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <div>
                        <Label htmlFor="vehicle_brand">Vehicle Brand</Label>
                        <Select onValueChange={(e) => setVehicleBrandId(parseInt(e))} value={vehicleBrandId ?? ''}>
                            <SelectTrigge disabled={processing} r className={`w-full`}>
                                <SelectValue placeholder="Select vehicle brand" />
                            </SelectTrigge>
                            <SelectContent>
                                {vehicleBrands.map((item) => (
                                    <SelectItem key={item.id} value={item.id}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="vehicle_variant_id">Vehicle Type</Label>
                        <Select
                            onValueChange={(e) => {
                                setData('vehicle_variant_id', parseInt(e));
                                if (errors.vehicle_variant_id) {
                                    setErrors((prev) => ({ ...prev, vehicle_variant_id: undefined }));
                                }
                            }}
                            value={data.vehicle_variant_id}
                        >
                            <SelectTrigger disabled={processing} className={`w-full ${errors.vehicle_variant_id ? 'border-red-500' : ''}`}>
                                <SelectValue placeholder="Select vehicle type" />
                            </SelectTrigger>
                            {vehicleVariantsTmp && vehicleVariantsTmp.length > 0 ? (
                                <SelectContent>
                                    {vehicleVariantsTmp.map((item) => (
                                        <SelectItem key={item.id} value={item.id}>
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            ) : null}
                        </Select>
                        {errors.vehicle_variant_id && <p className="text-sm text-red-500">{errors.vehicle_variant_id}</p>}
                    </div>

                    <div>
                        <Label htmlFor="vehicle_year">Vehicle Year</Label>
                        <Select
                            onValueChange={(e) => {
                                setData('vehicle_year', e);
                                if (errors.vehicle_year) {
                                    setErrors((prev) => ({ ...prev, vehicle_year: undefined }));
                                }
                            }}
                            value={data.vehicle_year}
                        >
                            <SelectTrigger disabled={processing} className={`w-full ${errors.vehicle_year ? 'border-red-500' : ''}`}>
                                <SelectValue placeholder="Select vehicle year" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map((year) => (
                                    <SelectItem key={year} value={year}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.vehicle_year && <p className="text-sm text-red-500">{errors.vehicle_year}</p>}
                    </div>

                    <div>
                        <Label htmlFor="police_number">Police Number</Label>
                        <Input
                            id="police_number"
                            value={data.police_number}
                            disabled={processing}
                            placeholder="ex: DK 1212 MD"
                            onChange={(e) => {
                                setData('police_number', e.target.value);

                                if (errors.police_number) {
                                    setErrors((prev) => ({ ...prev, police_number: undefined }));
                                }
                            }}
                            className={errors.police_number ? 'border-red-500' : ''}
                        />
                        {errors.police_number && <p className="text-sm text-red-500">{errors.police_number}</p>}
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving...' : 'Save'}
                    </Button>
                </form>
            </div>
        </UserLayout>
    );
}
