import Link from "next/link";
import LocalSettings from "@/components/local-settings";

const plannedSections = [
  { title: "القرآن الكريم", description: "قراءة وحفظ موضع القراءة — بعد اعتماد مصدر النص." },
  { title: "مواقيت الصلاة", description: "تُحدد بعد اختيار طريقة الحساب وإعدادات الموقع." },
  { title: "الأذكار والأدعية", description: "محتوى موثق بمراجعه ومصادره." },
  { title: "أدوات يومية", description: "المسبحة والورد وخطة الختمة." },
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="لكل مؤمن - الصفحة الرئيسية">
          <span className="brand-mark" aria-hidden="true">ك</span>
          <span>لكل مؤمن</span>
        </Link>
        <div className="topbar-actions">
          <LocalSettings />
          <span className="status-label">نسخة تأسيسية</span>
        </div>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <p className="eyebrow">رفيقك اليومي للعبادة والمعرفة</p>
        <h1 id="hero-title">قريب من القرآن،<br />وكل ما يعينك على الخير.</h1>
        <p className="hero-copy">
          مساحة إسلامية عربية تُبنى على مصادر واضحة، وخصوصية محترمة،
          وإمكانية الوصول إلى المحتوى المحفوظ دون اتصال.
        </p>
        <p className="notice">
          المشروع في مرحلة التأسيس. الأقسام أدناه خريطة عمل وليست ميزات مكتملة.
        </p>
      </section>

      <section className="section" aria-labelledby="sections-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">خريطة التطبيق</p>
            <h2 id="sections-title">أقسام نعمل على تأسيسها</h2>
          </div>
          <span className="section-count">٠٤ أقسام أولية</span>
        </div>
        <div className="section-grid">
          {plannedSections.map((section, index) => (
            <article className="section-card" key={section.title}>
              <span className="card-number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{section.title}</h3>
              <p>{section.description}</p>
              <span className="card-status">قيد التخطيط</span>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <span>لكل مؤمن</span>
        <span>الموثوقية أولاً، ثم الميزات.</span>
      </footer>
    </main>
  );
}
