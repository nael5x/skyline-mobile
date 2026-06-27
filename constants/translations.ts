export type Language = "ar" | "tr";

export type TranslationKey =
  | "home" | "products" | "about" | "contact" | "services" | "cart" | "settings"
  | "welcomeTitle" | "welcomeSubtitle" | "featuredCategories" | "viewAll"
  | "ourServices" | "whyChooseUs" | "contactUs" | "callUs" | "whatsapp" | "sendMessage"
  | "name" | "email" | "message" | "send" | "address" | "addressValue" | "phone"
  | "aboutTitle" | "aboutDesc" | "ourMission" | "missionDesc" | "ourVision" | "visionDesc"
  | "yearsExp" | "clients" | "projects" | "quality" | "selectLanguage"
  | "allCategories" | "searchProducts" | "productDetails" | "backToProducts"
  | "relatedProducts" | "getQuote"
  | "digitalPrinting" | "digitalPrintingDesc" | "offsetPrinting" | "offsetPrintingDesc"
  | "largeFormat" | "largeFormatDesc" | "designService" | "designServiceDesc"
  | "packaging" | "packagingDesc" | "expressDelivery" | "expressDeliveryDesc"
  | "boxCalculatorTitle" | "boxCalculatorSub"
  | "bookPrintingTitle" | "bookPrintingSub"
  | "marketplaceTitle" | "marketplaceSub"
  | "namePlaceholder" | "emailPlaceholder" | "messagePlaceholder"
  | "messageSent" | "fillAllFields" | "followUs" | "workHours" | "workHoursValue" | "categories"
  | "addToCart" | "cartEmpty" | "cartEmptyDesc" | "cartTitle" | "removeItem"
  | "clearCart" | "clearCartConfirm" | "cancel" | "yes" | "checkout"
  | "orderSummary" | "orderDetails" | "customerName" | "customerPhone" | "customerCity"
  | "notes" | "customerNamePlaceholder" | "customerPhonePlaceholder"
  | "customerCityPlaceholder" | "notesPlaceholder" | "placeOrder"
  | "orderSent" | "orderSentDesc" | "quantity" | "items" | "continueShop"
  | "total" | "itemAdded" | "back"
  | "orderHistory" | "noOrders" | "noOrdersDesc" | "orderDate" | "orderItems" | "reorder"
  | "privacyPolicy" | "termsOfService" | "appVersion" | "language" | "legalInfo"
  | "onboardingTitle1" | "onboardingDesc1" | "onboardingTitle2" | "onboardingDesc2"
  | "onboardingTitle3" | "onboardingDesc3" | "getStarted" | "next" | "skip"
  | "shareProduct" | "copyLink" | "moreProducts" | "searchAll"
  | "login" | "loginSubtitle" | "password" | "forgotPassword" | "noAccount"
  | "createAccount" | "registerSubtitle" | "fullName" | "confirmPassword"
  | "passwordMismatch" | "passwordTooShort" | "haveAccount"
  | "emailSent" | "checkEmail" | "forgotSubtitle" | "sendResetLink" | "backToLogin" | "enterEmail"
  | "logout" | "logoutConfirm" | "loginToAccount" | "addresses" | "notifications"
  | "orderTracking" | "orderStatus" | "pending" | "confirmed" | "printing" | "ready" | "delivered" | "cancelled"
  | "subtotal" | "vat" | "deliveryFee" | "couponCode" | "applyCoupon" | "paymentMethod" | "cashOnDelivery" | "bankTransfer"
  | "deliveryAddress" | "street" | "city" | "country";

type Translations = Record<Language, Record<TranslationKey, string>>;

export const translations: Translations = {
  ar: {
    home: "الرئيسية", products: "المنتجات", about: "من نحن", contact: "تواصل معنا",
    services: "خدماتنا", cart: "السلة", settings: "الإعدادات",
    welcomeTitle: "Skyline Group", welcomeSubtitle: "حلول الطباعة الاحترافية لعملكم",
    featuredCategories: "التصنيفات المميزة", viewAll: "عرض الكل",
    ourServices: "خدماتنا", whyChooseUs: "لماذا تختارنا؟",
    contactUs: "تواصل معنا", callUs: "اتصل بنا", whatsapp: "واتساب", sendMessage: "أرسل رسالة",
    name: "الاسم", email: "البريد الإلكتروني", message: "الرسالة", send: "إرسال",
    address: "العنوان", addressValue: "Değirmiçem, 36014. Sk., 27090 Şehitkamil/Gaziantep", phone: "الهاتف",
    aboutTitle: "من نحن",
    aboutDesc: "Skyline Group شركة رائدة في مجال الطباعة الاحترافية، نقدم حلولاً متكاملة لجميع احتياجاتكم الطباعية والتسويقية من غازي عنتاب / تركيا، نخدم عملاءنا في المنطقة وخارجها.",
    ourMission: "مهمتنا",
    missionDesc: "تقديم خدمات طباعة عالية الجودة بأسعار تنافسية مع ضمان رضا العميل الكامل وتسليم الطلبات في الوقت المحدد.",
    ourVision: "رؤيتنا",
    visionDesc: "أن نكون الشريك الطباعي الأول والأكثر ثقة في المنطقة، مع التوسع المستمر في تقديم حلول إبداعية ومبتكرة.",
    yearsExp: "سنوات خبرة", clients: "عميل راضٍ", projects: "مشروع منجز", quality: "ضمان الجودة",
    selectLanguage: "اختر اللغة", allCategories: "جميع الفئات", searchProducts: "ابحث عن منتج...",
    productDetails: "تفاصيل المنتج", backToProducts: "العودة للمنتجات", relatedProducts: "منتجات مشابهة",
    getQuote: "اطلب عرض سعر",
    digitalPrinting: "الطباعة الرقمية", digitalPrintingDesc: "طباعة رقمية عالية الدقة بألوان زاهية وحادة",
    offsetPrinting: "الطباعة الأوفست", offsetPrintingDesc: "طباعة أوفست احترافية للكميات الكبيرة",
    largeFormat: "الطباعة كبيرة الحجم", largeFormatDesc: "لافتات وبنرات وملصقات بأحجام ضخمة",
    designService: "خدمة التصميم", designServiceDesc: "فريق تصميم إبداعي لإبراز هويتكم التجارية",
    packaging: "حلول التغليف", packagingDesc: "تغليف احترافي يعكس جودة منتجاتكم",
    expressDelivery: "التوصيل السريع", expressDeliveryDesc: "توصيل سريع وآمن لجميع الطلبات",
    boxCalculatorTitle: "حاسبة الكرتون الذكية", boxCalculatorSub: "احسب تكلفة التغليف بدقة",
    bookPrintingTitle: "طباعة الكتب والمجلات", bookPrintingSub: "احسب تكلفة طباعة كتابك",
    marketplaceTitle: "المستلزمات والماكينات", marketplaceSub: "ماكينات ومواد خام بأفضل الأسعار",
    namePlaceholder: "أدخل اسمك", emailPlaceholder: "أدخل بريدك الإلكتروني",
    messagePlaceholder: "اكتب رسالتك هنا...", messageSent: "تم إرسال رسالتك بنجاح!",
    fillAllFields: "يرجى ملء جميع الحقول", followUs: "تابعنا",
    workHours: "ساعات العمل", workHoursValue: "الاثنين - السبت: 9:00 صباحاً - 7:00 مساءً",
    categories: "التصنيفات",
    addToCart: "أضف إلى السلة", cartEmpty: "السلة فارغة",
    cartEmptyDesc: "لم تضف أي منتجات بعد. تصفح منتجاتنا وأضف ما تحتاجه.",
    cartTitle: "سلة المشتريات", removeItem: "حذف", clearCart: "إفراغ السلة",
    clearCartConfirm: "هل أنت متأكد من إفراغ السلة؟", cancel: "إلغاء", yes: "نعم",
    checkout: "إتمام الطلب", orderSummary: "ملخص الطلب", orderDetails: "تفاصيل الطلب",
    customerName: "الاسم الكامل", customerPhone: "رقم الهاتف", customerCity: "المدينة / المنطقة",
    notes: "ملاحظات", customerNamePlaceholder: "أدخل اسمك الكامل",
    customerPhonePlaceholder: "مثال: 0911234567", customerCityPlaceholder: "مثال: دمشق - المزة",
    notesPlaceholder: "أي تفاصيل إضافية للطلب...",
    placeOrder: "إرسال الطلب عبر واتساب", orderSent: "تم إرسال طلبك!",
    orderSentDesc: "سيتواصل معك فريقنا في أقرب وقت لتأكيد الطلب.",
    quantity: "الكمية", items: "منتجات", continueShop: "تابع التسوق",
    total: "المجموع", itemAdded: "تمت الإضافة إلى السلة", back: "رجوع",
    orderHistory: "سجل الطلبات", noOrders: "لا توجد طلبات سابقة",
    noOrdersDesc: "ستظهر هنا طلباتك بعد إتمام أول طلب.", orderDate: "التاريخ",
    orderItems: "المنتجات", reorder: "إعادة الطلب",
    privacyPolicy: "سياسة الخصوصية", termsOfService: "الشروط والأحكام",
    appVersion: "إصدار التطبيق", language: "اللغة", legalInfo: "المعلومات القانونية",
    onboardingTitle1: "مرحباً بكم في Skyline Group",
    onboardingDesc1: "شريككم الموثوق في الطباعة الاحترافية لأكثر من 10 سنوات",
    onboardingTitle2: "تصفح مئات المنتجات",
    onboardingDesc2: "بطاقات أعمال، بروشورات، لافتات، ملصقات، هدايا ترويجية وأكثر",
    onboardingTitle3: "اطلب بسهولة عبر واتساب",
    onboardingDesc3: "أضف منتجاتك للسلة وأرسل طلبك مباشرة - سنتواصل معك في دقائق",
    getStarted: "ابدأ الآن", next: "التالي", skip: "تخطي",
    shareProduct: "مشاركة المنتج", copyLink: "نسخ الرابط", moreProducts: "منتجات أخرى",
    searchAll: "البحث في كل المنتجات",
    login: "تسجيل الدخول", loginSubtitle: "سجّل دخولك لمتابعة طلباتك",
    password: "كلمة المرور", forgotPassword: "نسيت كلمة المرور؟",
    noAccount: "ليس لديك حساب؟", createAccount: "إنشاء حساب",
    registerSubtitle: "أنشئ حسابك للبدء بالطلب", fullName: "الاسم الكامل",
    confirmPassword: "تأكيد كلمة المرور", passwordMismatch: "كلمات المرور غير متطابقة",
    passwordTooShort: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
    haveAccount: "لديك حساب بالفعل؟",
    emailSent: "تم الإرسال", checkEmail: "تحقق من بريدك الإلكتروني لإعادة تعيين كلمة المرور",
    forgotSubtitle: "أدخل بريدك وسنرسل لك رابط لإعادة تعيين كلمة المرور",
    sendResetLink: "إرسال رابط إعادة التعيين", backToLogin: "العودة لتسجيل الدخول",
    enterEmail: "الرجاء إدخال البريد الإلكتروني",
    logout: "تسجيل الخروج", logoutConfirm: "هل تريد تسجيل الخروج؟",
    loginToAccount: "سجّل دخولك لتتمكن من متابعة طلباتك",
    addresses: "العناوين", notifications: "الإشعارات",
    orderTracking: "تتبع الطلب", orderStatus: "حالة الطلب",
    pending: "قيد الانتظار", confirmed: "مؤكد", printing: "جارِ الطباعة",
    ready: "جاهز", delivered: "تم التسليم", cancelled: "ملغي",
    subtotal: "المجموع الفرعي", vat: "ضريبة القيمة المضافة",
    deliveryFee: "رسوم التوصيل", couponCode: "كود الخصم",
    applyCoupon: "تطبيق", paymentMethod: "طريقة الدفع",
    cashOnDelivery: "الدفع عند الاستلام", bankTransfer: "تحويل بنكي",
    deliveryAddress: "عنوان التوصيل", street: "الشارع", city: "المدينة", country: "البلد",
  },
  tr: {
    home: "Ana Sayfa", products: "Ürünler", about: "Hakkımızda", contact: "İletişim",
    services: "Hizmetler", cart: "Sepet", settings: "Ayarlar",
    welcomeTitle: "Skyline Group", welcomeSubtitle: "İşletmeniz İçin Profesyonel Baskı Çözümleri",
    featuredCategories: "Öne Çıkan Kategoriler", viewAll: "Tümünü Gör",
    ourServices: "Hizmetlerimiz", whyChooseUs: "Neden Bizi Seçmelisiniz?",
    contactUs: "Bize Ulaşın", callUs: "Ara", whatsapp: "WhatsApp", sendMessage: "Mesaj Gönder",
    name: "Ad Soyad", email: "E-posta", message: "Mesaj", send: "Gönder",
    address: "Adres", addressValue: "Değirmiçem, 36014. Sk., 27090 Şehitkamil/Gaziantep", phone: "Telefon",
    aboutTitle: "Hakkımızda",
    aboutDesc: "Skyline Group, Gaziantep'te kurulu, bölge genelinde ve ötesinde müşterilerine kapsamlı baskı ve pazarlama çözümleri sunan öncü bir profesyonel baskı şirketidir.",
    ourMission: "Misyonumuz",
    missionDesc: "Tam müşteri memnuniyetini ve zamanında teslimatı sağlarken rekabetçi fiyatlarla yüksek kaliteli baskı hizmetleri sunmak.",
    ourVision: "Vizyonumuz",
    visionDesc: "Bölgedeki en güvenilir baskı ortağı olmak ve yaratıcı ve yenilikçi çözümler sunmaya sürekli genişlemek.",
    yearsExp: "Yıllık Deneyim", clients: "Mutlu Müşteri", projects: "Tamamlanan Proje", quality: "Kalite Garantisi",
    selectLanguage: "Dil Seçin", allCategories: "Tüm Kategoriler", searchProducts: "Ürün ara...",
    productDetails: "Ürün Detayları", backToProducts: "Ürünlere Dön", relatedProducts: "İlgili Ürünler",
    getQuote: "Fiyat Teklifi Al",
    digitalPrinting: "Dijital Baskı", digitalPrintingDesc: "Canlı, keskin renklerle yüksek çözünürlüklü dijital baskı",
    offsetPrinting: "Ofset Baskı", offsetPrintingDesc: "Büyük miktarlar için profesyonel ofset baskı",
    largeFormat: "Büyük Format Baskı", largeFormatDesc: "Devasa formatlarda afiş, tabela ve posterler",
    designService: "Tasarım Hizmeti", designServiceDesc: "Marka kimliğinizi öne çıkarmak için yaratıcı tasarım ekibi",
    packaging: "Ambalaj Çözümleri", packagingDesc: "Ürünlerinizin kalitesini yansıtan profesyonel ambalaj",
    expressDelivery: "Hızlı Teslimat", expressDeliveryDesc: "Tüm siparişler için hızlı ve güvenli teslimat",
    boxCalculatorTitle: "Akıllı Kutu Hesaplayıcı", boxCalculatorSub: "Ambalaj maliyetini doğru hesaplayın",
    bookPrintingTitle: "Kitap ve Dergi Baskısı", bookPrintingSub: "Kitap baskı maliyetini hesaplayın",
    marketplaceTitle: "Malzeme ve Makineler", marketplaceSub: "Makineler ve ham maddeler en iyi fiyatla",
    namePlaceholder: "Adınızı girin", emailPlaceholder: "E-posta adresinizi girin",
    messagePlaceholder: "Mesajınızı buraya yazın...", messageSent: "Mesajınız başarıyla gönderildi!",
    fillAllFields: "Lütfen tüm alanları doldurun", followUs: "Bizi Takip Edin",
    workHours: "Çalışma Saatleri", workHoursValue: "Pzt - Cmt: 09:00 - 19:00",
    categories: "Kategoriler",
    addToCart: "Sepete Ekle", cartEmpty: "Sepetiniz boş",
    cartEmptyDesc: "Henüz ürün eklemediniz. Ürünlerimize göz atın ve ihtiyaçlarınızı ekleyin.",
    cartTitle: "Alışveriş Sepeti", removeItem: "Kaldır", clearCart: "Sepeti Temizle",
    clearCartConfirm: "Sepeti temizlemek istediğinizden emin misiniz?", cancel: "İptal", yes: "Evet",
    checkout: "Siparişi Tamamla", orderSummary: "Sipariş Özeti", orderDetails: "Sipariş Detayları",
    customerName: "Ad Soyad", customerPhone: "Telefon Numarası", customerCity: "Şehir / Bölge",
    notes: "Notlar", customerNamePlaceholder: "Tam adınızı girin",
    customerPhonePlaceholder: "örn. +963 911 234 567", customerCityPlaceholder: "örn. Şam - Mezze",
    notesPlaceholder: "Ek sipariş detayları...",
    placeOrder: "WhatsApp ile Sipariş Gönder", orderSent: "Sipariş Gönderildi!",
    orderSentDesc: "Ekibimiz siparişinizi onaylamak için kısa süre içinde sizinle iletişime geçecektir.",
    quantity: "Adet", items: "ürün", continueShop: "Alışverişe Devam",
    total: "Toplam", itemAdded: "Sepete eklendi", back: "Geri",
    orderHistory: "Sipariş Geçmişi", noOrders: "Önceki sipariş yok",
    noOrdersDesc: "İlk siparişinizi tamamladıktan sonra siparişleriniz burada görünecektir.",
    orderDate: "Tarih", orderItems: "Ürünler", reorder: "Yeniden Sipariş Ver",
    privacyPolicy: "Gizlilik Politikası", termsOfService: "Hizmet Şartları",
    appVersion: "Uygulama Sürümü", language: "Dil", legalInfo: "Yasal Bilgiler",
    onboardingTitle1: "Skyline Group'a Hoş Geldiniz",
    onboardingDesc1: "10 yılı aşkın süredir güvenilir profesyonel baskı ortağınız",
    onboardingTitle2: "Yüzlerce Ürüne Göz Atın",
    onboardingDesc2: "Kartvizitler, broşürler, afişler, etiketler, promosyon hediyeleri ve daha fazlası",
    onboardingTitle3: "WhatsApp ile Kolayca Sipariş Verin",
    onboardingDesc3: "Ürünleri sepete ekleyin ve siparişinizi doğrudan gönderin - dakikalar içinde sizinle iletişime geçeceğiz",
    getStarted: "Başla", next: "İleri", skip: "Atla",
    shareProduct: "Ürünü Paylaş", copyLink: "Bağlantıyı Kopyala", moreProducts: "Daha Fazla Ürün",
    searchAll: "Tüm ürünlerde ara",
    login: "Giriş Yap", loginSubtitle: "Siparişlerinizi takip etmek için giriş yapın",
    password: "Şifre", forgotPassword: "Şifremi Unuttum?",
    noAccount: "Hesabınız yok mu?", createAccount: "Hesap Oluştur",
    registerSubtitle: "Sipariş vermeye başlamak için hesap oluşturun", fullName: "Ad Soyad",
    confirmPassword: "Şifre Tekrar", passwordMismatch: "Şifreler uyuşmuyor",
    passwordTooShort: "Şifre en az 6 karakter olmalıdır",
    haveAccount: "Zaten hesabınız var mı?",
    emailSent: "E-posta Gönderildi", checkEmail: "Şifrenizi sıfırlamak için e-postanızı kontrol edin",
    forgotSubtitle: "E-postanızı girin, size sıfırlama bağlantısı göndereceğiz",
    sendResetLink: "Sıfırlama Bağlantısı Gönder", backToLogin: "Girişe Dön",
    enterEmail: "Lütfen e-postanızı girin",
    logout: "Çıkış Yap", logoutConfirm: "Çıkış yapmak istediğinizden emin misiniz?",
    loginToAccount: "Siparişlerinizi takip etmek ve hesabınızı yönetmek için giriş yapın",
    addresses: "Adresler", notifications: "Bildirimler",
    orderTracking: "Sipariş Takibi", orderStatus: "Sipariş Durumu",
    pending: "Beklemede", confirmed: "Onaylandı", printing: "Baskıda",
    ready: "Hazır", delivered: "Teslim Edildi", cancelled: "İptal Edildi",
    subtotal: "Ara Toplam", vat: "KDV",
    deliveryFee: "Teslimat Ücreti", couponCode: "Kupon Kodu",
    applyCoupon: "Uygula", paymentMethod: "Ödeme Yöntemi",
    cashOnDelivery: "Kapıda Ödeme", bankTransfer: "Banka Transferi",
    deliveryAddress: "Teslimat Adresi", street: "Sokak", city: "Şehir", country: "Ülke",
  },
};