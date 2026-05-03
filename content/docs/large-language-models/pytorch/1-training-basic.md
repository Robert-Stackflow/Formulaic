---
title: 训练基础
description: 介绍深度学习的基本概念、训练流程、常见技术（如归一化、正则化）以及模型评价指标，为后续 PyTorch 实践打下坚实基础
---

- 参考资料
  - [简介 · PyTorch实用教程（第二版）](https://tingsongyu.github.io/PyTorch-Tutorial-2nd/)
  - [深入浅出PyTorch — 深入浅出PyTorch](https://datawhalechina.github.io/thorough-pytorch/index.html)
  - [前言 — 动手学深度学习 2.0.0 documentation](https://zh.d2l.ai/chapter_preface/index.html)

## 深度学习任务的一般流程

- 机器学习任务的一般流程包括
  - 数据预处理：统一数据格式、清洗异常数据、必要的数据变换
  - 数据集划分：训练集、验证集、测试集，常用方法有随机按比例划分、KFold 等（如 sklearn 的 train_test_split、KFold）
  - 模型选择：确定模型、损失函数、优化方法及超参数
  - 模型训练与评估：在训练集上拟合模型，在验证集或测试集上评估性能
- 深度学习在整体流程上与传统机器学习相似，但在实现细节上存在显著差异
- 数据处理不同
  - 深度学习的数据规模更大，无法一次性加载到内存
  - 深度学习通常采用 batch 训练，需要设计专门的数据加载机制，按批次读取和训练数据
- 模型构建方式不同
  - 深度神经网络层数多、结构复杂
  - 包含多种功能层，如卷积层、池化层、批归一化层、LSTM 等
  - 通常需要逐层搭建模型，或先定义模块再进行组合
  - 这种定制化方式提高了模型灵活性，也对代码结构提出更高要求
- 损失函数与优化器
  - 概念上与传统机器学习类似
  - 需要支持在用户自定义网络结构上的自动求导和反向传播
- 训练与硬件加速
  - 程序默认在 CPU 上运行，需显式将模型和数据放到 GPU 上
  - 要确保模型、损失函数、优化器都能在 GPU 上正确工作
  - 多 GPU 训练还涉及模型与数据的分配与整合
  - 某些评估指标的计算需要将数据从 GPU 拷回 CPU
- 深度学习训练与验证的核心特点
  - 数据按 batch 读入
  - 每个 batch 前向计算、计算损失、反向传播、参数更新
  - 各模块（数据加载、模型、损失函数、优化器、指标计算）需要协同工作
- 一个完整的深度学习任务包含数据加载、模型构建、损失与优化、GPU 配置、训练与评估等多个模块，而 PyTorch 通过模块化设计，为上述各个环节提供了灵活而清晰的实现方式

- Sweep

	- 在大模型训练 / 深度学习 / 炼丹里，Sweep 一般表示超参搜索 / 自动调参，全称常指 Hyperparameter Sweep

	- 即自动跑一堆不同参数组合，找出效果最好的那套

	- Sweep 就是让程序自动遍历 / 采样很多组参数，每组都训一遍，记录结果，最后告诉你哪组参数效果最好
	- 常见 Sweep 方式
		- Grid Search：穷举所有组合
		- Random Search：随机采样
		- Bayesian Search：智能优化搜索
	- 在大模型训练场景中，Sweep = 对训练配置 + 超参做大规模自动化实验

## 模型训练概念

### 轮次、批次与梯度

- 训练：通过大量样本调整模型参数，使模型在特定任务上的表现优化
- Batch（批次）：训练中一次前向和反向传播使用的数据子集
  - Batch size（批次大小）：每次送入模型的样本数量
  - Step（训练步）：一次参数更新（前向传播 + 反向传播 + 参数更新）称为一步
  - Gradient accumulation steps：在进行一次参数更新前累积多少个 batch 的梯度
  - Effective batch size（有效批次大小）：一次参数更新相当于处理的总样本数：

$$
\text{effective batch size} = \text{per\_device\_train\_batch\_size} \times \text{gradient\_accumulation\_steps} \times \text{GPU 数量}
$$

- Epoch 内 step 数：

$$
\text{steps per epoch} = \lceil \frac{\text{训练集样本数}}{\text{effective batch size}} \rceil
$$

- Epoch（轮次）：模型完整遍历训练集一次，每条样本至少被使用一次
- 这样，训练过程既控制了显存占用，又保证了有效的梯度更新

- 根据批次的规模，训练可以划分为全量训练（Batch Gradient Descent）、小批量训练（Mini-batch Gradient Descent）、单样本训练（Stochastic Gradient Descent, SGD）
- 梯度是模型在当前参数下的损失函数相对于参数的导数，表示“如何微调模型的每个参数，能最快降低损失”
  - 梯度通过反向传播（backpropagation）算法计算得到
  - 在每个 batch 上，先做一次前向传播得到预测结果和损失值，然后反向传播计算该 batch 的损失对所有参数的梯度，最后用这些梯度更新参数（利用优化器，如 SGD、Adam）

### 学习率与调度策略

- 在训练神经网络时，学习率是非常关键的超参数
- Scheduler 的任务就是：自动在训练过程中根据一定策略调整学习率，达到更高效、更稳定的训练效果
- Scheduler 通常和优化器一起使用，在每个 step 或 epoch 后自动调整学习率
- 常用的调度策略：
  - 每隔几步降低学习率：如 StepLR(optimizer, step_size=10, gamma=0.1) 表示每 10 个 epoch 把学习率乘以 0.1
  - 指数衰减：如 ExponentialLR(optimizer, gamma=0.95) 表示每个 epoch 学习率变为原来的 95%
  - 性能停滞时降低：如 ReduceLROnPlateau(optimizer, mode=‘min’, patience=3) 表示当验证集 loss 连续 3 轮没有下降，就降低学习率
  - 余弦退火：如 CosineAnnealingLR(optimizer, T_max=50) 表示学习率按照余弦曲线下降，可用于 fine-tuning 阶段
  - 快速升高后慢慢下降，适合快速收敛：如 OneCycleLR(optimizer, max_lr=0.1, steps_per_epoch=100, epochs=10) 表示先升后降，更快收敛，常用于 NLP 和迁移学习

### 随机种子

- 训练过程中通常会涉及各种随机过程

  | 操作                | 举例                                |
  | ------------------- | ----------------------------------- |
  | 数据打乱（shuffle） | 每轮训练打乱训练集                  |
  | 数据增强            | 图像翻转、颜色扰动                  |
  | Dropout             | 每次随机丢弃部分神经元              |
  | 权重初始化          | 网络参数从正态分布随机采样          |
  | minibatch 采样      | 从数据集中随机取一个 batch          |
  | GPU 并行计算        | 某些操作在不同平台/线程上有细微差异 |

- 通过设置随机种子，使得程序的随机性变得可控，使得同样的代码、同样的数据，运行多次得到的结果始终一致（可复现）

- 如 PyTorch 平台的随机种子设置

  ```python
  import random
  import numpy as np
  import torch
  
  seed = 42
  random.seed(seed)
  np.random.seed(seed)
  torch.manual_seed(seed)
  torch.cuda.manual_seed_all(seed)
  
  # 可选：禁用 cudnn 的 nondeterministic 行为（更严格保证一致）
  torch.backends.cudnn.deterministic = True
  torch.backends.cudnn.benchmark = False
  ```

### 代码实现

1. 导入库、设置随机种子

2. 准备 Dataset、DataLoader（在 DataLoader 设置 shuffle、batch_size）

   ```python
   # 转换成张量 + 标准化
   transform = transforms.Compose([
       transforms.ToTensor(),
       transforms.Normalize((0.5,), (0.5,))
   ])

   # 加载 MNIST 数据集
   train_dataset = torchvision.datasets.MNIST(root='./data', train=True, download=True, transform=transform)
   test_dataset = torchvision.datasets.MNIST(root='./data', train=False, download=True, transform=transform)

   # 创建 DataLoader（设定 batch_size）
   train_loader = torch.utils.data.DataLoader(train_dataset, batch_size=64, shuffle=True)
   test_loader = torch.utils.data.DataLoader(test_dataset, batch_size=1000, shuffle=False)
   ```

3. 定义模型、损失函数、优化器、调度器
   - 定义模型结构（如继承 nn.Module）定义简单的网络结构、定义 forward 方法

     ```python
     class SimpleNet(nn.Module):
         def __init__(self):
             super(SimpleNet, self).__init__()
             self.flatten = nn.Flatten()
             self.fc = nn.Sequential(
                 nn.Linear(28*28, 128),
                 nn.ReLU(),
                 nn.Linear(128, 10)
             )

         def forward(self, x):
             x = self.flatten(x)
             return self.fc(x)

     model = SimpleNet()
     ```

   - 定义损失函数，如交叉熵损失来衡量预测和标签之间的差异

   - 定义优化器，如 SGD 来根据梯度更新模型参数

   - 定义调度器，如 StepLR 来动态调整学习率

     ```python
     # 损失函数（loss）用于衡量预测和标签之间的差异
     criterion = nn.CrossEntropyLoss()
     
     # 优化器（optimizer）用于根据梯度更新模型参数
     optimizer = optim.SGD(model.parameters(), lr=0.1)
     
     # 学习率调度器（scheduler）用于动态调整学习率
     scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=5, gamma=0.5)
     ```

4. 开始训练循环（定义 num_epochs），对于每个 epoch

   ```python
   num_epochs = 10

   for epoch in range(num_epochs):  # ← 每次循环就是一个 epoch
       model.train()
       running_loss = 0.0

       for batch_idx, (inputs, targets) in enumerate(train_loader):
           # ← 每次循环是一个 batch → 会执行一个 step（一次前向 + 反向传播）
           # 前向传播
           outputs = model(inputs)
           loss = criterion(outputs, targets)  # 计算 loss
           # 反向传播
           optimizer.zero_grad()   # 清除旧梯度
           loss.backward()         # 计算当前梯度（通过链式法则）
           optimizer.step()        # 根据梯度更新参数（一次完整的 step）
           running_loss += loss.item()

           if batch_idx % 100 == 0:
               print(f"Epoch {epoch+1}, Step {batch_idx}, Loss: {loss.item():.4f}")

       # 学习率调度器更新（通常每个 epoch 后调用一次）
       scheduler.step()

       print(f"[Epoch {epoch+1}] Average Loss: {running_loss/len(train_loader):.4f}")
   ```

5. 模型验证

   ```python
   model.eval()
   correct = 0
   total = 0
   
   with torch.no_grad():  # 不计算梯度（更快更省内存）
       for inputs, targets in test_loader:
           outputs = model(inputs)
           _, predicted = torch.max(outputs, 1)
           total += targets.size(0)
           correct += (predicted == targets).sum().item()
   
   print(f"Test Accuracy: {100 * correct / total:.2f}%")
   ```

### 归一化（Normalization）

- 目的：统一输入或中间特征的数值分布，提高模型训练效率与稳定性

- 常见归一化类型：
  - 输入归一化 / 标准化（Input Normalization / Standardization）

    通常对输入数据进行操作，使其具有统一的尺度：
    - `MinMaxScaler`：将数据缩放到固定范围（通常是 [0, 1]）

      ```python
      x_norm = (x - x.min()) / (x.max() - x.min())
      ```

    - `StandardScaler`：将数据转换为均值为 0、标准差为 1 的分布

      ```python
      x_std = (x - x.mean()) / x.std()
      ```

    - 用于图像数据时通常是除以 255，使像素值落入 [0,1] 或 [−1, 1]

  - Batch Normalization
    - 位置：放在卷积层 / 全连接层后、激活函数前
    - 原理：在每一个 mini-batch 内，将特征归一化为标准分布（均值 0，方差 1），再通过可学习参数恢复尺度
    - 优点：缓解内部协变量偏移（internal covariate shift）、加快训练、减少对初始化和学习率的依赖

    ```python
    import torch.nn as nn
    nn.BatchNorm1d(num_features)    # 用于全连接层
    nn.BatchNorm2d(num_features)    # 用于卷积层
    ```

  - Layer Normalization
    - 与 BatchNorm 相反，它对每个样本的所有特征归一化，而不是跨 batch
    - 常用于 NLP、Transformer 结构中

    ```python
    nn.LayerNorm(normalized_shape)
    ```

  - InstanceNorm / GroupNorm
    - 适用于图像风格迁移、小 batch size 的场景

- 为什么归一化重要？
  - 避免某些特征主导梯度更新
  - 防止数值爆炸或梯度消失
  - 提高收敛速度
  - 降低对权重初始化的敏感性

### 正则化（Regularization）

- 目的：降低模型复杂度，防止过拟合

- 常见正则化方法：
  - L1 正则化（Lasso）
    - 向损失函数中加入权重的绝对值之和：$Loss_{total} = Loss + λ * ∑ |w|$
    - 会让一些权重变为 0，具有稀疏性

  - L2 正则化（Ridge）
    - 向损失函数中加入权重的平方和（PyTorch 中默认是 L2）：$Loss_{total} = Loss + λ * ∑ w²$
    - 会平滑权重，防止过大权重主导模型

  - Dropout：训练时随机屏蔽部分神经元，防止过拟合，提高泛化能力

    ```python
    nn.Dropout(p=0.5)
    ```

  - Early Stopping：在验证集性能不再提升时提前终止训练，防止过度拟合训练集

  - 数据增强（Data Augmentation）：虽不直接参与损失计算，但等价于对模型施加了平滑/正则限制（如对抗扰动）

  - 权重剪枝（Weight Pruning）：将不重要的连接置零，从而压缩模型、减少过拟合

- PyTorch 中添加 L2 正则项（weight decay）：

  ```python
  optimizer = torch.optim.Adam(model.parameters(), lr=1e-3, weight_decay=1e-5)
  ```

### 归一化与正则化的对比

| 项目                 | 归一化（Normalization）                  | 正则化（Regularization）                 |
| -------------------- | ---------------------------------------- | ---------------------------------------- |
| 目的                 | 加速收敛、稳定训练                       | 降低模型复杂度，防止过拟合               |
| 作用位置             | 输入或网络内部特征                       | 损失函数、网络结构                       |
| 是否影响模型表达能力 | 否（只是数值调整）                       | 是（约束权重或结构）                     |
| 是否使用可学习参数   | 部分是（如 BatchNorm 的 γ 和 β）         | 视方法而定（L1/L2 有 λ，Dropout 无参数） |
| 是否训练时启用       | 多数启用（但也能推理时用，如 BatchNorm） | 只在训练启用（如 Dropout）               |

## 模型评价指标

### 混淆矩阵

- 模型评价的一切起点都是混淆矩阵，混淆矩阵本质上是对预测结果与真实标签的联合分布做统计

- 对于一个 $K$ 类分类问题，混淆矩阵是一个 $K \times K$ 的矩阵，第 $i$ 行第 $j$ 列表示真实类别为 $i$、被模型预测为 $j$ 的样本数

- 对于二分类，这是最常见的 $TP, FP, FN, TN$ 四格结构
  - $TP$（True Positive）：预测为正，实际为正
  - $FP$（False Positive）：预测为正，实际为负
  - $TN$（True Negative）：预测为负，实际为负
  - $FN$（False Negative）：预测为负，实际为正

- 几乎所有常见的分类指标，本质上都是这四个数的不同组合与加权。理解这一点非常重要，因为它意味着：指标之间不是独立的，它们是在强调不同类型错误的代价结构
- 混淆矩阵的价值不在于它本身，而在于它告诉你的不是“模型好不好”，而是“模型在哪种错误上更偏向哪一边”

### Accuracy

- Accuracy 家族，是从整体正确率视角出发的

- Overall Accuracy（OA）
  - Overall Accuracy 是最直观的指标，表示所有样本中预测正确的比例，其定义为

    $$
    \text{OA} = \frac{TP + TN}{TP + FP + TN + FN}
    $$

  - 它评价的是模型的整体分类正确率，但隐含假设是“各类样本的重要性相同、分布相对均衡”

  - 一旦类别不平衡，比如正类极少，OA 很容易被多数类“刷高”，而掩盖模型对少数类的严重失效

- Average Accuracy（AA）
  - Average Accuracy 通常指对每一类分别计算分类准确率，然后再取平均

  - 以多分类为例，第 $i$ 类的分类准确率为

    $$
    \text{Acc}*i = \frac{TP_i}{N_i}
    $$

  - 其中 $N_i$ 是该类的真实样本数，则

    $$
    \text{AA} = \frac{1}{C} \sum*{i=1}^C \text{Acc}_i
    $$

  - AA 的核心意义在于对类别不平衡进行显式校正，它不再让“大类”天然拥有更大的话语权，因此在遥感分类、医学影像等长尾分布场景中比 OA 更可信

### Precision / Recall

- Accuracy 只关心“对不对”，而 Precision 和 Recall 开始区分“错在哪里”

- Recall（召回率）
  - Recall 衡量的是：真实为正的样本中，有多少被模型找出来了

    $$
    \text{Recall} = \frac{TP}{TP + FN}
    $$

  - 它对“漏报”（False Negative）非常敏感，常用于医学诊断、异常检测等场景，因为漏掉真正的重要样本代价极高

- Precision（精确率）
  - Precision 衡量的是：模型预测为正的样本中，有多少是真的正类

    $$
    \text{Precision} = \frac{TP}{TP + FP}
    $$

  - 它对“误报”（False Positive）非常敏感，比如垃圾邮件过滤、告警系统中，误报会带来很高的人工成本

- Precision 与 Recall 本质上是一对张力关系：阈值调高通常提高 Precision、降低 Recall，阈值调低则相反

- F1 Score
  - F1 是 Precision 和 Recall 的调和平均，其定义为

    $$
    \text{F1} = \frac{2 \cdot \text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}}
    $$

  - 使用调和平均而不是算术平均，是为了对“短板”更敏感：只要 Precision 或 Recall 其中之一很低，F1 就会被显著拉低

  - 因此 F1 更适合用作综合性能的单一标量指标，尤其在类别不平衡问题中

  - 在多分类任务中，F1 又会衍生出 macro-F1、micro-F1、weighted-F1，本质差异仍然是“是否按类别权重平均”

### PR / AP / mAP

- PR 曲线：阈值连续变化下的性能全貌
  - Precision 和 Recall 都依赖于分类阈值，而 PR 曲线通过扫描所有可能阈值，刻画 Precision–Recall 的整体权衡关系
  - PR 曲线以 Recall 为横轴、Precision 为纵轴
  - 与 ROC 曲线相比，PR 曲线在正负样本极不平衡时更具区分力，因为它不会被大量 $TN$ 人为抬高
  - 当模型的 PR 曲线整体包围住另一条曲线时，可以认为它在大多数阈值下都更优

- AP（Average Precision）
  - AP 定义为 PR 曲线下面积，本质上是对 Precision 在 Recall 维度上的积分

    $$
    \text{AP} = \int_0^1 \text{Precision}(r),dr
    $$

  - 在目标检测中，AP 通常是在固定 IoU 阈值（如 IoU ≥ 0.5）下计算的，用来衡量某一个类别的检测性能

- mAP（mean Average Precision）
  - mAP 是对所有类别 AP 的平均

    $$
    \text{mAP} = \frac{1}{C} \sum_{i=1}^C \text{AP}_i
    $$

  - 在现代检测基准（如 COCO）中，mAP 往往还会进一步扩展为在多个 IoU 阈值（如 0.5:0.95）上求平均，用以同时评价定位精度与分类置信度排序能力

### 其他指标

- IoU（Jaccard Index）：空间重叠度量
  - IoU 用于衡量预测区域与真实区域的重叠程度，其定义为

    $$
    \text{IoU} = \frac{|A \cap B|}{|A \cup B|}
    $$

  - 其中 $A$ 为预测区域，$B$ 为真实区域

  - IoU 是目标检测与语义分割中的核心指标，它不关心分类概率，只关注几何对齐质量

  - 在检测中，IoU 通常被用作“是否算一次正确检测”的判定条件

  - 在分割中，IoU 直接作为性能指标，甚至作为训练损失（如 IoU loss、Dice loss）

- 置信度：概率、校准与可解释性问题
  - 模型输出的“置信度”通常是 softmax 或 sigmoid 概率，但这并不等价于真实概率
  - 一个模型可以在 AP、F1 上表现很好，却在概率意义上严重失真
  - 因此，置信度评价往往涉及：
    - calibration（校准）：预测概率与真实频率是否一致
    - reliability diagram、ECE（Expected Calibration Error）等指标
    - 阈值敏感任务中的风险控制与决策可靠性

  - 在实际系统中，排序能力由 AP / mAP 决定，决策可靠性由置信度校准决定，这是两条经常被混淆但本质不同的评价维度

- Kappa 系数：去除“随机一致性”的评价
  - Kappa 系数用于衡量预测与真实标签之间的一致性，同时扣除了“随机猜对”的可能性，其定义为

    $$
    \kappa = \frac{p_o - p_e}{1 - p_e}
    $$

  - 其中 $p_o$ 是实际观测一致率（即 OA），$p_e$ 是在类别边缘分布已知的情况下随机一致的期望值

  - Kappa 特别适合用于人工标注一致性评估或类别分布极不均衡的任务，因为它能避免 OA 在随机情况下被误判为“看起来还不错”

- 总的来说
  - 混淆矩阵是结构基础
  - Accuracy 关注“总体正确性”
  - Precision / Recall / F1 关注“错误代价结构”
  - PR / AP / mAP 关注“排序与阈值鲁棒性”
  - IoU 关注“空间一致性”
  - 置信度与 Kappa 关注“可信度与一致性”

## NumPy

- 参考资料：[NumPy 教程](https://www.runoob.com/numpy/numpy-tutorial.html)

### ndarray

- NumPy 的一切都围绕 `ndarray`，它是一系列同类型数据的集合，以 0 下标为开始进行集合中元素的索引
- ndarray 对象是用于存放同类型元素的多维数组，ndarray 中的每个元素在内存中都有相同存储大小的区域
- ndarray 内部由以下内容组成：
  - 一个指向数据（内存或内存映射文件中的一块数据）的指针
  - 数据类型或 dtype，描述在数组中的固定大小值的格子
  - 一个表示数组形状（shape）的元组，表示各维度大小的元组
  - 一个跨度元组（stride），其中的整数指的是为了前进到当前维度下一个元素需要"跨过"的字节数

### 数据类型（dtype）

- NumPy 的 dtype 决定了每个元素占多少字节、如何解释二进制位、以及能做哪些算术运算，它远比 Python 的 `int / float` 体系严格

- 从逻辑上看，NumPy 的 dtype 可以分为以下几大类：

  | 类别        | 说明                               |
  | ----------- | ---------------------------------- |
  | 布尔        | `bool_`                            |
  | 有符号整数  | `int8 / int16 / int32 / int64`     |
  | 无符号整数  | `uint8 / uint16 / uint32 / uint64` |
  | 浮点数      | `float16 / float32 / float64`      |
  | 复数        | `complex64 / complex128`           |
  | 字符串      | `str_`（Unicode）                  |
  | 字节串      | `bytes_`                           |
  | Python 对象 | `object_`                          |
  | 时间类型    | `datetime64 / timedelta64`         |
  | 结构化类型  | structured / record dtype          |

- 在数值计算和深度学习中，真正高频使用的只有 `int64 / float32 / float64`，其中 `float32` 是性能与显存占用的黄金平衡点

- dtype 的显式控制

  ```python
  np.array([1, 2, 3], dtype=np.float32)
  a.astype(np.int32)
  # dtype 转换几乎一定意味着新内存分配，它不是 view
  ```

### 数组属性

- ndarray 有一批调试和理解内存行为所必需的属性，可以分为三层

- 结构与维度相关

  | 属性     | 含义              |
  | -------- | ----------------- |
  | `ndim`   | 维度数            |
  | `shape`  | 各维长度          |
  | `size`   | 元素总数          |
  | `len(a)` | 等价于 `shape[0]` |

- 内存与类型相关

  | 属性       | 含义                                                                                                                   |
  | ---------- | ---------------------------------------------------------------------------------------------------------------------- |
  | `dtype`    | 元素类型                                                                                                               |
  | `itemsize` | 单元素字节数                                                                                                           |
  | `nbytes`   | 总字节数                                                                                                               |
  | `strides`  | 每个维度跳过的字节数，理解 view / transpose / reshape 的钥匙，本质上是：<br/> “沿某个轴移动一步，在内存里要跳多少字节” |
  | `flags`    | 内存布局信息（C_CONTIGUOUS 等）                                                                                        |

- 数据访问相关

  | 属性   | 含义                    |
  | ------ | ----------------------- |
  | `data` | 底层 buffer（只读视角） |
  | `base` | 如果是 view，指向原数组 |

### 创建/生成

- 数组创建不是只有 `np.array`，而是一整套“语义明确的入口”

- 从 Python 对象创建

  ```python
  # array 会复制，asarray 尽量不复制
  np.array([1, 2, 3])
  np.asarray(list_like)

  ```

- 按形状创建（未初始化 / 已初始化）

  ```python
  # empty 不清零，只分配内存，速度快但内容不可预测
  np.zeros((2, 3))
  np.ones((2, 3))
  np.empty((2, 3))
  np.full((2, 3), 7)
  ```

- 序列与区间

  ```python
  # arange 是整数思维，linspace 是数值分析思维
  np.arange(0, 10, 2)
  np.linspace(0, 1, 5)
  ```

- 随机数组

  ```python
  np.random.rand(3, 4)
  np.random.randn(3, 4)
  np.random.randint(0, 10, size=(3, 4))
  ```

- 从已有数组派生

  ```python
  a.copy()
  a.view()
  ```

### 形状变换

- 形状变换的本质是在不动内存的前提下，重写 shape 和 strides

  ```python
  # reshape 和 transpose 是否拷贝，取决于 strides 是否能重排
  a.reshape(2, 3)
  a.ravel()
  a.flatten()   # 一定复制
  transpose / T
  swapaxes
  expand_dims
  squeeze
  ```

### 基本运算（向量化）

- NumPy 的算术运算都是逐元素 + 广播

  ```python
  a + b
  a * 2
  a ** 2
  np.sin(a)
  ```

- 所有这些运算在底层都是 ufunc（universal function），特点是 C 层循环、自动广播、可选 `out=` 避免新内存

  ```python
  np.add(a, b, out=c)
  ```

### 归约

- 归约是“把一个维度压缩掉”

  ```python
  a.sum()
  a.sum(axis=0)
  a.mean(axis=1)
  a.max()
  a.argmax(axis=1)
  ```

- 常见归约函数包括：
  - `sum / mean`
  - `min / max`
  - `argmin / argmax`
  - `std / var`
  - `any / all`

- 归约会破坏 shape，但可以保留维度

  ```python
  a.sum(axis=1, keepdims=True)
  ```

### 分解与组合

- 分解：这些操作通常返回 view

  ```python
  np.split(a, 3)
  np.hsplit(a, 3)
  np.vsplit(a, 2)
  ```

- 组合

  ```python
  np.concatenate([a, b], axis=0)
  np.stack([a, b], axis=0)
  np.hstack([a, b])
  np.vstack([a, b])
  ```

- `concatenate` 是最底层原语，其余都是语义糖

### 筛选与过滤（条件逻辑）

- 布尔掩码：布尔索引一定返回 copy

  ```python
  mask = a > 0
  a[mask]
  ```

- 条件选择：“向量化 if-else”

  ```python
  np.where(a > 0, a, 0)
  ```

- 查找索引

  ```python
  np.nonzero(a)
  np.argwhere(a > 0)
  ```

## pandas

- 参考资料：[Pandas 教程](https://www.runoob.com/pandas/pandas-tutorial.html)

- Pandas 主要用于数据分析与操作（表格/结构化数据），核心数据结构为 `DataFrame`、`Series`

- 导入 Pandas

  ```python
  import pandas as pd
  ```

- 读取与保存数据

  ```python
  df = pd.read_csv('data.csv')                     # 读取 CSV 文件
  df = pd.read_excel('data.xlsx')                 # 读取 Excel 文件
  df = pd.read_json('data.json')                  # 读取 JSON 文件

  df.to_csv('out.csv', index=False)               # 保存为 CSV，不保存索引
  df.to_excel('out.xlsx', index=False)            # 保存为 Excel
  ```

- 查看数据结构

  ```python
  df.head()                                       # 查看前 5 行
  df.tail(3)                                      # 查看最后 3 行
  df.shape                                        # 查看维度 (行数, 列数)
  df.columns                                      # 查看所有列名
  df.index                                        # 查看索引
  df.dtypes                                       # 每列数据类型
  df.info()                                       # 数据简要信息
  df.describe()                                   # 数值列的统计描述
  ```

- 选择数据

  ```python
  df['col']                                       # 选择一列，返回 Series
  df[['col1', 'col2']]                            # 选择多列，返回 DataFrame
  df.iloc[0]                                      # 选择第 0 行
  df.iloc[0:3]                                    # 选择第 0 到 2 行
  df.loc[3, 'col1']                               # 指定位置取值
  df.loc[df['col'] > 100]                         # 条件筛选
  ```

- 添加、删除、修改列或行

  ```python
  df['new'] = df['a'] + df['b']                   # 添加新列
  df.drop(columns=['a', 'b'])                     # 删除列（不改变原 df）
  df.drop(index=[0, 1])                           # 删除前两行
  df.rename(columns={'old': 'new'})               # 重命名列
  df.at[0, 'col'] = 123                           # 修改指定单元格
  ```

- 缺失值处理

  ```python
  df.isnull().sum()                               # 每列缺失值数量
  df.dropna()                                     # 删除含缺失值的行
  df.fillna(0)                                    # 用 0 填充缺失值
  df['col'].fillna(method='ffill')               # 前向填充
  df['col'].fillna(method='bfill')               # 后向填充
  ```

- 排序与唯一值

  ```python
  df.sort_values('col')                           # 默认升序
  df.sort_values('col', ascending=False)          # 降序
  df.sort_values(['a', 'b'], ascending=[True, False])  # 多列排序
  df['col'].unique()                              # 唯一值数组
  df['col'].nunique()                             # 唯一值数量
  df['col'].value_counts()                        # 值频率统计
  ```

- 分组与聚合操作

  ```python
  df.groupby('col').mean()                        # 按列分组并求平均
  df.groupby('col')['val'].sum()                  # 分组后某列求和
  df.groupby(['a', 'b']).agg({
      'x': 'mean',
      'y': 'max'
  })                                              # 多重聚合
  ```

- 合并与连接

  ```python
  pd.concat([df1, df2])                           # 纵向拼接（默认 axis=0）
  pd.concat([df1, df2], axis=1)                   # 横向拼接
  pd.merge(df1, df2, on='key')                    # 内连接
  pd.merge(df1, df2, how='left', on='key')        # 左连接
  ```

- apply 与 lambda 函数

  ```python
  df['col'].map(lambda x: x * 2)                  # 对 Series 应用函数
  df.apply(lambda row: row['a'] + row['b'], axis=1)  # 对行应用函数
  ```

- 透视表与交叉表

  ```python
  df.pivot_table(values='value', index='A', columns='B', aggfunc='mean')
  pd.crosstab(df['A'], df['B'])                   # 类似 Excel 的交叉表
  ```

- 时间序列处理

  ```python
  df['date'] = pd.to_datetime(df['date'])         # 转换为时间类型
  df.set_index('date', inplace=True)              # 将日期设置为索引
  df['2023']                                      # 选取某年数据（基于索引）
  df.resample('M').sum()                          # 月度重采样
  ```

- 可视化

  ```python
  import matplotlib.pyplot as plt

  df['col'].hist()                                # 绘制直方图
  df.plot(x='date', y='sales')                    # 折线图
  df['col'].value_counts().plot.pie(autopct='%.1f%%')  # 饼图
  plt.show()
  ```

- 设置与显示优化

  ```python
  pd.set_option('display.max_rows', 100)          # 设置最大显示行数
  pd.set_option('display.max_columns', None)      # 显示所有列
  pd.set_option('precision', 3)                   # 设置浮点显示精度
  ```

###

## matplotlib

- 参考资料：[Matplotlib Pyplot](https://www.runoob.com/matplotlib/matplotlib-pyplot.html)

- matplotlib 是一个通用二维（以及有限三维）绘图库，核心目标不是“好看”，而是可控、可复现、可精确表达数据关系

- 它的设计哲学非常偏工程和科学计算，而不是交互或美学，这一点会体现在 API 的复杂度上

- matplotlib 的核心思想是：图不是一张图片，而是一棵对象树（figure → axes → artists）
  - `Figure` 表示一整张画布，可以理解为“一页”
  - `Axes` 表示一个具体的坐标系（不是 axis），也就是你真正画数据的地方
  - `Artist` 是一切可见元素的统称，包括线、点、文字、刻度、图例等

- matplotlib 的关系结构如下

  ```text
  Figure
   ├── Axes
   │    ├── Line2D
   │    ├── Text
   │    ├── Patch
   │    └── Axis (xaxis, yaxis)
  ```

- matplotlib 提供了两套使用方式
  - pyplot（状态机风格）
    - `pyplot` 是一个状态机接口，内部维护“当前 figure / 当前 axes”
    - 优点是上手快，缺点是复杂图容易失控、多子图时可读性差、不利于封装和复用

    - 代码示例

      ```python
      import matplotlib.pyplot as plt
      
      plt.plot(x, y)
      plt.xlabel("x")
      plt.ylabel("y")
      plt.show()
      ```

  - 面向对象接口
    - 显式地拿到了 `Figure` 和 `Axes` 之后，后续所有操作都是对象方法调用，逻辑非常清晰

    - 代码示例

      ```python
      fig, ax = plt.subplots()
      ax.plot(x, y)
      ax.set_xlabel("x")
      ax.set_ylabel("y")
      ```

  - 一个经验法则是：脚本 / demo 用 pyplot，工程 /论文 /长期代码用 OO 接口

- 创建 Figure 和 Axes
  - 代码示例

    ```python
    fig, ax = plt.subplots()
    # 多子图，此时 `axes` 是一个二维 ndarray，每个元素都是一个 `Axes` 对象
    # fig, axes = plt.subplots(2, 3)
    ```

  - Figure 的常见属性和方法
    - `figsize`：尺寸（英寸）

    - `dpi`：分辨率

    - `fig.savefig(...)`：保存图片

    - `fig.tight_layout()`：自动调整布局

- Axes 是真正画图的核心对象
  - 基本绘图方法：这些方法本质上都是创建某种 Artist，并把它挂到 Axes 上

    ```python
    ax.plot(x, y)
    ax.scatter(x, y)
    ax.bar(x, y)
    ax.hist(data)
    ax.imshow(img)
    ```

  - 坐标轴控制：`Axis`（xaxis / yaxis）是 `Axes` 的子对象，但通常不需要直接操作它

    ```
    ax.set_xlim(0, 10)
    ax.set_ylim(-1, 1)

    ax.set_xscale("log")
    ax.set_yscale("log")
    ```

  - 标注与文字

    ```
    ax.set_title("title")
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    
    ax.text(x, y, "note")
    ```

- 样式系统（线条、颜色、marker）
  - 线条与 marker

    ```python
    ax.plot(
        x, y,
        linestyle="--",
        linewidth=2,
        marker="o",
        markersize=6
    )
    ```

  - 颜色系统，matplotlib 支持多种颜色表示：
    - 简写：`'r'`, `'g'`

    - 名称：`'blue'`

    - RGB / RGBA：`(0.1, 0.2, 0.5)`

    - 十六进制：`'#1f77b4'`

  - 全局样式

    ```python
    plt.style.use("seaborn-v0_8")
    ```

- 图例、网格、刻度

  ```python
  ax.legend()
  ax.grid(True)
  # 刻度控制
  ax.set_xticks([0, 1, 2])
  ax.set_xticklabels(["a", "b", "c"])
  ```

- 保存、显示与后端

  ```
  plt.show()
  fig.savefig("fig.png", dpi=300)
  ```

- matplotlib 有“后端”概念，用于区分屏幕显示（TkAgg、Qt）或文件输出（Agg、PDF）；一般不需要关心后端，除非在服务器或无显示环境

- 完整示例

  ```python
  import numpy as np
  import matplotlib.pyplot as plt
  
  # =========================
  # 1. 数据准备（NumPy）
  # =========================
  
  x = np.linspace(0, 2 * np.pi, 400)
  
  y_sin = np.sin(x)
  y_cos = np.cos(x)
  
  # 加一点噪声，模拟实验数据
  rng = np.random.default_rng(seed=42)
  noise = rng.normal(scale=0.1, size=x.shape)
  y_sin_noisy = y_sin + noise
  
  # =========================
  # 2. 创建 Figure 和 Axes
  # =========================
  
  fig, axes = plt.subplots(
      2, 1,
      figsize=(8, 6),
      sharex=True
  )
  
  ax1, ax2 = axes
  
  # =========================
  # 3. 第一幅子图：曲线
  # =========================
  
  ax1.plot(
      x, y_sin,
      label="sin(x)",
      linewidth=2
  )
  
  ax1.plot(
      x, y_cos,
      label="cos(x)",
      linestyle="--"
  )
  
  ax1.set_title("Trigonometric Functions")
  ax1.set_ylabel("value")
  
  ax1.legend()
  ax1.grid(True)
  
  # =========================
  # 4. 第二幅子图：含噪数据 + 原函数
  # =========================
  
  ax2.scatter(
      x, y_sin_noisy,
      s=10,
      alpha=0.6,
      label="sin(x) + noise"
  )
  
  ax2.plot(
      x, y_sin,
      color="black",
      linewidth=2,
      label="sin(x) (true)"
  )
  
  ax2.set_xlabel("x")
  ax2.set_ylabel("value")
  
  ax2.legend()
  ax2.grid(True)
  
  # =========================
  # 5. 布局与保存
  # =========================
  
  fig.tight_layout()
  fig.savefig("example_matplotlib.png", dpi=300)
  
  plt.show()
  ```

## Jupyter notebook

- 参考资料：[Jupyter Notebook 教程](https://www.runoob.com/jupyter-notebook/jupyter-notebook-tutorial.html)

## torchmetrics

- PyTorch 下各种机器学习和深度学习任务的评估，包括分类、回归、分段、对比学习等

- 安装：

  ```bash
  pip install torchmetrics
  ```

- 引入并使用常见指标（以分类任务为例）：

  ```python
  from torchmetrics.classification import Accuracy

  metric = Accuracy(task="multiclass", num_classes=3)

  preds = torch.tensor([0, 1, 2, 1])
  target = torch.tensor([0, 2, 1, 1])

  acc = metric(preds, target)
  print(acc)
  ```

- 累积式使用方法（适合训练中）：

  ```python
  metric = Accuracy(task="multiclass", num_classes=3)

  for batch in dataloader:
      preds = model(batch)
      target = batch['label']
      metric.update(preds, target)

  final_score = metric.compute()
  metric.reset()
  ```

- 常见分类指标包括：

  ```python
  from torchmetrics.classification import (
      Accuracy,
      Precision,
      Recall,
      F1Score,
      AUROC,
      ConfusionMatrix
  )

  acc = Accuracy(task="multiclass", num_classes=5)
  f1 = F1Score(task="multiclass", num_classes=5, average="macro")
  precision = Precision(task="multiclass", num_classes=5, average="macro")
  recall = Recall(task="multiclass", num_classes=5, average="macro")
  auroc = AUROC(task="multiclass", num_classes=5)
  ```

- 对于多标签分类：

  ```python
  from torchmetrics.classification import F1Score

  f1 = F1Score(task="multilabel", num_labels=4, average="macro")
  ```

- 用于回归任务的指标：

  ```python
  from torchmetrics.regression import (
      MeanSquaredError,
      MeanAbsoluteError,
      R2Score
  )

  mse = MeanSquaredError()
  mae = MeanAbsoluteError()
  r2 = R2Score()
  ```

- 可用于 GPU：

  ```python
  metric = Accuracy(task="multiclass", num_classes=3).to("cuda")
  ```

- 可视化混淆矩阵示例：

  ```python
  from torchmetrics.classification import ConfusionMatrix
  import matplotlib.pyplot as plt
  import seaborn as sns

  metric = ConfusionMatrix(task="multiclass", num_classes=3)
  cm = metric(preds, target).cpu().numpy()

  sns.heatmap(cm, annot=True, fmt="d")
  plt.xlabel("Predicted")
  plt.ylabel("True")
  plt.show()
  ```

- 在 PyTorch Lightning 中的集成用法：

  ```python
  class LitModel(pl.LightningModule):
      def __init__(self):
          ...
          self.train_acc = Accuracy(task="multiclass", num_classes=10)

      def training_step(self, batch, batch_idx):
          x, y = batch
          logits = self(x)
          loss = ...
          self.train_acc.update(logits, y)
          self.log("train/acc", self.train_acc, prog_bar=True)
          return loss
  ```

- 使用 MetricCollection 组合多个指标：

  ```python
  from torchmetrics import MetricCollection

  metrics = MetricCollection({
      "acc": Accuracy(task="multiclass", num_classes=5),
      "f1": F1Score(task="multiclass", num_classes=5)
  })

  for x, y in dataloader:
      pred = model(x)
      metrics.update(pred, y)

  print(metrics.compute())
  ```

- 自定义指标方式：

  ```python
  from torchmetrics import Metric
  
  class SumMetric(Metric):
      def __init__(self):
          super().__init__()
          self.add_state("total", default=torch.tensor(0), persistent=True)
  
      def update(self, x):
          self.total += x.sum()
  
      def compute(self):
          return self.total
  ```

###
