import { Language } from "./translations";

export interface Category {
  id: string;
  icon: string;
  nameAr: string;
  nameEn: string;
  nameTr: string;
  color: string;
  image?: string;
  products: Product[];
}

export interface Product {
  id: string;
  categoryId: string;
  nameAr: string;
  nameEn: string;
  nameTr: string;
  descAr: string;
  descEn: string;
  descTr: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "labels",
    icon: "tag",
    nameAr: "ملصقات لاصقة",
    nameEn: "Sticker Labels",
    nameTr: "Yapışkan Etiket",
    color: "#1B3A6B",
    products: [
      { id: "l1", categoryId: "labels", nameAr: "مطبوع - سيلوفاني", nameEn: "Printed - Laminated", nameTr: "Baskılı - Selefonlu", descAr: "ملصقات لاصقة مطبوعة بجودة عالية مع طبقة سيلوفان براقة للحماية والمظهر الاحترافي", descEn: "High-quality printed sticker labels with glossy lamination for protection and professional look", descTr: "Koruma ve profesyonel görünüm için parlak selefon kaplı yüksek kaliteli baskılı yapışkan etiket" },
      { id: "l2", categoryId: "labels", nameAr: "طباعة ذهبية - سيلوفاني", nameEn: "Gold Print - Laminated", nameTr: "Yaldız Baskı - Selefon", descAr: "ملصقات فاخرة مع طباعة ذهبية لامعة وطبقة سيلوفان عالية الجودة", descEn: "Luxury stickers with shiny gold printing and high-quality lamination", descTr: "Parlak altın baskılı ve yüksek kaliteli selefonlu lüks etiketler" },
      { id: "l3", categoryId: "labels", nameAr: "قص مخصص", nameEn: "Custom Cut", nameTr: "Özel Kesim", descAr: "ملصقات بأشكال مخصصة حسب تصميمكم وحاجاتكم", descEn: "Custom shaped stickers according to your design and needs", descTr: "Tasarımınıza ve ihtiyaçlarınıza göre özel şekilli etiketler" },
      { id: "l4", categoryId: "labels", nameAr: "ملصقات مرور البضائع", nameEn: "Cargo Labels", nameTr: "Kargo Etiketleri", descAr: "ملصقات تعريفية للبضائع والشحنات بألوان وأحجام مختلفة", descEn: "Identification labels for goods and shipments in various colors and sizes", descTr: "Çeşitli renk ve boyutlarda mal ve kargo için kimlik etiketleri" },
      { id: "l5", categoryId: "labels", nameAr: "ملصقات شفافة", nameEn: "Transparent Labels", nameTr: "Şeffaf Etiketler", descAr: "ملصقات شفافة أنيقة تبدو كأنها جزء من المنتج نفسه", descEn: "Elegant transparent labels that look like part of the product itself", descTr: "Ürünün kendisinin parçasıymış gibi görünen zarif şeffaf etiketler" },
    ],
  },
  {
    id: "brochures_105",
    icon: "book-open",
    nameAr: "بروشورات إعلانية 105g",
    nameEn: "Promotional Brochures 105g",
    nameTr: "Tanıtım Broşürleri 105g",
    color: "#C9A847",
    image: "cat_brochures",
    products: [
      { id: "b1", categoryId: "brochures_105", nameAr: "بروشور A4", nameEn: "A4 Brochure", nameTr: "A4 Broşür", descAr: "بروشورات إعلانية بحجم A4 على ورق 105 غرام - طباعة ملونة عالية الجودة", descEn: "Promotional A4 brochures on 105g paper - high quality color printing", descTr: "105g kağıt üzerine A4 tanıtım broşürü - yüksek kaliteli renkli baskı" },
      { id: "b2", categoryId: "brochures_105", nameAr: "بروشور A5", nameEn: "A5 Brochure", nameTr: "A5 Broşür", descAr: "بروشورات إعلانية بحجم A5 مثالية للتوزيع اليدوي والمعارض", descEn: "A5 promotional brochures ideal for handouts and exhibitions", descTr: "El ilanları ve sergiler için ideal A5 tanıtım broşürleri" },
      { id: "b3", categoryId: "brochures_105", nameAr: "بروشور مطوي A4", nameEn: "Folded A4 Brochure", nameTr: "Katlı A4 Broşür", descAr: "بروشور A4 مطوي ثلاث أو أربع طيات - مثالي للمعلومات التفصيلية", descEn: "Tri or quad-fold A4 brochure - ideal for detailed information", descTr: "Ayrıntılı bilgi için ideal üç veya dört katlı A4 broşür" },
    ],
  },
  {
    id: "brochures_115",
    icon: "file-text",
    nameAr: "بروشورات رسمية 115g",
    nameEn: "Official Brochures 115g",
    nameTr: "Resmi Broşürler 115g",
    color: "#2E6DA4",
    products: [
      { id: "br1", categoryId: "brochures_115", nameAr: "بروشور رسمي A3", nameEn: "Official A3 Brochure", nameTr: "Resmi A3 Broşür", descAr: "بروشورات رسمية بحجم A3 على ورق 115 غرام فاخر", descEn: "Official A3 brochures on premium 115g paper", descTr: "Premium 115g kağıt üzerine resmi A3 broşür" },
      { id: "br2", categoryId: "brochures_115", nameAr: "بروشور رسمي A4", nameEn: "Official A4 Brochure", nameTr: "Resmi A4 Broşür", descAr: "بروشورات رسمية بحجم A4 على ورق 115 غرام مثالية للمراسلات الرسمية", descEn: "Official A4 brochures on 115g paper ideal for formal correspondence", descTr: "Resmi yazışmalar için ideal 115g kağıt üzerine resmi A4 broşür" },
      { id: "br3", categoryId: "brochures_115", nameAr: "بروشور رسمي A5", nameEn: "Official A5 Brochure", nameTr: "Resmi A5 Broşür", descAr: "بروشورات رسمية بحجم A5 للوثائق والتقارير المختصرة", descEn: "Official A5 brochures for documents and brief reports", descTr: "Belgeler ve kısa raporlar için resmi A5 broşür" },
    ],
  },
  {
    id: "brochures_laminated",
    icon: "layers",
    nameAr: "بروشورات مصفحة 200g",
    nameEn: "Laminated Brochures 200g",
    nameTr: "Selefonlu Resmi Broşürler 200g",
    color: "#5C3D82",
    products: [
      { id: "bl1", categoryId: "brochures_laminated", nameAr: "بروشور مصفح A3", nameEn: "Laminated A3 Brochure", nameTr: "Selefonlu A3 Broşür", descAr: "بروشور A3 على ورق 200 غرام مع تصفيح فاخر للحماية من الماء والخدش", descEn: "A3 brochure on 200g paper with luxury lamination for water and scratch protection", descTr: "Su ve çizik koruması için lüks selefon kaplı 200g kağıt üzerine A3 broşür" },
      { id: "bl2", categoryId: "brochures_laminated", nameAr: "بروشور مصفح A4", nameEn: "Laminated A4 Brochure", nameTr: "Selefonlu A4 Broşür", descAr: "بروشور A4 مصفح 200 غرام - الخيار الأفضل للكتيبات الإعلانية الراقية", descEn: "Laminated A4 brochure 200g - the best choice for premium promotional booklets", descTr: "Premium tanıtım kitapçıkları için en iyi seçim, selefonlu A4 broşür 200g" },
      { id: "bl3", categoryId: "brochures_laminated", nameAr: "بروشور مصفح A5", nameEn: "Laminated A5 Brochure", nameTr: "Selefonlu A5 Broşür", descAr: "بروشور A5 مصفح على ورق 200 غرام مثالي لبطاقات المنتجات والكتالوجات", descEn: "Laminated A5 brochure on 200g paper ideal for product cards and catalogs", descTr: "Ürün kartları ve kataloglar için ideal 200g kağıt üzerine selefonlu A5 broşür" },
    ],
  },
  {
    id: "posters",
    icon: "image",
    nameAr: "بوسترات إعلانية كبيرة",
    nameEn: "Large Promotional Posters",
    nameTr: "Büyük Tanıtım Posterleri",
    color: "#B5451B",
    image: "cat_posters",
    products: [
      { id: "p1", categoryId: "posters", nameAr: "بوستر 69×49 سم", nameEn: "Poster 69×49 cm", nameTr: "Afiş 69×49 cm", descAr: "بوسترات إعلانية كبيرة بحجم 69×49 سم على ورق 105 غرام لامع", descEn: "Large promotional posters 69×49 cm on 105g glossy paper", descTr: "105g parlak kağıt üzerine büyük tanıtım afişleri 69×49 cm" },
      { id: "p2", categoryId: "posters", nameAr: "بوستر 34×49 سم", nameEn: "Poster 34×49 cm", nameTr: "Afiş 34×49 cm", descAr: "بوسترات إعلانية بحجم 34×49 سم مثالية للمحلات والمطاعم", descEn: "Promotional posters 34×49 cm ideal for shops and restaurants", descTr: "Dükkanlar ve restoranlar için ideal 34×49 cm tanıtım afişleri" },
      { id: "p3", categoryId: "posters", nameAr: "بوستر A1", nameEn: "A1 Poster", nameTr: "A1 Afiş", descAr: "بوسترات A1 ضخمة للإعلانات الخارجية والداخلية", descEn: "Large A1 posters for outdoor and indoor advertising", descTr: "Açık ve kapalı mekan reklamcılığı için büyük A1 afişler" },
    ],
  },
  {
    id: "cards",
    icon: "credit-card",
    nameAr: "بطاقات أعمال",
    nameEn: "Business Cards",
    nameTr: "Kartvizitler",
    color: "#1B5E8A",
    products: [
      { id: "c1", categoryId: "cards", nameAr: "ملمس كتاني", nameEn: "Linen Textured", nameTr: "Keten Dokulu", descAr: "بطاقات أعمال بملمس كتاني فاخر يعطي انطباعاً احترافياً مميزاً", descEn: "Business cards with luxurious linen texture giving a distinctive professional impression", descTr: "Ayırt edici profesyonel izlenim veren lüks keten dokulu kartvizitler" },
      { id: "c2", categoryId: "cards", nameAr: "لاك بارز - طباعة ذهبية", nameEn: "Embossed - Gold Print", nameTr: "Kabartma Lak - Yaldız Baskı", descAr: "بطاقات بلاك بارز وطباعة ذهبية - للشركات التي تريد إبهار عملائها", descEn: "Cards with embossed lacquer and gold printing - for companies that want to impress clients", descTr: "Müşterileri etkilemek isteyen şirketler için kabartma laklı ve altın baskılı kartvizitler" },
      { id: "c3", categoryId: "cards", nameAr: "كرتون مطلي - لاك - ذهبي", nameEn: "Coated Card - Lacquer - Gold", nameTr: "Sıvamalı Karton - Lak - Yaldız", descAr: "بطاقات بكرتون مطلي سميك مع لاك بارز وطباعة ذهبية - الأفضل في السوق", descEn: "Cards with thick coated cardboard, embossed lacquer and gold print - the best in the market", descTr: "Piyasadaki en iyisi: kalın kaplı karton, kabartma lak ve yaldız baskılı kartvizitler" },
      { id: "c4", categoryId: "cards", nameAr: "بطاقات UV", nameEn: "UV Coated Cards", nameTr: "UV Kaplı Kartvizitler", descAr: "بطاقات مع طلاء UV براق أو مطفي لمظهر عصري وأنيق", descEn: "Cards with glossy or matte UV coating for a modern and elegant look", descTr: "Modern ve zarif görünüm için parlak veya mat UV kaplı kartvizitler" },
      { id: "c5", categoryId: "cards", nameAr: "بطاقات موف بارز", nameEn: "Embossed Spot UV", nameTr: "Kabartmalı Spot UV", descAr: "بطاقات مع UV موضعي بارز على عناصر محددة من التصميم", descEn: "Cards with embossed spot UV on specific design elements", descTr: "Belirli tasarım öğelerinde kabartmalı spot UV'li kartvizitler" },
    ],
  },
  {
    id: "restaurant",
    icon: "coffee",
    nameAr: "مطاعم ومقاهي",
    nameEn: "Restaurants & Cafes",
    nameTr: "Restoran ve Kafeler",
    color: "#7B3F00",
    products: [
      { id: "r1", categoryId: "restaurant", nameAr: "قوائم مصفحة", nameEn: "Laminated Menus", nameTr: "Laminasyonlu Menüler", descAr: "قوائم طعام محمية بتصفيح عالي الجودة مقاومة للبقع والرطوبة", descEn: "Menu protected with high-quality lamination resistant to stains and moisture", descTr: "Leke ve neme karşı dayanıklı yüksek kaliteli laminasyonla korunan menüler" },
      { id: "r2", categoryId: "restaurant", nameAr: "قوائم جلدية", nameEn: "Leather Menus", nameTr: "Deri Menüler", descAr: "قوائم طعام فاخرة بأغطية جلدية تعكس فخامة مطعمكم", descEn: "Luxury menus with leather covers that reflect the elegance of your restaurant", descTr: "Restoranınızın zarafetini yansıtan deri kapaklı lüks menüler" },
      { id: "r3", categoryId: "restaurant", nameAr: "ورق خدمة", nameEn: "Service Paper", nameTr: "Servis Kağıdı", descAr: "ورق خدمة الطاولات مع شعار المطعم - يضيف لمسة احترافية", descEn: "Table service paper with restaurant logo - adds a professional touch", descTr: "Profesyonel dokunuş katan restoran logolu masa servis kağıdı" },
      { id: "r4", categoryId: "restaurant", nameAr: "ورق الساندويش", nameEn: "Sandwich Paper", nameTr: "Sandviç Kağıdı", descAr: "ورق تغليف الساندويش المطبوع بشعار علامتكم التجارية", descEn: "Sandwich wrapping paper printed with your brand logo", descTr: "Marka logonuzla baskılı sandviç sarma kağıdı" },
      { id: "r5", categoryId: "restaurant", nameAr: "أكياس ورقية", nameEn: "Paper Bags", nameTr: "Kağıt Çantalar", descAr: "أكياس ورقية مطبوعة بشعاركم للتوصيل والتغليف", descEn: "Printed paper bags with your logo for delivery and packaging", descTr: "Teslimat ve paketleme için logonuzla baskılı kağıt çantalar" },
      { id: "r6", categoryId: "restaurant", nameAr: "بطاقات طاولة", nameEn: "Table Cards", nameTr: "Masa Kartları", descAr: "بطاقات طاولة للخدمات والعروض الترويجية في مطعمكم", descEn: "Table cards for services and promotional offers in your restaurant", descTr: "Restoranınızdaki hizmetler ve promosyonlar için masa kartları" },
    ],
  },
  {
    id: "promo",
    icon: "gift",
    nameAr: "هدايا ترويجية",
    nameEn: "Promotional Gifts",
    nameTr: "Promosyon Hediyeleri",
    color: "#5C3D82",
    products: [
      { id: "pg1", categoryId: "promo", nameAr: "أكواب بورسلين", nameEn: "Porcelain Mugs", nameTr: "Porselen Kupa", descAr: "أكواب بورسلين مطبوعة بشعار شركتك - هدية ترويجية مميزة ومفيدة", descEn: "Porcelain mugs printed with your company logo - distinctive and useful promotional gift", descTr: "Şirket logonuzla baskılı porselen kupalar - ayırt edici ve kullanışlı promosyon hediyesi" },
      { id: "pg2", categoryId: "promo", nameAr: "أطقم مكتبية", nameEn: "Desk Sets", nameTr: "Masaüstü Setler", descAr: "أطقم مكتبية مخصصة بشعار الشركة - هدية راقية لعملائكم المميزين", descEn: "Custom desk sets with company branding - premium gift for your distinguished clients", descTr: "Şirket markalı özel masaüstü setler - seçkin müşterileriniz için premium hediye" },
      { id: "pg3", categoryId: "promo", nameAr: "لافتات اسم", nameEn: "Name Badges", nameTr: "İsimlikler", descAr: "لافتات اسم احترافية للموظفين والمعارض والفعاليات", descEn: "Professional name badges for staff, exhibitions and events", descTr: "Personel, sergiler ve etkinlikler için profesyonel isimlikler" },
      { id: "pg4", categoryId: "promo", nameAr: "أقلام مطبوعة", nameEn: "Branded Pens", nameTr: "Markalı Kalemler", descAr: "أقلام مع شعار شركتكم - إعلان متنقل بتكلفة منخفضة", descEn: "Pens with your company logo - mobile advertising at low cost", descTr: "Şirket logonuzla kalemler - düşük maliyetli mobil reklam" },
      { id: "pg5", categoryId: "promo", nameAr: "دفاتر ملاحظات", nameEn: "Branded Notebooks", nameTr: "Markalı Defterler", descAr: "دفاتر ملاحظات مخصصة بشعار شركتكم وألوانها", descEn: "Custom notebooks with your company logo and colors", descTr: "Şirket logonuz ve renkleriyle özel defterler" },
      { id: "pg6", categoryId: "promo", nameAr: "ساعة طاولة مطبوعة", nameEn: "Printed Desk Clock", nameTr: "Baskılı Masa Saati", descAr: "ساعات طاولة فاخرة مطبوعة بشعار الشركة - هدية دائمة الحضور", descEn: "Luxury desk clocks printed with company logo - a permanent presence gift", descTr: "Şirket logosuyla baskılı lüks masa saatleri - kalıcı bir hediye" },
    ],
  },
  {
    id: "flags",
    icon: "flag",
    nameAr: "طباعة الأعلام",
    nameEn: "Flag Printing",
    nameTr: "Bayrak Baskı",
    color: "#1B7A5A",
    image: "cat_flags",
    products: [
      { id: "f1", categoryId: "flags", nameAr: "أعلام مكتبية صغيرة", nameEn: "Small Desk Flags", nameTr: "Küçük Masa Bayrakları", descAr: "أعلام مكتبية صغيرة مثالية للمكاتب والاجتماعات الرسمية", descEn: "Small desk flags ideal for offices and official meetings", descTr: "Ofisler ve resmi toplantılar için ideal küçük masa bayrakları" },
      { id: "f2", categoryId: "flags", nameAr: "أعلام جدارية", nameEn: "Wall Flags", nameTr: "Duvar Bayrakları", descAr: "أعلام للتعليق على الجدران في المكاتب والشركات والمنظمات", descEn: "Flags for hanging on walls in offices, companies and organizations", descTr: "Ofisler, şirketler ve kuruluşlarda duvarlara asılmak üzere bayraklar" },
      { id: "f3", categoryId: "flags", nameAr: "أعلام كبيرة للأعمدة", nameEn: "Large Pole Flags", nameTr: "Büyük Boy Bayraklar", descAr: "أعلام كبيرة للأعمدة الخارجية وواجهات الشركات", descEn: "Large flags for outdoor poles and company facades", descTr: "Açık hava direkleri ve şirket cepheleri için büyük bayraklar" },
      { id: "f4", categoryId: "flags", nameAr: "أعلام مقامية", nameEn: "Official Venue Flags", nameTr: "Makam Bayrakları", descAr: "أعلام رسمية للمقامات والمؤسسات الحكومية", descEn: "Official flags for venues and government institutions", descTr: "Mekanlar ve devlet kurumları için resmi bayraklar" },
    ],
  },
  {
    id: "fabric",
    icon: "scissors",
    nameAr: "طباعة القماش والملابس",
    nameEn: "Fabric & Apparel Printing",
    nameTr: "Kumaş ve Kıyafet Baskı",
    color: "#8B4513",
    image: "cat_fabric",
    products: [
      { id: "fab1", categoryId: "fabric", nameAr: "تي شيرت مطبوع", nameEn: "Printed T-Shirt", nameTr: "Baskılı Tişört", descAr: "تي شيرت عالية الجودة مطبوع بشعار شركتكم أو تصميمكم المخصص", descEn: "High-quality t-shirts printed with your company logo or custom design", descTr: "Şirket logonuz veya özel tasarımınızla baskılı yüksek kaliteli tişörtler" },
      { id: "fab2", categoryId: "fabric", nameAr: "قبعات مطبوعة", nameEn: "Printed Caps", nameTr: "Baskılı Şapkalar", descAr: "قبعات بيسبول مطبوعة أو مطرزة بشعار الشركة", descEn: "Baseball caps printed or embroidered with company logo", descTr: "Şirket logosuyla baskılı veya işlemeli beyzbol şapkaları" },
      { id: "fab3", categoryId: "fabric", nameAr: "حقائب قماشية", nameEn: "Canvas Bags", nameTr: "Bez Çantalar", descAr: "حقائب قماشية صديقة للبيئة مطبوعة بعلامتكم التجارية", descEn: "Eco-friendly canvas bags printed with your brand", descTr: "Markanızla baskılı çevre dostu bez çantalar" },
      { id: "fab4", categoryId: "fabric", nameAr: "سترة العمل المطبوعة", nameEn: "Printed Work Vest", nameTr: "Baskılı İş Yeleği", descAr: "سترات عمل للموظفين مطبوعة بشعار الشركة للمظهر الموحد", descEn: "Work vests for employees printed with company logo for unified appearance", descTr: "Birleşik görünüm için şirket logosuyla baskılı çalışan yelek" },
    ],
  },
  {
    id: "corporate",
    icon: "briefcase",
    nameAr: "منتجات مؤسسية",
    nameEn: "Corporate Products",
    nameTr: "Kurumsal Ürünler",
    color: "#2C4770",
    image: "cat_corporate",
    products: [
      { id: "co1", categoryId: "corporate", nameAr: "دفاتر الفواتير والإيصالات", nameEn: "Invoice & Receipt Books", nameTr: "Fatura ve Fiş Defterleri", descAr: "دفاتر فواتير وإيصالات مصممة بشعار وبيانات شركتكم", descEn: "Invoice and receipt books designed with your company logo and details", descTr: "Şirket logonuz ve detaylarınızla tasarlanmış fatura ve fiş defterleri" },
      { id: "co2", categoryId: "corporate", nameAr: "ورق ذو رأسية", nameEn: "Letterhead Paper", nameTr: "Antetli Kağıt", descAr: "ورق رسمي بترويسة شركتكم للمراسلات الرسمية والعقود", descEn: "Official paper with your company letterhead for formal correspondence and contracts", descTr: "Resmi yazışmalar ve sözleşmeler için şirket başlığınızla resmi kağıt" },
      { id: "co3", categoryId: "corporate", nameAr: "أختام مطاطية", nameEn: "Rubber Stamps", nameTr: "Kauçuk Mühürler", descAr: "أختام مطاطية عالية الجودة بتصميم احترافي", descEn: "High-quality rubber stamps with professional design", descTr: "Profesyonel tasarımlı yüksek kaliteli kauçuk mühürler" },
      { id: "co4", categoryId: "corporate", nameAr: "مظاريف مطبوعة", nameEn: "Printed Envelopes", nameTr: "Baskılı Zarflar", descAr: "مظاريف مطبوعة بشعار وعنوان شركتكم بأحجام مختلفة", descEn: "Envelopes printed with your company logo and address in various sizes", descTr: "Çeşitli boyutlarda şirket logonuz ve adresinizle baskılı zarflar" },
      { id: "co5", categoryId: "corporate", nameAr: "هوية بصرية كاملة", nameEn: "Complete Brand Identity", nameTr: "Eksiksiz Kurumsal Kimlik", descAr: "باقة متكاملة: كرت شخصي + ورق رأسية + مظروف + ختم + بروشور", descEn: "Complete package: business card + letterhead + envelope + stamp + brochure", descTr: "Eksiksiz paket: kartvizit + antetli kağıt + zarf + mühür + broşür" },
    ],
  },
  {
    id: "exhibition",
    icon: "box",
    nameAr: "منتجات المعارض",
    nameEn: "Exhibition Products",
    nameTr: "Fuar Ürünleri",
    color: "#B5451B",
    image: "cat_exhibition",
    products: [
      { id: "ex1", categoryId: "exhibition", nameAr: "حقيبة كرتونية 17×24×7 سم", nameEn: "Cardboard Bag 17×24×7 cm", nameTr: "Karton Çanta 17x24x7 cm", descAr: "حقائب كرتونية متينة للمعارض والفعاليات التجارية بحجم 17×24×7 سم مطبوعة بشعاركم", descEn: "Sturdy cardboard bags for exhibitions and trade events 17×24×7 cm printed with your logo", descTr: "Sergi ve ticari etkinlikler için logonuzla baskılı sağlam karton çanta 17x24x7 cm" },
      { id: "ex2", categoryId: "exhibition", nameAr: "حقيبة كرتونية 38×23×9 سم", nameEn: "Cardboard Bag 38×23×9 cm", nameTr: "Karton Çanta 38x23x9 cm", descAr: "حقائب كرتونية للمعارض بحجم 38×23×9 سم مثالية للهدايا الترويجية والمواد التسويقية", descEn: "Exhibition cardboard bags 38×23×9 cm ideal for promotional gifts and marketing materials", descTr: "Promosyon hediyeleri ve pazarlama materyalleri için ideal 38x23x9 cm fuar karton çantası" },
      { id: "ex3", categoryId: "exhibition", nameAr: "حقيبة كرتونية 25×37×8 سم", nameEn: "Cardboard Bag 25×37×8 cm", nameTr: "Karton Çanta 25x37x8 cm", descAr: "حقائب كرتونية متوسطة الحجم 25×37×8 سم للمعارض وتوزيع المواد على الزوار", descEn: "Medium-sized cardboard bags 25×37×8 cm for exhibitions and distributing materials to visitors", descTr: "Ziyaretçilere materyal dağıtmak için orta boy 25x37x8 cm fuar karton çantası" },
      { id: "ex4", categoryId: "exhibition", nameAr: "دفتر ملاحظات بدون غلاف 9.5×13.5 سم", nameEn: "Notebook without Cover 9.5×13.5 cm", nameTr: "Kapaklı Defter 9.5×13.5 cm", descAr: "دفاتر ملاحظات صغيرة 9.5×13.5 سم بدون غلاف مثالية للتوزيع في المعارض", descEn: "Small notebooks 9.5×13.5 cm without cover ideal for distribution at exhibitions", descTr: "Fuarlarda dağıtım için ideal kapaksız küçük defter 9.5x13.5 cm" },
      { id: "ex5", categoryId: "exhibition", nameAr: "حقيبة ورقية مطبوعة للمعارض", nameEn: "Printed Paper Bag for Exhibitions", nameTr: "Fuar için Baskılı Kağıt Çanta", descAr: "حقائب ورقية مخصصة للمعارض التجارية مطبوعة بتصميم شركتكم بجودة عالية", descEn: "Custom paper bags for trade fairs printed with your company design in high quality", descTr: "Yüksek kalitede şirket tasarımınızla baskılı ticari fuarlar için özel kağıt çanta" },
      { id: "ex6", categoryId: "exhibition", nameAr: "باقة المعرض الكاملة", nameEn: "Complete Exhibition Package", nameTr: "Eksiksiz Fuar Paketi", descAr: "باقة متكاملة للمعارض: بنر + حقائب + بروشورات + بطاقات أعمال + هدايا ترويجية", descEn: "Complete exhibition package: banner + bags + brochures + business cards + promotional gifts", descTr: "Eksiksiz fuar paketi: afiş + çantalar + broşürler + kartvizitler + promosyon hediyeleri" },
    ],
  },
  {
    id: "banners",
    icon: "monitor",
    nameAr: "لافتات وبنرات",
    nameEn: "Banners & Signage",
    nameTr: "Afiş ve Tabelalar",
    color: "#1B7A5A",
    image: "cat_banners",
    products: [
      { id: "bn1", categoryId: "banners", nameAr: "بنر خارجي", nameEn: "Outdoor Banner", nameTr: "Dış Mekan Afişi", descAr: "بنرات خارجية مقاومة للعوامل الجوية بأحجام قياسية ومخصصة", descEn: "Weather-resistant outdoor banners in standard and custom sizes", descTr: "Standart ve özel boyutlarda hava koşullarına dayanıklı dış mekan afişleri" },
      { id: "bn2", categoryId: "banners", nameAr: "X-Stand بنر", nameEn: "X-Stand Banner", nameTr: "X-Stand Afiş", descAr: "بنر X-Stand سهل الحمل والتركيب للمعارض والفعاليات", descEn: "Easy to carry and install X-Stand banner for exhibitions and events", descTr: "Sergi ve etkinlikler için taşınması ve kurulması kolay X-Stand afiş" },
      { id: "bn3", categoryId: "banners", nameAr: "لوحة Roll-up", nameEn: "Roll-up Display", nameTr: "Roll-up Tabela", descAr: "لوحة Roll-up احترافية قابلة للطي للعروض والمعارض التجارية", descEn: "Professional foldable Roll-up display for exhibitions and trade shows", descTr: "Sergiler ve ticari fuarlar için profesyonel katlanabilir Roll-up tabela" },
      { id: "bn4", categoryId: "banners", nameAr: "لافتة داخلية", nameEn: "Indoor Signage", nameTr: "İç Mekan Tabelası", descAr: "لافتات داخلية احترافية للمحلات والمكاتب والمراكز التجارية", descEn: "Professional indoor signs for shops, offices and shopping centers", descTr: "Dükkanlar, ofisler ve alışveriş merkezleri için profesyonel iç mekan tabelaları" },
      { id: "bn5", categoryId: "banners", nameAr: "خلفية تصوير", nameEn: "Photography Backdrop", nameTr: "Fotoğraf Arka Planı", descAr: "خلفيات تصوير عالية الجودة للاستوديوهات والفعاليات والمؤتمرات", descEn: "High-quality photography backdrops for studios, events and conferences", descTr: "Stüdyolar, etkinlikler ve konferanslar için yüksek kaliteli fotoğraf arka planları" },
    ],
  },
];

export const getCategoryName = (category: Category, lang: Language): string => {
  if (lang === "ar") return category.nameAr;
  if (lang === "tr") return category.nameTr;
  return category.nameEn;
};

export const getProductName = (product: Product, lang: Language): string => {
  if (lang === "ar") return product.nameAr;
  if (lang === "tr") return product.nameTr;
  return product.nameEn;
};

export const getProductDesc = (product: Product, lang: Language): string => {
  if (lang === "ar") return product.descAr;
  if (lang === "tr") return product.descTr;
  return product.descEn;
};

export const CONTACT_INFO = {
  phone: "+905550005905",
  whatsapp: "+905550005905",
  email: "info@skylinegroup-sy.com",
  website: "https://skylinegroup-sy.com",
  instagram: "skylinegroup_sy",
  facebook: "skylinegroupsy",
  address: "Değirmiçem, 36014. Sk., 27090 Şehitkamil/Gaziantep",
};

export const APP_VERSION = "1.0.0";
export const APP_BUILD = "1";
