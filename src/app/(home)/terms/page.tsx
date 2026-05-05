import { Footer } from "@/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "使用条款",
  description: "Formulaic 使用条款",
};

export default function TermsPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="py-12 sm:py-16 lg:py-24 px-4 mb-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-fd-foreground mb-8">
            使用条款
          </h1>

          <div className="prose prose-neutral dark:prose-invert max-w-none text-fd-foreground">
            <p className="text-lg text-fd-muted-foreground mb-6">
              最后更新日期：{new Date().toLocaleDateString("zh-CN")}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. 接受条款</h2>
              <p className="mb-4">
                欢迎使用
                Formulaic。通过访问和使用本网站，您同意遵守以下使用条款。如果您不同意这些条款，请不要使用本网站。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. 网站用途</h2>
              <p className="mb-4">
                Formulaic 是一个开源的知识分享平台，旨在提供：
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>算法与数据结构学习资源</li>
                <li>编程技术文档和教程</li>
                <li>计算机科学相关知识</li>
                <li>技术博客和经验分享</li>
              </ul>
              <p className="mb-4">本网站内容仅供学习和参考使用。</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. 知识产权</h2>
              <p className="mb-4">
                本网站的内容（包括但不限于文本、图片、代码、设计）受知识产权法保护。除非另有说明：
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>网站源代码采用开源许可证（请查看 GitHub 仓库）</li>
                <li>文档内容采用 Creative Commons 许可证或其他指定许可证</li>
                <li>第三方内容归其各自所有者所有</li>
              </ul>
              <p className="mb-4">
                您可以在遵守相应许可证的前提下使用、修改和分发内容。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. 用户行为</h2>
              <p className="mb-4">使用本网站时，您同意：</p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  不发布违法、有害、威胁、辱骂、骚扰、诽谤、粗俗、淫秽或其他不当内容
                </li>
                <li>不侵犯他人的知识产权或其他权利</li>
                <li>不进行任何可能损害网站或干扰他人使用的行为</li>
                <li>不使用自动化工具过度访问或抓取网站内容</li>
                <li>遵守所有适用的法律法规</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. 评论和用户内容</h2>
              <p className="mb-4">如果您在本网站发表评论或其他内容：</p>
              <ul className="list-disc pl-6 mb-4">
                <li>您保留对自己内容的所有权</li>
                <li>您授予我们使用、展示和分发该内容的非独占许可</li>
                <li>您声明您有权发布该内容</li>
                <li>我们保留删除不当内容的权利</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. 免责声明</h2>
              <p className="mb-4">
                本网站按"现状"提供，不提供任何明示或暗示的保证，包括但不限于：
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>内容的准确性、完整性或时效性</li>
                <li>网站的可用性或无错误运行</li>
                <li>特定用途的适用性</li>
              </ul>
              <p className="mb-4">
                我们不对因使用或无法使用本网站而造成的任何损失承担责任。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. 外部链接</h2>
              <p className="mb-4">
                本网站可能包含指向第三方网站的链接。这些链接仅为方便用户而提供，我们不对这些外部网站的内容或隐私政策负责。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. 服务变更和终止</h2>
              <p className="mb-4">
                我们保留随时修改、暂停或终止网站服务的权利，无需事先通知。我们不对服务的修改、暂停或终止承担责任。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. 条款修改</h2>
              <p className="mb-4">
                我们可能会不时更新这些使用条款。更新后的条款将在本页面发布，并更新"最后更新日期"。继续使用本网站即表示您接受修改后的条款。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. 适用法律</h2>
              <p className="mb-4">
                这些使用条款受中华人民共和国法律管辖。因使用本网站引起的任何争议应通过友好协商解决。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. 联系我们</h2>
              <p className="mb-4">
                如果您对这些使用条款有任何疑问，请通过以下方式联系我们：
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

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. 开源声明</h2>
              <p className="mb-4">
                本网站是一个开源项目，源代码托管在 GitHub
                上。我们欢迎社区贡献和反馈。
              </p>
              <p className="mb-4">
                GitHub 仓库：
                <a
                  href="https://github.com/Robert-Stackflow/Formulaic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fd-primary hover:underline"
                >
                  Robert-Stackflow/Formulaic
                </a>
              </p>
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
