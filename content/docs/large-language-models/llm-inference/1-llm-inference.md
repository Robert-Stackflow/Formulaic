---
title: LLM Inference
description: 介绍大语言模型推理系统的基本架构
---

- 需要讨论的问题
  - 为什么input比output 贵
  - 大模型的latency（延迟）和throughput（吞吐量）
- 参考资料
  - 书籍
    - Hands-On LLM Serving and Optimization
  - 帖子
    - [Understanding LLM Inference](https://read.theaimerge.com/p/understanding-llm-inference)
    - [The AI Engineer's Guide to Inference Engines and Frameworks](https://read.theaimerge.com/p/the-ai-engineers-guide-to-inference)
    - [The Complete Guide to Ollama: Local LLM Inference Made Simple (VIDEO)](https://read.theaimerge.com/p/the-complete-guide-to-ollama-local)
    - [How does vLLM serve LLMs efficiently at scale?](https://read.theaimerge.com/p/unpacking-vllm-distributed-inference)
    - [Understanding LLM Optimization Techniques - by Alex Razvant](https://read.theaimerge.com/p/understanding-llm-optimization-techniques)
  - 论文
    - [LLM Inference Serving: Survey of Recent Advances and Opportunities](https://arxiv.org/abs/2407.12391)

    - [Towards Efficient Generative Large Language Model Serving: A Survey from Algorithms to Systems](https://arxiv.org/abs/2312.15234)

    - [A Survey on Efficient Inference for Large Language Models](https://arxiv.org/abs/2404.14294)
    - [A Survey on Model Compression for Large Language Models](https://arxiv.org/abs/2308.07633)
    - [BlendServe: Optimizing Offline Inference for Auto-regressive Large Models with Resource-aware Batching](https://arxiv.org/abs/2411.16102)
    - [FLUX: Fast Software-based Communication Overlap On GPUs Through Kernel Fusion](https://arxiv.org/abs/2406.06858)
    - [BatchLLM: Optimizing Large Batched LLM Inference with Global Prefix Sharing and Throughput-oriented Token Batching](https://arxiv.org/abs/2412.03594)

### 大模型推理优化

- 大模型推理的核心挑战

  ![llm inference challenges](/img/llm/llm-inference-challenges.png)

  | 挑战类别           | 具体描述                                                         |
  | ------------------ | ---------------------------------------------------------------- |
  | 延迟与响应时间     | 实时应用（如聊天应用）需低延迟，需平衡模型复杂度与推理速度       |
  | 内存占用与模型规模 | 模型参数庞大（如千亿级），内存受限设备（如边缘设备）部署困难     |
  | 可扩展性与吞吐量   | 生产环境请求负载波动大，需通过并行计算、调度优化提升并发处理能力 |
  | 硬件兼容性与加速   | 需适配不同硬件架构，设计硬件感知的算法以充分利用硬件性能         |
  | 精度与效率权衡     | 优化推理效率可能导致精度损失，需平衡模型大小、计算复杂度与性能   |

- 关键瓶颈
  - 模型规模庞大：主流 LLMs 参数多为数十亿至万亿级（如 LLaMA - 2 - 70B 含 700 亿参数、GPT - 3 含 1750 亿参数），导致存储与计算成本极高，例如 70B 模型以 FP16 格式存储需 140GB 显存，需多块高端 GPU 支撑
  - 注意力操作复杂度高：自注意力机制计算复杂度与输入长度呈二次关系，输入文本越长，计算与内存开销增长越快
  - 自回归解码特性：逐 token 生成，每步需加载全部模型权重，内存访问成本高，且 KV Cache 随着序列长度增加，容易导致内存碎片化与访问模式不规则

- 大模型推理系统的四个关键优化点
  - KV Cache 和内存管理
    - 核心问题：KV cache 随上下文长度动态增长，成为推理阶段的主要显存瓶颈
    - 研究方向：
      - 非连续内存分配，避免大块连续显存需求
      - 分布式 KV 管理，在多 GPU / 多节点间拆分和迁移 KV
      - 智能缓存与淘汰策略，根据访问模式保留高价值 token
      - KV 压缩与近似表示，降低显存占用
    - 效果：支持更长上下文、更低内存开销，提升推理可扩展性
  - 大模型计算优化
    - 请求级优化：动态与连续批处理，最大限度地提高 GPU 利用率
    - 推理流程解耦：将推理拆分为 prefill 和 decode 阶段，两阶段可采用不同并行策略与硬件配置
    - 模型并行：张量并行、流水线并行、专家并行等，支撑大模型在多 GPU 上高效执行
    - 效果：提升吞吐、降低延迟、提高硬件利用率
  - 云端 LLM 部署
    - 优势：弹性扩展、按需付费、快速部署
    - 主要挑战：成本控制与资源浪费
    - 研究方向：
      - Spot 实例与抢占式资源管理
      - Serverless 与弹性推理框架
      - 智能调度与资源分配
      - 能耗与功率管理
      - 任务协同定位与 token 交付优化
    - 目标：在保证用户体验的同时降低云端推理成本
  - 新兴研究方向
    - RAG（检索增强生成）：
      - 问题：检索文档导致输入变长，计算和 KV 成本显著增加
      - 关注点：检索粒度、上下文裁剪、推理效率
    - MoE 推理：
      - 问题：专家间通信开销大、负载不均
      - 关注点：高效路由、负载均衡、通信优化
    - 伦理与可持续性：
      - 公平性、能耗、碳足迹等
      - 服务阶段的责任与长期影响

- 大模型推理优化的方法

  ```mermaid
  flowchart LR
      classDef main fill:#E6E6FA,stroke:#333,stroke-width:2px
      classDef category fill:#FFF2CC,stroke:#333,stroke-width:2px
      classDef subcategory fill:#D9EAD3,stroke:#333,stroke-width:2px
      classDef leaf fill:#D9EAD3,stroke:#333,stroke-width:1px

      A["LLM 服务体系分类（LLM Serving Taxonomy）"]:::main

      %% 第一分支：算法层创新
      B["算法层创新（Algorithmic Innovations）"]:::category
      A --> B

      C["解码算法（Decoding Algorithm）"]:::subcategory
      B --> C
      C --> C1["非自回归解码（Non-autoregressive Decoding）"]:::leaf
      C --> C2["推测式解码（Speculative Decoding）"]:::leaf
      C --> C3["提前退出（Early Exiting）"]:::leaf
      C --> C4["级联推理（Cascade Inference）"]:::leaf

      D["模型架构设计（Architecture Design）"]:::subcategory
      B --> D
      D --> D1["配置缩减（Config Downsizing）"]:::leaf
      D --> D2["Attention 简化（Attention Simplification）"]:::leaf
      D --> D3["循环单元（Recurrent Unit）"]:::leaf
      D --> D4["激活共享（Activation Sharing）"]:::leaf
      D --> D5["条件计算（Conditional Computing）"]:::leaf

      E["模型压缩（Model Compression）"]:::subcategory
      B --> E
      E --> E1["知识蒸馏（Knowledge Distillation）"]:::leaf
      E --> E2["网络剪枝（Network Pruning）"]:::leaf

      %% 第二分支：系统层优化
      F["系统层优化（System Optimizations）"]:::category
      A --> F

      G["低比特量化（Low-bit Quantization）"]:::subcategory
      F --> G

      H["并行计算（Parallel Computation）"]:::subcategory
      F --> H
      H --> H1["模型并行（Model Parallelism）"]:::leaf
      H --> H2["序列并行（Sequence Parallelism）"]:::leaf
      H --> H3["云端扩展（Cloud Scaling）"]:::leaf
      H --> H4["去中心化推理（Decentralized Inference）"]:::leaf

      I["内存管理（Memory Management）"]:::subcategory
      F --> I

      J["请求调度（Request Scheduling）"]:::subcategory
      F --> J

      K["Kernel 优化（Kernel Optimizations）"]:::subcategory
      F --> K
      K --> K1["Kernel 融合（Kernel Fusion）"]:::leaf
      K --> K2["定制 Attention（Tailored Attention）"]:::leaf
      K --> K3["可变序列长度（Variable Sequence Length）"]:::leaf
      K --> K4["自动编译（Automatic Compilation）"]:::leaf
  ```

### 大模型推理流程

- 大语言模型（LLM）的推理过程以自回归方式生成输出 token，即在给定初始输入序列 $P$（称为 Prompt）的条件下逐 token 生成结果
- 整个推理流程可以划分为两个主要阶段：预填充阶段（prefill phase）和解码阶段（decoding phase）
- 预填充阶段负责为高效生成做好准备，而解码阶段则执行后续 token 的逐步生成

- 预填充阶段（Prefill Phase）
  - 首先，对输入 Prompt 进行分词和编码表示

  - 编码后的序列依次通过 Transformer 的各个层，在此过程中，每一层都会为每个 token 生成对应的键和值（Key-Value 对）

  - 这些由 Transformer 各层生成的键值对会被缓存起来，称为 KV cache

  - KV cache 的作用是在后续生成新 token 时，避免重复计算历史 token 的 $K$ 和 $V$，从而显著提升推理效率

  - 设输入 Prompt 为

    $$
    P = [p_1, p_2, \dots, p_n]
    $$

  - 在预填充阶段完成前向计算后，模型已经为所有输入 token 生成并缓存了对应的 KV 对：
    $$
    [(k_1, v_1), (k_2, v_2), \dots, (k_n, v_n)]
    $$

- 解码阶段（Decoding Phase）
  - 解码阶段采用自回归方式生成新 token

  - 模型基于已有的 Prompt 和 KV cache 预测下一个 token $p_{n+1}$，并将其追加到原始输入序列中

  - 同时，新生成 token 对应的 $(k_{n+1}, v_{n+1})$ 也会被加入 KV cache

  - 需要注意的是，随着生成 token 数量的增加，KV cache 的大小会随 token 数量线性增长，这也是推理阶段显存开销的主要来源之一

- 伪代码

  ```text
  Algorithm 1 Autoregressive LLM Inference

  Input:
  P: encoded input sequence [p1, p2, …, pn]

  Output:
  X: generated new sequence []

  1: Forward Pass([p1, p2, …, pn])
  2: Store the KV cache:
     [(k1, v1), (k2, v2), …, (kn, vn)]
  3: for i from 1 to M do
  4:     Predict the next token p_{n+i} using the KV cache
  5:     Store (k_{n+i}, v_{n+i}) to the KV cache
  6:     X ← X ∪ {p_{n+i}}
  7:     if p_{n+i} is EOS token or len(X) > max length then
  8:         break
  ```

### 大模型推理效率分析

#### 推理效率指标

- 在生成过程中，GPU 内存随着时间的变化曲线

![gpu memory curve by time](/img/llm/gpu-memory-curve-by-time.png)

- 延迟（Latency）
  - First Token Latency（TTFT, Time To First Token）：从输入请求到生成第一个 token 的时间，本质上由 prefill 决定
  - Per-output Token Latency（TPOT, Time Per Output Token）：解码阶段生成每个 token 的平均时间
  - Latency：从输入到最后一个 token 输出的总时间
  - Latency ≈ TTFT + TPOT × 输出 token 数
  - Latency 是“面向用户体验”的指标，即首个 token 多久能出来？一次对话要等多久？
- 内存（Memory）
  - Model Size：存储模型权重所需的内存
  - KV Cache Size：存储 KV cache 所需的内存
  - Peak Memory：推理过程中出现的峰值内存占用，通常近似等于模型权重与 KV Cache 占用内存之和
- 吞吐量（Throughput）
  - Token Throughput（Tokens Per Second，TPS）：每秒生成的 token 数量，TPS = 总输出 token 数 / Latency
  - Request Throughput：每秒完成的推理请求数量
  - Throughput 描述的是单位时间内服务的吞吐能力，关注资源利用率
  - Throughput 通常通过 batching、并行、调度提升，而此时，单个请求的 latency 可能因此变差
- Batching 是 latency 和 throughput 分叉的根源
  - Naive / static batching：提升 throughput，但是短请求被最长请求拖慢，拉高 latency
  - Continuous batching：动态合并请求，提高 GPU 利用率，在多数场景下同时改善 throughput，并控制 latency，是当前 LLM serving 的核心技术之一（vLLM、FastGen 等）
  - 但即便如此 Continuous batching 仍然是以系统视角优化 throughput，是否牺牲 latency，取决于调度策略与负载情况
- 使用什么指标
  - 面向用户交互（聊天、Copilot、Agent）：优先看 latency，尤其是 TTFT
  - 面向批处理、离线生成、API 服务：优先看 throughput
  - 真正的工程目标是：在可接受的 latency 下，最大化 throughput

#### 硬件约束

从工程视角看，大模型推理性能最终会被三个硬件因素共同约束：

- 显存（Memory）：能不能跑
  - 显存是推理的第一道硬门槛，在推理过程中，GPU 显存主要承载三类数据：
    - 模型权重（Model Weights）
    - KV Cache（随 prompt + completion 增长）
    - 中间激活与临时张量（通常可忽略在量级上）
  - 因此，是否能在单卡或少量 GPU上完成推理，取决于模型参数量 × 精度、Prompt 长度 + Completion 长度 × Batch Size
  - 显存不足时，系统只能拆模型（模型并行）或 Offload 到 CPU / NVMe，而这会直接把问题引向第二个瓶颈：通信

- 通信（Communication）：跑不跑得满
  - 在当前的大模型推理中，通信能力已经成为制约 GPU 利用率的核心瓶颈

  - 通信并不是一个单一概念，而是分为三个层级

  - 卡内通信（On-device）
    - 这是最频繁、最基础的通信形式：数据从 HBM 读入 SRAM / Register，在计算单元中执行矩阵运算，结果写回 HBM
    - 理论上，这是带宽最高、延迟最低的一层，但随着算力指数级增长，HBM 带宽已经开始跟不上计算能力，导致算子变成 memory-bound，这也是 FlashAttention、Kernel Fusion 的直接动机

  - 节点内卡间通信（Intra-node）
    - 当单张 GPU 放不下模型时，就必须在同一节点内多卡协同，如张量并行（TP）、流水线并行（PP）
    - 此时，GPU 之间需要频繁交换激活值或中间结果
    - 即便如此，NVLink 仍然远慢于 GPU 内部计算速度，并行粒度一旦不合适，就会出现 GPU 等数据的情况

  - 跨节点通信（Inter-node）
    - 当模型或 KV Cache 大到需要跨节点部署时，通信瓶颈会被进一步放大
    - 相比卡内通信，这里的延迟已经是数量级差异，因此多节点推理几乎一定会显著拉高 TTFT，Decoding 阶段的小粒度通信会极度低效，这也是为什么多节点更适合训练，而非低延迟推理

  - 不同通信层级的带宽与延迟

    | 场景                 | 技术组合                      | 带宽与延迟特性                          |
    | -------------------- | ----------------------------- | --------------------------------------- |
    | 单节点多 GPU         | NVLink 全互连 + PCIe Gen5 x16 | NVLink 带宽 900GB/s，延迟 <500ns        |
    | 多节点 GPU 集群      | InfiniBand + GPUDirect RDMA   | 网络带宽 400Gbps，延迟 1-3μs            |
    | 混合拓扑（多机多卡） | PCIe Switch + 光互连扩展      | 短距离扩展带宽 ≈63GB/s（PCIe Gen5 x16） |

- 计算（Compute）：跑得有多快

- GPU 利用率
  - GPU 的理论 FLOPs 几乎永远是“上限”，而不是“实际值”，现实中 GPU 利用率受以下因素限制：
    - 通信等待（HBM / NVLink / 网络）

    - Kernel launch 开销

    - batch 不足导致并行度不够

    - Prefill / Decode 阶段计算模式差异

  - 因此，即使一张 GPU 的计算性能是 148 TFLOPs，实际推理中能用到 40%–60% 已经算很好，Decoding 阶段通常更低
  - 这也是为什么通信能力的提升速度，已经明显落后于计算能力的提升速度

- 在固定硬件算力的前提下，要估计 TTFT 和 Throughput，本质上就是算清 Prefilling 和 Decoding 两个阶段各自需要多少 FLOPs
  - Prefilling 更偏计算密集，Decoding 更偏通信 + 调度密集
  - Prefilling 阶段
    - Prefilling 需要对 prompt 的所有 token 做一次完整前向传播
    - Prefilling_FLOPs = 2 × Batch_size × Prompt_size × Parameters
    - 对应指标：TTFT ≈ Prefilling_FLOPs /（GPU_FLOPs × 利用率）
    - 这解释了为什么 Prompt 越长，首 token 越慢；TTFT 与 batch size 成正比
  - Decoding 阶段
    - 每生成一个新 token，只需要计算一次新的 query，并与 KV Cache 交互
    - Decoding_FLOPs_Per_Step = 2 × Batch_size × Parameters
    - 总 decoding 计算量：Decoding_FLOPs = 2 × Batch_size × Completion_size × Parameters
    - 对应吞吐量上限：Throughput ≈ GPU_FLOPs / Decoding_FLOPs_Per_Step
    - 这也解释了TPS 主要由模型规模和 GPU 算力决定，与 prompt 长度关系较小（因为 KV cache 已就绪）

#### 举例说明

- 假设这样一个私有化部署场景：
  - 模型：Qwen2.5-32B（Dense）
  - 激活参数量：32B
  - 精度：BF16
  - GPU：单张 H100 SXM，理论算力：148 TFLOPS（BF16）
  - Batch size：1
  - Prompt length：1024 tokens
  - Output length：1024 tokens
  - 推理方式：标准自回归 + KV Cache
  - GPU 利用率假设：60%
- 在这个配置下：
  - 显存：
    - 32B 参数 × 2 bytes ≈ 64GB
    - KV Cache + 中间激活值 ≈ 10~20GB
    - 单卡 H100 80GB 勉强可放下 → 不需要跨卡通信
  - 通信：
    - 仅发生在卡内（HBM ↔ SRAM）
    - 不涉及 NVLink / RDMA → 通信瓶颈主要是 memory-bound，而不是网络
  - 计算：
    - Prefilling 阶段是大矩阵乘（算力密集）
    - Decoding 阶段是小 GEMM + attention（更容易被通信拖慢）
- Prefilling FLOPs 估计：$Prefilling_{FLOPs} = 2 \times 1 \times 1024 \times 32\text{B} = 65.5 \text{ TFLOPs}$
- 理论 TTFT（不考虑利用率）：$TTFT_{theoretical} = \frac{Prefilling_FLOPs}{GPU_FLOPS} = \frac{65.5}{148} \approx 0.44 \text{ s}$​，即理论 TTFT ≈ 440 ms
- 假设 GPU 实际利用率约 60%：$TTFT_{actual} \approx \frac{0.44}{0.6} \approx 0.73 \text{ s}$​，则单请求输入 1024 tokens，TTFT 大约在 700~800 ms 这个量级
- 单 token 的 Decoding FLOPs：$Decoding_{FLOPs_{per\ token}} = 2 \times Batch_size \times Parameters = 2 \times 1 \times 32\text{B} = 0.064 \text{ TFLOPs}$
- 理论 TPS（单请求）：$TPS_{theoretical} = \frac{GPU_FLOPS}{Decoding_FLOPs_{per\ token}}= \frac{148}{0.064} \approx 2312 \text{ token/s}$
- 考虑 GPU 利用率：$TPS_{actual} \approx 2312 \times 0.6 \approx 1380 \text{ token/s}$​​，单请求 Decoding 阶段的 TPS 大致在 1200~1500 token/s
- 生成每个 token 的时间：$TPOT \approx \frac{1}{TPS} \approx \frac{1}{1380} \approx 0.72 \text{ ms}$
- 生成 1024 个 token：$Latency = TTFT + TPOT \times Output_{tokens} \approx 730\text{ ms} + 1024 \times 0.72\text{ ms}= 730\text{ ms} + 737\text{ ms}\approx 1.47 \text{ s}$

### 解码算法改进

![decoding](/img/llm/decoding.png)

- 非自回归解码（Non-autoregressive Decoding）旨在突破大语言模型默认采用的自回归解码（Autoregressive Decoding）所带来的严格串行依赖
  - 该类方法通过削弱输出 token 之间的条件依赖关系，使模型能够在一次解码步骤中并行生成多个位置的 token，从而显著降低解码时延
  - 该思路最早用于机器翻译加速，通过假设一定程度的条件独立来换取并行性
  - 由于直接并行生成会引入明显的质量退化，后续研究提出了半自回归解码（Semi-autoregressive Decoding），通过显式建模部分输出依赖或采用迭代式修正机制来逐步逼近自回归模型的生成质量
  - 块级并行解码（Blockwise Parallel Decoding）则在原模型中插入额外的前馈层，对多个未来位置同时进行预测，并回退到由原模型验证通过的最长前缀
  - 然而，这类方法通常需要重新训练模型或修改原有网络结构，且由于难以充分建模 token 间的复杂依赖关系，其生成质量整体仍不及自回归解码，因此在大语言模型推理中尚未得到广泛应用
- 推测解码（Speculative Decoding）通过引入推测执行机制来缓解自回归解码的串行瓶颈，而不改变最终生成结果
  - 其基本流程是先利用一个轻量级的草稿模型（Draft Model）快速生成多个候选 token，再由原始大语言模型对这些候选进行并行验证；一旦发现预测不一致，系统立即回退到安全路径继续解码
  - 由于所有输出均由原模型确认，该方法在理论上保证与标准自回归解码完全一致的生成结果
  - 近年来提出的树状推测解码（Tree-based Speculative Decoding）通过构造多分支候选结构，进一步提升了验证阶段的并行度，显著提高了推理吞吐率
  - 推测解码的核心挑战在于如何以足够低的计算成本生成高质量候选，以及如何高效实现大模型侧的并行验证
- 提前退出（Early Exiting）利用大语言模型深层结构中的层级冗余，在中间层即尝试输出预测结果以减少不必要的计算开销
  - 该类方法基于这样一种观察：对于部分输入，请求的目标分布在模型的早期层已经具备较高置信度，因此无需执行完整的前向传播
  - 通过在不同层引入内部分类器并设定置信度判据，模型可以根据输入难度自适应地提前终止计算，因此该方向也常被归类为自适应计算（Adaptive Computation）
  - 部分工作将提前退出机制与推测解码相结合，利用大模型的子网络构造自草稿模型以进一步减少解码成本
  - 然而，由于中间层表征信息有限，这类方法在生成任务中往往难以稳定地产生高质量输出
- 级联推理（Cascade Inference）从系统层面出发，利用不同规模模型在能力与成本上的差异来降低整体推理开销
  - 其核心思想是根据输入请求的难度或不确定性，在多个模型之间进行自适应调度：简单请求由小模型快速处理，复杂请求再交由大模型完成
  - 该思路已在判别任务和生成任务中被证明能够有效降低平均响应时间和推理成本，并可与模型复用、请求缓存等机制协同优化
  - 然而，级联推理的关键难点在于如何准确评估请求难度并设计可靠的调度策略，以避免错误分流对输出质量造成影响

- 总结
  - Non-autoregressive decoding：用并行换速度，但质量难保

  - Speculative decoding：最成功的并行解码路线，质量有保证

  - Early exiting：按难度裁剪计算，但中间层信息有限

  - Cascade inference：系统级“分流”，难点在调度准确性

### 架构设计改进

- 架构设计方向通过重新设计模型结构，在模型规模、性能与推理效率之间取得更优平衡，为大语言模型的高效推理提供了新的可能
- 相较于单纯依赖系统层优化，该方向从模型本身出发，尝试减少不必要的计算与内存访问开销
- 配置缩减（Configuration Downsizing）
  - 即通过减小模型深度、共享权重或压缩词表等方式降低推理成本，例如使用浅层编码器或解码器结构
  - 然而，这类方法本质上以削减模型容量为代价，通常会对下游任务性能造成不可避免的影响
- 注意力机制简化（Attention Simplification）
  - 标准自注意力的计算与存储复杂度为 $O(L^2)$，在长上下文推理中成为主要瓶颈
  - 大量工作提出通过稀疏化、核函数化或低秩分解等方式构造近似注意力，从而降低复杂度
  - 近期研究进一步结合多种思想，通过滑动窗口注意力（Sliding Window Attention）、哈希注意力（Hash-based Attention）、膨胀注意力（Dilated Attention）或稀疏注意力（Scissorhands）等手段，减少上下文长度或 KV cache 的规模
  - 此外，一类方法通过上下文压缩（Context Compression）将历史上下文表示为少量“软 token”，或依据重要性直接丢弃、重写不关键的 token（也称语义压缩）
  - 尽管这些方法显著降低了推理开销，但在复杂真实场景中，由于上下文信息不完整，仍可能带来信息损失和生成质量下降

- 激活共享（Activation Sharing）通过复用中间层计算结果进一步减少推理成本
  - 相关研究观察到不同层之间的注意力分布具有高度相似性，因此可以共享或复用注意力矩阵
  - 多查询注意力（Multi-Query Attention, MQA）让多个注意力头共享同一组键和值，从而显著降低增量推理阶段的内存带宽需求
  - 分组查询注意力（Group-Query Attention, GQA）在此基础上放宽共享约束，在效率与表达能力之间取得折中
  - 多头潜变量注意力（Multi-Head Latent Attention, MLA）则通过低秩潜表示联合压缩键和值
  - 这类方法已被多种主流大模型采用，并在保持模型性能的同时显著降低推理内存开销

- 条件计算（Conditional Computing）以稀疏激活的专家混合模型（Mixture of Experts, MoE）为代表
  - 通过路由机制仅激活与当前输入相关的少量专家网络，从而在扩大模型容量的同时控制计算成本
  - 相比于全模型激活，MoE 在推理阶段具有明显的计算与存储优势
  - 随着模型规模持续扩大，MoE 被认为是实现高效扩展的重要方向，但其动态路由特性也对分布式通信调度与 GPU kernel 实现提出了更高要求

- 最后，一些工作尝试用循环单元（Recurrent Unit）替代 Transformer 的注意力模块，以实现线性时间和空间复杂度的推理
  - 例如 RWKV 和 RetNet 结合线性注意力或状态空间模型，通过递归状态更新建模 token 间依赖，从根本上消除 $O(L^2)$ 的注意力瓶颈
  - 这类模型在推理效率方面展现出显著优势，并在一定程度上保持了并行训练能力
  - 然而，循环结构能否在长上下文理解和复杂生成任务中全面替代 Transformer，目前仍是一个开放问题

### 模型压缩

- 模型压缩旨在通过构建更加紧凑的模型表示，降低大语言模型在推理阶段的计算与存储开销，同时尽量保持原有性能表现
- 相较于系统层优化，该方向直接作用于模型参数本身，是推理加速的重要补充
- 知识蒸馏（Knowledge Distillation）是最为经典的一类方法
  - 其核心思想是利用大模型（教师模型）产生的监督信号训练参数规模更小的学生模型
  - 早期研究主要集中于白盒蒸馏，即在训练过程中可直接访问教师模型的内部参数与中间表示
  - 随着 API 形式的大模型服务（如 ChatGPT）的兴起，黑盒蒸馏逐渐受到关注，这类方法仅依赖教师模型的输出结果进行训练
  - 代表性工作如 Alpaca、Vicuna、WizardLM 等，通过高质量指令数据构建小模型，在多项下游任务上展现出接近甚至部分场景可比拟超大模型的性能
  - 尽管蒸馏模型在参数规模和推理成本上具有明显优势，其效果仍高度依赖教师模型能力以及蒸馏数据的覆盖范围

- 网络剪枝（Network Pruning）通过移除冗余参数或结构以压缩模型规模
  - 相较于早期针对小模型的剪枝方法，直接将其应用于大语言模型面临两大挑战：一是高昂的再训练成本，二是剪枝是否能够在实际系统中转化为可观的推理加速
  - 近期研究更多关注结构化剪枝，即移除完整的注意力头、MLP 通道或子模块，从而更容易获得 GPU 层面的加速效果
  - 例如 Deja Vu 在不修改预训练模型的前提下，基于上下文稀疏性假设裁剪部分注意力头和前馈网络参数

- 非结构化剪枝（Unstructured Pruning）
  - 相关方法通常可实现 50%–60% 的参数稀疏度，并可进一步推广至半结构化 N:M 稀疏模式（如 2:4、4:8），从而利用 NVIDIA 稀疏张量核心实现显著推理加速
  - 在此基础上，一些方法通过低秩分解将权重近似为“小型稠密矩阵 + 稀疏矩阵”的组合，以在压缩率和精度之间取得更优平衡
  - Flash-LLM 通过为非结构化稀疏矩阵乘法提供高效实现，降低了稀疏推理的工程门槛
  - 进一步地，PowerInfer 观察到剪枝后神经元访问具有明显偏斜性，提出 GPU–CPU 混合推理框架，使不同设备分别负责不同子集的神经元计算，从系统层面放大剪枝带来的收益

- 总体而言，模型压缩通过蒸馏与剪枝等手段有效降低了推理资源需求，但其实际收益高度依赖于底层硬件与系统实现方式
- 如何在保证生成质量的前提下，将参数压缩稳定地转化为端到端推理加速，仍是该方向持续研究的关键问题

### 量化

- 系统层优化关注在不改变大语言模型计算语义的前提下，通过改进底层系统与推理框架来提升整体推理效率

- 与模型结构或参数层面的改动不同，该方向主要从数值表示、内存访问和硬件利用角度出发，使现有模型在真实部署环境中运行得更快、更省资源

- 低比特量化通过使用少于 32 位的数值表示模型权重和激活，从而显著降低显存占用并加速推理计算

- 目前大语言模型量化方法主要分为两类：训练后量化（Post-Training Quantization，PTQ）和量化感知训练（Quantization-Aware Training，QAT）

- 训练后量化是在不重新训练模型的情况下，直接降低权重甚至激活的数值精度
  - 现有方法通常将权重量化到 INT8 或 INT4，并在部分方案中保留激活为 FP16 或 BF16，例如权重量化激活保持高精度的 W8A16、W4A16（如 GPTQ），以及权重与激活同时量化的 W8A8（如 SmoothQuant）和 W4A4
  - 为了高效执行低精度计算，这类方法往往依赖定制 CUDA 内核或编译器级优化

  - 硬件的发展为低比特量化提供了重要支撑。NVIDIA 在 Turing 与 Ampere 架构中引入了 INT8 与 INT4 张量核心，而在最新的 Hopper 架构中虽然取消了 INT4 支持，但引入了 FP8 张量核心，在数值稳定性与吞吐率之间取得更优折中
  - 例如 H100 GPU 在 FP8 精度下的峰值算力可达 FP32 的数十倍。配合硬件特性，现有量化方法采用了包括均匀量化（如最近邻舍入）与非均匀量化在内的多种量化函数，以减轻精度损失

- 量化感知训练
  - 在模型训练阶段显式引入量化算子，使模型参数逐步适应低精度表示，从而在推理时获得更好的精度保持能力
  - 相较 PTQ，QAT 往往能够在更低比特数下维持性能，但训练成本更高，对训练系统的要求也更严格
- 需要注意的是，低精度并不必然带来更快的推理速度
  - 在实际系统中，由于内核实现复杂度、访存模式变化以及算子融合受限，部分低比特量化方案在端到端推理延迟上可能不及 FP16
  - 与此同时，已有研究表明，大语言模型在低精度下的性能退化受到缩放定律（scaling law）的显著影响，模型规模、量化粒度与任务类型都会影响最终效果
- 除了直接作用于模型权重和激活，量化技术也被扩展到推理系统的其他关键组件中
  - 例如，在上下文压缩与 KV 缓存管理中引入量化以降低缓存占用，或在参数高效微调方法中结合量化（如 QLoRA），进一步减少显存需求
  - 这些工作表明，低比特量化不仅是模型压缩手段，也是系统层推理优化的重要工具

### KV Cache 和内存管理

- KV Cache 的高效管理
  - 早期系统通常采用连续内存来存储 KV cache，但由于请求的生成长度和生命周期在推理开始前未知，这种方式容易导致显著的预分配浪费和内存碎片化

  - PagedAttention 提出将 KV cache 组织为非连续内存页，使其能够随 token 的生成动态扩展和回收，从而显著提升显存利用率，并降低内存浪费与碎片化，已被 vLLM、TGI 和 TensorRT-LLM 等主流 LLM 服务框架采用，成为事实上的工业标准

  - 然而，非连续内存也带来了新的问题，例如需要重写注意力算子以适配分页布局，并引入额外的软件复杂度和运行时开销

  - 为降低系统侵入性，vAttention 选择在虚拟地址空间中保持 KV cache 的连续性，并直接利用操作系统已有的按需分页机制

  - 通过将内存分配与计算过程重叠、提前分配资源以及延迟回收内存，vAttention 在减少实现复杂度的同时，隐藏了内存管理带来的性能开销

  - 除系统层面的内存管理外，一部分工作从应用层入手提升 KV cache 的利用效率
    - Prompt Cache 通过规范化 Prompt 的结构，使得系统提示等固定模块对应的注意力状态可以在不同请求之间复用，从而减少重复的预填充计算
    - AttentionStore 则重点关注 ChatGPT 等应用的多轮对话场景，解决用户会话不活跃时 LLM 引擎丢弃 KV 缓存、会话活跃时重新计算导致额外预填充成本的问题。AttentionStore 利用 CPU 内存/磁盘保存非活跃会话的 KV cache，并通过计算与加载重叠、智能的预取和淘汰策略，降低多轮交互中的额外 prefill 开销

- 长上下文
  - 随着 LLM 应用对长上下文需求的增长，KV Cache 的大小会随 token 数量增加而扩大，这使得 KV cache 的规模往往超过单张 GPU 的显存容量，进一步加剧了内存压力

  - 针对这一问题，一类方法通过分布式执行来扩展可用上下文长度——即序列并行（SP）
    - Ring Attention 将注意力和前馈计算按块划分，并分布到多个设备上执行，同时重叠 KV cache 的通信与计算，使得最大上下文长度能够随设备数量线性扩展
    - Infinite-LLM 采用类似的思路，将 KV cache 拆分为更小的 rBlocks 等小型可管理单元，在 GPU 和 CPU 之间通过动态内存共享与协调机制进行管理——内存卸载

  - 另一类方法关注跨请求和单请求内部的统一优化
    - MemServe 引入分布式内存池 MemPool，对整个集群范围内的 KV cache 进行集中管理，并结合全局调度策略，最大化 KV cache 的复用率，统一处理 LLM 服务的请求间和请求内优化
    - 当上下文长度超过 GPU 内存上限时，多数系统需要将 KV cache 卸载到 CPU，而 InfiniGen 通过预演注意力计算来预测关键的 KV Cache 条目，仅将最重要的部分预取到 GPU，从而显著减少数据传输成本——内存卸载
    - LoongServe 则提出弹性序列并行（Elastic Sequence Parallelism，ESP）机制，动态适应请求间及请求不同阶段（预填充和解码）的资源使用差异，减少长序列服务时的 KV 缓存迁移开销和碎片化

- 压缩 KV Cache
  - 除了内存管理和分布式执行，压缩 KV cache 也是降低内存占用的重要方向

  - FlexGen 在内存聚合和通信调度的基础上，采用细粒度的分组量化方法，将权重和 KV 缓存压缩到 4 位，减少内存占用

  - KIVI 分析了 KV Cache 中元素的分布特性，并对 Key 和 Value 采用不同粒度的非对称量化策略（Key cache 按通道（channel）进行量化，Value cache 按 token 进行量化），从而最小化量化误差，在压缩率和误差之间取得更优平衡

  - Gear 通过对幅值相近的大多数 KV cache 条目进行量化，并利用低秩矩阵近似量化误差，实现了近乎无损的高压缩率 KV cache 压缩

  - MiniCache 观察到，在模型中后层，相邻层的 KV cache 状态具有高度相似性。基于这一发现，MiniCache 将这些高度相似的状态合并为共享表示以减少冗余，同时识别并保留对模型性能至关重要的差异状态，从而在显著降低内存占用的同时避免性能退化

### 请求调度

- 除了内存与 KV cache 管理之外，大语言模型的计算过程本身也带来了显著的系统层挑战
- 由于自回归生成过程中 token 之间存在严格的顺序依赖关系，对于单个请求，LLM 在任意时刻只能生成一个 token
- 因此，相比高度并行化的训练任务，LLM 推理在为大规模并行设计的 GPU 硬件上往往资源利用率较低

- 请求批处理
  - 当单个请求无法充分利用 GPU 资源时，将多个推理请求合并进行批处理是一种直观的优化方式

  - 然而，不同 Prompt 的生成长度往往差异很大，当它们被放入同一个 batch 时，较短的请求需要等待较长请求完成，导致计算资源浪费

  - 预测生成长度
    - Response Length Perception and Sequence Scheduling 提出在实际生成响应之前，先让 LLM 预测生成长度，并将预测长度相近的请求进行批处理，以减少由长度不匹配带来的浪费
    - 类似地，$S^3$ 通过微调 DistilBERT 模型来预测序列长度；当预测错误导致序列超出分配内存时，系统会抢占该序列并重新训练预测器，使其从错误中学习如何正确预测序列长度

  - 然而，基于预测生成长度的批处理方法对预测器的准确性依赖较强，实际部署中存在一定局限性

  - 连续批处理（continuous batching）
    - Orca 提出了一种连续批处理（continuous batching）机制，其调度粒度从请求级别降低到 token 级别
    - 在当前 batch 中某个请求完成后，立即将新的请求调度到当前批处理中
    - 连续批处理已成为 LLM 推理框架的工业标准，并被 TGI、vLLM 和 TensorRT-LLM 等系统采用

  - 在连续批处理的基础上，DeepSpeed-FastGen 提出了动态 SplitFuse 机制，将长 Prompt 拆分为多个小块，跨多个迭代调度执行；同时将短 Prompt 融合在一起，以使推理始终运行在高吞吐量区间（在该区间中，任务执行受 GPU 计算能力而非内存带宽限制）

  - Sarathi-Serve 也探索了类似思路，其将 prefill 请求拆分为更小的块，并与正在进行的 decode 请求一起调度，且不会引入停滞（stall-free batching）；该机制允许新请求在不中断当前解码过程的情况下加入运行中的 batch，从而将流水线气泡降至最低

- 推理解耦
  - 如第二节所述，LLM 推理过程包含预填充阶段（prefill）和解码阶段（decode）

  - 现有多数 LLM 服务系统将这两个阶段集中部署，并在所有用户和请求之间对 prefill 与 decode 计算统一进行批处理

  - 然而，这两个阶段在计算模式、延迟敏感性和资源需求方面具有显著差异，当它们被混合调度时，往往会相互干扰

  - TetriInfer 将 prefill 和 decode 实例解耦，使两个阶段可以独立运行，从而避免批量型 prefill 作业对延迟敏感的 decode 任务的干扰；该系统采用两级调度算法，并结合对资源使用情况的预测，避免在 decode 阶段出现调度热点，从而实现高效的资源分配并降低竞争

  - Splitwise 系统性地分析了在不同代 GPU（异构硬件）上，prefill 与 decode 阶段在执行特性和资源利用模式上的差异；基于这一分析，Splitwise 提出将两个阶段部署在不同机器上，并针对各自阶段选用专用硬件，以提升利用率、降低硬件拥有成本并减少能耗

  - DistServe 设计了一种调度与放置算法，用于协调 prefill 和 decode 阶段的计算任务
    - 在具备高速跨节点网络的集群中，DistServe 可分别为 prefill 与 decode 实例独立优化并行配置，以最大化单 GPU 的有效吞吐（goodput）
    - 而在跨节点带宽受限的集群中，它则保证同一阶段的 prefill 与 decode 实例共置于单节点内，并在节点内部优化并行策略

- 模型并行
  - 大语言模型的参数规模可达数千亿级别，必须依赖多 GPU 的模型并行执行

  - Pope 等人构建了一个推理效率的分析模型，可根据具体应用需求，在 TPU v4 切片上选择最优的多维划分策略

  - HeteGen 提出了一种面向 CPU 与 GPU 的异构并行计算框架，通过异构并行算法在混合并行体系中分配计算任务，并利用异步重叠来缓解 CPU 与 GPU 之间的 I/O 瓶颈

  - ExeGPT 能够在给定延迟约束下，联合优化 batch size 和张量并行度，从而最大化推理吞吐；该系统利用输入与输出序列长度的分布特性进行资源分配，并确定最优的并行配置

  - Helix 面向异构 GPU 和多种网络连接类型，对 LLM 进行跨设备划分；其将模型划分问题形式化为一个带权有向图上的最大流问题，其中节点表示 GPU 实例，边的容量同时刻画 GPU 性能与网络异构性，从而在整体上实现高效的模型并行执行

### Kernel 优化

- 这一类方法聚焦在内核级（kernel-level）的推理优化，目标是把语言模型推理流水线中最耗时的算子做到“极限快”，充分榨干硬件性能
- 由于推理阶段不需要反向传播，相比训练阶段有更多自由度，因此可以进行更激进的内核合并与算子重排
- 内核融合（kernel fusion）
  - 通过把多个原本独立的算子合并成一个 GPU kernel，减少 kernel 启动开销和中间结果的显存访问
  - 在 Transformer 推理中，常见做法包括
    - 将形状一致的多次线性变换（如 Q/K/V 投影）合并执行
    - 或把加偏置（Add Bias）与残差连接、层归一化、激活函数等非 GEMM 操作融合
  - FasterTransformer、TurboTransformers、LightSeq 等推理引擎，以及 Welder 等编译器系统，都在这一方向上取得了显著收益
  - 其中，融合多头注意力（fused multi-head attention） 是研究最充分、收益也最大的代表方法

- 面向注意力的定制内核（tailored attention kernels）
  - 由于自回归生成的特殊性，注意力计算通常分为两种场景
    - 一是首轮的上下文阶段（prefill / prompt phase），需要并行处理整段输入
    - 二是后续的生成阶段（decode phase），每一步只生成一个 token，并依赖缓存的 KV
  - 针对前者，xFormers 等工作利用在线 softmax 技术，将整个注意力计算高效地映射到 GPU 上
  - 针对后者，优化重点转向最大化线程占用率、减少对高带宽显存（HBM）的访问，例如通过并行 batch 维度和 head 维度，或将 KV cache 分块处理
  - FlashDecoding 首次系统性地并行化 KV cache，而 FlashDecoding++ 进一步消除了分块 softmax 的同步开销
  - 更新的 FlashInfer 则通过块稀疏 KV cache、可定制注意力模板和 CUDAGraph，提高了复杂推理负载下的 GPU 利用率

- 变长序列（variable sequence length）
  - 在实际服务中，不同请求的输入长度和输出长度差异很大，简单 padding 会浪费大量算力
  - 为此，研究者提出了序列打包（packing）、不规则张量（ragged tensor）、以及更细粒度的分桶或分块计算等方法，以减少无效计算和内存浪费
  - 但由于上下文阶段与生成阶段往往混合执行，这类优化也给内存管理和请求调度带来了新的系统挑战

- 自动编译（automatic compilation）
  - 尽管现有推理系统大量依赖 cuBLAS、cuDNN、CUTLASS 等高度优化的厂商库，并辅以手写 attention kernel，但自动化编译仍然是重要趋势
  - TVM、MLIR、Triton、TorchInductor 等编译框架可以自动搜索更高效的算子实现，并显著降低模型迁移到不同硬件平台（如 CPU、移动端、非 NVIDIA GPU）的成本

### MoE 优化

- MoE 推理优化的研究主要围绕三类核心问题展开：
  - 通信效率（减少 all-to-all 开销）

  - 内存管理（专家的动态加载与卸载）

  - 负载均衡与资源利用率

- MoE 通信（MoE Communication）
  - 在分布式 MoE 推理中，一个核心瓶颈是 all-to-all 通信：token 需要被发送到其对应的专家所在设备进行处理，随后再将结果返回到原始设备
  - Lina 针对这一瓶颈提出了一种系统方案，该系统在推理过程中根据专家的受欢迎程度（expert popularity）动态调度资源，在不同设备之间平衡 all-to-all 通信的传输规模与带宽占用，从而缓解通信热点问题
  - ExFlow 则利用了跨层专家亲和性（inter-layer expert affinity），即不同 MoE 层中专家选择之间的相关性。通过根据这种亲和性将专家放置在对应的 GPU 上，ExFlow 减少了跨 GPU 的路由延迟，并提升了整体推理吞吐

- 专家卸载（Expert Offloading）
  - SiDA-MoE（Sparsity-inspired Data-Aware）
    - 通过同时利用 GPU 显存与主存，来应对 MoE 推理中专家激活稀疏的问题
    - 该系统包含两个并行线程：推理线程和哈希构建线程
    - 哈希构建线程预测每个 token 在每一层将被激活的专家，并将预测结果存入哈希表
    - 推理线程据此动态地将被激活的专家加载到 GPU，并将未激活的专家卸载到主存，从而最大化 GPU 内存利用率

  - MoE-Infinity 采用了不同的专家卸载策略
    - 该系统基于 MoE 推理过程中专家激活具有稀疏性和时间局部性的观察，即在处理某个序列时，只有少量专家会被反复激活
    - MoE-Infinity 在序列级别跟踪专家激活模式，从而预测后续所需专家并提前进行预取

- MoE 推理效率（MoE Efficiency）
  - Fiddler
    - 旨在在有限 GPU 资源下高效运行 MoE 模型，即使模型整体规模超过单 GPU 显存容量
    - 其核心思想是对模型组件进行分层放置：高频使用的非专家层始终保留在 GPU 上；根据使用频率选择一部分专家层放置在 GPU，其余专家层则保留在 CPU 内存中

  - Huang 等人提出了三种优化技术，以缓解 MoE 推理中的效率问题：
    - 动态门控（Dynamic Gating）：允许每个专家处理的 token 数量动态变化，避免静态门控带来的资源过度预留，从而减少计算浪费、通信开销和内存占用

    - 专家缓冲（Expert Buffering）：利用专家激活的稀疏性和时间局部性，将频繁使用的“热”专家缓存在 GPU 内存中，而将低活跃专家缓存在 CPU 内存中，降低 GPU 的静态内存压力

    - 专家负载均衡（Expert Load Balancing）：针对 token 在专家之间分配不均导致的性能瓶颈，通过负载均衡机制实现更均匀的计算分布，提升整体推理性能

### 推理流水线优化

- 推理流水线优化聚焦于从算子级到系统级消除 LLM 推理中的性能瓶颈，包括 GPU kernel 设计、数据流组织以及多请求协同执行等问题
- FlashDecoding++
  - 针对推理引擎的性能进行系统性优化，重点解决 softmax 同步开销、GPU kernel 效率以及整体数据流设计中的问题
  - 在解码阶段，推理通常涉及形状较“扁平”的线性 GEMM 运算，其中参与矩阵乘法的 batch 维度远小于其他维度，导致 GPU 利用率不高
  - FlashDecoding++ 通过引入双缓冲机制（double buffering），将计算与数据传输进行重叠，从而隐藏输入矩阵加载过程中的内存访问延迟，显著加速了这类 flat GEMM 运算

- Parrot
  - 面向包含多个 LLM 请求、且具有复杂工作流的 LLM 应用场景进行优化
  - Parrot 通过对应用进行数据流分析，挖掘多个 LLM 请求之间的相关性，并据此引入一系列跨请求的优化策略，从系统层面提升整体执行效率，而不仅局限于单次推理性能
- FlashAttention-3
  - 专注于加速大语言模型和长上下文应用中的注意力计算
  - 该方法引入了 warp specialization 和异步的分块计算（asynchronous block-wise operations）等技术，以进一步提升 GPU 的利用率
  - 相较于前代版本，FlashAttention-3 在 Hopper GPU 上实现了显著的性能提升，并在 FP8 计算场景下有效降低了数值误差

### 现有推理框架

| 系统名称                         | TP  | PP  | 异构/存储卸载 | 调度优化 | 初始阶段计算            | 增量阶段计算   | 优先优化延迟 | 优先优化吞吐 | 主要特性                          |
| -------------------------------- | --- | --- | ------------- | -------- | ----------------------- | -------------- | ------------ | ------------ | --------------------------------- |
| FasterTransformer                | √   | √   |               |          | cuBLAS GEMM             | FusedAttention | √            |              | 手写高性能内核，轻量级运行时      |
| FlexFlow-Serve                   | √   | √   | √             | √        | cuBLAS GEMM             | TreeAttention  | √            |              | 支持 SpecInfer，极低推理延迟      |
| vLLM                             | √   |     | √             | √        | xFormers                | PagedAttention |              | √            | 块级 KV Cache，扩大批量提升吞吐   |
| FlexGen                          |     | √   | √             |          | torch.bmm               | torch.bmm      |              | √            | CPU 与磁盘卸载，最大化单卡吞吐    |
| TGI（Text Generation Inference） | √   |     |               | √        | FlashAttention          | PagedAttention |              | √            | 与 HuggingFace 生态深度集成       |
| DeepSpeed-Inference              | √   | √   |               |          | cuBLAS GEMM             | cuBLAS GEMM    | √            |              | 内核自动注入，支持多 GPU 与多节点 |
| ZeRO-Inference                   | √   | √   | √             |          | cuBLAS GEMM             | cuBLAS GEMM    |              | √            | CPU 与 NVMe 卸载，提升单卡吞吐    |
| LightLLM                         | √   |     |               | √        | FlashAttention          | TokenAttention |              | √            | Token 级 KV Cache，扩大批量       |
| MLC-LLM                          | √   |     |               | √        | 编译后 MatMul           | PagedAttention | √            |              | 通用部署，支持多种 GPU 架构       |
| TensorRT-LLM                     | √   | √   | √             | √        | cuBLAS / FlashAttention | PagedAttention | √            |              | 基于 NVIDIA Triton，功能完整      |
