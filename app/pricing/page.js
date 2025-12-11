'use client';

import { useState } from 'react';
import { Check, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/components/ui/Input';
import Script from 'next/script';

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [loading, setLoading] = useState(false);

    const plans = [
        {
            name: 'Starter',
            price: '0',
            currency: '₹',
            description: 'For individuals exploring AI memory.',
            features: [
                '10 daily queries',
                'Basic memory retention',
                'Standard response speed',
                'Community support'
            ],
            highlight: false,
            cta: 'Get Started',
            href: '/auth/signin',
            action: 'link'
        },
        {
            name: 'Pro',
            price: '999',
            currency: '₹',
            period: '/month',
            description: 'Power users who need a second brain.',
            features: [
                'Unlimited queries',
                'Infinite memory history',
                'Fast response speed',
                'Priority support',
                'Upload documents (PDF, Docx)'
            ],
            highlight: true,
            cta: 'Upgrade to Pro',
            href: '#',
            action: 'pay',
            amount: 999
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            currency: '',
            description: 'For teams requiring secure knowledge sharing.',
            features: [
                'Everything in Pro',
                'Team spaces',
                'Admin controls',
                'SSO & Audit logs',
                'Dedicated success manager'
            ],
            highlight: false,
            cta: 'Contact Sales',
            href: 'mailto:sales@lynx.ai',
            action: 'link'
        }
    ];

    const handlePayment = async (plan) => {
        if (plan.action !== 'pay') {
            window.location.href = plan.href;
            return;
        }

        setLoading(true);
        try {
            // 1. Create Order
            const res = await fetch('/api/payment/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId: plan.name, amount: plan.amount })
            });

            const order = await res.json();

            if (!res.ok) throw new Error(order.error);

            // 2. Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "test_key", // Fallback for dev
                amount: order.amount,
                currency: order.currency,
                name: "Lynx AI",
                description: `Subscription to ${plan.name} Plan`,
                order_id: order.id,
                handler: function (response) {
                    alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
                    // Verify payment on backend here
                },
                prefill: {
                    name: "User Name", // Ideally from session
                    email: "user@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#A8C7FA"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.error("Payment failed:", error);
            alert("Payment initialization failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-on-surface py-20 px-6 overflow-x-hidden relative">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

             {/* Abstract Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[128px] pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto space-y-16">

                {/* Header */}
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                    <h1 className="text-display-small md:text-display-medium font-medium text-balance">
                        Invest in your <span className="text-primary">intellectual capacity</span>.
                    </h1>
                    <p className="text-headline-small text-on-surface-variant font-normal">
                        Choose the plan that fits your thinking style.
                    </p>

                    {/* Toggle (Visual only for now) */}
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <span className={cn("text-label-large", billingCycle === 'monthly' ? "text-on-surface" : "text-on-surface-variant")}>Monthly</span>
                        <button
                            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                            className="w-14 h-8 bg-surface-container-high rounded-full relative transition-colors"
                        >
                            <div className={cn(
                                "absolute top-1 w-6 h-6 bg-primary rounded-full transition-all duration-300 shadow-sm",
                                billingCycle === 'monthly' ? "left-1" : "left-7"
                            )} />
                        </button>
                        <span className={cn("text-label-large", billingCycle === 'yearly' ? "text-on-surface" : "text-on-surface-variant")}>
                            Yearly <span className="text-secondary text-label-small font-bold ml-1">-20%</span>
                        </span>
                    </div>
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-3 gap-8 items-start">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "relative p-8 rounded-[32px] border transition-all duration-300 flex flex-col gap-6",
                                plan.highlight
                                    ? "bg-surface-container border-primary/30 shadow-elevation-2 scale-105 z-10"
                                    : "bg-surface-container-low border-outline-variant/30 hover:bg-surface-container"
                            )}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-label-small font-bold shadow-sm">
                                    Most Popular
                                </div>
                            )}

                            <div>
                                <h3 className="text-title-large font-medium mb-2">{plan.name}</h3>
                                <p className="text-body-medium text-on-surface-variant h-10">{plan.description}</p>
                            </div>

                            <div className="flex items-baseline gap-1">
                                <span className="text-display-small font-bold">{plan.currency}{plan.price}</span>
                                {plan.period && <span className="text-body-large text-on-surface-variant">{plan.period}</span>}
                            </div>

                            <Button
                                variant={plan.highlight ? 'filled' : 'outlined'}
                                className="w-full"
                                onClick={() => handlePayment(plan)}
                                disabled={loading}
                            >
                                {plan.cta}
                            </Button>

                            <div className="space-y-4 pt-4 border-t border-outline-variant/20">
                                {plan.features.map((feature, fIdx) => (
                                    <div key={fIdx} className="flex items-start gap-3 text-body-medium text-on-surface-variant">
                                        <Check size={20} className="text-secondary shrink-0" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Enterprise Banner */}
                 <div className="p-8 md:p-12 rounded-[32px] bg-gradient-to-r from-surface-container to-surface-container-high border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-8 shadow-elevation-1">
                    <div className="space-y-4 max-w-2xl">
                        <div className="flex items-center gap-3 text-tertiary">
                            <Shield size={24} />
                            <h3 className="text-title-large font-medium">Enterprise Security</h3>
                        </div>
                         <p className="text-body-large text-on-surface-variant">
                            Need custom data retention, SLA guarantees, or on-premise deployment? We build for compliance.
                        </p>
                    </div>
                    <Button variant="tonal" size="lg">Talk to Security Team</Button>
                </div>
            </div>
        </div>
    );
}
