---
title: PyTorch 模型训练
description: 介绍模型训练的基本概念、模型定义与常见模块、PyTorch 框架相关概念及生态工具
---

### 一、模型训练的概念

#### 1.1 轮次、批次与梯度

- 训练是指通过大量样本来调整模型参数，使模型在某个任务上的表现变好
  - 训练过程包括多个**epoch**（轮次），每一轮把**整个训练集**都跑一遍
- 由于数据量可能非常大，通常不会一次性把所有样本都喂给模型，而是**拆分为小批次（Batch）**
  - 批次是训练中用于一次前向传播和反向传播的数据子集
  - **批次大小（batch size）** 是指每次送入模型计算的一组样本的数量
  - 一轮训练（1 epoch）会有多个 batch，例如数据集有 10000 条数据，批次大小为 100，那么一个 epoch 里会有 100 次 batch 迭代，即 100 个**step**（一次前向传播 + 反向传播 + 参数更新称为一步）
  - 根据批次的规模，训练可以划分为全量训练（Batch Gradient Descent）、小批量训练（Mini-batch Gradient Descent）、单样本训练（Stochastic Gradient Descent, SGD）
- 梯度是模型在当前参数下的**损失函数相对于参数的导数**，表示 “如何微调模型的每个参数，能最快降低损失”
  - 梯度通过 \*\* 反向传播（backpropagation）\*\* 算法计算得到
  - 在每个 batch 上，先做一次前向传播得到预测结果和损失值，然后反向传播计算该 batch 的损失对所有参数的梯度，最后用这些梯度更新参数（利用优化器，如 SGD、Adam）

#### 1.2 学习率与调度策略

- 在训练神经网络时，学习率是非常关键的超参数
- Scheduler 的任务就是：自动在训练过程中根据一定策略调整学习率，达到更高效、更稳定的训练效果
- Scheduler 通常和优化器一起使用，在每个 **step** 或 **epoch** 后自动调整学习率
- 常用的调度策略：
  - 每隔几步降低学习率：如 StepLR (optimizer, step\_size = 10, gamma = 0.1) 表示每 10 个 epoch 把学习率乘以 0.1
  - 指数衰减：如 ExponentialLR (optimizer, gamma = 0.95) 表示每个 epoch 学习率变为原来的 95%
  - 性能停滞时降低：如 ReduceLROnPlateau (optimizer, mode=‘min’, patience = 3) 表示当验证集 loss 连续 3 轮没有下降，就降低学习率
  - 余弦退火：如 CosineAnnealingLR (optimizer, T\_max = 50) 表示学习率按照余弦曲线下降，可用于 fine-tuning 阶段
  - 快速升高后慢慢下降，适合快速收敛：如 OneCycleLR (optimizer, max\_lr = 0.1, steps\_per\_epoch = 100, epochs = 10) 表示先升后降，更快收敛，常用于 NLP 和迁移学习

#### 1.3 随机种子

- 训练过程中通常会涉及各种随机过程

| 操作            | 举例                   |
| ------------- | -------------------- |
| 数据打乱（shuffle） | 每轮训练打乱训练集            |
| 数据增强          | 图像翻转、颜色扰动            |
| Dropout       | 每次随机丢弃部分神经元          |
| 权重初始化         | 网络参数从正态分布随机采样        |
| minibatch 采样  | 从数据集中随机取一个 batch     |
| GPU 并行计算      | 某些操作在不同平台 / 线程上有细微差异 |

- 通过设置随机种子，使得程序的随机性变得可控，使得**同样的代码、同样的数据，运行多次得到的结果**始终一致（可复现）
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

#### 1.4 代码实现

1. 导入库、设置随机种子

2. 准备 Dataset、DataLoader（在 DataLoader 设置 shuffle、batch\_size）

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

4. 开始训练循环（定义 num\_epochs），对于每个 epoch

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

#### 1.5 正则化与归一化

##### 1.5.1 归一化（Normalization）

- 目的：统一输入或中间特征的数值分布，提高模型训练效率与稳定性

- 常见归一化类型：

  - 输入归一化 / 标准化（Input Normalization / Standardization）

    通常对输入数据进行操作，使其具有统一的尺度：

    - `MinMaxScaler`：将数据缩放到固定范围（通常是 \[0, 1]）

      ```python
      x_norm = (x - x.min()) / (x.max() - x.min())
      ```

    - `StandardScaler`：将数据转换为均值为 0、标准差为 1 的分布

      ```python
      x_std = (x - x.mean()) / x.std()
      ```

    - 用于图像数据时通常是除以 255，使像素值落入 \[0,1] 或 \[−1, 1]

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

##### 1.5.2 正则化（Regularization）

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

  - 数据增强（Data Augmentation）：虽不直接参与损失计算，但等价于对模型施加了平滑 / 正则限制（如对抗扰动）

  - 权重剪枝（Weight Pruning）：将不重要的连接置零，从而压缩模型、减少过拟合

- PyTorch 中添加 L2 正则项（weight decay）：

  ```python
  optimizer = torch.optim.Adam(model.parameters(), lr=1e-3, weight_decay=1e-5)
  ```

##### 1.5.3 对比总结

| 项目         | 归一化（Normalization）        | 正则化（Regularization）            |
| ---------- | ------------------------- | ------------------------------ |
| 目的         | 加速收敛、稳定训练                 | 降低模型复杂度，防止过拟合                  |
| 作用位置       | 输入或网络内部特征                 | 损失函数、网络结构                      |
| 是否影响模型表达能力 | 否（只是数值调整）                 | 是（约束权重或结构）                     |
| 是否使用可学习参数  | 部分是（如 BatchNorm 的 γ 和 β）  | 视方法而定（L1 / L2 有 λ，Dropout 无参数） |
| 是否训练时启用    | 多数启用（但也能推理时用，如 BatchNorm） | 只在训练启用（如 Dropout）              |

### 二、模型定义

#### 2.1 模型结构如何定义

- 在 PyTorch 中，\*\* 模型结构（Model Architecture）\*\* 是通过继承 `torch.nn.Module` 类并实现其 `__init__` 和 `forward` 方法来定义的

- 继承 `nn.Module`

  ```python
  import torch.nn as nn

  class MyModel(nn.Module):
      def __init__(self):
          super(MyModel, self).__init__()  # 初始化父类
          ...

      def forward(self, x):
          ...
  ```

- 在 `__init__` 中定义子层（Layer）—— 定义网络中会用到的卷积层、全连接层、激活函数等

  ```python
  self.fc1 = nn.Linear(784, 128)   # 输入维度784（28x28图像摊平），输出128维
  self.relu = nn.ReLU()
  self.fc2 = nn.Linear(128, 10)    # 输出10类
  ```

- 在 `forward` 中定义前向传播逻辑 —— 决定输入数据 x 如何经过层流动

  ```python
  def forward(self, x):
      x = self.fc1(x)
      x = self.relu(x)
      x = self.fc2(x)
      return x
  ```

#### 2.2 常见模块

##### 2.2.1 全连接与卷积层（基础构建模块）

| 名称    | 类名                                                  | 说明        |
| ----- | --------------------------------------------------- | --------- |
| 全连接层  | `nn.Linear(in_features, out_features)`              | MLP 的基本组成 |
| 1D 卷积 | `nn.Conv1d(in_channels, out_channels, kernel_size)` | 时间序列、文本处理 |
| 2D 卷积 | `nn.Conv2d(in_channels, out_channels, kernel_size)` | 图像常用      |
| 3D 卷积 | `nn.Conv3d(in_channels, out_channels, kernel_size)` | 视频、医学图像等  |
| 转置卷积  | `nn.ConvTranspose2d(...)`                           | 图像上采样     |
| 空洞卷积  | `nn.Conv2d(..., dilation=N)`                        | 扩大感受野     |

##### 2.2.2 激活函数（非线性激活）

| 名称         | 类名                                  | 特性                          |
| ---------- | ----------------------------------- | --------------------------- |
| ReLU       | `nn.ReLU()`                         | 最常用                         |
| LeakyReLU  | `nn.LeakyReLU(negative_slope=0.01)` | 防止死神经元                      |
| ELU        | `nn.ELU()`                          | 类似于 LeakyReLU               |
| GELU       | `nn.GELU()`                         | Transformer 默认激活            |
| Sigmoid    | `nn.Sigmoid()`                      | 压缩到 (0,1)，用于二分类输出           |
| Tanh       | `nn.Tanh()`                         | 压缩到 (-1,1)                  |
| Softmax    | `nn.Softmax(dim)`                   | 多分类输出层使用（通常结合 CrossEntropy） |
| LogSoftmax | `nn.LogSoftmax(dim)`                | 通常用于 `nn.NLLLoss()`         |

##### 2.2.3 池化层（Pooling）

| 名称            | 类名                             | 用途       |
| ------------- | ------------------------------ | -------- |
| 最大池化          | `nn.MaxPool2d(kernel_size)`    | 保留特征最大值  |
| 平均池化          | `nn.AvgPool2d(kernel_size)`    | 取特征平均值   |
| 自适应池化         | `nn.AdaptiveAvgPool2d((H, W))` | 输出固定大小   |
| GlobalAvgPool | `nn.AdaptiveAvgPool2d((1,1))`  | 通常用于分类尾部 |

##### 2.2.4 归一化层（Normalization）

| 名称    | 类名                                       | 用途               |
| ----- | ---------------------------------------- | ---------------- |
| 批归一化  | `nn.BatchNorm1d / 2d / 3d`               | 对 batch 维度归一化    |
| 层归一化  | `nn.LayerNorm(normalized_shape)`         | 对每个样本归一化，常用于 NLP |
| 实例归一化 | `nn.InstanceNorm2d(num_features)`        | 图像风格迁移常用         |
| 群归一化  | `nn.GroupNorm(num_groups, num_channels)` | 小 batch 情况下代替 BN |

##### 2.2.5 Dropout / 正则化

| 名称            | 类名                  | 用途              |
| ------------- | ------------------- | --------------- |
| Dropout       | `nn.Dropout(p=0.5)` | 随机屏蔽神经元，防止过拟合   |
| 2D Dropout    | `nn.Dropout2d()`    | 专用于 CNN         |
| Alpha Dropout | `nn.AlphaDropout()` | 与 SELU 激活函数配套使用 |

##### 2.2.6 循环网络 / Transformer 模块

| 名称                      | 类名                                            | 用途                   |
| ----------------------- | --------------------------------------------- | -------------------- |
| RNN                     | `nn.RNN(input_size, hidden_size, ...)`        | 简单循环网络               |
| GRU                     | `nn.GRU(input_size, hidden_size, ...)`        | Gated Recurrent Unit |
| LSTM                    | `nn.LSTM(input_size, hidden_size, ...)`       | 最常用的循环网络             |
| TransformerEncoder      | `nn.TransformerEncoder(...)`                  | 多头注意力块堆叠结构           |
| MultiheadAttention      | `nn.MultiheadAttention(embed_dim, num_heads)` | 自注意力核心               |
| PositionalEmbedding（自写） | 自定义 `nn.Embedding`                            | 添加位置信息               |

##### 2.2.7 辅助模块 / 工具层

| 名称        | 类名                                            | 用途                        |
| --------- | --------------------------------------------- | ------------------------- |
| Flatten   | `nn.Flatten()`                                | 将多维输入拉平，通常用于 CNN 到 MLP 之间 |
| Unflatten | `nn.Unflatten(dim, unflattened_size)`         | 展开张量为多维                   |
| Identity  | `nn.Identity()`                               | 占位符，用于动态启 / 停某层           |
| Embedding | `nn.Embedding(num_embeddings, embedding_dim)` | 文本 / 离散变量嵌入层              |

##### 2.2.8 模块组合封装

| 名称         | 类名                     | 说明         |
| ---------- | ---------------------- | ---------- |
| Sequential | `nn.Sequential(...)`   | 顺序堆叠多个层    |
| ModuleList | `nn.ModuleList([...])` | 可迭代模块列表    |
| ModuleDict | `nn.ModuleDict({...})` | 模块字典（命名访问） |

#### 2.3 常见任务的模型结构定义

| 任务类型        | 常用模块组合                                                          |
| ----------- | --------------------------------------------------------------- |
| 图像分类        | Conv2d + BatchNorm2d + ReLU + MaxPool + Linear                  |
| 文本分类        | Embedding + LSTM/GRU + Linear                                   |
| Transformer | Embedding + PositionalEncoding + MultiheadAttention + LayerNorm |
| GAN         | Conv2d / ConvTranspose2d + BatchNorm + LeakyReLU / Tanh         |
| 小样本任务       | GroupNorm + Dropout 替代 BN                                       |

### 三、PyTorch 框架的相关概念

#### 3.1 计算图机制

- 在上述代码中，**loss 本身与 optimizer 并没有 “绑定”**，为什么还能更新参数？

- 这得益于 PyTorch 的工作机制，它是**基于计算图（computation graph）自动追踪的**

- 来看核心代码段：

  ```python
  loss = criterion(outputs, targets)  # 计算损失
  loss.backward()                     # 自动计算所有可训练参数的梯度
  optimizer.step()                    # 使用这些梯度更新参数
  ```

- 底层实现

  - `outputs` 是由 `model(inputs)` 计算出来的：它包含了从输入 → 每一层 → 输出的 “前向传播路径”，也就是**计算图**
  - `loss.backward()` 会从 `loss` 开始，沿着这个计算图反向传播，计算出每个参与计算的参数的梯度，自动存储在每个参数的 `.grad` 属性中
  - `optimizer.step()` 会遍历你传入的 `model.parameters()` 并对有 `.grad` 的参数执行参数更新 —— 所以 optimizer 不需要知道 loss，它只需要**模型参数的梯度已经准备好**就行

- 因此如果写错了计算路径，比如 `loss = some_tensor_unrelated_to_model`，那 `optimizer.step()` 就没效果了

- 此外，学习率更新的是 optimizer 的内部状态（`optimizer.param_groups[0]['lr']`）

#### 3.2 什么是张量（Tensor）

- \*\* 张量（Tensor）\*\* 是深度学习中最基础的数据结构，是 PyTorch 和其他深度学习框架（如 TensorFlow）里用来表示数据的通用形式

- 张量就是一个**多维数组**，是标量、向量、矩阵的**高维泛化**

  | 数学对象 | PyTorch 中的张量形式                 | 例子          | 维度（rank） |
  | ---- | ------------------------------ | ----------- | -------- |
  | 标量   | `torch.tensor(3.14)`           | 3.14        | 0 维      |
  | 向量   | `torch.tensor([1, 2, 3])`      | \[1, 2, 3]  | 1 维      |
  | 矩阵   | `torch.tensor([[1,2],[3,4]])`  | 2×2 表格      | 2 维      |
  | 张量   | `torch.randn(3, 4, 5)`         | 3 个 4×5 的表格 | 3 维      |
  | 更高维  | `torch.randn(64, 3, 224, 224)` | batch 图像数据  | 4 维或更多   |

- 例如，在训练一个 CNN 图像分类模型时，输入的图像是以下张量，表示 64 张图片（一个 batch）、每张图片有 3 个通道（RGB）、每个通道是 224 × 224 的像素，也即一个 **4 维张量**

  ```
  (batch_size, channels, height, width)
  → (64, 3, 224, 224)
  ```

- PyTorch 中张量的基本操作

  ```python
  import torch

  # 创建张量
  a = torch.tensor([[1, 2], [3, 4]])   # 2×2 矩阵
  b = torch.randn(3, 4)                # 3×4 随机张量
  c = torch.zeros(2, 3)                # 2×3 零张量
  d = torch.ones(1, 5)                 # 1×5 全1张量

  # 张量形状
  print(a.shape)     # torch.Size([2, 2])
  print(a.ndim)      # 维度数
  ```

- 张量在 PyTorch 中几乎代表了所有数据：模型输入 / 输出、权重参数、梯度、loss 值、中间层特征图等等都是张量

- 张量和 NumPy 的 ndarray 很相似，但张量支持自动求导和 GPU

### 四、生态工具

#### 4.1 Numpy

- Numpy 主要用于科学计算（向量、矩阵、数学运算），核心数据结构为`ndarray`

- PyTorch 的张量（`torch.Tensor`）和 NumPy 的数组（`numpy.ndarray`）在数据结构上高度兼容，且支持无拷贝、**共享内存**和高效互操作

- 你可以 **在 NumPy 中处理数据**，再把它交给 PyTorch 训练；

- 你也可以 **从 PyTorch 模型中拿结果**，转成 NumPy 数组用于分析、可视化、保存等

- 例如 Torch 与 ndarray 的转换

  ```python
  import torch

  a = torch.tensor([1.0, 2.0, 3.0])
  b = a.numpy()  # 转为 NumPy 数组

  print(type(b))  # <class 'numpy.ndarray'>

  import numpy as np
  x = np.array([1.0, 2.0, 3.0])
  y = torch.from_numpy(x)  # 转为 Tensor

  print(type(y))  # <class 'torch.Tensor'>
  ```

- GPU 张量不能直接 .numpy()

  ```python
  a = torch.tensor([1.0, 2.0], device='cuda')
  a.numpy()  # ❌ 会报错：必须在 CPU 上
  a.cpu().numpy()	# ✔️
  ```

- float64 / float32 类型匹配

  - NumPy 默认是 `float64`，而 PyTorch 默认是 `float32`
  - 如果两边混用，可能导致精度不一致或报错（如 `.matmul()`）

  ```python
  x = np.array([1.0, 2.0], dtype=np.float32)
  y = torch.from_numpy(x)  # float32 兼容性更好
  ```

#### 4.2 Pandas

- Pandas 主要用于数据分析与操作（表格 / 结构化数据）

- 核心数据结构为`DataFrame`、`Series`

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

#### 4.3 matplotlib

- 主要用于数据分析、科研绘图、模型可视化

- 导入 matplotlib

  ```python
  import matplotlib.pyplot as plt
  ```

- 基本绘图

  ```python
  x = [1, 2, 3, 4]
  y = [10, 20, 25, 30]

  plt.plot(x, y)             # 折线图
  plt.title("Title")         # 图标题
  plt.xlabel("X Label")      # x 轴标签
  plt.ylabel("Y Label")      # y 轴标签
  plt.grid(True)             # 显示网格
  plt.show()                 # 显示图像
  ```

- 常见图表类型

  ```python
  plt.plot(x, y)                                 # 折线图
  plt.bar(['A', 'B', 'C'], [10, 20, 15])         # 条形图
  plt.barh(['A', 'B', 'C'], [10, 20, 15])        # 横向条形图
  plt.scatter(x, y)                              # 散点图
  plt.hist([1,1,2,2,3,3,4], bins=4)              # 直方图
  plt.boxplot([[1, 2, 3], [2, 4, 6]])            # 箱线图
  plt.pie([30, 40, 30], labels=["A", "B", "C"])  # 饼图
  ```

- 图像保存

  ```python
  plt.savefig("figure.png", dpi=300)             # 保存为图片
  ```

- 多图绘制（子图）

  ```python
  plt.subplot(2, 1, 1)       # 2行1列，第1个图
  plt.plot([1, 2, 3], [1, 4, 9])

  plt.subplot(2, 1, 2)       # 第2个图
  plt.plot([1, 2, 3], [1, 2, 3])

  plt.tight_layout()         # 避免重叠
  plt.show()
  ```

- 设置线型、颜色、点型

  ```python
  plt.plot(x, y, color='red', linestyle='--', marker='o')
  ```

  - 可选参数示例：
    - `color`: `'r'`, `'g'`, `'blue'`, `'#00FF00'`
    - `linestyle`: `'-'`, `'--'`, `'-.'`, `':'`
    - `marker`: `'o'`, `'s'`, `'^'`, `'x'`

- 图例与注释

  ```python
  plt.plot(x, y, label="Line 1")
  plt.legend(loc='best')                         # 添加图例
  plt.annotate('Peak', xy=(3, 25), xytext=(2, 28),
               arrowprops=dict(arrowstyle='->')) # 注释
  ```

- 设置中文显示（防乱码）

  ```python
  plt.rcParams['font.family'] = 'SimHei'         # 中文黑体
  plt.rcParams['axes.unicode_minus'] = False     # 正确显示负号
  ```

- 设置图像大小、分辨率

  ```python
  plt.figure(figsize=(8, 6), dpi=100)
  plt.plot(x, y)
  ```

- 使用 Pandas 与 Matplotlib—— 常用类型参数：`line`, `bar`, `barh`, `hist`, `box`, `pie`, `scatter`, `area`, `kde`

  ```python
  import pandas as pd

  df = pd.read_csv("data.csv")
  df['col1'].plot(kind='line')
  df['col2'].plot(kind='hist')
  plt.show()
  ```

- 多图并排显示（面板式）

  ```python
  fig, axs = plt.subplots(1, 2, figsize=(10, 4))
  axs[0].plot(x, y)
  axs[1].bar(['A', 'B'], [1, 2])
  ```

- 多个折线图叠加

  ```python
  plt.plot(x, y, label='line 1')
  plt.plot(x, [v**1.5 for v in y], label='line 2')
  plt.legend()
  plt.show()
  ```

- 颜色映射与热图

  ```python
  import numpy as np
  data = np.random.rand(5, 5)
  plt.imshow(data, cmap='hot', interpolation='nearest')
  plt.colorbar()
  ```

- 坐标轴范围与刻度

  ```python
  plt.xlim(0, 10)
  plt.ylim(0, 100)
  plt.xticks([0, 2, 4, 6, 8])
  plt.yticks(range(0, 101, 20))
  ```

- 对数坐标

  ```python
  plt.xscale('log')
  plt.yscale('log')
  ```

- 清除当前图像

  ```python
  plt.clf()                 # 清空当前图像
  plt.close()               # 关闭窗口
  ```

#### 4.4 wandb

- **Weights & Biases (wandb)** 是一款**实验管理与可视化平台**，广泛用于机器学习训练过程的追踪与协作。

- 安装和登录：第一次使用会跳转网页获取 API key，登录后即可在代码中使用

  ```bash
  pip install wandb
  wandb login
  ```

- 初始化项目

  - 常用参数：

    - `project`: 项目名称（dashboard 页面分组）
    - `name`: 当前实验名称
    - `config`: 可用于记录超参数

    ```python
    import wandb

    wandb.init(project="my_project_name", name="run_001")
    ```

- 记录超参数

  ```python
  config = {
      "epochs": 10,
      "batch_size": 32,
      "lr": 0.001,
      "model": "MLP"
  }
  wandb.init(project="my_project", config=config)
  ```

  - wandb.config 之后可用于访问这些参数：

    ```python
    wandb.config.lr
    ```

- 记录训练日志（loss、accuracy 等）

  ```python
  for epoch in range(10):
      train_loss = ...
      val_acc = ...
      wandb.log({"train/loss": train_loss, "val/accuracy": val_acc, "epoch": epoch})
  ```

- 记录图像，也支持 mask、heatmap、bbox 等高级图像类型

  ```python
  wandb.log({"example_image": [wandb.Image(img_tensor, caption="input")]})
  ```

- 记录模型文件

  ```python
  torch.save(model.state_dict(), "model.pt")
  wandb.save("model.pt")
  ```

- 也可以在 `.init()` 时开启自动保存：

  ```python
  wandb.init(..., save_code=True)
  ```

- 与 PyTorch 集成完整示例

  ```python
  import torch
  import wandb

  wandb.init(project="torch_demo")

  model = torch.nn.Linear(10, 1)
  optimizer = torch.optim.Adam(model.parameters(), lr=0.01)
  loss_fn = torch.nn.MSELoss()

  for epoch in range(100):
      x = torch.randn(16, 10)
      y = torch.randn(16, 1)
      y_pred = model(x)
      loss = loss_fn(y_pred, y)

      optimizer.zero_grad()
      loss.backward()
      optimizer.step()

      wandb.log({"loss": loss.item(), "epoch": epoch})
  ```

- 跟踪模型权重 / 梯度变化，建议在 `.init()` 之后使用

  ```python
  wandb.watch(model, log="all")  # log 可选："gradients", "parameters", "all"
  ```

- 批量 sweep 超参搜索

  - 创建 sweep 配置 YAML：

    ```yaml
    # sweep.yaml
    method: grid
    parameters:
      lr:
        values: [0.001, 0.01]
      batch_size:
        values: [32, 64]
    ```

  - 启动 sweep：

    ```bash
    wandb sweep sweep.yaml
    wandb agent your-entity/project-name/sweep-id
    ```

  - 在训练脚本中读取参数：

    ```python
    import wandb
    wandb.init()
    lr = wandb.config.lr
    ```

- 结束记录

  ```python
  wandb.finish()
  ```

- 在 Jupyter 中使用

  ```python
  !wandb login
  import wandb
  wandb.init(project="notebook_project")
  ```

- 关闭联网记录（可离线）

  ```python
  wandb.init(mode="offline")     # 离线记录
  wandb.init(mode="disabled")    # 完全禁用 wandb
  ```

  - 也可以用环境变量控制：

    ```bash
    WANDB_MODE=offline python train.py
    ```

- 清理缓存

  ```bash
  wandb artifact cache cleanup  # 清除本地缓存
  ```

- PyTorch Lightning、Huggingface Transformers、Keras 等框架，通常都直接支持 wandb 集成，只需传入 `logger=wandb_logger` 等参数

#### 4.5 torchmetrics

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

#### 4.6 PyTorch Lightning

- PyTorch Lightning 是基于 PyTorch 的一个轻量级封装框架，旨在简化深度学习模型的训练流程，帮助研究者和工程师专注于模型设计和实验逻辑，而减少样板代码和训练细节的重复实现。

- 它把训练流程中的通用代码（如训练循环、验证循环、分布式训练、混合精度等）抽象出来，实现代码解耦、模块化、易复用。

- 安装：

  ```bash
  pip install pytorch-lightning
  ```

- 结构核心是继承 `pl.LightningModule`，在该类中实现模型结构、前向传播、训练和验证逻辑、优化器配置等。

- 一个简单示例：

  ```python
  import pytorch_lightning as pl
  import torch
  import torch.nn.functional as F
  from torch.utils.data import DataLoader, random_split, TensorDataset

  class LitModel(pl.LightningModule):
      def __init__(self):
          super().__init__()
          self.layer = torch.nn.Linear(28 * 28, 10)

      def forward(self, x):
          return self.layer(x.view(x.size(0), -1))

      def training_step(self, batch, batch_idx):
          x, y = batch
          logits = self(x)
          loss = F.cross_entropy(logits, y)
          self.log("train_loss", loss)
          return loss

      def validation_step(self, batch, batch_idx):
          x, y = batch
          logits = self(x)
          val_loss = F.cross_entropy(logits, y)
          self.log("val_loss", val_loss)

      def configure_optimizers(self):
          return torch.optim.Adam(self.parameters(), lr=1e-3)

  # 构造数据
  dataset = TensorDataset(torch.randn(1000, 28, 28), torch.randint(0, 10, (1000,)))
  train_ds, val_ds = random_split(dataset, [800, 200])
  train_loader = DataLoader(train_ds, batch_size=32)
  val_loader = DataLoader(val_ds, batch_size=32)

  model = LitModel()
  trainer = pl.Trainer(max_epochs=5)
  trainer.fit(model, train_loader, val_loader)
  ```

- PyTorch Lightning 的主要特点：

  - 自动处理训练循环，支持分布式训练、GPU / TPU 加速、多卡训练
  - 内置早停、模型检查点、日志接口（支持 TensorBoard、wandb 等）
  - 支持 16-bit 混合精度训练，提升训练速度和显存利用
  - 方便复用和扩展，配合回调机制灵活控制训练过程
  - 统一接口，简化实验管理和结果复现

- 常用方法和钩子：

  - `forward(self, x)`: 定义前向传播
  - `training_step(self, batch, batch_idx)`: 训练过程每个 batch 的逻辑
  - `validation_step(self, batch, batch_idx)`: 验证过程每个 batch 的逻辑
  - `test_step(self, batch, batch_idx)`: 测试过程每个 batch 的逻辑
  - `configure_optimizers(self)`: 配置优化器和学习率调度器
  - `on_train_start`, `on_epoch_end`, `on_validation_epoch_end` 等回调钩子，可灵活扩展

- 训练器 `Trainer` 负责训练过程，常用参数包括：

  - `max_epochs`: 最大训练轮数
  - `gpus`: 使用的 GPU 数量（如 `gpus=1` 或 `gpus=[0,1]`）
  - `precision`: 数值精度，支持 16 或 32
  - `callbacks`: 传入回调列表（如早停、模型保存）
  - `logger`: 训练日志管理（如 TensorBoardLogger、WandbLogger）
