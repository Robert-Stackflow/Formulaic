import { Footer } from "@/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "隐私政策",
  description: "Formulaic 隐私政策",
};

export default function PrivacyPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="py-12 sm:py-16 lg:py-24 px-4 mb-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-fd-foreground mb-8">
            隐私政策
          </h1>

          <div className="prose prose-neutral dark:prose-invert max-w-none text-fd-foreground">
            <p className="text-lg text-fd-muted-foreground mb-6">
              最后更新日期：{new Date().toLocaleDateString("zh-CN")}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. 信息收集</h2>
              <p className="mb-4">
                我们重视您的隐私。本网站是一个开源的知识分享平台，我们收集的信息包括：
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>访问日志：包括 IP 地址、浏览器类型、访问时间等基本信息</li>
                <li>
                  评论信息：如果您选择在文章下方评论，我们会通过 Giscus 收集您的
                  GitHub 账户信息
                </li>
                <li>分析数据：我们使用分析工具来了解网站的使用情况</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. 信息使用</h2>
              <p className="mb-4">我们收集的信息仅用于：</p>
              <ul className="list-disc pl-6 mb-4">
                <li>改善网站内容和用户体验</li>
                <li>分析网站流量和使用模式</li>
                <li>维护网站安全和防止滥用</li>
                <li>回应用户的评论和反馈</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Cookie 使用</h2>
              <p className="mb-4">
                本网站使用 Cookie 来提供更好的用户体验。Cookie 用于：
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>记住您的主题偏好（深色/浅色模式）</li>
                <li>分析网站流量</li>
                <li>提供个性化内容</li>
              </ul>
              <p className="mb-4">
                您可以通过浏览器设置管理或禁用
                Cookie，但这可能会影响网站的某些功能。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. 第三方服务</h2>
              <p className="mb-4">本网站使用以下第三方服务：</p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>Giscus</strong>：用于评论系统，基于 GitHub Discussions
                </li>
                <li>
                  <strong>Vercel Analytics</strong>：用于网站分析
                </li>
                <li>
                  <strong>Algolia</strong>：用于站内搜索功能
                </li>
              </ul>
              <p className="mb-4">
                这些服务有各自的隐私政策，我们建议您查阅它们的隐私政策以了解更多信息。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. 数据安全</h2>
              <p className="mb-4">
                我们采取合理的技术和组织措施来保护您的个人信息安全。但请注意，互联网传输不是完全安全的，我们无法保证数据传输的绝对安全。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. 您的权利</h2>
              <p className="mb-4">您有权：</p>
              <ul className="list-disc pl-6 mb-4">
                <li>访问我们持有的关于您的个人信息</li>
                <li>要求更正不准确的信息</li>
                <li>要求删除您的个人信息</li>
                <li>反对或限制我们处理您的信息</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. 儿童隐私</h2>
              <p className="mb-4">
                本网站不针对 13 岁以下的儿童。我们不会故意收集 13
                岁以下儿童的个人信息。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. 隐私政策更新</h2>
              <p className="mb-4">
                我们可能会不时更新本隐私政策。更新后的政策将在本页面发布，并更新"最后更新日期"。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. 联系我们</h2>
              <p className="mb-4">
                如果您对本隐私政策有任何疑问或建议，请通过以下方式联系我们：
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  GitHub Issues：
                  <a
                    href="https://github.com/Robert-Stackflow/Formulaic/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fd-primary hover:underline"
                  >
                    提交问题
                  </a>
                </li>
                <li>电子邮件：通过 GitHub 个人资料联系</li>
              </ul>
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
