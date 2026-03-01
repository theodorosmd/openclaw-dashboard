'use server';

import { seedSampleActivities } from '@/lib/log-activity';
import { revalidatePath } from 'next/cache';

export async function seedActivities(formData: FormData) {
  await seedSampleActivities();
  revalidatePath('/activity');
}

export async function refreshActivity() {
  revalidatePath('/activity');
}
