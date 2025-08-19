import axios from 'axios';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { showToast } from '@/lib/utils/toast';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const homePageSchema = z.object({
    company_name: z.string().min(1, 'Company name is required'),
    address: z.string().min(1, 'Address is required'),
    email: z.string().min(1, 'Email is required'),
    phone: z.string().min(1, 'Phone number is required'),
    hero: z
        .instanceof(File)
        .refine((file) => file.size < 5_000_000, 'File must be < 5MB')
        .refine((file) => ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type), 'Only JPG, JPEG, PNG, and WEBP allowed')
        .optional(),
});

type HomePageFormValues = z.infer<typeof homePageSchema>;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home Page Setting',
        href: '/home-page',
    },
];

export default function Create() {
    const [errors, setErrors] = useState<Partial<Record<keyof HomePageFormValues, string>>>({});
    const [form, setForm] = useState<HomePageFormValues>({ company_name: '', address: '', email: '', phone: '', hero: undefined });
    const [processing, setProcessing] = useState<boolean>(false);
    const [preview, setPreview] = useState<string | null>(null);

    const getData = async () => {
        try {
            setProcessing(true);

            const rs = await axios.get('/admin/home-page/get-one');

            if (rs.data.status) {
                const data = rs.data.data;

                setForm({ company_name: data.company_name, address: data.address, email: data.email, phone: data.phone, hero: undefined });

                if (data.hero) {
                    setPreview(`/storage/${data.hero}`);
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setProcessing(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const onChangeHero = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setForm((prev) => ({ ...prev, hero: file }));
            setPreview(URL.createObjectURL(file));

            if (errors.hero) {
                setErrors((prev) => ({ ...prev, hero: undefined }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();

            const result = homePageSchema.safeParse(form);

            if (!result.success) {
                const flatErrors = result.error.flatten().fieldErrors;

                setErrors({
                    company_name: flatErrors.company_name?.[0],
                    address: flatErrors.address?.[0],
                    email: flatErrors.email?.[0],
                    phone: flatErrors.phone?.[0],
                    hero: flatErrors.hero?.[0],
                });
                return;
            }

            setProcessing(true);

            const formData = new FormData();
            formData.append('company_name', form.company_name);
            formData.append('email', form.email);
            formData.append('phone', form.phone);
            formData.append('address', form.address);
            formData.append('hero', form.hero as Blob);

            await axios.post('/admin/home-page', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            showToast('Home page data updated successfully.');
        } catch (error) {
            console.log(error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Hero Page" />
            <div className="mx-auto w-[50%]">
                <form onSubmit={handleSubmit} className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <div className="w-full">
                        <Label htmlFor="company_name">Company Name</Label>
                        <Input
                            id="company_name"
                            value={form.company_name}
                            onChange={(e) => {
                                setForm((prev) => ({ ...prev, company_name: e.target.value }));

                                if (errors.company_name) {
                                    setErrors((prev) => ({ ...prev, company_name: undefined }));
                                }
                            }}
                            disabled={processing}
                            className={errors.company_name ? 'border-red-500' : ''}
                        />
                        {errors.company_name && <p className="text-sm text-red-500">{errors.company_name}</p>}
                    </div>

                    <div className="w-full">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={(e) => {
                                setForm((prev) => ({ ...prev, email: e.target.value }));

                                if (errors.email) {
                                    setErrors((prev) => ({ ...prev, email: undefined }));
                                }
                            }}
                            disabled={processing}
                            className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>
                    <div className="w-full">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            value={form.phone}
                            onChange={(e) => {
                                setForm((prev) => ({ ...prev, phone: e.target.value }));

                                if (errors.phone) {
                                    setErrors((prev) => ({ ...prev, phone: undefined }));
                                }
                            }}
                            disabled={processing}
                            className={errors.phone ? 'border-red-500' : ''}
                        />
                        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                    </div>
                    <div className="w-full">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                            id="address"
                            value={form.address}
                            onChange={(e) => {
                                setForm((prev) => ({ ...prev, address: e.target.value }));
                                if (errors.address) {
                                    setErrors((prev) => ({ ...prev, address: undefined }));
                                }
                            }}
                            disabled={processing}
                            className={errors.address ? 'border-red-500' : ''}
                        />
                        {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                    </div>

                    <div className="w-full">
                        <Label htmlFor="hero">Hero Image</Label>
                        <Input id="hero" type="file" accept="image/*" onChange={onChangeHero} className={errors.hero ? 'border-red-500' : ''} />
                        <p className="text-sm text-neutral-700 dark:text-neutral-400">
                            Note: The hero image must have an aspect ratio of 22:6 to ensure it displays correctly.
                        </p>
                        {errors.hero && <p className="text-sm text-red-500">{errors.hero}</p>}

                        {preview && (
                            <div className="mx-auto mt-5 flex aspect-[22/6] w-full items-center justify-center overflow-hidden">
                                <img src={preview} alt="Preview" className="h-full w-full object-cover object-center" />
                            </div>
                        )}
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Save
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
