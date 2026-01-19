import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    TextInput,
    Image,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { Card } from '../../components/ui/Card';
import { Colors } from '../../constants/colors';
import { libraryService } from '../../services/dataService';
import { Book, BookIssue } from '../../types';

const { width } = Dimensions.get('window');

const LibraryScreen: React.FC = () => {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'browse' | 'borrowed' | 'history'>('browse');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [books, setBooks] = useState<Book[]>([]);
    const [borrowedBooks, setBorrowedBooks] = useState<BookIssue[]>([]);

    // Sample data
    const sampleBooks: Book[] = [
        { id: 1, title: 'Data Structures and Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', publisher: 'MIT Press', category: 'Computer Science', total_copies: 5, available_copies: 3 },
        { id: 2, title: 'Fundamentals of Physics', author: 'David Halliday', isbn: '978-1118230718', publisher: 'Wiley', category: 'Physics', total_copies: 8, available_copies: 5 },
        { id: 3, title: 'Organic Chemistry', author: 'Paula Yurkanis Bruice', isbn: '978-0134042282', publisher: 'Pearson', category: 'Chemistry', total_copies: 6, available_copies: 2 },
        { id: 4, title: 'Calculus: Early Transcendentals', author: 'James Stewart', isbn: '978-1285741550', publisher: 'Cengage', category: 'Mathematics', total_copies: 10, available_copies: 7 },
        { id: 5, title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0061120084', publisher: 'Harper Perennial', category: 'Literature', total_copies: 12, available_copies: 8 },
        { id: 6, title: 'A Brief History of Time', author: 'Stephen Hawking', isbn: '978-0553380163', publisher: 'Bantam Books', category: 'Science', total_copies: 4, available_copies: 1 },
        { id: 7, title: 'The Art of Electronics', author: 'Paul Horowitz', isbn: '978-0521809269', publisher: 'Cambridge', category: 'Electronics', total_copies: 3, available_copies: 2 },
        { id: 8, title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', isbn: '978-0062316097', publisher: 'Harper', category: 'History', total_copies: 6, available_copies: 4 },
    ];

    const sampleBorrowedBooks = [
        { id: 1, book: sampleBooks[0], issue_date: '2026-01-05', due_date: '2026-01-19', status: 'issued' as const },
        { id: 2, book: sampleBooks[5], issue_date: '2026-01-10', due_date: '2026-01-24', status: 'issued' as const },
    ];

    const categories = ['All', 'Computer Science', 'Physics', 'Mathematics', 'Chemistry', 'Literature', 'Science'];

    const fetchLibraryData = async () => {
        try {
            const [booksData, borrowedData] = await Promise.all([
                libraryService.getAllBooks().catch(() => ({ results: [] })),
                libraryService.getIssuedBooks().catch(() => ({ results: [] })),
            ]);
            setBooks(booksData.results.length > 0 ? booksData.results : sampleBooks);
            setBorrowedBooks(borrowedData.results.length > 0 ? borrowedData.results as BookIssue[] : sampleBorrowedBooks as any);
        } catch (error) {
            console.log('Error fetching library data:', error);
            setBooks(sampleBooks);
            setBorrowedBooks(sampleBorrowedBooks as any);
        }
    };

    useEffect(() => {
        fetchLibraryData();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchLibraryData();
        setRefreshing(false);
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            'Computer Science': Colors.primary[500],
            'Physics': Colors.accent.purple,
            'Mathematics': Colors.secondary[500],
            'Chemistry': Colors.accent.orange,
            'Literature': Colors.accent.pink,
            'Science': Colors.info.main,
            'History': Colors.warning.main,
            'Electronics': Colors.accent.cyan,
        };
        return colors[category] || Colors.neutral[500];
    };

    const getAvailabilityStatus = (book: Book) => {
        const percentage = (book.available_copies / book.total_copies) * 100;
        if (percentage === 0) return { label: 'Unavailable', color: Colors.error.main };
        if (percentage <= 30) return { label: 'Low Stock', color: Colors.warning.main };
        return { label: 'Available', color: Colors.success.main };
    };

    const getDaysRemaining = (dueDate: string) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const tabs = [
        { key: 'browse', label: 'Browse', icon: 'grid-outline' },
        { key: 'borrowed', label: 'Borrowed', icon: 'book-outline', badge: borrowedBooks.length },
        { key: 'history', label: 'History', icon: 'time-outline' },
    ];

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Colors.background.primary, Colors.background.secondary]}
                style={StyleSheet.absoluteFillObject}
            />

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Library</Text>
                    <TouchableOpacity style={styles.headerButton}>
                        <Ionicons name="qr-code-outline" size={24} color={Colors.text.primary} />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search-outline" size={20} color={Colors.text.muted} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search books, authors..."
                            placeholderTextColor={Colors.text.muted}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Ionicons name="close-circle" size={20} color={Colors.text.muted} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <TouchableOpacity style={styles.filterButton}>
                        <Ionicons name="options-outline" size={20} color={Colors.text.primary} />
                    </TouchableOpacity>
                </View>

                {/* Tab Bar */}
                <View style={styles.tabBar}>
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab.key}
                            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
                            onPress={() => setActiveTab(tab.key as any)}
                        >
                            <Ionicons
                                name={tab.icon as any}
                                size={18}
                                color={activeTab === tab.key ? Colors.primary[500] : Colors.text.muted}
                            />
                            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
                                {tab.label}
                            </Text>
                            {tab.badge !== undefined && tab.badge > 0 && (
                                <View style={styles.tabBadge}>
                                    <Text style={styles.tabBadgeText}>{tab.badge}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={Colors.primary[500]}
                        />
                    }
                >
                    {activeTab === 'browse' && (
                        <>
                            {/* Categories */}
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.categoriesContainer}
                            >
                                {categories.map((category) => (
                                    <TouchableOpacity
                                        key={category}
                                        style={[
                                            styles.categoryChip,
                                            selectedCategory === category && styles.activeCategoryChip,
                                        ]}
                                        onPress={() => setSelectedCategory(category)}
                                    >
                                        <Text
                                            style={[
                                                styles.categoryChipText,
                                                selectedCategory === category && styles.activeCategoryChipText,
                                            ]}
                                        >
                                            {category}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            {/* Books Grid */}
                            <View style={styles.booksGrid}>
                                {filteredBooks.map((book) => {
                                    const availability = getAvailabilityStatus(book);
                                    return (
                                        <TouchableOpacity key={book.id} style={styles.bookCard}>
                                            <Card variant="glass" style={styles.bookCardInner}>
                                                {/* Book Cover Placeholder */}
                                                <View style={[styles.bookCover, { backgroundColor: getCategoryColor(book.category) + '20' }]}>
                                                    <Ionicons name="book" size={40} color={getCategoryColor(book.category)} />
                                                </View>
                                                <View style={styles.bookInfo}>
                                                    <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
                                                    <Text style={styles.bookAuthor} numberOfLines={1}>{book.author}</Text>
                                                    <View style={styles.bookMeta}>
                                                        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(book.category) + '20' }]}>
                                                            <Text style={[styles.categoryBadgeText, { color: getCategoryColor(book.category) }]}>
                                                                {book.category}
                                                            </Text>
                                                        </View>
                                                        <View style={[styles.availabilityBadge, { backgroundColor: availability.color + '20' }]}>
                                                            <View style={[styles.availabilityDot, { backgroundColor: availability.color }]} />
                                                            <Text style={[styles.availabilityText, { color: availability.color }]}>
                                                                {book.available_copies}/{book.total_copies}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </Card>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </>
                    )}

                    {activeTab === 'borrowed' && (
                        <View style={styles.borrowedList}>
                            {borrowedBooks.length > 0 ? (
                                <>
                                    {/* Stats */}
                                    <View style={styles.borrowedStats}>
                                        <Card variant="glass" style={styles.borrowedStatCard}>
                                            <Ionicons name="book" size={24} color={Colors.primary[500]} />
                                            <Text style={styles.borrowedStatValue}>{borrowedBooks.length}</Text>
                                            <Text style={styles.borrowedStatLabel}>Books Borrowed</Text>
                                        </Card>
                                        <Card variant="glass" style={styles.borrowedStatCard}>
                                            <Ionicons name="time" size={24} color={Colors.warning.main} />
                                            <Text style={styles.borrowedStatValue}>
                                                {borrowedBooks.filter((b: any) => getDaysRemaining(b.due_date) <= 3).length}
                                            </Text>
                                            <Text style={styles.borrowedStatLabel}>Due Soon</Text>
                                        </Card>
                                    </View>

                                    {borrowedBooks.map((issue: any) => {
                                        const daysLeft = getDaysRemaining(issue.due_date);
                                        const isOverdue = daysLeft < 0;
                                        const isDueSoon = daysLeft <= 3 && daysLeft >= 0;

                                        return (
                                            <Card key={issue.id} variant="glass" style={styles.borrowedCard}>
                                                <View style={[styles.borrowedBookCover, { backgroundColor: getCategoryColor(issue.book.category) + '20' }]}>
                                                    <Ionicons name="book" size={28} color={getCategoryColor(issue.book.category)} />
                                                </View>
                                                <View style={styles.borrowedContent}>
                                                    <Text style={styles.borrowedTitle} numberOfLines={1}>{issue.book.title}</Text>
                                                    <Text style={styles.borrowedAuthor}>{issue.book.author}</Text>
                                                    <View style={styles.borrowedMeta}>
                                                        <View style={styles.dateInfo}>
                                                            <Ionicons name="calendar-outline" size={12} color={Colors.text.muted} />
                                                            <Text style={styles.dateText}>Issued: {issue.issue_date}</Text>
                                                        </View>
                                                        <View style={[
                                                            styles.dueInfo,
                                                            { backgroundColor: isOverdue ? Colors.error.main + '20' : isDueSoon ? Colors.warning.main + '20' : Colors.success.main + '20' }
                                                        ]}>
                                                            <Ionicons
                                                                name={isOverdue ? 'alert-circle' : 'time'}
                                                                size={12}
                                                                color={isOverdue ? Colors.error.main : isDueSoon ? Colors.warning.main : Colors.success.main}
                                                            />
                                                            <Text style={[
                                                                styles.dueText,
                                                                { color: isOverdue ? Colors.error.main : isDueSoon ? Colors.warning.main : Colors.success.main }
                                                            ]}>
                                                                {isOverdue ? `Overdue by ${Math.abs(daysLeft)} days` : `${daysLeft} days left`}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <TouchableOpacity style={styles.renewButton}>
                                                    <Ionicons name="refresh" size={18} color={Colors.primary[500]} />
                                                </TouchableOpacity>
                                            </Card>
                                        );
                                    })}
                                </>
                            ) : (
                                <View style={styles.emptyState}>
                                    <Ionicons name="book-outline" size={64} color={Colors.text.muted} />
                                    <Text style={styles.emptyTitle}>No Borrowed Books</Text>
                                    <Text style={styles.emptySubtitle}>Browse our collection and borrow some books</Text>
                                </View>
                            )}
                        </View>
                    )}

                    {activeTab === 'history' && (
                        <View style={styles.historyList}>
                            <View style={styles.emptyState}>
                                <Ionicons name="time-outline" size={64} color={Colors.text.muted} />
                                <Text style={styles.emptyTitle}>No History Yet</Text>
                                <Text style={styles.emptySubtitle}>Your borrowing history will appear here</Text>
                            </View>
                        </View>
                    )}

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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: Colors.glass.background,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.glass.border,
    },
    headerTitle: {
        fontSize: 20,
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
    searchContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 16,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.glass.background,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: Colors.glass.border,
        paddingHorizontal: 14,
        height: 48,
        gap: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: Colors.text.primary,
    },
    filterButton: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: Colors.glass.background,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.glass.border,
    },
    tabBar: {
        flexDirection: 'row',
        marginHorizontal: 20,
        backgroundColor: Colors.glass.background,
        borderRadius: 16,
        padding: 4,
        marginBottom: 16,
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
        fontSize: 13,
        fontWeight: '500',
        color: Colors.text.muted,
    },
    activeTabText: {
        color: Colors.primary[500],
        fontWeight: '600',
    },
    tabBadge: {
        backgroundColor: Colors.error.main,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        marginLeft: 2,
    },
    tabBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: Colors.white,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    categoriesContainer: {
        gap: 10,
        paddingBottom: 16,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: Colors.glass.background,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.glass.border,
    },
    activeCategoryChip: {
        backgroundColor: Colors.primary[500],
        borderColor: Colors.primary[500],
    },
    categoryChipText: {
        fontSize: 13,
        fontWeight: '500',
        color: Colors.text.secondary,
    },
    activeCategoryChipText: {
        color: Colors.white,
    },
    booksGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    bookCard: {
        width: (width - 52) / 2,
    },
    bookCardInner: {
        padding: 12,
    },
    bookCover: {
        width: '100%',
        height: 120,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    bookInfo: {},
    bookTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 4,
        lineHeight: 18,
    },
    bookAuthor: {
        fontSize: 12,
        color: Colors.text.muted,
        marginBottom: 10,
    },
    bookMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    categoryBadgeText: {
        fontSize: 9,
        fontWeight: '600',
    },
    availabilityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 6,
        gap: 4,
    },
    availabilityDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
    },
    availabilityText: {
        fontSize: 10,
        fontWeight: '600',
    },
    borrowedList: {
        gap: 12,
    },
    borrowedStats: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    borrowedStatCard: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
    },
    borrowedStatValue: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text.primary,
        marginTop: 8,
    },
    borrowedStatLabel: {
        fontSize: 12,
        color: Colors.text.muted,
        marginTop: 2,
    },
    borrowedCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
    },
    borrowedBookCover: {
        width: 56,
        height: 72,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    borrowedContent: {
        flex: 1,
    },
    borrowedTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 2,
    },
    borrowedAuthor: {
        fontSize: 13,
        color: Colors.text.muted,
        marginBottom: 8,
    },
    borrowedMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    dateInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dateText: {
        fontSize: 11,
        color: Colors.text.muted,
    },
    dueInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        gap: 4,
    },
    dueText: {
        fontSize: 10,
        fontWeight: '600',
    },
    renewButton: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: Colors.primary[500] + '15',
        justifyContent: 'center',
        alignItems: 'center',
    },
    historyList: {},
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.text.primary,
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: Colors.text.muted,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
});

export default LibraryScreen;
