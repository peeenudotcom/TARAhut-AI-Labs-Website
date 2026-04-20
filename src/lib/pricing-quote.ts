import 'server-only';
import { createServiceClient } from '@/lib/supabase';
import {
  validatePromoCode,
  computeDiscount,
  errorMessage,
  type PromoError,
} from '@/lib/promo';
import {
  getCoursePricing,
  RETURN_CUSTOMER_PRICE,
} from '@/config/pricing';

// Server-authoritative price quote. Every paid-flow endpoint goes through
// here so the price the student sees, the price Razorpay charges, and the
// price we log to the database are always the same number.
export type PriceQuote = {
  courseSlug: string;
  basePrice: number; // starting price for this student (after return-customer adj.)
  originalAmount: number; // strike-through price
  finalAmount: number; // what they will pay
  discountPercent: number;
  discountAmount: number;
  isReturnCustomer: boolean;
  promo?: { id: string; code: string; discountPercent: number };
  promoError?: PromoError;
  promoErrorMessage?: string;
};

export async function hasPriorPurchase(email: string | undefined | null): Promise<boolean> {
  if (!email) return false;
  const db = createServiceClient();
  const { count } = await db
    .from('online_purchases')
    .select('id', { count: 'exact', head: true })
    .eq('student_email', email.trim().toLowerCase())
    .eq('status', 'active');
  return (count ?? 0) > 0;
}

export async function quoteCoursePrice(params: {
  courseSlug: string;
  email?: string | null;
  promoCode?: string | null;
}): Promise<PriceQuote> {
  const { courseSlug, email, promoCode } = params;
  const { price, originalPrice } = getCoursePricing(courseSlug);
  const returnCustomer = await hasPriorPurchase(email);
  const basePrice = returnCustomer ? RETURN_CUSTOMER_PRICE : price;
  const originalAmount = originalPrice ?? price;

  if (!promoCode || !email) {
    return {
      courseSlug,
      basePrice,
      originalAmount,
      finalAmount: basePrice,
      discountPercent: 0,
      discountAmount: 0,
      isReturnCustomer: returnCustomer,
    };
  }

  const validation = await validatePromoCode(promoCode, email);
  if (!validation.ok) {
    return {
      courseSlug,
      basePrice,
      originalAmount,
      finalAmount: basePrice,
      discountPercent: 0,
      discountAmount: 0,
      isReturnCustomer: returnCustomer,
      promoError: validation.error,
      promoErrorMessage: errorMessage(validation.error),
    };
  }

  const { discountAmount, finalAmount } = computeDiscount(
    basePrice,
    validation.discountPercent
  );
  return {
    courseSlug,
    basePrice,
    originalAmount,
    finalAmount,
    discountPercent: validation.discountPercent,
    discountAmount,
    isReturnCustomer: returnCustomer,
    promo: {
      id: validation.id,
      code: promoCode.trim().toUpperCase(),
      discountPercent: validation.discountPercent,
    },
  };
}
