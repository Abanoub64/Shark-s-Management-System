import {
  Injectable,
  signal,
  inject,
  PLATFORM_ID,
  EffectRef,
  effect,
  computed,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export type Language = 'en' | 'ar';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  currentLang = signal<Language>('en');

  // Translation Dictionary
  private translations: Record<Language, any> = {
    en: {
      // Layout
      admin: 'Admin',
      headOffice: 'Head Office',
      dashboard: 'Dashboard',
      branches: 'Branches',
      employees: 'Employees',
      services: 'Services',
      bookings: 'Bookings',
      analytics: 'Analytics',
      branchManager: 'Branch Manager',
      branchOverview: 'Branch Overview',
      queueSystem: 'Queue System',
      exit: 'Exit',

      // Common
      exportReport: 'Export Report',
      quickActions: 'Quick Actions',
      export: 'Export',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      confirm: 'Confirm',
      actions: 'Actions',
      status: 'Status',
      name: 'Name',
      phone: 'Phone',
      role: 'Role',
      branch: 'Branch',
      rating: 'Rating',
      save: 'Save',
      update: 'Update',
      create: 'Create',
      search: 'Search',
      filterByName: 'Filter by name...',
      choosePhoto: 'Choose Photo',
      fullName: 'Full Name',
      phoneNumber: 'Phone Number',
      selectBranch: 'Select a branch',

      // Dashboard
      superAdminDashboard: 'Super Admin Dashboard',
      welcomeMessage: "Welcome back! Here's what's happening today.",
      totalRevenueYTD: 'Total Revenue (YTD)',
      yearToDateEarnings: 'Year to date earnings',
      totalBookings: 'Total Bookings',
      allTimeBookings: 'All time bookings',
      activeBranches: 'Active Branches',
      operationalLocations: 'Operational locations',
      avgWaitTime: 'Avg Wait Time',
      minutesPerCustomer: 'Minutes per customer',
      dailyRevenue: 'Daily Revenue',
      weeklyRevenue: 'Weekly Revenue',
      monthlyRevenue: 'Monthly Revenue',
      completedBookings: 'Completed Bookings',
      revenueTrends: 'Revenue Trends',
      revenueByBranch: 'Revenue by Branch',
      revenueByService: 'Revenue by Service',
      topPerformingBarbers: 'Top Performing Barbers',
      customerBreakdown: 'Customer Breakdown',
      revenueByTimeOfDay: 'Revenue by Time of Day',
      newCustomers: 'New Customers',
      returningCustomers: 'Returning Customers',
      cancelledBookings: 'Cancelled Bookings',
      averageRating: 'Average Rating',

      // Employees
      employeesManagement: 'Employees Management',
      manageStaff: 'Manage barbers and staff across all branches',
      addEmployee: 'Add Employee',
      totalEmployees: 'Total Employees',
      activeToday: 'Active Today',
      onLeave: 'On Leave',
      avgPerformance: 'Avg Performance',
      allEmployees: 'All Employees',
      noEmployeesFound: 'No employees found matching',
      employeePhoto: 'Employee Photo',
      editEmployee: 'Edit Employee',
      addNewEmployee: 'Add New Employee',

      // Store
      store: 'Store',
      products: 'Products',
      addToCart: 'Add to Cart',
      price: 'Price',
      currency: 'EGP',
      productDetails: 'Product Details',
      category: 'Category',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      buyNow: 'Buy Now',
      cart: 'Cart',
      items: 'Items',
      total: 'Total',
      checkout: 'Checkout',
      shoppingCart: 'Shopping Cart',
      emptyCart: 'Your cart is empty',
      continueShopping: 'Continue Shopping',
      addedToCart: 'Added to cart!',

      // Landing Page
      premiumBarberExperience: 'Premium Barber Experience',
      experienceArt: 'Experience the Art of',
      masterfulGrooming: 'Masterful Grooming',
      heroSubtitle:
        'Where traditional craftsmanship meets modern style. Elevate your look with our expert barbers in an atmosphere of refined luxury.',
      bookAppointment: 'Book Appointment',
      exploreServices: 'Explore Services',
      // averageRating key exists in Dashboard section
      happyClients: 'Happy Clients',
      yearsExperience: 'Years Experience',
      whyChoose: 'Why Choose BarberChain?',
      whyChooseSubtitle:
        'We combine traditional techniques with modern style to give you the best look.',
      expertBarbers: 'Expert Barbers',
      expertBarbersDesc:
        'Our team consists of highly trained professionals with years of experience.',
      premiumComfort: 'Premium Comfort',
      premiumComfortDesc:
        'Relax in our luxury chairs and enjoy a complimentary beverage with every cut.',
      easyBooking: 'Easy Booking',
      easyBookingDesc: 'Book your appointment online in seconds. Choose your barber and time slot.',
      popularBranches: 'Popular Branches',
      findLocation: 'Find a location near you.',
      viewAll: 'View All',
      open: 'Open',
      closed: 'Closed',
      book: 'Book',

      // Main Layout
      home: 'Home',
      myBookings: 'My Bookings',
      signIn: 'Sign In',
      footerTagline: 'Premium grooming services for the modern gentleman.',
      quickLinks: 'Quick Links',
      aboutUs: 'About Us',
      support: 'Support',
      contactUs: 'Contact Us',
      faq: 'FAQ',
      privacyPolicy: 'Privacy Policy',
      connect: 'Connect',
      rightsReserved: 'All rights reserved.',
      findBranch: 'Find a Branch',
      searchPlaceholder: 'Search by name or location...',
      viewDetails: 'View Details',
      noBranchesFound: 'No branches found matching your search.',

      // Hairstyle Recommender
      tryHaircut: 'Try Haircut',
      hairstyleRecommender: 'AI Hairstyle Recommender',
      hairstyleSubtitle: 'Upload your photo and discover your next look with professional barber insights.',
      uploadPhoto: 'Upload Photo',
      dragDropWrapper: 'Drag & drop or click to browse',
      changePhoto: 'Change Photo',
      selectHairstyle: 'Select Hairstyle',
      generateNewLook: 'Generate New Look',
      processing: 'Processing...',
      yourNewLook: 'Your New Look',
      barberNote: "Barber's Note",
      validImageError: 'Please upload a valid image file.',
      uploadFirstError: 'Please upload an image first.',
      failedToGenerate: 'Failed to generate hairstyle',
    },
    ar: {
      // Layout
      admin: 'الإدارة',
      headOffice: 'المكتب الرئيسي',
      dashboard: 'لوحة التحكم',
      branches: 'الفروع',
      employees: 'الموظفين',
      services: 'الخدمات',
      bookings: 'الحجوزات',
      analytics: 'التحليلات',
      branchManager: 'مدير الفرع',
      branchOverview: 'نظرة عامة للفرع',
      queueSystem: 'نظام الطابور',
      exit: 'خروج',

      // Common
      exportReport: 'تصدير التقرير',
      quickActions: 'إجراءات سريعة',
      export: 'تصدير',
      cancel: 'إلغاء',
      delete: 'حذف',
      edit: 'تعديل',
      view: 'عرض',
      confirm: 'تأكيد',
      actions: 'إجراءات',
      status: 'الحالة',
      name: 'الاسم',
      phone: 'الهاتف',
      role: 'الوظيفة',
      branch: 'الفرع',
      rating: 'التقييم',
      save: 'حفظ',
      update: 'تحديث',
      create: 'إنشاء',
      search: 'بحث',
      filterByName: 'بحث بالاسم...',
      choosePhoto: 'اختر صورة',
      fullName: 'الاسم الكامل',
      phoneNumber: 'رقم الهاتف',
      selectBranch: 'اختر الفرع',

      // Dashboard
      superAdminDashboard: 'لوحة تحكم الإدارة العليا',
      welcomeMessage: 'مرحباً بعودتك! إليك ملخص اليوم.',
      totalRevenueYTD: 'إجمالي الإيرادات (السنة الحالية)',
      yearToDateEarnings: 'أرباح منذ بداية العام',
      totalBookings: 'إجمالي الحجوزات',
      allTimeBookings: 'جميع الحجوزات',
      activeBranches: 'الفروع النشطة',
      operationalLocations: 'المواقع العاملة',
      avgWaitTime: 'متوسط وقت الانتظار',
      minutesPerCustomer: 'دقيقة لكل عميل',
      dailyRevenue: 'الإيرادات اليومية',
      weeklyRevenue: 'الإيرادات الأسبوعية',
      monthlyRevenue: 'الإيرادات الشهرية',
      completedBookings: 'الحجوزات المكتملة',
      revenueTrends: 'اتجاهات الإيرادات',
      revenueByBranch: 'الإيرادات حسب الفرع',
      revenueByService: 'الإيرادات حسب الخدمة',
      topPerformingBarbers: 'أفضل الحلاقين أداءً',
      customerBreakdown: 'توزيع العملاء',
      revenueByTimeOfDay: 'الإيرادات حسب الوقت',
      newCustomers: 'عملاء جدد',
      returningCustomers: 'عملاء عائدون',
      cancelledBookings: 'حجوزات ملغاة',
      averageRating: 'متوسط التقييم',

      // Employees
      employeesManagement: 'إدارة الموظفين',
      manageStaff: 'إدارة الحلاقين والموظفين في جميع الفروع',
      addEmployee: 'إضافة موظف',
      totalEmployees: 'إجمالي الموظفين',
      activeToday: 'نشط اليوم',
      onLeave: 'في إجازة',
      avgPerformance: 'متوسط الأداء',
      allEmployees: 'جميع الموظفين',
      noEmployeesFound: 'لا يوجد موظفين مطابقين لـ',
      employeePhoto: 'صورة الموظف',
      editEmployee: 'تعديل موظف',
      addNewEmployee: 'إضافة موظف جديد',

      // Store
      store: 'المتجر',
      products: 'المنتجات',
      addToCart: 'أضف إلى السلة',
      price: 'السعر',
      currency: 'ج.م',
      productDetails: 'تفاصيل المنتج',
      category: 'الفئة',
      inStock: 'متوفر',
      outOfStock: 'غير متوفر',
      buyNow: 'شراء الآن',
      cart: 'السلة',
      items: 'عناصر',
      total: 'الإجمالي',
      checkout: 'الدفع',
      shoppingCart: 'سلة التسوق',
      emptyCart: 'سلتك فارغة',
      continueShopping: 'متابعة التسوق',
      addedToCart: 'تمت الإضافة للسلة!',

      // Landing Page
      premiumBarberExperience: 'تجربة حلاقة فاخرة',
      experienceArt: 'جرب فن',
      masterfulGrooming: 'الحلاقة المتقنة',
      heroSubtitle:
        'حيث تلتقي الحرفية التقليدية بالأسلوب الحديث. ارتقِ بمظهرك مع خبرائنا في أجواء من الفخامة الراقية.',
      bookAppointment: 'احجز موعداً',
      exploreServices: 'استكشف الخدمات',
      // averageRating key exists in Dashboard section
      happyClients: 'عميل سعيد',
      yearsExperience: 'سنوات خبرة',
      whyChoose: 'لماذا تختار BarberChain؟',
      whyChooseSubtitle: 'نجمع بين التقنيات التقليدية والأسلوب الحديث لمنحك أفضل مظهر.',
      expertBarbers: 'حلاقون خبراء',
      expertBarbersDesc: 'فريقنا يتكون من محترفين مدربين تدريباً عالياً ولديهم سنوات من الخبرة.',
      premiumComfort: 'راحة فاخرة',
      premiumComfortDesc: 'استرخ في مقاعدنا الفاخرة واستمتع بمشروب مجاني مع كل قصة شعر.',
      easyBooking: 'حجز سهل',
      easyBookingDesc: 'احجز موعدك عبر الإنترنت في ثوان. اختر حلاقك والوقت المناسب.',
      popularBranches: 'الفروع الشهيرة',
      findLocation: 'ابحث عن موقع قريب منك.',
      viewAll: 'عرض الكل',
      open: 'مفتوح',
      closed: 'مغلق',
      book: 'حجز',

      // Main Layout
      home: 'الرئيسية',
      myBookings: 'حجوزاتي',
      signIn: 'تسجيل الدخول',
      footerTagline: 'خدمات حلاقة فاخرة للرجل العصري.',
      quickLinks: 'روابط سريعة',
      aboutUs: 'من نحن',
      support: 'الدعم',
      contactUs: 'اتصل بنا',
      faq: 'الأسئلة الشائعة',
      privacyPolicy: 'سياسة الخصوصية',
      connect: 'تواصل معنا',
      rightsReserved: 'جميع الحقوق محفوظة.',
      findBranch: 'ابحث عن فرع',
      searchPlaceholder: 'ابحث بالاسم أو الموقع...',
      viewDetails: 'عرض التفاصيل',
      noBranchesFound: 'لا توجد فروع تطابق بحثك.',

      // Hairstyle Recommender
      tryHaircut: 'جرب قصة الشعر',
      hairstyleRecommender: 'مستشار قصات الشعر بالذكاء الاصطناعي',
      hairstyleSubtitle: 'ارفع صورتك واكتشف مظهرك الجديد مع نصائح حلاقة احترافية.',
      uploadPhoto: 'رفع صورة',
      dragDropWrapper: 'اسحب وأفلت أو انقر للتصفح',
      changePhoto: 'تغيير الصورة',
      selectHairstyle: 'اختر قصة الشعر',
      generateNewLook: 'إنشاء مظهر جديد',
      processing: 'جاري المعالجة...',
      yourNewLook: 'مظهرك الجديد',
      barberNote: 'ملاحظة الحلاق',
      validImageError: 'يرجى رفع ملف صورة صالح.',
      uploadFirstError: 'يرجى رفع صورة أولاً.',
      failedToGenerate: 'فشل إنشاء قصة الشعر',
    },
  };

  // Computed signal for current translations
  t = computed(() => this.translations[this.currentLang()]);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Load saved language or default to 'en'
      const savedLang = localStorage.getItem('lang') as Language;
      if (savedLang) {
        this.setLanguage(savedLang);
      }
    }

    effect(() => {
      const lang = this.currentLang();
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('lang', lang);
        this.updateDocument(lang);
      }
    });
  }

  toggleLanguage() {
    this.setLanguage(this.currentLang() === 'en' ? 'ar' : 'en');
  }

  setLanguage(lang: Language) {
    this.currentLang.set(lang);
  }

  private updateDocument(lang: Language) {
    // const dir = lang === 'ar' ? 'rtl' : 'ltr';
    this.document.documentElement.lang = lang;
    // this.document.documentElement.dir = dir;
  }
}
