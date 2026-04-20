import { courseConfigs } from '@/config/learn-modules';

// Single source of truth for online-course pricing. Client + server both
// read from here so the price on the button always matches the price the
// server charges. Never compute pricing from client-supplied values.
export const DEFAULT_COURSE_PRICE = 999;
export const RETURN_CUSTOMER_PRICE = 799;

export type CoursePricing = {
  price: number;
  originalPrice?: number;
};

export function getCoursePricing(courseSlug: string): CoursePricing {
  const cfg = courseConfigs[courseSlug];
  return {
    price: cfg?.onlinePrice ?? DEFAULT_COURSE_PRICE,
    originalPrice: cfg?.originalPrice,
  };
}
