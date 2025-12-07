---
title: 机器学习
description: 介绍机器学习的基本概念、朴素贝叶斯理论、信息熵、隐马尔可夫模型及Word2Vec等内容
---

### 一、概率分布

- 联合概率分布

  - 简单定义：两个事件共同发生的概率，即 $P(AB)$ 或 $P(A,B)$ 或 $P(A\cap B)$

  - 严格定义：对于多维随机变量 $X_1,\cdots,X_n$，可以用联合概率分布 $P(X_1,\cdots,X_n)$ 描述其各个状态的概率，即联合 a 概率分布，是一个定义在所有变量状态空间的笛卡尔乘积上的函数：

    $$
    P(X_1,\cdots,X_n):\oplus_{i=1}^n\Omega_{x_i}\rightarrow[0,1]
    $$

    - 且所有函数值之和为 1，即 $\sum_{X_1,\cdots,X_n}P(X_1,\cdots,X_n)=1$

- 边缘概率分布

  - 仅与单个随机变量有关的概率称为边缘概率
  - 边缘化（Marginalization）：在联合概率中，在最终结果中将不需要的事件合并成该事件的全概率
  - $P(X=a)=\sum_bP(X=a,Y=b)$

- 条件概率分布

  - 在条件 $Y=b$ 成立的情况下，$X=a$ 发生的概率，记作 $P(X=a|Y=b)$ 或 $P(a|b)$
  - $\sum_aP(X=a|Y=b)=1$
  - $P(X=a|Y=b)=\frac{P(X=a,Y=b)}{P(Y=b)}$

- $Pr(X=x)=\sum_yPr(X=x,Y=y)=\sum_yPr(X=x|Y=y)Pr(Y=y)$

  - 统计独立性：当且仅当 $P(A\cap B)=P(A)P(B)$ 时，$P(A|B)=P(A)$ 且 $P(B|A)=P(B)$
  - 条件独立性：若 $P(A|B\cap C)=P(A|C)$ 或者 $P(B\cap C)=0$？？？

- 贝叶斯公式

  - $P(A|B)=\frac{P(A,B)}{P(B)}=\frac{P(B|A)P(A)}{P(B)}$
    - $P(Y)$ 称为先验概率，$P(Y|X)$ 称为后验（条件）概率，$P(X,Y)$ 称为联合概率
  - $P(A_i|B)=\frac{P(B|A_i)P(A_i)}{\sum_jP(B|A_j)P(A_j)}$，其中 $A_1,\cdots,A_n$ 为 $A$ 的完备事件组
  - $P(A|B,C)=\frac{P(A)P(B|A)P(C|A,B)}{P(B)P(C|B)}$

- 极大后验假设

  - $h_{MAP}=\arg\max_{h\in H}P(h|D)=\arg\max_{h\in H}\frac{P(D|h)P(h)}{P(D)}=\arg\max_{h\in H}P(D|h)P(h)$
    - 在候选假设集合 $H$ 中，找到给定数据 $D$ 时可能性最大的假设 $h$，$h$ 即称为极大后验假设（MAP）
    - $P(D)$ 是不依赖于 $h$ 的常量
  - 假设 $H$ 中每个假设有相同的先验概率，则简化为只考虑 $P(D|h)$，称为给定 $h$ 时数据 $D$ 的似然度，而称 $h_{ML}=\arg\max_{h\in H}P(D|h)$ 为极大似然假设

### 二、朴素贝叶斯理论

- 以文本分类任务为例

  - 形式化定义：给定文档空间 $X$，类别集合 $C=\{c_1,\cdots,c_j\}$，则训练集 $D={<d,c>\in X\times C}$，需要学习一个算法，得到分类器 $\gamma:X\rightarrow C$，确定文档 $d$ 最可能属于的类别

  - 文本的表示

    - One-Hot 表示
      - 相互独立地表示语料中的每个词，将每个词表示为一个稀疏向量，其维度是词典大小
      - 不考虑单词之间的关联，不能表示词语的重要性，语义信息被全部丢失
    - TF - IDF（Term Frequency-Inverse Document Frequency，词频 - 逆文档频率）
      - 衡量一个词语在文档中的重要性，来评估该词对于整个文档集合的区分能力
      - 词频（TF，Term Frequency）
        - 一个词语在文档中出现的频率，即 $TF(t,d)=\frac{f_t}{N}$
        - 表示词语在单个文档中的相对重要性，未考虑在整个文档集合中的普遍性
      - 逆文档频率（IDF，Inverse Document Frequency）
        - 一个词语在整个文档集合中的重要性，即 $IDF(t,D)=\log\frac{|D|}{1+|d\in D:t\in d|}$，其中 $|d\in D:t\in d|$ 表示包含词语 $t$ 的文档数
        - 若一个词在多个文档中都频繁出现，其区分能力较低，其 IDF 值也较低
      - $TF-IDF(t,d,D)=TF(t,d)\cdot IDF(t,D)$
      - 忽略了词语的语义信息，不能捕捉上下文关系

  - 朴素贝叶斯分类器

    - 文档 $d$ 的类别是 $c$ 的概率公式是一个多项式模型

      $$
      P(c\mid d)=P(d\mid c)P(c)/P(d)\propto P(d\mid c)P(c)=P(c)\prod_{1\leq k\leq n_{d}}P(t_{k}\mid c)
      $$

    - 查询似然模型（Query Likelihood Model，QLM）

      - $RSV(Q,D)=P(Q|D)=P(Q|M_D)=P(q_1q_2\cdots q_m|M_D)=P(q_1|M_D)\cdots P(q_m|M_D)=\Pi_{w\in Q}P(w|M_D)^{c(w,Q)}$
      - 即需要估计文档 $D$ 的一元模型 $M_D$，即求 $P(w|M_D)$
      - 平滑技术
        - Jelinek-Mercer 平滑：$p(w|D)=\lambda P_{ML}(w|D)+(1-\lambda)P(w|C)$
        - $p(w|D)=\frac{c(w,D)+\mu P(w|C)}{|D|+\mu}$
        - $p(w|D)=\frac{max(c(w,D)-\delta,0)}{|D|}+\frac{\delta|D|_{\mu}}{|D|}p(w|C)$​
      - 无法解决词语失配问题，如查询中用词和文档中用词不一致

    - 基于翻译的语言模型

      - $P(Q|D)=\Pi_i P(q_i|D)=\Pi_i\sum_jP(q_i|w_j)P(w_j|M_D)$
      - 其中，$P(q_i|w_j)$ 为翻译概率，可以通过同近义词构造

    - 基于 KL 距离（相对熵）模型

      - $D_{KL}(P\|Q)=\sum_{x\in\mathcal{X}}P(x)\log\frac{P(x)}{Q(x)}$
      - $Score(Q,D)=\log\frac{P(Q|M_D)}{P(Q|M_C)}$，其中 $P(Q|M_D)$ 表示文档 $D$ 的查询似然模型
      - $Score(Q,D)=\sum_{q_i\in Q}tf(q_i,Q)*\frac{P(q_i|M_D)}{P(q_i|M_C)}\propto\sum_{q_i\in Q}P(q_i|M_Q)*\frac{P(q_i|M_D)}{P(q_i|M_C)}=\sum_{q_i\in Q}P(q_i|M_Q)*\frac{P(q_i|M_D)}{P(q_i|M_Q)}-\sum_{q_i\in Q}P(q_i|M_Q)*\frac{P(q_i|M_C)}{P(q_i|M_Q)}=-KL(M_Q,M_D)+KL(M_Q,M_C)$
      - $-KL(M_Q,M_D)=\sum_{q_i\in Q}P(q_i|M_Q)*\log P(q_i|M_D)-\sum_{q_i\in Q}P(q_i|M_Q)*\log P(q_i|M_Q)$
      - $Score(Q,D)\propto\sum_{q_i\in Q}P(q_i|M_Q)*\log P(q_i|M_D)$

    - 朴素贝叶斯分类的目标：找到具有最大后验概率的类别 $c_{\mathrm{map}}=\underset{c\in\mathbb{C}}{\operatorname*{\operatorname*{\operatorname*{\arg\max}}}}\hat{P}(c\mid d)=\underset{c\in\mathbb{C}}{\operatorname*{\operatorname*{\arg\max}}}\hat{P}(c)\prod_{1\leq k\leq n_d}\hat{P}(t_k\mid c)$​

      - 利用对数将小概率乘积转变为求和计算：$c_\mathrm{map}=\arg\max_{c\in\mathbb{C}}\left[\log\hat{P}(c)+\sum_{1\leq k\leq n_d}\log\hat{P}(t_k\mid c)\right]$

    - 利用极大似然估计法从训练数据中估计 $\hat{P}(c)$ 和 $\hat{P}(t_k\mid c)$

      - 先验概率：$\hat{P}(c)=\frac{N_c}{N}$
      - 条件概率 $\hat{P}(t_k\mid c)=\frac{T_{ct}}{\sum_{t^{'}\in V}T_{ct^{'}}}$
        - 其中 $T_{ct}$ 是训练集中类别 $c$ 中的词条 $t$​ 的个数，计入重数
        - 给定位置独立性假设 $\hat{P}(t_{k_1}\mid c)=\hat{P}(t_{k_2}\mid c)$

    - 零概率问题

      - 如果词 $t$ 没有出现在类别 $c$ 时，即 $\hat{P}(t\mid c)=0$
      - 平滑后：$\hat{P}(t_k\mid c)=\frac{T_{ct}+1}{\sum_{t^{'}\in V}(T_{ct^{'}}+1)}$，其中 $B$ 是不同的词语个数，即词汇表大小 $|V|=B$

### 三、信息熵

- 信息量

  - 信息多少的度量
  - 信息量的大小和事件发生的概率成反比（概率越小，不确定性越大，信息量越大）
  - $I(x)=-\log p(x)$

- 信息熵

  - 对平均不确定性的度量
  - 对于离散型随机变量 $X$ 的熵，即为信息量的数学期望，$H(X)=E_{x\sim X}[I(x)]=E_{x\sim X}[-\log x]=-\sum_{x\in X}[p(x)\log p(x)]$
  - 单调性：发生概率越高的事件，信息熵越低
  - 非负性：信息熵不能为负
  - 累加性

- 联合熵：$H(X,Y)=-1*\sum_{x\in \mathcal{X}}\sum_{y\in \mathcal{Y}}p(x,y)log(p(x,y))$

- 条件熵：
  $$
  \begin{aligned}
  H(Y|X)&=\mathbb{E}_{X}[H(Y|X=x)]\\
  &=\sum_{x \in \mathcal{X}} p(x) H(Y|X=x)\\
  &=\sum_{x \in \mathcal{X}} p(x) \left( -\sum_{y \in \mathcal{Y}} p(y|x) \log p(y|x) \right)\\
  &=-\sum_{x \in \mathcal{X}} \sum_{y \in \mathcal{Y}} p(y,x) \log p(y|x).
  \end{aligned}
  $$

- 联合熵与条件熵的关系

  $$
  \begin{aligned}
  H(X, Y) &= -\sum_{x \in \mathcal{X}} \sum_{y \in \mathcal{Y}} p(x, y) \text{log} [p(x) p(y|x)] \\
  &= -\sum_{x \in \mathcal{X}} \sum_{y \in \mathcal{Y}} p(x, y) [\log p(x) + \log p(y|x)] \\
  &= -\sum_{x \in \mathcal{X}} \sum_{y \in \mathcal{Y}} p(x, y) \log p(x) - \sum_{x \in \mathcal{X}} \sum_{y \in \mathcal{Y}} p(x, y) \log p(y|x) \\
  &= -\sum_{x \in \mathcal{X}} p(x) \log p(x) - \sum_{x \in \mathcal{X}} \sum_{y \in \mathcal{Y}} p(x, y) \log p(y|x) \\
  &= H(X) + H(Y|X).
  \end{aligned}
  $$

- 交叉熵

  - 度量两个概率分布之间的差异性信息，在分类任务中常用作目标函数

  - 其中，$p$ 为真实标签，$q$ 为预测标签
    $$
    \begin{align}
    H(p,q)&=\sum_{i=1}^np(x_i)*log(\frac{1}{q(x_i)}) \\
    &=-1*\sum_{i=1}^np(x_i)*log(q(x_i))
    \end{align}
    $$

- KL 散度（相对熵）

  - 对同一个随机变量有两个概率分布 $P(X)$ 和 $Q(X)$​，衡量两个分布的不相似程度
  - 相对熵具有不对称性
  - $D_{KL}(p||q)=\sum_{i=1}^np(x_i)*log(\frac{p(x_i)}{q(x_i)})$​

- 交叉熵与相对熵的关系

  - KL 散度 = 随机变量 $ X$ 的信息熵 - 交叉熵
  - 由于 $H(X)$ 为常量，因此两者均可用来评估分类任务中真实标签和预测标签的差别

  $$
  \begin{align}
  D_{KL}(p||q)&=\sum_{i=1}^np(x_i)*log(\frac{p(x_i)}{q(x_i)})\\
  &=\sum_{i=1}^np(x_i)*log(p(x_i))-1*\sum_{i=1}^np(x_i)*log(q(x_i))\\
  &=H(X)-H(p,q)
  \end{align}
  $$

- 互信息

  - 联合分布 $p(x,y)$ 和 $p(x)p(y)$​ 之间的相对熵

  - $I(X;Y)=\sum_{y\in Y}\sum_{x\in X}p(x,y)\log\frac{p(x,y)}{p(x)p(y)}$​

  - 信息熵与条件熵之差 —— 知道其中一个，另一个不确定性减少的程度
    $$
    \begin{aligned}
    I(x;y)&=H(Y)-H(Y|X)=H(X)-H(X|Y) \\
    & =-\sum_{x\in X}p(x)\log p(x)-\sum_{y\in Y}p(y)H(X\mid Y=y) \\
    & =-\sum_{x\in X}\left(\sum_{y\in Y}p(x,y)\right)\log p(x)+\sum_{y\in Y}p(y)\sum_{x\in X}p(x\mid y)\log p(x\mid y) \\
    & =-\sum_{x\in X}\sum_{y\in Y}p(x,y)\log p(x)+\sum_{y\in Y}\sum_{x\in X}p(x,y)\log p(x\mid y) \\
    & =\sum_{y\in Y}\sum_{x\in X}p(x,y)\log\frac{p(x\mid y)}{p(x)} \\
    & =\sum_{y\in Y}\sum_{x\in X}p(x,y)\log\frac{p(x,y)}{p(x)p(y)}
    \end{aligned}
    $$

### 四、隐马尔可夫模型

- 隐马尔可夫模型（Hidden Markov Model, HMM）

  - 一个五元组 $\lambda=(Y,X,\Pi,A,B)$，其中 $Y$ 是隐状态（输出变量）的集合，$X$ 是观察值（输入）的集合，$\Pi$ 是初始状态的概率，$A$ 是状态转移概率矩阵，$B$ 是输出观察值概率矩阵
  - $p(\vec{y},\vec{x})=\prod_{i=1}^np(y_i|y_{i-1})p(x_i|y_i)$
  - 三个假设
    - 马尔可夫性假设（状态构成一阶马尔可夫链）
    - 不动性假设（状态与时间无关）
    - 输出独立性假设（输出仅与当前状态有关）

- 以词性标注（Part-Of-Speech Tagging, POS Tagging）为例理解隐马尔可夫模型

  - 假设句子 “Time flies quickly”，目标即为找出最可能的词性序列 $S = \text{(N, V, ADV)}$

  - 已知概率分布

    - 初始状态分布 ($\Pi$)：句子开头每个词性的概率
      $$
      P(S_1 = N) = 0.6, \quad P(S_1 = V) = 0.3, \quad P(S_1 = ADV) = 0.1
      $$

    2. 状态转移概率 ($A$)：词性之间的转移概率
       $$
       P(S_t = N | S_{t-1} = N) = 0.3, \quad P(S_t = V | S_{t-1} = N) = 0.5, \quad \dots
       $$
    3. 观测概率 ($B$)：隐藏状态生成观测单词的概率
       $$
       P(O_t = \text{"Time"} | S_t = N) = 0.8, \quad P(O_t = \text{"flies"} | S_t = V) = 0.7, \dots
       $$

  - 计算最优序列：采用维特比算法（Viterbi Algorithm）求解

    - 构建动态规划表

      - 行表示隐藏状态 $S$，列表示单词 $O$
      - 每个单元格存储到当前单词位置的最优路径概率以及最佳前驱状态

    - 过程

      - 初始化：

        $$
        V_1(N) = \pi(N) \cdot B(N, \text{"Time"}) = 0.6 \cdot 0.8 = 0.48
        $$

        - 类似计算 $V_1(V)$ 和 $V_1(ADV)$

      - 递推：

      $$
      V_2(V) = \max_{S_1} [V_1(S_1) \cdot A(S_1 \to V)] \cdot B(V, \text{"flies"})
      $$

      - 回溯：根据存储的最佳前驱状态，回溯出隐藏状态序列

      - 输出结果：通过维特比算法，找到最优词性序列 $S = \text{(N, V, ADV)}$​

- 三个基本问题

  - 评估问题
    - 对于给定模型，求解某个观察值序列的概率 $P(Q|\lambda)$
    - 如语音识别：给定一个观测序列（如一段音频的特征向量序列）和一个特定的 HMM（如表示单词 "hello" 的模型），评估这段音频是否属于该单词
    - 前向算法
    - 后向算法
  - 解码问题
    - 对于给定模型和观察值序列，求可能性最大的状态序列 $\max_{Q}\{P(Q|O,\lambda)\}$
    - 如词性标注任务：给定一个句子的单词序列（如 "Time flies quickly"），找到对应的最可能的词性序列（如 "Noun, Verb, Adverb"）
    - Viterbi 算法
  - 学习问题
    - 对于给定观察值序列 $O$，调整参数 $\lambda$，使得观察值出现的概率 $P(O|\lambda)$​ 最大
    - 如 DNA 序列分析：给定一组 DNA 序列（观测序列），学习模型参数以区分不同的区域类型（隐藏状态，例如基因编码区和非编码区）。
    - Baum-Welch 算法

### 五、Word2Vec

- 词向量：对词典 $D$ 中的任意词 $w$，指定一个固定长度的实数值向量 $ v(w)\propto R^m$ ，则 $v(w)$ 就称为 $w$​ 的词向量

- Word Embedding：将不可计算、非结构化的词转化为可计算、结构化的向量，将现实问题转化为数学问题

- N-gram 模型

  - N-gram 是长度为 $n$ 的词序列或字符序列。

  2. 使用前 $n-1$ 个单词预测第 $n$ 个单词：

     $$
     P(w_1, w_2, \dots, w_m) = \prod_{i=1}^m P(w_i | w_{i-n+1}, \dots, w_{i-1})
     $$

  3. 马尔科夫假设：假设一个单词的概率仅取决于其前 $n-1$ 个单词，而非完整句子
     $$
     P(w_i | w_1, \dots, w_{i-1}) \approx P(w_i | w_{i-n+1}, \dots, w_{i-1})
     $$

  - Unigram (1-gram)：假设每个单词的概率与上下文无关，即 $P(w_1, w_2, \dots, w_m) = \prod_{i=1}^m P(w_i)$

  2. Bigram (2-gram)：假设每个单词的概率仅取决于前一个单词，即 $P(w_i | w_{i-1})$

  - Trigram (3-gram)：假设每个单词的概率取决于前两个单词，即 $P(w_i | w_{i-2}, w_{i-1})$​

- Word2Vec

  - 通过计算向量之间的距离，来体现词与词之间的相似性， 解决 One-Hot 向量存在的词汇鸿沟问题
  - 基于如下假设： 衡量两个词在语义上的相似性，决定于其邻居词的分布是否相似
  - 问题描述：$p(w\mid\mathrm{Context}(w))=F(w,\mathrm{Context}(w),\theta)$，优化 $\theta^*$，确定 $F$ 函数
  - 两种形式
    - CBOW
      - 通过上下文来预测当前值。相当于一句话中 mask 一个词，预测该词是什么
      - 优化函数：对数似然函数，$\mathcal{L}=\sum_{w\in\mathcal{C}}\log p(w\mid\mathsf{Context}(w))=- \sum \log P(w_t | w_{t-n}, \dots, w_{t+n})$
    - Skip-gram
      - 用当前词来预测上下文。相当于给定一个词，预测前后词是什么
      - 优化函数：对数似然函数，$\mathcal{L}=\sum_{w\in\mathcal{C}}\log p(\mathsf{Context}(w)\mid w)=- \sum \log P(w_{t+i} | w_t), \quad i \in \{-n, \dots, -1, 1, \dots, n\}$
  - 目标：优化模型参数使得 $P(w_o | w_c) = \frac{\exp(v_o \cdot v_c)}{\sum_{w} \exp(v_w \cdot v_c)}$，其中 $v_o$ 是输出词向量，$v_c$​ 是中心词向量

### 六、机器学习概述

- 机器学习

  - 本质：构建一个映射函数
  - $x\rightarrow f(x,\theta^*)\rightarrow y/p(y|x)$

- 机器学习三要素

  - 模型
    - 线性：$f(x,\theta)=w^Tx+b$
    - 广义线性：$f(x,\theta)=w^T\Phi(x)+b$，当 $\Phi(x)$ 为可学习的非线性基函数，则 $f(x,\theta)$ 即为神经网络
  - 学习准则
    - 期望风险：$\mathcal{R}(f)=\mathbb{E}_{(\mathbf{x},y)\sim p(\mathbf{x},y)}[\mathcal{L}(f(\mathbf{x}),y)]$​
    - 经验风险：$R(\theta)=\frac{1}{\mathrm{N}}\sum_{i=1}^{\mathrm{N}}L(y^{(i)},f(\mathrm{x}^{(i)}))$
    - 结构风险：$R(\theta)+\lambda\|\theta\|^2$
  - 优化：梯度下降

- 机器学习的类型

  | 类别   | 监督学习                                 | 无监督学习                           | 强化学习                           |
  | ---- | ------------------------------------ | ------------------------------- | ------------------------------ |
  | 训练样本 | 训练集 $\{(x^{(n)}, y^{(n)})\}_{n=1}^N$ | 训练集 $\{x^{(n)}\}_{n=1}^N$       | 智能体和环境交互的轨迹 $\tau$ 和累计奖励 $G_T$ |
  | 优化目标 | $y = f(x)$ 或 $p(y\mid x)$            | $p(x)$ 或带隐变量 $z$ 的 $p(x\mid z)$ | 期望总回报 $\mathbb{E}[G_T]$        |
  | 学习准则 | 期望风险最小化、最大似然估计                       | 最大似然估计、最小重构误差                   | 策略评估、策略改进                      |

- 参数学习

  - 由于期望风险未知，利用经验风险近似

  - 在选择合适的风险函数后，寻找参数 $\theta^*$，使得经验风险函数最小化

    $$
    \theta^*=\underset{\theta}{\operatorname*{\arg\min}}\mathcal{R}_{\mathcal{D}}^{emp}(\theta)
    $$

  - 机器学习问题转化为最优化问题

- 优化：梯度下降法

  - 批量梯度下降法
  - 随机梯度下降法
  - 小批量梯度下降法

- 如何减少泛化错误

  - 优化：经验风险最小
  - 正则化（regularization）：降低模型复杂度
  - 所有损害优化的方法都是正则化
    - 增加优化约束（L1 / L2 约束，数据增强）
    - 干扰优化过程（权重衰减、随机梯度下降、早停）

- 模型的选择

  - 拟合能力强的模型一般复杂度会比较高，容易过拟合

  - 如果限制模型复杂度，降低拟合能力，可能会欠拟合

  - 期望错误的分解（偏差与方差分解）

    $$
    \mathcal{R}(f) = (\text{bias})^2 + \text{variance} + \epsilon
    $$

    1. 偏差（Bias）：

       $$
       \mathbb{E}_x \left[ \left( \mathbb{E}_D[f_D(x)] - f^*(x) \right)^2 \right]
       $$

    2. 方差（Variance）：

       $$
       \mathbb{E}_x \left[ \mathbb{E}_D \left[ \left( f_D(x) - \mathbb{E}_D[f_D(x)] \right)^2 \right] \right]
       $$

    3. 噪声项（Irreducible Error）：

    $$
    \mathbb{E}_{(x,y) \sim p_r(x,y)} \left[ \left( y - f^*(x) \right)^2 \right]
    $$

  - 低方差、低偏差时模型最优

  - 有效降低方差：集成模型

    - 通过多个高方差模型的平均来降低方差
    - 集成模型的期望错误大于等于所有模型的平均期望错误的 $\frac{1}{M}$​，小于等于所有模型的平均期望错误

- 线性模型

  | 模型          | 函数 / 激活函数     | 损失函数                              | 输出形式     | 优化方法       |
  | ----------- | ------------- | --------------------------------- | -------- | ---------- |
  | 线性模型        | $f(x)=w^Tx+b$ | $(y-w^Tx)^2$                      | 实数或类别    | 最小二乘、梯度下降  |
  | Logistic 回归 | logistic 函数   | 交叉熵损失：$y\log\sigma(w^Tx)$         | 类别的概率值   | 梯度下降       |
  | Softmax 回归  | softmax 函数    | 交叉熵损失：$y\log\text{softmax}(w^Tx)$ | 各类别的概率分布 | 梯度下降       |
  | 感知机         | 阶跃函数          | $\max(0,-yw^Tx)$                  | $+1/-1$  | 随机梯度下降     |
  | SVM         | 阶跃函数          | $\max(0,1-yw^Tx)$                 | $+1/-1$  | 二次规划、SMO 等 |

- 线性模型备注

  - Logistic 回归

    - 在线性模型基础上加入 Sigmoid 函数，使输出值限定在 $(0,1)$ 之间，即 $P(y=1|x)=\sigma(w^Tx+b)=\frac{1}{1+e^{-(w^Tx+b)}}$

    - 用于二分类任务，输出类别的概率值

  - Softmax 回归

    - 对 Logistic 回归的扩展，适用于多分类任务
    - 对于 $K$ 分类任务，$P(y=k|x)=\frac{e^{w_k^Tx}}{\sum_{j=1}^{K}e^{w_j^Tx}}$​
    - 分类规则：选择概率最大的类别 $\arg\max_kP(y=k|x)$

  - 感知机

    - $f(x)=\text{sign}(w^Tx+b)$

    - 学习规则：通过误分类点的更新规则调整权重

      $$
      \begin{align}
      w &\gets w + \eta y_i x_i \\
      b &\gets b + \eta y_i
      \end{align}
      $$

    - 用于线性可分的二分类任务

  - 支持向量机

    - 寻找最优决策边界（最大化分类间隔）的分类模型，适用于二分类问题

    - 找到一个超平面，使两类之间的间隔（Margin）最大化：$\max \frac{2}{\|w\|}$，同时满足：$y_i (w^T x_i + b) \geq 1, \quad \forall i$​

    - 损失函数 —— 引入松弛变量（对于线性不可分问题）后，优化目标为：
      $$
      \min \frac{1}{2} \|w\|^2 + C \sum_{i=1}^N \xi_i
      $$
      其中 $C$ 控制间隔和误分类的权衡，$\xi_i$ 是松弛变量。

- 深度学习

  - 传统机器学习的步骤
    - 原始数据 $\Rightarrow$ 数据预处理 $\Rightarrow$ 特征提取 $\Rightarrow$ 特征转换 $\Rightarrow$ 预测识别 $\Rightarrow$ 结果
    - 第 2-4 步为特征处理，第 5 步为浅层学习
  - 深度学习 = 表示学习 + 浅层学习
    - 原始数据 $\Rightarrow$ 底层特征 $\Rightarrow$ 中层特征 $\Rightarrow$ 高层特征 $\Rightarrow$ 预测识别 $\Rightarrow$​​ 结果
  - 深度学习的核心思想：通过层次化的表征学习，从数据中自动提取特征
  - 尽管深度学习通常使用多层神经网络，但深度学习的范围实际上更广
  - 深度学习天然不是神经网络，但神经网络天然是深度学习

- 正则化方法

  - L1 正则化
  - L2 正则化

- 优化器（Optimizer）

  - 核心功能：计算梯度，并基于梯度信息调整模型参数

  - 通常，优化器通过梯度下降法来更新参数，即沿着损失函数的梯度方向，调整模型参数，以减少损失值

  - 基本步骤

    - **计算梯度：** 计算损失函数相对于模型参数的梯度
    - **更新参数：** 根据梯度的方向和大小，调整模型参数，使损失函数逐步减小

  - 常见优化器类型

    - 梯度下降法（GD, Gradient Descent）

      - 批量梯度下降（Batch GD）：每次使用所有训练数据来计算梯度并更新参数，计算量大，适用于小型数据集
      - 随机梯度下降（SGD, Stochastic GD）：每次使用一个样本来计算梯度并更新参数，计算效率高，但容易受噪声影响
      - 小批量梯度下降（Mini-batch GD）：每次使用一小部分样本来计算梯度并更新参数，是大多数实际应用中最常用的方法，平衡了计算效率和稳定性

    - 动量法（Momentum）：在每次更新时加入之前梯度的加权平均，能加速收敛并减少震荡，特别在处理有很多局部最小值的问题时表现较好

    - AdaGrad：自适应地调整每个参数的学习率，适用于稀疏数据（例如文本数据或推荐系统中的数据）

    - RMSprop：结合了动量法和 AdaGrad，适用于非平稳目标函数，通常用于训练深度神经网络

    - Adam（Adaptive Moment Estimation）：结合了动量法和 RMSprop 的优点，计算每个参数的自适应学习率，且在训练过程中能够自动调整。Adam 广泛用于深度学习训练中，通常能提供较好的效果

### 七、前馈神经网络

- 神经网络

  - 激活规则：神经元输入到输出之间的映射关系，一般为非线性函数
  - 网络结构：不同神经元之间的连接关系
  - 学习算法：通过训练数据来学习神经网络的参数

- M - P 神经元模型

  - 神经元接受来自 $𝑛$ 个其他神经元传递过来的输入信号，这些输入信号通过带权重的连接进行传递，将神经元接收到的总输入值与神经元的阈值进行比较，然后通过 “激活函数”（activation function）处理产生神经元输出
  - $a=f(n)=f(\sum_{i=1}^n x_iw_i+b)=f(WX+b)$

- 学习与优化

  - 将样本数据实际输出与神经元输出进行比较，计算模型偏差 / 损失，以自适应线性单元（无激活函数的线性层）为例，假设有 $n$​ 个样本

  - 梯度下降

    - $E=\frac{1}{2}\sum_{i=1}^n(W^Tx^{(i)}-\tilde{y}^{(i)})$

    - 沿着损失函数的曲线下降，直到达到局部或全局的最小值点
      $$
      \begin{aligned}
       & w:=w+\Delta w \\
       & \Delta w=-\eta\nabla E(w) \\
       & \frac{\partial E}{\partial w_j}=-\sum_i(y^{(i)}-\hat{y}^{(i)})x_j^{(i)} \\
       & \Delta w_j=-\eta\frac{\partial E}{\partial w_j}
      \end{aligned}
      $$

- 前馈神经网络（Forward Nerual Network）

  - 各神经元分别属于不同的层
  - 整个网络中无反馈，信号从输入层向输出层单向传播，可用一个有向无环图表示
  - 同一层神经元之间没有连接；前后两层所有神经元相连（即 full connected），前层神经元输出就是后层神经元输入；每一个连接都有一个权重

- 通用近似原理：对于具有线性输出层和至少一个使用 “挤压” 性质的激活函数的隐藏层组成的前馈神经网络，只要其隐藏层神经元的数量足够，它可以以任意精度来近似任何从一个定义在实数空间中的有界闭集函数

### 八、反向传播

- BP（Back Propagation）神经网络是前馈神经网络，但权重学习过程是 BP 过程

  - 第 $k$ 层共有 $p_k$ 个神经元
  - 第 $k$ 层第 $i$ 个神经元的输入线性加权和为 $u_i^k=\sum_{j=1}^{p_{k-1}}w_{ij}^ky_j^{k-1}-\theta_i=\sum_{j=0}^{p_{k-1}}w_{ij}^ky_j^{k-1}$，其中 $y_o^{k-1}=\theta_i,w_{i0}^k=-1$
  - 第 $k$ 层第 $i$ 个神经元的输出为 $y_i^k=f(u_i^k)=\frac{1}{1+e^{-s_i^k}}$
  - 一个三层的 BP 神经网络可以任意精度逼近任意连续函数 $Y = f(X)$​（通过学习不断调整边权重）
  - 给定 $N$ 组输入样本 $\{X_{si},Y_{si}\}$，如何调整 BP 神经网络的权重，使得输入为 $X_{si}$ 时，输出为 $Y_{si}$​

- BP 学习算法的基本思想

  - 基本思想：目标函数为神经网络输出层每个神经元实际输出值 $y_j^m$ 与期望输出值 $d_j$ 之差的平方和，其中 $d_j$ 是向量 $Y_{si}$ 的第 $j$ 维分量
  - 如何不断调整权重：利用 “最快下降法” 使得权值沿着目标函数的负梯度方向改变（这样可以使得目标函数值迅速下降，接近 0）
  - 目标函数：$J=\frac{1}{2}\sum_{j=1}^{p_m}(y_j^m-d_j)^2$
  - 约束条件：$u_i^k=\sum_{j}w_{ij}^ky_j^{k-1}$，$y_i^k=f_k(u_i^k)$
  - 连接权重的修正量：$\Delta w_{ij}^k=-\epsilon\frac{\partial J}{\partial w_{ij}^k}$​
  - 梯度：在单变量的函数中，梯度即为导数，也就是曲线上某点的斜率。但是在多维变量的函数中，梯度就是函数对每一维度变量求偏导得出的向量

- BP 学习算法的步骤

  - 正向传播输入信息，产生输出
  - 反向传播误差，反向逐层计算偏导，调整网络权值（最快下降法，调整权值使得误差迅速减小）
    - 例如：$\frac{\partial E_{total}}{\partial w_5}=\frac{\partial E_{total}}{\partial y_{o_1}}\times\frac{\partial y_{o_1}}{\partial u_{o_1}}\times\frac{\partial u_{o_1}}{\partial w_5}$​
    - 同样把其余所有的权值都进行更新迭代，然后再进行正向传播计算， 并且每次重新计算误差，根据误差再反向传播更新权重。
  - 直至达到损失函数的最小值，最后得到的就是具有正确权值的最佳模型

- 优化问题

  - 在每一层都要乘以该层的激活函数的导数
  - 梯度消失问题
    - 激活函数求导过小（求导小于 1）前面的层比后面的层梯度变化更小，故变化更慢，从而引起了梯度消失问题
    - 在反向传播中，梯度通过链式法则传递，多个小于 1 的数相乘会使梯度指数级衰减
  - 梯度爆炸问题
    - 激活函数求导过大（求导大于 1），前面层比后面层梯度变化更快，会引起梯度爆炸问题
    - 在反向传播中，梯度通过链式法则传递，多个大于 1 的数相乘会使梯度指数级增大

- 常见激活函数

  | 激活函数       | 数学表达式                                                                       | 导数表达式                                                                       | 特点                                                   |
  | ---------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------- |
  | Sigmoid    | $f(x) = \frac{1}{1 + e^{-x}}$                                               | $f'(x) = f(x)(1 - f(x))$                                                    | 输出范围为 (0, 1)，常用于概率预测。容易导致梯度消失问题，特别是在深层网络中。           |
  | Tanh       | $f(x) = \tanh(x) = \frac{e^x - e^{-x}}{e^x + e^{-x}}$                       | $f'(x) = 1 - f(x)^2$                                                        | 输出范围为 (-1, 1)，比 Sigmoid 更常用。仍有梯度消失风险。                |
  | ReLU       | $f(x) = \max(0, x)$                                                         | $f'(x) = \begin{cases} 1 & x > 0 \\ 0 & x \leq 0 \end{cases}$               | 简单高效，避免梯度消失 / 爆炸问题。导数在 $x \leq 0$ 时为 0，可能导致 “死亡神经元”。 |
  | Leaky ReLU | $f(x) = \begin{cases} x & x > 0 \\ \alpha x & x \leq 0 \end{cases}$         | $f'(x) = \begin{cases} 1 & x > 0 \\ \alpha & x \leq 0 \end{cases}$          | 解决 ReLU 的 “死亡神经元” 问题，$\alpha$ 是一个小的正常数（如 0.01）。      |
  | ELU        | $f(x) = \begin{cases} x & x > 0 \\ \alpha (e^x - 1) & x \leq 0 \end{cases}$ | $f'(x) = \begin{cases} 1 & x > 0 \\ f(x) + \alpha & x \leq 0 \end{cases}$   | 更平滑，输出范围更接近 0，增强训练稳定性。                               |
  | Softmax    | $f_i(x) = \frac{e^{x_i}}{\sum_{j} e^{x_j}}$                                 | $f'_i(x) = f_i(x)(1 - f_i(x))$（单一元素导数） $f'_{ij}(x) = -f_i(x)f_j(x)$（交叉元素导数） | 用于多分类问题，输出为概率分布。                                     |
  | Swish      | $f(x) = x \cdot \sigma(x) = x \cdot \frac{1}{1 + e^{-x}}$                   | $f'(x) = f(x) + \sigma(x) \cdot (1 - f(x))$                                 | 平滑非线性，比 ReLU 表现更好，尤其在深层网络中。                          |
  | GELU       | $f(x) = x \cdot \Phi(x)$, 其中 $\Phi(x)$ 是标准正态分布的 CDF                         | 无明确的闭式解，可近似为 $f'(x) \approx \sigma(x) \cdot (1 + x \cdot (1 - \sigma(x)))$  | 平滑近似，性能优于 ReLU 和 Swish，常用于 Transformer。              |
  | Linear     | $f(x) = x$                                                                  | $f'(x) = 1$                                                                 | 输出未受限，通常用于回归问题或最后一层。                                 |

- 常见激活函数的曲线图

  ![激活函数曲线](img/激活函数曲线.png)

### 九、卷积神经网络

- 传统神经网络的缺点

  - 不同层神经元连接方式为 “全连接”，对于大维度输入数据，权重和偏置参数量大，导致训练收敛缓慢
  - 特别是图像数据（数以百万像素），以单张黑白 28 × 28 的手写数字图片为例，输入层神经元就有 784 个

- 卷积神经网络（Convolutional Neural Network, CNN）

  - 利用生物学上感受野的概念
  - 局部连接：卷积层的神经元只与前一层的部分神经元节点相连，即神经元之间的连接是**非全连接**的
  - 权重共享：同一层中某些神经元之间的连接的权重 $𝑤$ 和偏置 $𝑏$​​ 是相同的，大大减少了训练参数量
  - 降采样（池化）：更进一步信息抽象和特征提取，减少数据处理量

- 卷积层

  - 卷积是一种线性的、平移不变的运算，其由在输入信号上执行局部加权的组合构成
  - 根据所选择的权重集合不同，揭示输入信号的不同性值
  - 卷积核（滤波器）：在 CNN 中，与权重集合相关的是卷积核（kernel）；选择合适的核，能从输入信号中提取最显著和最重要的特征
  - $c_i=f(\sum\omega\cdot x+b)$，其中 $\omega$​ 即为卷积核
  - 在全连接神经网络中，隐藏层中的神经元的感受野足够大乃至可以看到上一层的所有特征
  - 而在卷积神经网络中，隐藏层中的神经元的感受野比较小，只能看到上一层的部分特征，其所能看到的大小即为卷积核大小
  - 通过一个带有卷积核的感受视野扫描生成的下一层神经元矩阵被称为一个 Feature Map（特征图）
  - 卷积核中的每一项即为其权重值

- 特征图大小的计算

  - 输入图像大小为 $H_{\text{in}} \times W_{\text{in}}$（高度 × 宽度）

  - 卷积核大小为 $K_h \times K_w$（高度 × 宽度）

  - 步幅（stride）为 $S_h$ 和 $S_w$（纵向步幅 × 横向步幅）

  - 填充（padding）为 $P_h$ 和 $P_w$（高度方向填充 × 宽度方向填充）

  - 则输出图像大小 $H_{\text{out}} \times W_{\text{out}}$ 可以计算为：

  $$
  H_{\text{out}} = \left\lfloor \frac{H_{\text{in}} + 2P_h - K_h}{S_h} \right\rfloor + 1 \\
  W_{\text{out}} = \left\lfloor \frac{W_{\text{in}} + 2P_w - K_w}{S_w} \right\rfloor + 1
  $$

  - 很多深度学习框架会采取向下取整的方式，放弃输入特征图的一部分边界数据
  - Caffe 和 PyTorch 会放弃输入特征图的左侧和上侧的一部分数据， 使得卷积核滑动窗恰好能到达最右下角的点

- 如何增加输出单元的感受野

  - 增加卷积核大小
  - 增加卷积层数
  - 在卷积前进行汇聚操作

- 卷积的变种

  - 分组卷积
  - 转置卷积
  - 空洞卷积：通过给卷积核插入 “空洞” 来变相地增加感受野的大小
  - 可变形卷积

- 卷积核的深度

  - 卷积核（Kernel）的形状可以表示为 $K_h \times K_w \times C_{\text{in}}$:

    - $K_h$：卷积核的高度
    - $K_w$​：卷积核的宽度
    - $C_{\text{in}}$：输入特征图的通道数（深度）

  - 特点
    - 卷积核的深度 $C_{\text{in}}$ 必须与输入特征图的通道数相等，因为每个卷积核需要对输入的每一通道进行逐元素卷积
    - 如果输入特征图是 RGB 图像（3 个通道），卷积核的深度 $C_{\text{in}}$​ 就为 3

  - 卷积过程

    - 输入特征图的形状：$H_{\text{in}} \times W_{\text{in}} \times C_{\text{in}}$（高度 × 宽度 × 通道数）

    2. 卷积核的形状：$K_h \times K_w \times C_{\text{in}}$
    3. 每个卷积核的作用：
       - 对输入特征图的每一通道进行单独卷积
       - 将所有通道的卷积结果按元素相加（求和），生成一个二维特征图

    - 输出特征图：如果有 $C_{\text{out}}$ 个卷积核，则输出特征图的形状为 $H_{\text{out}} \times W_{\text{out}} \times C_{\text{out}}$​

- 池化（Pooling）

  - 对图像进行 “有损压缩”
  - 最大值池化、最小值池化、平均池化、全局平均池化（Global Average Pooling）
  - 作用
    - 不变性，更关注是否存在某些关键特征而不是特征具体的位置；
    - 减少计算量和参数量；
    - 获得定长输出，例如：文本分类的时候输入是不定长的，可以通过池化获得定长输出；
    - 防止过拟合，但也有可能会带来欠拟合

- 局部响应归一化（Local Response Normalization, LRN）

  - 局部响应归一化是一种归一化技术，主要用于提高模型的泛化能力

  - 它最早出现在 AlexNet 中，用于对中间特征图进行归一化，灵感来自生物神经网络的 “侧抑制” 机制

  - 核心思想是对特定像素位置的值，使用其相邻通道的响应来进行归一化：

    - 计算当前像素位置在 **通道维度** 上的局部响应平方和
    - 根据平方和对当前通道的值进行归一化，抑制大的激活值，提升其他通道的响应

  - 对于给定的输入特征图，假设输入在某一位置的特征值为 $a_{i,x,y}$，表示第 $i$ 个通道在位置 $(x, y)$ 的值。LRN 的归一化计算如下：

    $$
    b_{i,x,y} = \frac{a_{i,x,y}}{\left( k + \alpha \sum_{j=\max(0, i-n/2)}^{\min(N-1, i+n/2)} (a_{j,x,y})^2 \right)^\beta}
    $$

    - $b_{i,x,y}$：归一化后的值
    - $a_{i,x,y}$：原始输入值
    - $k$：一个常数，避免归一化分母为零（通常 $k = 2$）
    - $\alpha$：缩放因子，控制归一化的强度（常见值为 $10^{-4}$）
    - $\beta$：指数项，控制归一化的抑制程度（通常取 $0.75$）
    - $N$：输入特征图的通道数
    - $n$​：归一化时考虑的通道范围（常见值为 5）

- 批归一化（Batch Normalization，BN，BatchNorm）

  - 对于一个神经网络层的输入 $x$，BN 的核心步骤如下：

    - 计算均值和方差：

      $$
      \mu_B = \frac{1}{m} \sum_{i=1}^{m} x_i, \quad \sigma_B^2 = \frac{1}{m} \sum_{i=1}^{m} (x_i - \mu_B)^2
      $$

    - 标准化：

      $$
      \hat{x}_i = \frac{x_i - \mu_B}{\sqrt{\sigma_B^2 + \epsilon}}
      $$

    - 缩放和平移：

      $$
      y_i = \gamma \hat{x}_i + \beta
      $$

      - $m$：当前批次的样本数
      - $\epsilon$：一个小常数，防止分母为零
      - $\gamma$ 和 $\beta$​：可学习的参数，用于调整标准化后的分布

    - $y_i = \gamma \cdot \frac{x_i - \mu_B}{\sqrt{\sigma_B^2 + \epsilon}} + \beta$​

  - 通常用于非线性激活函数之前或之后，最常见的是放在激活函数之前：
    $$
    \text{Input} \to \text{Linear/Conv} \to \text{BatchNorm} \to \text{Activation (e.g., ReLU)}
    $$

- 瓶颈结构

- 沙漏结构

- 正则化方法（Dropout）

  - Dropout 是一种常用的正则化方法，可以缓解网络的过拟合问题
  - Dropout 操作是指在网络的训练阶段，每次迭代时会从基础网络中随机丢弃一定比例的神经元，然后在修改后的网络上进行前向传播和反向传播
  - 注意：模型在测试阶段会恢复全部的神经元

- 残差网络（Residual Neural Network，ResNet）

  - 网络的退化（degeneration）：在 CNN 中，随着网络层数的加深，网络的训练误差和测试误差都会上升

  - 残差连接

    - ResNet 引入残差块（Residual Block），通过引入跳跃连接（Skip Connection），避免直接学习输入到输出的复杂映射，而是让网络学习残差映射：

      $$
      F(x) = H(x) - x\\
      H(x) = F(x) + x
      $$

    - 其中，$H(x)$ 是目标映射；$F(x)$ 是残差映射，由一系列卷积层学习；$x$ 是输入，通过跳跃连接直接加到输出

  - 残差块（Residual Block）

    ![正常块与残差块](img/正常块与残差块.png)

    - 基本结构包括：

      - 两层卷积层（每层包含卷积 + 批归一化 + ReLU 激活）
      - 跳跃连接：输入直接加到第二层卷积的输出

    - 具体流程：

      - 输入 $x$ 经过两层卷积，生成 $F(x)$。

      - 跳跃连接将 $x$ 加到 $F(x)$，输出 $H(x) = F(x) + x$。

    - 表达式

      $$
            y = \text{ReLU}(F(x, \{W_i\}) + x)
      $$

    - 如果输入和输出维度不同（如通道数不一致），跳跃连接可以通过线性投影（$W_s$）调整：
      $$
            y = \text{ReLU}(F(x, \{W_i\}) + W_s \cdot x)
      $$

    ![包含以及不包含1x1卷积层的残差块](img/包含以及不包含1x1卷积层的残差块.png)

  - 网络结构

    1. 浅层卷积层：一个大核卷积（如 $7 \times 7$）和池化层
    2. 残差块堆叠：由多个残差块组成，每个阶段的通道数可能不同
    3. 全局平均池化：将最后的特征图通过全局平均池化降维，变为固定大小的特征向量
    4. 全连接层：用于分类或其他任务

- TextCNN

  - 将卷积神经网络 CNN 应用到文本分类任务，利用多个不同 size 的卷积核（kernel）提取句子中关键信息（类似多窗口大小的 n-gram），从而能够更好地捕捉局部相关性

  - 输入层
    - 给定长度为 $l$ 的句子 $S = [w_1, w_2, \dots, w_l]$，每个单词 $w_i$ 使用词嵌入（如 Word2Vec 或 GloVe）转换为固定长度的向量
    - 输入矩阵 $X \in \mathbb{R}^{l \times d}$：$X = [v(w_1), v(w_2), \dots, v(w_l)]^T$，其中 $l$ 表示句子长度，$d$ 表示词向量的维度

  - 卷积层

    - 卷积核：

      - 使用多个不同大小的卷积核（如 $h = 2, 3, 4$​）来捕捉不同长度的 n-gram 特征
      - 卷积核的大小为 $h \times d$，跨越词嵌入的整个维度

    - 卷积操作：对输入矩阵 $X$ 应用卷积，生成特征映射 $c$：$c_i = f(w \cdot X[i:i+h-1] + b)$

  - 池化层：使用 1-max pooling
    - 从每个特征映射中选择最大的值，表示该卷积核在整个输入中最显著的特征
    - 池化后的结果是一个固定长度的向量，每个值对应一个卷积核的输出
    - 特征的位置信息在池化层完全丢失
    - 最大池化会丢失同一特征的强度信息：强特征会出现多次，出现次数越多说明这个特征越强，但 Max Pooling 只保留一个最大值
    - 采用 Average Pooling、K-Max Pooling、Chunk-Max Pooling

  - 全连接层
    - 将池化层的输出拼接后传入全连接层
    - 最后通过 softmax（或 sigmoid）激活函数完成分类

### 十、循环神经网络

- FNN、CNN 处理序列数据的局限性

  - 只适合：图片分类、识别等任务
  - 不适合：连续数据处理，与时间有关数据（序列依赖关系）
    - 比如语音、文本、视频、金融数据（股票波动）
    - 整个数据由若干同类型单元组成，称为 “帧”，如音素、字词、每帧图像
    - 帧与帧之间存在相互依赖关系，不再满足独立性假设， 需要考虑数据前后位置关系
  - 无法处理变长度数据
    - 全部或者部分丧失数据之间前后依赖性
    - 单次处理数据长度不能过长，容易引起参数爆炸

- 循环神经网络（Recurrent Neural Network, RNN）

  - 给定输入序列 $X = [x_1, x_2, \dots, x_T]$，RNN 的计算过程为：

    - 输入层：序列中的每个时间步 $t$，输入 $x_t$

    - 隐藏层：每个时间步的隐藏状态 $h_t$ 根据当前输入 $x_t$ 和前一时间步的隐藏状态 $h_{t-1}$ 计算：
      $$
      h_t = f(W_{hx} \cdot x_t + W_{hh} \cdot h_{t-1} + b_h)
      $$
      - $W_{hx}$：输入到隐藏层的权重矩阵
      - $W_{hh}$：隐藏层到隐藏层的权重矩阵（时间共享）
      - $b_h$：隐藏层的偏置。
      - $f$：激活函数（如 tanh 或 ReLU）

    - 输出层：计算每个时间步的输出 $y_t$：
      $$
      y_t = g(W_{hy} \cdot h_t + b_y)
      $$
      - $W_{hy}$：隐藏层到输出层的权重矩阵
      - $g$​：输出激活函数（如 softmax 或 sigmoid）

- 双向循环神经网络

  - 基本思想
    - 普通 RNN 只能利用序列的过去信息（即从 $t=1$ 到 $t=T$ 的顺序）
    - BiRNN 在同一时间步 $t$ 同时考虑：
      - 前向 RNN：从 $t=1$ 到 $t=T$ 的正向传播
      - 后向 RNN：从 $t=T$ 到 $t=1$​ 的反向传播
    - 最终输出结合两种方向的信息
  - 每个时间步 $t$ 的隐藏状态为：$h_t = [h_t^f; h_t^b]$
    - $h_t^f$：前向隐藏状态
    - $h_t^b$：后向隐藏状态
    - 输出 $y_t$ 结合了前向和后向隐藏状态的信息
  - 给定输入序列 $X = [x_1, x_2, \dots, x_T]$

    - 前向 RNN：$h_t^f = f(W_{hx}^f \cdot x_t + W_{hh}^f \cdot h_{t-1}^f + b_h^f)$

    - 后向 RNN：$h_t^b = f(W_{hx}^b \cdot x_t + W_{hh}^b \cdot h_{t+1}^b + b_h^b)$

    - 输出层：每个时间步的输出 $y_t = g(W_{hy} \cdot [h_t^f; h_t^b] + b_y)$​

- 基本循环神经网络和双向神经网络：只有单个隐藏层，不能很好学习数据内部关系

- Deep（Bidirectional）RNN：叠加多个隐藏层，即在每个时刻会有多个隐藏层，有更强学习能力，但需要更多训练数据

- 循环神经网络训练算法 —— 基于时间的反向传播 BPTT（Back-Propagation Through Time）

- 优化问题

  - RNN 循环神经网络在时间维度上非常深，导致在训练中很容易发生梯度爆炸和梯度消失问题
  - 训练时梯度不能在较长序列中一直传递下去，从而使 RNN 无法捕捉到长距离的影响

- 正则化方法（Dropout）

- RNN 的架构类型

  | 架构类型           | 输入形态                     | 输出形态                     | 应用场景           | 特点                                           |
  | -------------- | ------------------------ | ------------------------ | -------------- | -------------------------------------------- |
  | 一对一            | 单一输入 $x$                 | 单一输出 $y$                 | 图像分类           | 无时间维度，类似传统神经网络                               |
  | 一对多            | 单一输入 $x$                 | 序列输出 $[y_1, \dots, y_T]$ | 图像描述生成         | 单一输入扩展为序列输出，常结合解码器使用                         |
  | 多对一            | 序列输入 $[x_1, \dots, x_T]$ | 单一输出                     | 情感分析、分类        | 将输入序列压缩为单一结果，依赖隐藏状态捕捉序列信息                    |
  | 多对多 (定长)       | 序列输入                     | 序列输出                     | 视频帧分类、同步时间序列处理 | 输入和输出长度相同，适合逐时间步预测                           |
  | 多对多 (变长)       | 序列输入                     | 序列输出                     | 机器翻译、对话生成      | Encoder-Decoder/Seq2Seq；编码器提取上下文向量，解码器生成序列输出 |
  | 长短期记忆网络 (LSTM) | 序列输入                     | 灵活                       | 长期时间序列预测       | 通过记忆单元和门机制缓解梯度消失问题                           |
  | 门控循环单元 (GRU)   | 序列输入                     | 灵活                       | 长距离依赖建模        | 结构更简洁，效率更高，但效果与 LSTM 相近                      |

- LSTM

  ![LSTM](img/LSTM.png)

  - 公式：假设当前输入为 $x_t$，前一时刻的隐藏状态和记忆单元状态分别为 $h_{t-1}$ 和 $c_{t-1}$

    1. 遗忘门（Forget Gate）：决定当前时刻哪些信息需要从记忆单元中删除

       $$
       f_t = \sigma(W_f \cdot [h_{t-1}, x_t] + b_f)
       $$

       - $f_t \in [0, 1]$：表示是否保留记忆单元中信息的比例

    2. 输入门（Input Gate）：决定当前输入信息的重要性，并选择性地将其添加到记忆单元

       $$
       i_t = \sigma(W_i \cdot [h_{t-1}, x_t] + b_i)
       $$

       - $i_t \in [0, 1]$：表示当前输入的重要程度

    3. 候选记忆单元状态：

       $$
       \tilde{c}_t = \tanh(W_c \cdot [h_{t-1}, x_t] + b_c)
       $$

       - $\tilde{c}_t$：表示当前输入的候选记忆信息

    4. 更新记忆单元状态（Cell State）：用来存储长期的上下文信息

       $$
       c_t = f_t \odot c_{t-1} + i_t \odot \tilde{c}_t
       $$

       - $c_t$：结合过去的记忆和当前的输入，更新记忆单元状态

    5. 输出门（Output Gate）：决定从记忆单元中读取哪些信息作为当前的隐藏状态输出

       $$
       o_t = \sigma(W_o \cdot [h_{t-1}, x_t] + b_o)
       $$

       - $o_t \in [0, 1]$：表示当前记忆单元中哪些信息用于生成隐藏状态

    6. 隐藏状态：
       $$
       h_t = o_t \odot \tanh(c_t)
       $$
       - $h_t$​：作为当前时刻的输出信息

  - 综述所述，LSTM 公式可描述如下
    $$
    \begin{align}
    \begin{bmatrix}
    \tilde{c}_t \\
    o_t \\
    i_t \\
    f_t
    \end{bmatrix}
    &=
    \begin{bmatrix}
    \tanh \\
    \sigma \\
    \sigma \\
    \sigma
    \end{bmatrix}
    \begin{pmatrix}
    \mathbf{x}_t \\
    \mathbf{h}_{t-1}
    \end{pmatrix}
    +
    \mathbf{b} \\
    c_t &= f_t \odot c_{t-1} + i_t \odot \tilde{c}_t\\
    h_t &= o_t \odot \tanh(c_t)
    \end{align}
    $$

- GRU

  ![GRU](img/GRU.png)

  - GRU 比 LSTM 网络更简单的循环神经网络

    - LSTM 中引入三个门函数控制输入值、记忆值和输出值，参数较多，训练起来比较困难
    - 遗忘门和输入门合并成更新门，另外多一个重置门
    - 不需要计算额外的内部状态 $c$，在当前状态 $h_t$ 和历史状态 $h_{t-1}$​ 之间引入线性依赖关系

  - 公式：假设当前时刻的输入为 $x_t$，上一时刻的隐藏状态为 $h_{t-1}$

    1. 更新门：控制当前时刻的隐藏状态中有多少信息需要从上一时刻传递，以及有多少新信息需要添加

       $$
       z_t = \sigma(W_z \cdot [h_{t-1}, x_t] + b_z)
       $$

       - $z_t \in [0, 1]$：更新门的输出，表示上一时刻的隐藏状态与当前时刻的输入的权重

    2. 重置门：决定丢弃多少过去的记忆，从而有选择性地 “重置” 上一时刻的隐藏状态

       $$
       r_t = \sigma(W_r \cdot [h_{t-1}, x_t] + b_r)
       $$

       - $r_t \in [0, 1]$：重置门的输出，控制当前时刻如何利用上一时刻的隐藏状态

    3. 候选隐藏状态：将记忆直接集成到隐藏状态 $h_t$ 中，结构更为简单

       $$
       \tilde{h}_t = \tanh(W_h \cdot [r_t \odot h_{t-1}, x_t] + b_h)
       $$

       - $\tilde{h}_t$：基于当前输入和重置后的隐藏状态计算得到的候选隐藏状态

    4. 隐藏状态更新：
       $$
       \begin{align}
       h_t &= z_t \odot h_{t-1} + (1 - z_t) \odot \tilde{h}_t \\
       &= z_t\odot h_{t-1}+(1-z_t)\odot\tanh(W_hx_t+U_h(r_t\circ h_{t-1})+b_h)
       \end{align}
       $$
       - $h_t$：结合上一时刻的隐藏状态（通过更新门的权重）和候选隐藏状态，更新当前隐藏状态

  - 当 $z_t=0$ 且 $r_t=1$ 时，隐状态 $h_t$ 退化为简单循环神经网络，即 $h_t=\tanh(W_hx_t+U_hh_{t-1}+b_h)$

### 十一、Transformer 模型

- 序列到序列（Sequence to Sequence，Seq2Seq）架构

- 注意力机制

  - 深度学习中的注意力机制本质上和人类的选择性视觉注意力机制类似
  - 核心目标也是从众多信息中选择出对当前任务目标更关键的信息，可以广义地解释为重要性权重的向量
  - RNN 是健忘的，前面的信息在经过多个时间步骤传播后会被逐渐消弱乃至消失；
  - RNN 的解码期间没有对齐操作，因此在解码每个元素的过程中，焦点分散在整个序列中；

- 注意力机制的核心步骤

  - 第一步：根据 Query 和 Key 计算权重系数

    - 根据 Query 和 Key 计算两者的相似性或者相关性

    - 对第一阶段的原始分值进行归一化处理

  - 第二步：根据权重系数对 Value 进行加权求和

  - 假设输入序列为 $X = [x_1, x_2, \dots, x_T]$，输出序列为 $Y = [y_1, y_2, \dots, y_{T'}]$

  - 计算注意力分数：对于每个时间步 $t$ 的输出 $y_t$，计算输入序列中每个元素 $x_i$ 的相关性（称为注意力分数）

    $$
    e_{t,i} = f(h_t^{\text{dec}}, h_i^{\text{enc}})
    $$

    - $h_t^{\text{dec}}$：解码器当前时间步的隐藏状态
    - $h_i^{\text{enc}}$：编码器中第 $i$ 个时间步的隐藏状态
    - $f(\cdot)$：相关性函数，常用的形式包括：
      - 点积：$e_{t,i} = h_t^{\text{dec}} \cdot h_i^{\text{enc}}$
      - 加法：$e_{t,i} = W[h_t^{\text{dec}}, h_i^{\text{enc}}] + b$
      - 缩放点积（用于 Transformer）

  - 归一化注意力权重：使用 softmax 函数将注意力分数归一化为概率分布，$\alpha_{t,i}$ 表示输入 $x_i$ 对生成 $y_t$ 的贡献权重

    $$
    \alpha_{t,i} = \frac{\exp(e_{t,i})}{\sum_{j=1}^T \exp(e_{t,j})}
    $$

  - 加权求和生成上下文向量：用注意力权重对输入序列的隐藏状态进行加权求和，生成上下文向量 $c_t$

    $$
    c_t = \sum_{i=1}^T \alpha_{t,i} h_i^{\text{enc}}
    $$

  - 生成输出：上下文向量 $c_t$ 和当前隐藏状态 $h_t^{\text{dec}}$ 结合，生成最终输出
    $$
    y_t = g(c_t, h_t^{\text{dec}})
    $$

- 自注意力（Self-Attention）

  - 缩放点积注意力（Scaled Dot-Product Attention）

  - 自注意力是 Transformer 的核心机制，用于输入序列中每个元素与其他所有元素的交互

  - 减少了对外部信息的依赖，更擅长捕捉数据或特征的内部相关性

  - 将输入单词转化成嵌入向量，根据嵌入向量得到 $Q,K,V$ 三个向量且 $Q=K=V$

  - 自注意力的权重矩阵计算：
    $$
    \text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right)V
    $$
    - $Q$：查询矩阵
    - $K$：键矩阵
    - $V$：值矩阵
    - $d_k$：键向量的维度，用于缩放点积

- 多头注意力（Multi-Head Attention）

  - 将输入分为多个头（子空间），并行计算注意力，每个头独立学习不同的特征表示
  - 这些 “头” 的输出随后被合并（通常是拼接后再通过一个线性层），以产生最终的输出表示
  - 公式：
    $$
    \text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, \text{head}_2, \dots, \text{head}_h)W^O
    $$
    - $\text{head}_i = \text{Attention}(QW_i^Q, KW_i^K, VW_i^V)$​

- Transformer 结构

  - 编码器结构：每个编码器由 N 层叠加的模块组成，每层包括

    - 多头自注意力机制：输入序列之间计算相关性，生成权重分布；

    - 前馈神经网络：每个时间步上的特征通过一个两层的全连接网络进行处理；

    - 残差连接与层归一化（Residual Connection & Layer Normalization）：保留梯度流，提高模型训练的稳定性
      $$
      \begin{align}
      Z' &= Z + \text{SubLayer}(Z)\\
      \text{LayerNorm}(Z') &= \gamma \cdot \frac{Z' - \mu}{\sigma} + \beta
      \end{align}
      $$

  - 解码器结构：解码器与编码器类似，但增加了以下模块

    - 掩码自注意力（Masked Multi-Head Self-Attention）：遮蔽未来的时间步，确保仅依赖已生成的部分；

      $$
      \text{MaskedAttention}(Q, K, V) = \text{softmax}\left(\frac{QK^\top}{\sqrt{d_k}} + M\right)V
      $$

    - 交叉注意力（Encoder-Decoder Attention）：将自己的隐藏状态作为查询 $Q$，编码器的输出作为键 $K$ 和值 $V$

  - 模型输入和位置编码

    - 输入嵌入：输入序列的每个词首先被嵌入到高维向量空间

    - 位置编码（Positional Encoding）：
      - Transformer 不使用循环结构，因此需要位置编码提供序列位置信息
      - 位置编码公式（正弦和余弦）：
        $$
        \begin{align}
        PE(pos, 2i) &= \sin\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right)\\
        PE(pos, 2i+1) &= \cos\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right)
        \end{align}
        $$

- GPT（Generative Pre-trained Transformer）

  - 单向 Transformer 编码器：

    - 输入序列仅能关注之前的上下文（从左到右），无法利用后续信息。

  - 预训练 - 微调范式：

    - 预训练阶段：在大规模无标签文本上进行自回归任务（如下一个词预测）

    - 微调阶段：在特定任务（如分类、生成）上微调模型

- BERT（Bidirectional Encoder Representations from Transformers）

  - 双向 Transformer 编码器：
    - 每个词同时关注其左侧和右侧的上下文
  - 预训练目标：
    - 掩码语言模型（Masked Language Model，MLM）：随机遮蔽部分词汇，通过上下文预测它们
    - 下一句预测（Next Sentence Prediction，NSP）：判断两句子是否为连续句子
  - Emebedding

    - Token Emebedding
    - Segment Embedding 用于区分输入的句子对，间接在语言模型中建模出前后句子所属的不同类型；
    - Position Embedding 则不同于 Transformer 中的三角函数，BERT 中直接设定处理序列的最大长度为 512，并对每个位置的 Embedding 进行学习

- T5（Text-to-Text Transfer Transformer）

  - 编码器 - 解码器结构：编码器处理输入，解码器生成输出文本
  - 任务统一化：例如，将分类任务表示为 "输入：文本，输出：标签"
  - 预训练目标：使用填空（Span Corruption）任务：随机遮蔽文本片段，模型学习恢复这些片段

- RoBERTa（A Robustly Optimized BERT Pretraining Approach）

  - 改进点：
    - 移除了下一句预测（NSP）任务，专注于 MLM
    - 使用更大的数据集和更长的训练时间
    - 动态生成掩码：每次训练时重新生成遮蔽词
    - 增加批量大小和序列长度
