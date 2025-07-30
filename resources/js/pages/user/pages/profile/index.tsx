import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { showToast } from '../../../../lib/utils/toast';

import UserLayout from '../../layouts/user-layout';

type PageProps = {
    success?: string;
};

const profileSchema = z.object({
    name: z.string().min(1, 'Name is required.').max(100, 'Name maximal 100 characters.'),
    email: z.string().min(1, 'Slug is required.'),
    phone: z.string().min(10, 'Whatsapp is not valid.').max(15, 'Whatsapp is not valid.'),
    address: z.string().min(1, 'Address is required.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function Index() {
    const { success } = usePage<PageProps>().props;
    const page = usePage<SharedData>();
    const { auth } = page.props;

    const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; address?: string }>({});

    const {
        data,
        setData,
        put,
        processing,
        errors: serverErrors,
    } = useForm<ProfileFormValues>({
        name: auth.user.name,
        email: auth.user.email,
        phone: auth.user.phone || '',
        address: auth.user.address || '',
    });

    useEffect(() => {
        setErrors({
            name: serverErrors.name || undefined,
            email: serverErrors.email || undefined,
            phone: serverErrors.phone || undefined,
            address: serverErrors.address || undefined,
        });
    }, [serverErrors]);

    const onChangePhone = (value: string) => {
        const phone = value.replaceAll(/[^0-9+]/g, '');
        setData('phone', phone);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const result = profileSchema.safeParse(data);

        if (!result.success) {
            console.log('masuk');
            const flatErrors = result.error.flatten().fieldErrors;

            setErrors({
                name: flatErrors.name?.[0],
                email: flatErrors.email?.[0],
                phone: flatErrors.phone?.[0],
                address: flatErrors.address?.[0],
            });
            return;
        }

        setErrors({});
        put(
            route('profile.update', auth.user.id, {
                preserveScroll: true,
            }),
        );
    };

    useEffect(() => {
        showToast(success);
    }, [success]);

    return (
        <UserLayout>
            <div className="mx-auto mt-10 flex min-h-[44.5vh] w-[50%] flex-col gap-5">
                <form onSubmit={handleSubmit} className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => {
                                setData('name', e.target.value);

                                if (errors.name) {
                                    setErrors((prev) => ({ ...prev, name: undefined }));
                                }
                            }}
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            value={data.email}
                            onChange={(e) => {
                                setData('email', e.target.value);

                                if (errors.email) {
                                    setErrors((prev) => ({ ...prev, email: undefined }));
                                }
                            }}
                            className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>
                    <div>
                        <Label htmlFor="phone">Whatsapp</Label>
                        <Input
                            id="phone"
                            value={data.phone}
                            onChange={(e) => {
                                onChangePhone(e.target.value);

                                if (errors.phone) {
                                    setErrors((prev) => ({ ...prev, phone: undefined }));
                                }
                            }}
                            className={errors.phone ? 'border-red-500' : ''}
                        />
                        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                    </div>

                    <div>
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                            id="address"
                            value={data.address}
                            onChange={(e) => {
                                setData('address', e.target.value);
                            }}
                            className={errors.address ? 'border-red-500' : ''}
                        />
                        {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving...' : 'Save'}
                    </Button>
                </form>
            </div>
        </UserLayout>
    );
}
