import { useState } from "react";
import { CalendarClock, Eye, FileText, Mail, MessageSquare, Phone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/components/Tabs";

export function TabsSection() {
  const [mainTab, setMainTab] = useState("activity");
  const [filterTab, setFilterTab] = useState("all");

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-foreground mb-1">التبويبات</h1>
        <p className="text-muted-foreground">
          تنفيذ مطابق لتصميم Figma: تبويبات تنقل علوية + تبويبات فلترة بشكل Pills، مع دعم الشارات
          والرموز وRTL.
        </p>
      </div>

      <section className="bg-card rounded-2xl border border-border p-6">
        <Tabs value={mainTab} onValueChange={setMainTab} defaultValue="activity" dir="rtl">
          <TabsList variant="top-navigation">
            <TabsTrigger value="activity">النشاط</TabsTrigger>
            <TabsTrigger value="clients">العملاء</TabsTrigger>
            <TabsTrigger value="appointments">المواعيد</TabsTrigger>
            <TabsTrigger value="tasks" badge={4}>
              المهام
            </TabsTrigger>
            <TabsTrigger value="files" badge={5}>
              الملفات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-4">
            <Tabs value={filterTab} onValueChange={setFilterTab} defaultValue="all" dir="rtl">
              <TabsList variant="pill-group">
                <TabsTrigger variant="pill" value="all">
                  الكل
                </TabsTrigger>
                <TabsTrigger variant="pill" value="notes" badge={4} startIcon={<FileText size={14} />}>
                  الملاحظات
                </TabsTrigger>
                <TabsTrigger variant="pill" value="calls" badge={4} startIcon={<Phone size={14} />}>
                  المكالمات
                </TabsTrigger>
                <TabsTrigger variant="pill" value="emails" badge={4} startIcon={<Mail size={14} />}>
                  الرسائل
                </TabsTrigger>
                <TabsTrigger variant="pill" value="tasks-filter" badge={4} startIcon={<CalendarClock size={14} />}>
                  المهام
                </TabsTrigger>
                <TabsTrigger variant="pill" value="views" badge={4} startIcon={<Eye size={14} />}>
                  المشاهدات
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="pt-4">
                <ActivityCard
                  title="Responded 2 discussion in 1 Property"
                  time="24 August, 19:31"
                  link="Aspr.com/bit.98fj8..."
                  body="In order for a person to sell property, building conditions must be met..."
                />
              </TabsContent>
              <TabsContent value="notes" className="pt-4">
                <ActivityCard
                  title="ملاحظة جديدة على العميل"
                  time="24 August, 19:31"
                  link="crm.local/notes/128"
                  body="تم تحديث حالة الفرصة وإضافة تعليق متابعة للفريق."
                />
              </TabsContent>
              <TabsContent value="calls" className="pt-4">
                <ActivityCard
                  title="مكالمة متابعة مع العميل"
                  time="24 August, 19:31"
                  link="crm.local/calls/551"
                  body="تم الاتفاق على موعد عرض جديد ومشاركة المستندات المطلوبة."
                />
              </TabsContent>
              <TabsContent value="emails" className="pt-4">
                <ActivityCard
                  title="رسالة بريد واردة"
                  time="24 August, 19:31"
                  link="mail.local/thread/772"
                  body="رد العميل على العرض وطلب تفاصيل إضافية قبل الإغلاق."
                />
              </TabsContent>
              <TabsContent value="tasks-filter" className="pt-4">
                <ActivityCard
                  title="مهمة جديدة للفريق"
                  time="24 August, 19:31"
                  link="pm.local/task/221"
                  body="تعيين مهمة تجهيز العرض النهائي وتحديث نسبة الإنجاز."
                />
              </TabsContent>
              <TabsContent value="views" className="pt-4">
                <ActivityCard
                  title="مشاهدة ملف العميل"
                  time="24 August, 19:31"
                  link="crm.local/client/992"
                  body="تمت مراجعة بيانات العميل والأنشطة الأخيرة."
                />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="clients">
            <MutedPanel text="محتوى العملاء" />
          </TabsContent>
          <TabsContent value="appointments">
            <MutedPanel text="محتوى المواعيد" />
          </TabsContent>
          <TabsContent value="tasks">
            <MutedPanel text="محتوى المهام" />
          </TabsContent>
          <TabsContent value="files">
            <MutedPanel text="محتوى الملفات" />
          </TabsContent>
        </Tabs>
      </section>


    </div>
  );
}

function ActivityCard({
  title,
  time,
  link,
  body,
}: {
  title: string;
  time: string;
  link: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-2">
      <p className="text-foreground text-lg" style={{ fontWeight: 600 }}>
        {title} <span className="text-muted-foreground text-sm">· {time}</span>
      </p>
      <p className="text-primary text-sm" style={{ fontWeight: 500 }}>
        {link}
      </p>
      <p className="text-muted-foreground">{body}</p>
    </div>
  );
}

function MutedPanel({ text }: { text: string }) {
  return (
    <div className="pt-4">
      <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground flex items-center gap-2">
        <MessageSquare size={14} className="shrink-0" />
        <span>{text}</span>
      </div>
    </div>
  );
}
