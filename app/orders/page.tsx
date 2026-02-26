'use client'

import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingBag, Calendar, Package, Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function OrdersPage() {
    const { user, loading: authLoading } = useAuth()
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user) {
            fetchOrders()
        } else if (!authLoading) {
            setLoading(false)
        }
    }, [user, authLoading])

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setOrders(data || [])
        } catch (err) {
            console.error('Error fetching orders:', err)
        } finally {
            setLoading(false)
        }
    }

    if (loading || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-20 space-y-4">
                <Clock className="w-16 h-16 text-muted-foreground" />
                <h2 className="text-2xl font-serif">Please login to view your orders</h2>
                <Link href="/login?redirect=/orders">
                    <Button>Login Now</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <header className="flex justify-between items-end mb-12">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-serif font-bold text-foreground">Order History</h1>
                        <p className="text-muted-foreground">Your curated collection of past purchases.</p>
                    </div>
                    <Link href="/">
                        <Button variant="outline" className="rounded-full">Continue Shopping</Button>
                    </Link>
                </header>

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-card border border-border/40 rounded-3xl space-y-6">
                        <Package className="w-12 h-12 text-muted-foreground mx-auto" />
                        <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                        <Link href="/">
                            <Button>Explore Collection</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {orders.map((order) => (
                            <Card key={order.id} className="overflow-hidden border-border/40 hover:shadow-lg transition-shadow rounded-2xl">
                                <CardHeader className="bg-secondary/10 px-8 py-6">
                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                        <div className="flex items-center gap-6">
                                            <div className="space-y-1">
                                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Order Date</p>
                                                <div className="flex items-center gap-2 text-sm font-medium">
                                                    <Calendar className="w-4 h-4 text-primary" />
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Total Amount</p>
                                                <p className="text-sm font-bold text-primary">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_price)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end md:items-end justify-center">
                                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Status</p>
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="space-y-6">
                                        {order.items.map((item: any, idx: number) => (
                                            <div key={idx} className="flex gap-4 items-center">
                                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary/10 flex-shrink-0">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-grow flex justify-between">
                                                    <div>
                                                        <p className="font-semibold text-sm">{item.name}</p>
                                                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                                    </div>
                                                    <p className="text-sm font-medium">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
