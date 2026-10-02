'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/checkout/shipping-address');
  }, [router]);

  return (
    <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400">
      Redirecting to shipping address...
    </div>
  );
}
