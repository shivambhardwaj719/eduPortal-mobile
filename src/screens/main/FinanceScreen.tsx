import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Card, StatCard } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Colors } from '../../constants/colors';
import { format } from 'date-fns';

const FinanceScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'fees' | 'transactions'>('fees');

    // Sample data
    const financeStats = {
        totalFees: 45000,
        paidAmount: 35000,
        pendingAmount: 10000,
        dueDate: '2026-02-15',
    };

    const feeItems = [
        { id: 1, name: 'Tuition Fee', amount: 25000, status: 'paid', dueDate: '2026-01-15', paidDate: '2026-01-10' },
        { id: 2, name: 'Library Fee', amount: 2000, status: 'paid', dueDate: '2026-01-15', paidDate: '2026-01-10' },
        { id: 3, name: 'Lab Fee', amount: 5000, status: 'paid', dueDate: '2026-01-15', paidDate: '2026-01-12' },
        { id: 4, name: 'Sports Fee', amount: 3000, status: 'paid', dueDate: '2026-01-15', paidDate: '2026-01-12' },
        { id: 5, name: 'Exam Fee', amount: 5000, status: 'pending', dueDate: '2026-02-15' },
        { id: 6, name: 'Activity Fee', amount: 5000, status: 'pending', dueDate: '2026-02-15' },
    ];

    const transactions = [
        { id: 1, type: 'payment', description: 'Tuition Fee - Q3', amount: 25000, date: '2026-01-10', method: 'UPI' },
        { id: 2, type: 'payment', description: 'Library Fee', amount: 2000, date: '2026-01-10', method: 'Card' },
        { id: 3, type: 'payment', description: 'Lab + Sports Fee', amount: 8000, date: '2026-01-12', method: 'Net Banking' },
        { id: 4, type: 'refund', description: 'Late Fee Waiver', amount: 500, date: '2026-01-08', method: 'Credit' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return Colors.success.main;
            case 'pending': return Colors.warning.main;
            case 'overdue': return Colors.error.main;
            default: return Colors.neutral[500];
        }
    };

    const paidPercentage = (financeStats.paidAmount / financeStats.totalFees) * 100;

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Colors.background.primary, Colors.background.secondary]}
                style={StyleSheet.absoluteFillObject}
            />

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Finance</Text>
                    <TouchableOpacity style={styles.headerButton}>
                        <Ionicons name="download-outline" size={24} color={Colors.text.primary} />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Summary Card */}
                    <Card variant="gradient" style={styles.summaryCard} gradientColors={['#6366F1', '#8B5CF6']}>
                        <View style={styles.summaryHeader}>
                            <Text style={styles.summaryTitle}>Fee Summary</Text>
                            <Text style={styles.academicYear}>2025-26</Text>
                        </View>

                        <View style={styles.amountContainer}>
                            <View style={styles.amountItem}>
                                <Text style={styles.amountLabel}>Total Fees</Text>
                                <Text style={styles.amountValue}>₹{financeStats.totalFees.toLocaleString()}</Text>
                            </View>
                            <View style={styles.amountDivider} />
                            <View style={styles.amountItem}>
                                <Text style={styles.amountLabel}>Paid</Text>
                                <Text style={styles.amountValue}>₹{financeStats.paidAmount.toLocaleString()}</Text>
                            </View>
                            <View style={styles.amountDivider} />
                            <View style={styles.amountItem}>
                                <Text style={styles.amountLabel}>Pending</Text>
                                <Text style={[styles.amountValue, { color: '#FCD34D' }]}>
                                    ₹{financeStats.pendingAmount.toLocaleString()}
                                </Text>
                            </View>
                        </View>

                        {/* Progress Bar */}
                        <View style={styles.progressContainer}>
                            <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: `${paidPercentage}%` }]} />
                            </View>
                            <Text style={styles.progressText}>{paidPercentage.toFixed(0)}% Paid</Text>
                        </View>

                        <View style={styles.summaryFooter}>
                            <View style={styles.dueDateBadge}>
                                <Ionicons name="calendar-outline" size={14} color={Colors.white} />
                                <Text style={styles.dueDateText}>
                                    Next Due: {format(new Date(financeStats.dueDate), 'MMM dd, yyyy')}
                                </Text>
                            </View>
                        </View>
                    </Card>

                    {/* Quick Pay Button */}
                    {financeStats.pendingAmount > 0 && (
                        <Button
                            title={`Pay ₹${financeStats.pendingAmount.toLocaleString()}`}
                            onPress={() => { }}
                            fullWidth
                            style={styles.payButton}
                            icon={<Ionicons name="wallet-outline" size={20} color={Colors.white} />}
                        />
                    )}

                    {/* Tab Bar */}
                    <View style={styles.tabBar}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'fees' && styles.activeTab]}
                            onPress={() => setActiveTab('fees')}
                        >
                            <Ionicons
                                name="receipt-outline"
                                size={18}
                                color={activeTab === 'fees' ? Colors.primary[500] : Colors.text.muted}
                            />
                            <Text style={[styles.tabText, activeTab === 'fees' && styles.activeTabText]}>
                                Fee Details
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'transactions' && styles.activeTab]}
                            onPress={() => setActiveTab('transactions')}
                        >
                            <Ionicons
                                name="swap-horizontal-outline"
                                size={18}
                                color={activeTab === 'transactions' ? Colors.primary[500] : Colors.text.muted}
                            />
                            <Text style={[styles.tabText, activeTab === 'transactions' && styles.activeTabText]}>
                                Transactions
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Fee Details Tab */}
                    {activeTab === 'fees' && (
                        <View style={styles.feeList}>
                            {feeItems.map((fee) => (
                                <Card key={fee.id} variant="glass" style={styles.feeCard}>
                                    <View style={styles.feeHeader}>
                                        <View>
                                            <Text style={styles.feeName}>{fee.name}</Text>
                                            <Text style={styles.feeDueDate}>
                                                {fee.status === 'paid'
                                                    ? `Paid on ${format(new Date(fee.paidDate!), 'MMM dd')}`
                                                    : `Due: ${format(new Date(fee.dueDate), 'MMM dd, yyyy')}`
                                                }
                                            </Text>
                                        </View>
                                        <View style={styles.feeRight}>
                                            <Text style={styles.feeAmount}>₹{fee.amount.toLocaleString()}</Text>
                                            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(fee.status) + '20' }]}>
                                                <Ionicons
                                                    name={fee.status === 'paid' ? 'checkmark-circle' : 'time'}
                                                    size={14}
                                                    color={getStatusColor(fee.status)}
                                                />
                                                <Text style={[styles.statusText, { color: getStatusColor(fee.status) }]}>
                                                    {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </Card>
                            ))}
                        </View>
                    )}

                    {/* Transactions Tab */}
                    {activeTab === 'transactions' && (
                        <View style={styles.transactionsList}>
                            {transactions.map((transaction) => (
                                <Card key={transaction.id} variant="glass" style={styles.transactionCard}>
                                    <View style={[
                                        styles.transactionIcon,
                                        { backgroundColor: transaction.type === 'payment' ? Colors.success.main + '20' : Colors.info.main + '20' }
                                    ]}>
                                        <Ionicons
                                            name={transaction.type === 'payment' ? 'arrow-up' : 'arrow-down'}
                                            size={20}
                                            color={transaction.type === 'payment' ? Colors.success.main : Colors.info.main}
                                        />
                                    </View>
                                    <View style={styles.transactionContent}>
                                        <Text style={styles.transactionDesc}>{transaction.description}</Text>
                                        <View style={styles.transactionMeta}>
                                            <Text style={styles.transactionDate}>
                                                {format(new Date(transaction.date), 'MMM dd, yyyy')}
                                            </Text>
                                            <View style={styles.methodBadge}>
                                                <Ionicons
                                                    name={transaction.method === 'UPI' ? 'phone-portrait' : transaction.method === 'Card' ? 'card' : 'globe'}
                                                    size={12}
                                                    color={Colors.text.muted}
                                                />
                                                <Text style={styles.methodText}>{transaction.method}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <Text style={[
                                        styles.transactionAmount,
                                        { color: transaction.type === 'payment' ? Colors.success.main : Colors.info.main }
                                    ]}>
                                        {transaction.type === 'payment' ? '-' : '+'}₹{transaction.amount.toLocaleString()}
                                    </Text>
                                </Card>
                            ))}
                        </View>
                    )}

                    {/* Payment Methods */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Payment Methods</Text>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.paymentMethods}
                    >
                        {[
                            { name: 'UPI', icon: 'phone-portrait', color: Colors.primary[500] },
                            { name: 'Card', icon: 'card', color: Colors.secondary[500] },
                            { name: 'Net Banking', icon: 'globe', color: Colors.accent.purple },
                            { name: 'Wallet', icon: 'wallet', color: Colors.accent.orange },
                        ].map((method, index) => (
                            <TouchableOpacity key={index} style={styles.paymentMethod}>
                                <View style={[styles.paymentIcon, { backgroundColor: method.color + '20' }]}>
                                    <Ionicons name={method.icon as any} size={24} color={method.color} />
                                </View>
                                <Text style={styles.paymentName}>{method.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View style={{ height: 100 }} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.primary,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    headerButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: Colors.glass.background,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.glass.border,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    summaryCard: {
        marginBottom: 16,
        padding: 20,
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.white,
    },
    academicYear: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    amountContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    amountItem: {
        flex: 1,
        alignItems: 'center',
    },
    amountDivider: {
        width: 1,
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    amountLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 4,
    },
    amountValue: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.white,
    },
    progressContainer: {
        marginBottom: 16,
    },
    progressBar: {
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 4,
        marginBottom: 8,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.white,
        borderRadius: 4,
    },
    progressText: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'right',
    },
    summaryFooter: {
        alignItems: 'center',
    },
    dueDateBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    dueDateText: {
        fontSize: 13,
        color: Colors.white,
        fontWeight: '500',
    },
    payButton: {
        marginBottom: 24,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: Colors.glass.background,
        borderRadius: 16,
        padding: 4,
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        gap: 6,
        borderRadius: 12,
    },
    activeTab: {
        backgroundColor: Colors.background.tertiary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text.muted,
    },
    activeTabText: {
        color: Colors.primary[500],
        fontWeight: '600',
    },
    feeList: {
        gap: 12,
        marginBottom: 24,
    },
    feeCard: {
        padding: 16,
    },
    feeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    feeName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 4,
    },
    feeDueDate: {
        fontSize: 13,
        color: Colors.text.muted,
    },
    feeRight: {
        alignItems: 'flex-end',
    },
    feeAmount: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 6,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
    },
    transactionsList: {
        gap: 12,
        marginBottom: 24,
    },
    transactionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    transactionIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    transactionContent: {
        flex: 1,
    },
    transactionDesc: {
        fontSize: 15,
        fontWeight: '500',
        color: Colors.text.primary,
        marginBottom: 4,
    },
    transactionMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    transactionDate: {
        fontSize: 13,
        color: Colors.text.muted,
    },
    methodBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    methodText: {
        fontSize: 12,
        color: Colors.text.muted,
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: '700',
    },
    sectionHeader: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    paymentMethods: {
        gap: 12,
        paddingBottom: 8,
    },
    paymentMethod: {
        alignItems: 'center',
        backgroundColor: Colors.glass.background,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.glass.border,
        minWidth: 90,
    },
    paymentIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    paymentName: {
        fontSize: 13,
        fontWeight: '500',
        color: Colors.text.secondary,
    },
});

export default FinanceScreen;
