import { courseConfigs } from '@/config/learn-modules';
import { courses } from '@/config/courses';

// Two course pricing surfaces exist:
//  - /learn/course/[slug] + "Buy All Access": cheap self-paced online tier,
//    priced from learn-modules.ts (onlinePrice, typically ₹999).
//  - /lp/* cohort landing pages: premium cohort tier, priced from
//    courses.ts (the price the LP renders). Razorpay must charge the
//    cohort price the student saw, never the cheap online-tier price.
// getCoursePricing() serves the online tier; getLpPricing() serves LPs.
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

export function getLpPricing(courseSlug: string): CoursePricing {
  const course = courses.find((c) => c.slug === courseSlug);
  if (!course) {
    return getCoursePricing(courseSlug);
  }
  return {
    price: course.price,
    originalPrice: course.originalPrice,
  };
}
