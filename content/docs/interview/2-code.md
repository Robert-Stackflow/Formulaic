---
title: 手撕代码
description: 介绍一些面试中常见的手撕代码题目及其解法，包括基础算法、数据结构、系统设计等内容，帮助开发者在面试中展示扎实的编程能力和问题解决能力
---

## 基础

### Softmax

- `torch.max()` 不只是返回最大值，它返回的是一个「复合对象」（元组 / 命名元组），包含两个东西：
  - values：真正的最大值数值
  - indices：最大值所在的下标位置

- 实现

  ```python
  def softmax(x, dim=-1):
      # 减去最大值保证，数值稳定性
      x_max = torch.max(x, dim=dim, keepdim=True).values
      x_exp = torch.exp(x - x_max)

      x_sum = torch.sum(x_exp, dim=dim, keepdim=True)

      return x_exp / x_sum
  ```

### 熵

- 熵的公式

  $$
  H(P)=-\sum_x P(x)\log P(x)
  $$

- 公式实现

  ```python
  def compute_entropy(logits):
      log_probs = F.log_softmax(logits, dim=-1)
      probs = torch.exp(log_probs)
      # 逐 token 熵
      entropy = -(probs * log_probs).sum(dim=-1)  # [B, T]
      # 平均熵
      entropy_mean = entropy.mean()
     	return entropy_mean

  # logits: [B, T, V]
  logits = model(...)
  print(compute_entropy(logits))
  ```

### 交叉熵

- 第一步：计算 softmax

- 第二步：取 log 得到 logits

- 第三步：取每个样本在真实标签上的 log 概率，并取平均

- 代码实现

  ```python
  def cross_entropy(
      inputs: torch.Tensor,
      labels: torch.Tensor,
      dim=-1,
      eps=1e-10,
  ) -> torch.Tensor:
      """
      inputs:  [batch, num_classes]  模型原始 logits（未经过 softmax）
      labels:  [batch]               类别索引（0,1,2...）
      """
      # 1. 稳定 softmax
      x_max = torch.max(inputs, dim=dim, keepdim=True).values
      exp_x = torch.exp(inputs - x_max)
      softmax_x = exp_x / torch.sum(exp_x, dim=dim, keepdim=True)

      # 2. 取 log
      log_softmax = torch.log(softmax_x + eps)  # 加小epsilon防log(0)

      # 3. 对真实类别取负对数概率
      # one-hot 索引选取
      n = inputs.shape[0]
      # torch.arange(n) 表示行，labels 表示列，从而取出每个样本在真实标签上的 log 概率
      loss = -log_softmax[torch.arange(n), labels]

      # 4. 平均
      return loss.mean()
  ```

### KL 散度

- 公式

  $$
  D_{KL}(P \parallel Q) = \mathbb{E}_{x \sim P} \left[ \log \frac{P(x)}{Q(x)} \right] = \sum_i P(i) \log \frac{P(i)}{Q(i)}
  $$
  - 输入为对数概率时：$ \log P = \text{log_probs} $，$ \log Q = \text{log_probs_base} $
  - 指数形式：$ \frac{P}{Q} = \exp(\log P - \log Q) $

- 代码实现

  ```python
  def k3(log_p, log_q):
      log_ratio = log_p - log_q
      return torch.exp(log_ratio) - log_ratio - 1

  def kl_divergence(
      p_logits: torch.Tensor,
      q_logits: torch.Tensor,
      temperature: float = 1.0,
      reduction: str = "batchmean",
  ) -> torch.Tensor:
      """
      KL(p || q) = E_p [log p - log q]
      输入为 logits，内部会做 softmax + log_softmax
      """
      p = F.softmax(p_logits / temperature, dim=-1)
      log_p = F.log_softmax(p_logits / temperature, dim=-1)
      log_q = F.log_softmax(q_logits / temperature, dim=-1)

      kl = p * (log_p - log_q)
      kl = kl.sum(dim=-1)

      if reduction == "none":
          return kl
      elif reduction == "mean":
          return kl.mean()
      elif reduction == "sum":
          return kl.sum()
      elif reduction == "batchmean":
          return kl.sum() / p_logits.shape[0]
      else:
          raise ValueError(f"Unknown reduction: {reduction}")
  ```

### LoRA

- 代码实现

  ```python
  class LoRALayer(nn.Module):
      def __init__(self, in_dim, out_dim, rank: int = 8, alpha: float = 8):
          super().__init__()

          self.rank = rank
          self.alpha = alpha
          self.scaling = alpha / rank

          self.weight = nn.Parameter(torch.randn(in_dim, out_dim), requires_grad=False)

          self.lora_A = nn.Parameter(torch.randn(in_dim, rank))
          self.lora_B = nn.Parameter(torch.empty(rank, out_dim))

      def forward(self, x):
          original_out = x @ self.weight
          lora_out = (x @ self.lora_A) @ self.lora_B
          return original_out + self.scaling * lora_out
  ```

- QLoRA

  ```python
  import bitsandbytes as bnb


  class QLoRALayer(nn.module):
      def __init__(self, in_dim, out_dim, rank: int = 8, alpha: float = 8):
          super().__init__()

          self.rank = rank
          self.alpha = alpha
          self.scaling = alpha / rank

          self.base_layer = bnb.nn.Linear4bit(
              in_dim,
              out_dim,
              unbiased=False,
              quant_type="nf4",
          )
          for param in self.base_layer.parameters():
              param.requires_grad = False

          self.lora_A = nn.Parameter(torch.randn(in_dim, rank))
          self.lora_B = nn.Parameter(torch.empty(rank, out_dim))

      def forward(self, x):
          original_out = self.base_layer(x)
          lora_out = (x @ self.lora_A) @ self.lora_B
          return original_out + self.scaling * lora_out
  ```

### MLP

- 代码实现

  ```python
  import numpy as np

  # -----------------------------
  # 1. 激活函数与 Softmax
  # -----------------------------
  def relu(x):
      return np.maximum(0, x)

  def relu_grad(x):
      return (x > 0).astype(float)

  def softmax(x):
      exp_x = np.exp(x - np.max(x, axis=-1, keepdims=True))  # 防溢出
      return exp_x / np.sum(exp_x, axis=-1, keepdims=True)

  # -----------------------------
  # 2. Cross Entropy Loss
  # -----------------------------
  def cross_entropy_loss(pred, label):
      # pred: softmax输出 [B, C]
      # label: one-hot [B, C]
      batch_size = pred.shape[0]
      log_pred = -np.log(pred + 1e-8)
      loss = np.sum(label * log_pred) / batch_size
      return loss

  # -----------------------------
  # 3. MLP 类（手动前向+反向）
  # -----------------------------
  class MLP:
      def __init__(self, in_dim, hidden_dim, out_dim):
          # 初始化参数
          self.W1 = np.random.randn(in_dim, hidden_dim) * 0.01
          self.b1 = np.zeros((1, hidden_dim))
          self.W2 = np.random.randn(hidden_dim, out_dim) * 0.01
          self.b2 = np.zeros((1, out_dim))

      def forward(self, x):
          # 前向传播，保存中间变量用于反向
          self.x = x
          self.z1 = x @ self.W1 + self.b1
          self.h = relu(self.z1)
          self.z2 = self.h @ self.W2 + self.b2
          self.pred = softmax(self.z2)
          return self.pred

      def backward(self, label, lr=1e-3):
          B = label.shape[0]

          # -----------------------
          # 反向传播 手推梯度
          # -----------------------
          # 1. dz2 = dLoss/dz2 = (pred - label) / B （关键！）
          dz2 = (self.pred - label) / B

          # 2. 输出层梯度
          dW2 = self.h.T @ dz2
          db2 = np.sum(dz2, axis=0, keepdims=True)

          # 3. 隐藏层梯度
          dh = dz2 @ self.W2.T
          dz1 = dh * relu_grad(self.z1)

          # 4. 输入层梯度
          dW1 = self.x.T @ dz1
          db1 = np.sum(dz1, axis=0, keepdims=True)

          # -----------------------
          # 梯度下降更新
          # -----------------------
          self.W2 -= lr * dW2
          self.b2 -= lr * db2
          self.W1 -= lr * dW1
          self.b1 -= lr * db1

  # -----------------------------
  # 测试
  # -----------------------------
  if __name__ == "__main__":
      # 数据：batch=2, in=3, out=2
      x = np.array([[1.0, 2.0, 3.0],
                    [4.0, 5.0, 6.0]])
      label = np.array([[1, 0],
                        [0, 1]])  # one-hot

      model = MLP(in_dim=3, hidden_dim=5, out_dim=2)

      for step in range(1000):
          pred = model.forward(x)
          loss = cross_entropy_loss(pred, label)
          model.backward(label, lr=1e-1)

          if step % 100 == 0:
              print(f"step {step}, loss = {loss:.4f}")
  ```

## Attention

### MHA

- 代码实现

  ```python
  class MultiHeadAttention(nn.Module):
      def __init__(self, hidden_size, num_heads):
          super().__init__()

          assert hidden_size % num_heads == 0

          self.hidden_size = hidden_size
          self.num_heads = num_heads
          self.d_k = hidden_size // num_heads

          self.W_q = nn.Linear(hidden_size, hidden_size)
          self.W_k = nn.Linear(hidden_size, hidden_size)
          self.W_v = nn.Linear(hidden_size, hidden_size)
          self.W_o = nn.Linear(hidden_size, hidden_size)

          self.dropout = nn.Dropout(0.1)

          self.cache_k = None
          self.cache_v = None

      def forward(self, x, mask=None, use_cache=False):
          B, S, _ = x.shape

          q = self.W_q(x)
          k = self.W_k(x)
          v = self.W_v(x)

          # reshape -> [B, H, S, D]
          q = q.view(B, S, self.num_heads, self.d_k).transpose(1, 2)
          k = k.view(B, S, self.num_heads, self.d_k).transpose(1, 2)
          v = v.view(B, S, self.num_heads, self.d_k).transpose(1, 2)

          if use_cache:
              if self.cache_k is not None:
                  self.cache_k = torch.cat([self.cache_k, k], dim=-2)
                  self.cache_v = torch.cat([self.cache_v, v], dim=-2)
              else:
                  self.cache_k = k
                  self.cache_v = v
              k = self.cache_k
              v = self.cache_v

          # attention scores -> [B, H, S, S]
          attn_scores = (q @ k.transpose(-2, -1)) * (self.d_k**-0.5)

          # mask -> [B, 1, 1, S] or [B, 1, S, S]
          if mask is not None:
              attn_scores = attn_scores.masked_fill(mask == 0, float("-inf"))

          # softmax
          attn_scores = torch.nn.functional.softmax(attn_scores, dim=-1)
          attn_scores = self.dropout(attn_scores)

          # attention weights -> [B, H, S, D]
          attn_weights = attn_scores @ v
          # concat heads -> [B, S, H*D]
          attn_weights = attn_weights.transpose(1, 2).contiguous().view(B, S, self.hidden_size)
          # final linear
          attn_output = self.W_o(attn_weights)

          return attn_output
  ```

### MQA

- 代码实现

  ```python
  class MultiQueryAttention(nn.Module):
      def __init__(self, hidden_size, num_heads):
          super().__init__()

          assert hidden_size % num_heads == 0

          self.hidden_size = hidden_size
          self.num_heads = num_heads
          self.d_k = hidden_size // num_heads

          self.W_q = nn.Linear(hidden_size, hidden_size)

          # K/V shared across all heads
          self.W_k = nn.Linear(hidden_size, self.d_k)
          self.W_v = nn.Linear(hidden_size, self.d_k)

          self.W_o = nn.Linear(hidden_size, hidden_size)
          self.dropout = nn.Dropout(0.1)

      def forward(self, x, mask=None):
          B, S, _ = x.shape

          q = self.W_q(x)
          k = self.W_k(x)
          v = self.W_v(x)

          # Q: [B, S, H, D] -> [B, H, S, D]
          q = q.view(B, S, self.num_heads, self.d_k).transpose(1, 2)

          # K/V: [B, 1, S, D] for broadcasting
          k = k.unsqueeze(1)
          v = v.unsqueeze(1)

          # attention scores -> [B, H, S, S]
          scores = (q @ k.transpose(-2, -1)) * (self.d_k**-0.5)

          if mask is not None:
              scores = scores.masked_fill(mask == 0, float("-inf"))

          # attention weights -> [B, H, S, S]
          attn = torch.softmax(scores, dim=-1)
          attn = self.dropout(attn)

          # out: [B, H, S, D]
          out = attn @ v

          # concat heads -> [B, S, H*D]
          out = out.transpose(1, 2).contiguous().view(B, S, self.hidden_size)

          return self.W_o(out), attn
  ```

### GQA

- 代码实现

  ```python
  class GroupQueryAttention(nn.Module):
      def __init__(self, hidden_size, num_heads, num_groups):
          super().__init__()

          assert hidden_size % num_heads == 0
          assert hidden_size % num_groups == 0
          assert num_heads % num_groups == 0

          self.hidden_size = hidden_size
          self.num_heads = num_heads
          self.num_groups = num_groups

          self.d_k = hidden_size // num_heads
          self.num_kv_heads = num_heads // num_groups

          self.W_q = nn.Linear(hidden_size, hidden_size)
          self.W_k = nn.Linear(hidden_size, num_groups * self.d_k)
          self.W_v = nn.Linear(hidden_size, num_groups * self.d_k)
          self.W_o = nn.Linear(hidden_size, hidden_size)

          self.dropout = nn.Dropout(0.1)

      def forward(self, x, mask=None):
          B, S, _ = x.shape

          q = self.W_q(x)
          k = self.W_k(x)
          v = self.W_v(x)

          # Q: [B, S, H, D] -> [B, H, S, D]
          q = q.view(B, S, self.num_heads, self.d_k).transpose(1, 2)
          # K/V: [B, S, G, D] -> [B, G, S, D]
          k = k.view(B, S, self.num_groups, self.d_k).transpose(1, 2)
          v = v.view(B, S, self.num_groups, self.d_k).transpose(1, 2)

          k = k.repeat_interleave(self.num_kv_heads, dim=1)
          v = v.repeat_interleave(self.num_kv_heads, dim=1)

          # attention scores -> [B, H, S, S]
          attn_scores = (q @ k.transpose(-2, -1)) * (self.d_k**-0.5)

          if mask is not None:
              attn_scores = attn_scores.masked_fill(mask == 0, float("-inf"))

          attn_scores = torch.nn.functional.softmax(attn_scores, dim=-1)
          attn_scores = self.dropout(attn_scores)

          # attn_weights [B, H, S, d_k]
          attn_weights = attn_scores @ v
          attn_weights = attn_weights.transpose(1, 2).contiguous().view(B, S, self.hidden_size)

          attn_output = self.W_o(attn_weights )

          return attn_output
  ```

### MLA

- 代码实现

  ```python

  ```

### LinearAttention

## 位置编码

### Absolute

- 代码实现

  ```python
  class AbsolutePositionalEncoding(nn.Module):
      def __init__(self, max_seq_len, hidden_size):
          super().__init__()
          self.pos_embedding = nn.Embedding(max_seq_len, hidden_size)

      def forward(self, input_ids):
          seq_len = input_ids.size(1)
          device = input_ids.device
          positions = torch.arange(0, seq_len, dtype=torch.long, device=device).unsqueeze(
              0
          )
          return input_ids + self.pos_embedding(positions)
  ```

### Sinusoidal

- 代码实现

  ```python
  class SinusoidalPositionalEncoding(nn.Module):
      def __init__(self, max_seq_len, hidden_size, base=10000):
          super().__init__()
          self.max_seq_len = max_seq_len
          self.hidden_size = hidden_size

          # 创建一个 [max_seq_len, hidden_size] 的位置编码矩阵
          position = torch.arange(0, max_seq_len).unsqueeze(1)  # [max_seq_len, 1]
          div_term = torch.exp(
              torch.arange(0, hidden_size, 2)
              * (-torch.log(torch.tensor(base, dtype=torch.float32)) / hidden_size)
          )  # [hidden_size/2]

          # [max_seq_len, hidden_size] 的位置编码矩阵
          pe = torch.zeros(max_seq_len, hidden_size)
          # 公式：PE(pos, 2i) = sin(pos / (base^(2i/hidden_size)))
          #      PE(pos, 2i+1) = cos(pos / (base^(2i/hidden_size)))
          # 0::2 表示步长为 2，从索引 0 开始，1::2 表示步长为 2，从索引 1 开始
          pe[:, 0::2] = torch.sin(position * div_term)  # 偶数维度使用正弦函数
          pe[:, 1::2] = torch.cos(position * div_term)  # 奇数维度使用余弦函数

          self.register_buffer("pos_embedding", pe)  # 将位置编码注册为 buffer，不参与训练

      def forward(self, input_ids):
          seq_len = input_ids.size(1)
          return input_ids + self.pos_embedding[:seq_len, :].unsqueeze(0).to(
              input_ids.device
          )
  ```

### RoPE

- 代码实现

  ```python
  class LlamaRotaryEmbedding(nn.Module):
      """
      Rotary Positional Embedding (RoPE).

      原理:
      RoPE 通过将 Query(Q) 和 Key(K) 向量对看作是复数空间中的坐标，并对其进行旋转来注入位置信息。
      相较于绝对位置编码，RoPE 捕捉的是相对位置关系，具有更好的外推性（Extrapolation）。

      具体实现上，它通过将向量两两分组，并在 2D 平面应用旋转矩阵来实现：
      [cos θ, -sin θ] [x_1]
      [sin θ,  cos θ] [x_2]
      """

      def __init__(
          self, dim: int, max_position_embeddings: int = 2048, base: float = 10000.0
      ):
          """
          初始化 RoPE 模块

          Args:
              dim: 每个头的维度 (head_dim)，通常为 hidden_size / num_heads
              max_position_embeddings: 预计算的最大序列长度，默认为 2048
              base: 频率基数，控制旋转频率，默认为 10000.0
          """
          super().__init__()
          self.dim = dim
          self.max_position_embeddings = max_position_embeddings
          self.base = base
          # 计算逆频系数 (Inverse frequencies)，即每个维度分组的旋转角度系数
          # 公式: inv_freq[i] = 1 / (base^(2*i/dim))，其中 i 是偶数索引
          # torch.arange(0, dim, 2)：取偶数索引 [0,2,4,...]，因为维度两两分组（x0/x1 一组，x2/x3 一组...）
          inv_freq = 1.0 / (
              self.base ** (torch.arange(0, self.dim, 2).float() / self.dim)
          )
          # 注册一个不可训练的缓冲区，存储逆频系数，形状为 [dim/2]，用于后续计算旋转角度
          self.register_buffer("inv_freq", inv_freq, persistent=False)
          # 预计算并缓存 cos 和 sin 矩阵，以加速前向计算，初始长度为 max_position_embeddings
          self._set_cos_sin_cache(
              max_position_embeddings, inv_freq.device, inv_freq.dtype
          )

      def _set_cos_sin_cache(self, seq_len, device, dtype):
          """
          预计算并缓存 cos 和 sin 矩阵，以加速前向计算

          Args:
              seq_len: 需要预计算的序列长度
              device: 预计算张量所在的设备
              dtype: 预计算张量的数据类型
          """
          self.max_seq_len_cached = seq_len
          # 生成位置索引 t = [0,1,2,...,seq_len-1]
          t = torch.arange(
              self.max_seq_len_cached, device=device, dtype=self.inv_freq.dtype
          )
          # 计算对应的频率值，形状为 [seq_len, dim/2]
          # 公式: freqs[t][i] = t * inv_freq[i] = t * θ_i，其中 t 是位置索引，i 是频率索引
          # outer 实现了 “位置索引 × 逆频率” 的外积，快速得到所有位置 × 所有维度分组的旋转角度矩阵
          freqs = torch.outer(t, self.inv_freq)
          # 将频率与其自身拼接以适应 [x_1, x_2, ..., x_n/2, x_1, x_2, ..., x_n/2] 的旋转策略
          # 拼接 freq → shape: [seq_len, dim]
          # 原因：分组维度需要重复 θ_i（如 x0/x1 共享 θ_0，所以 θ_0 要出现在 dim=0 和 dim=1 位置）
          # 对应公式中高维旋转的“两两分组”逻辑
          emb = torch.cat((freqs, freqs), dim=-1)
          # 预计算 cos 和 sin，增加两个维度 [1,1,seq_len,dim]
          # 额外维度是为了适配注意力的 [batch_size, num_heads, seq_len, dim] 形状，方便广播
          self.register_buffer(
              "cos_cached", emb.cos()[None, None, :, :].to(dtype), persistent=False
          )
          self.register_buffer(
              "sin_cached", emb.sin()[None, None, :, :].to(dtype), persistent=False
          )

      def forward(self, x, seq_len: int):
          """
          获取指定长度的旋转编码嵌入 (cos, sin)。

          Args:
              x: 参考张量，用于确定 device 和 dtype
              seq_len: 需要生成的序列长度
          """
          # 如果当前缓存长度不足，则动态重新计算
          if seq_len > self.max_seq_len_cached:
              self._set_cos_sin_cache(seq_len, x.device, x.dtype)
          # 返回预计算的 cos 和 sin 矩阵，形状为 [1,1,seq_len,dim]，并确保数据类型与输入 x 一致
          return (
              self.cos_cached[:, :, :seq_len, ...].to(dtype=x.dtype),
              self.sin_cached[:, :, :seq_len, ...].to(dtype=x.dtype),
          )
  ```

- LinearScaling

  ```python
  # LlamaLinearScalingRotaryEmbedding 是 LlamaRotaryEmbedding 的一个变体，增加了一个 scaling_factor 参数
  # scaling_factor 用于调整位置索引 t 的缩放，从而改变旋转频率，公式为 t' = t / scaling_factor
  # 通过调整 scaling_factor，可以控制 RoPE 的外推能力和对不同长度序列的适应性，适用于需要处理更长序列或希望增强模型泛化能力的场景
  class LlamaLinearScalingRotaryEmbedding(LlamaRotaryEmbedding):
      def __init__(
          self,
          dim,
          max_position_embeddings=2048,
          base=10000,
          device=None,
          scaling_factor=1.0,
      ):
          self.scaling_factor = scaling_factor
          super().__init__(dim, max_position_embeddings, base, device)

      def _set_cos_sin_cache(self, seq_len, device, dtype):
          self.max_seq_len_cached = seq_len
          t = torch.arange(
              self.max_seq_len_cached, device=device, dtype=self.inv_freq.dtype
          )
          t = t / self.scaling_factor

          freqs = torch.outer(t, self.inv_freq)
          # Different from paper, but it uses a different permutation in order to obtain the same calculation
          emb = torch.cat((freqs, freqs), dim=-1)
          self.register_buffer("cos_cached", emb.cos().to(dtype), persistent=False)
          self.register_buffer("sin_cached", emb.sin().to(dtype), persistent=False)
  ```

- NTK Scaling

  ```python
  # LlamaDynamicNTKScalingRotaryEmbedding 是 LlamaRotaryEmbedding 的另一个变体，增加了一个 scaling_factor 参数
  class LlamaDynamicNTKScalingRotaryEmbedding(LlamaRotaryEmbedding):
      def __init__(
          self,
          dim,
          max_position_embeddings=2048,
          base=10000,
          device=None,
          scaling_factor=1.0,
      ):
          self.scaling_factor = scaling_factor
          super().__init__(dim, max_position_embeddings, base, device)

      def _set_cos_sin_cache(self, seq_len, device, dtype):
          self.max_seq_len_cached = seq_len

          # 仅当当前序列长度 > 预训练最大长度时，才调整base（动态NTK）
          if seq_len > self.max_position_embeddings:
              # 公式为：base' = base * ((scaling_factor * seq_len / max_position_embeddings) - (scaling_factor - 1))^(dim/(dim-2))
              base = self.base * (
                  (self.scaling_factor * seq_len / self.max_position_embeddings)
                  - (self.scaling_factor - 1)
              ) ** (self.dim / (self.dim - 2))
              # 重新计算逆频系数，公式为 inv_freq[i] = 1 / (base'^(2*i/dim))，其中 i 是偶数索引
              inv_freq = 1.0 / (
                  base ** (torch.arange(0, self.dim, 2).float().to(device) / self.dim)
              )
              self.register_buffer("inv_freq", inv_freq, persistent=False)

          # 和基础版本一样的计算逻辑，但使用可能调整过的 inv_freq
          t = torch.arange(
              self.max_seq_len_cached, device=device, dtype=self.inv_freq.dtype
          )

          freqs = torch.outer(t, self.inv_freq)
          # Different from paper, but it uses a different permutation in order to obtain the same calculation
          emb = torch.cat((freqs, freqs), dim=-1)
          self.register_buffer("cos_cached", emb.cos().to(dtype), persistent=False)
          self.register_buffer("sin_cached", emb.sin().to(dtype), persistent=False)
  ```

- 工具函数

  ```python
  def rotate_half(x):
      """
      对向量后半部分取负号并交换前后部分，以配合 RoPE 的复数乘法展开式。

      公式: [-x_2, x_1] 对应于复数空间中的 (x_1 + i*x_2) * i = (-x_2 + i*x_1)

      Args:
          x: 输入张量，形状为 [..., head_dim]
      """
      x1 = x[..., : x.shape[-1] // 2]
      x2 = x[..., x.shape[-1] // 2 :]
      return torch.cat((-x2, x1), dim=-1)

  def apply_rotary_pos_emb(q, k, cos, sin, position_ids, unsqueeze_dim=1):
      """
      将旋转位置编码应用到 Q 和 K。

      实现公式：
      O = Q * cos(θ) + rotate_half(Q) * sin(θ)

      Args:
          q: Query 张量 [batch, num_heads, seq_len, head_dim]
          k: Key 张量 [batch, num_kv_heads, seq_len, head_dim]
          cos: 预计算好的 cos 缓存
          sin: 预计算好的 sin 缓存
          position_ids: 当前 token 的位置索引 [batch, seq_len]
          unsqueeze_dim: 需要在 cos 和 sin 上增加的维度位置，以便与 q 和 k 进行广播
      Returns:
          q_embed: 应用 RoPE 后的 Query 张量
          k_embed: 应用 RoPE 后的 Key 张量
      """
      # 按照 position_ids 从预计算的缓存中提取对应的 cos 和 sin
      # q, k 形状通常为 [batch, num_heads, seq_len, head_dim]
      # cos, sin 预计算形状为 [1, 1, max_seq, head_dim]
      cos = cos[:, :, position_ids, :].squeeze(1)  # [batch, seq_len, head_dim]
      sin = sin[:, :, position_ids, :].squeeze(1)
      # 使用广播机制完成旋转变换
      q_embed = (q * cos.unsqueeze(1)) + (rotate_half(q) * sin.unsqueeze(1))
      k_embed = (k * cos.unsqueeze(1)) + (rotate_half(k) * sin.unsqueeze(1))
      return q_embed, k_embed
  ```

## 归一化

### BatchNorm

### LayerNorm

- 代码实现

  ```python
  class LayerNorm(nn.Module):
      def __init__(self, hidden_size, eps=1e-6):
          super().__init__()
          self.hidden_size = hidden_size
          self.eps = eps

          # gamma 和 beta 是可学习的参数，初始化为 1 和 0
          self.gamma = nn.Parameter(torch.ones(hidden_size))
          self.beta = nn.Parameter(torch.zeros(hidden_size))

      def forward(self, x):
          # 公式：LayerNorm(x) = gamma * (x - mean) / sqrt(var + eps) + beta
          # 计算最后一个维度的均值和方差
          mean = x.mean(dim=-1, keepdim=True)  # [B, S, 1]
          var = x.var(dim=-1, keepdim=True, unbiased=False)  # [B, S, 1]
          # 标准化
          normalized = (x - mean) / torch.sqrt(var + self.eps)
          # 缩放和平移，*是逐元素乘法，+是逐元素加法
          output = self.gamma * normalized + self.beta
          return output
  ```

### RMSNorm

- 代码实现

  ```python
  class RMSNorm(nn.Module):
      def __init__(self, hidden_size, eps=1e-6):
          super().__init__()
          self.hidden_size = hidden_size
          self.eps = eps
          # RMSNorm 只有 gamma 参数，没有 beta 参数，初始化为 1
          self.gamma = nn.Parameter(torch.ones(hidden_size))

      def forward(self, x):
          # 公式：RMSNorm(x) = gamma * x / sqrt(mean(x^2) + eps)
          rms = torch.sqrt(x.pow(2).mean(dim=-1, keepdim=True) + self.eps)
          normalized = x / rms
          output = self.gamma * normalized
          return output
  ```

## Transformer

### FFN

- 代码实现

  ```python
  class FFN(nn.Module):
      def __init__(self, hidden_size, intermediate_size):
          super().__init__()
          self.hidden_size = hidden_size

          self.up_proj = nn.Linear(hidden_size, intermediate_size)
          self.down_proj = nn.Linear(intermediate_size, hidden_size)
          self.dropout = nn.Dropout(0.1)

      def forward(self, x):
          x = self.up_proj(x)
          x = F.gelu(x)
          x = self.down_proj(x)
          x = self.dropout(x)
          return x
  ```

### SwiGLU

- 代码实现

  ```python
  class SwiGLU(nn.Module):
      def __init__(self, hidden_size, intermediate_size):
          super().__init__()
          self.hidden_size = hidden_size

          self.gate = nn.Linear(hidden_size, intermediate_size)
          self.up_proj = nn.Linear(hidden_size, intermediate_size)
          self.down_proj = nn.Linear(intermediate_size, hidden_size)
          self.dropout = nn.Dropout(0.1)

      def forward(self, x):
          return self.down_proj(F.silu(self.gate(x)) * self.up_proj(x))
  ```

### MoE

- 代码实现

  ```python
  class MoELayer(nn.Module):
      """
      原理:
      MoE 层通过门控网络 (Gate) 动态地为输入的每个 token 选择 Top-K 个专家
      MoE 的特殊设计包括：
      1. 共享专家 (Shared Experts): 处理所有 token 的特征，提取共性知识
      2. 稀疏专家 (Routed/Sparse Experts): 只处理选中的 token

      公式:
      Output = Shared_Experts(x) + Gate(x) * TopK_Experts(x)
      """

      def __init__(
          self,
          hidden_size: int,                  # 模型维度
          num_experts: int,                 # 总专家数
          num_experts_per_tok: int,         # 每个 token 选 Top-K 个专家
          intermediate_size: int = None,    # FFN 中间维度（默认 4*hidden_size）
          use_shared_expert: bool = True,   # 是否使用共享专家
          dropout: float = 0.0              # dropout 概率
          balance_loss_coef: float = 0.01  # 平衡损失系数
      ):
          super().__init__()
          self.hidden_size = hidden_size
          self.num_experts = num_experts
          self.top_k = num_experts_per_tok
          self.balance_loss_coef = balance_loss_coef  # 通常 0.01 ~ 0.001

          # 门控网络
          self.gate = nn.Linear(hidden_size, num_experts, bias=False)

          # 稀疏路由专家
          self.experts = nn.ModuleList([
              SwiGLU(hidden_size, intermediate_size, dropout)
              for _ in range(num_experts)
          ])

          # 共享专家
          self.shared_experts = (
              SwiGLU(hidden_size, intermediate_size, dropout)
              if use_shared_expert else None
          )

      def forward(self, hidden_states: torch.Tensor) -> torch.Tensor:
          batch_size, seq_len, hidden_size = hidden_states.shape

          # 展平 [B, S, H] -> [B*S, H]
          x = hidden_states.view(-1, hidden_size)
          num_tokens = x.shape[0]

          # 1. 门控路由 + TopK
          router_logits = self.gate(x)
          routing_weights = nnf.softmax(router_logits, dim=-1, dtype=torch.float32)
          weights, selected_experts = torch.topk(routing_weights, self.top_k, dim=-1)

          # 权重归一化
          weights = weights / weights.sum(dim=-1, keepdim=True)
          weights = weights.to(x.dtype)

          balance_loss = self._calculate_balance_loss(
              routing_weights, selected_experts, num_tokens
          )

          # 2. 稀疏专家计算
          final_hidden_states = torch.zeros_like(x)

          for expert_idx in range(self.num_experts):
              expert = self.experts[expert_idx]
              # 找到选中当前专家的 token
              token_mask = (selected_experts == expert_idx).any(dim=-1)
              if not token_mask.any():
                  continue

              token_indices = torch.where(token_mask)[0]
              expert_out = expert(x[token_indices])

              # 加权累加所有 Top-K 路径
              for k in range(self.top_k):
                  pos_mask = selected_experts[token_indices, k] == expert_idx
                  if pos_mask.any():
                      final_hidden_states[token_indices[pos_mask]] += (
                          weights[token_indices[pos_mask], k, None] * expert_out[pos_mask]
                      )

          # 3. 加上共享专家输出
          if self.shared_experts is not None:
              final_hidden_states += self.shared_experts(x)

          # 恢复形状
          output = final_hidden.view(batch_size, seq_len, hidden_size)
          return output, balance_loss

  	 def _calculate_balance_loss(self, routing_weights, selected_experts, num_tokens):
          """
          标准 MoE 负载均衡损失（Google Switch Transformer）
          防止部分专家被过度使用，部分闲置
          """
          if self.num_experts <= 1:
              return torch.tensor(0.0, device=routing_weights.device)

          # 每个 token 分配给专家的概率（mean over tokens）
          prob_per_expert = routing_weights.mean(dim=0)  # [E]

          # 每个专家被选中的频率（实际分配到的 token 占比）
          mask = torch.zeros_like(routing_weights)
          mask.scatter_(1, selected_experts, 1.0)
          freq_per_expert = mask.sum(dim=0) / num_tokens  # [E]

          # 平衡损失公式
          balance_loss = self.num_experts * (prob_per_expert * freq_per_expert).sum()
          balance_loss = balance_loss * self.balance_loss_coef

          return balance_loss
  ```

- Qwen3-MoE

  ```python
  class Qwen3MoeSparseMoeBlock(nn.Module):
      """
      Qwen3混合专家模型中的稀疏MoE模块，通过路由器选择部分专家处理输入，实现高效计算
      """
      def __init__(self, config: Qwen3MoeConfig):
          super().__init__()
          # 1. 基础配置参数
          self.hidden_size = config.hidden_size  # 输入特征维度
          self.num_experts = config.num_experts  # 专家网络总数：128
          self.num_experts_per_tok = config.num_experts_per_tok  # 每个token激活的专家数：8

          # 2. 路由器（Router）：决定每个token选择哪些专家
          # 输入：[batch_size, seq_len, hidden_size]，输出：[batch_size, seq_len, num_experts]（专家权重）
          self.gate = nn.Linear(self.hidden_size, self.num_experts, bias=False)

          # 3. 初始化专家网络（每个专家为独立的MLP）
          # 专家网络通常采用与稠密MLP相同的结构（如两次线性变换+激活函数）
          self.experts = nn.ModuleList([
              Qwen3MoeMLP(config)  # 复用Qwen3的MLP结构作为专家
              for _ in range(self.num_experts)
          ])

          # 4. 损失函数相关（可选，用于训练时平衡专家负载）
          self.router_aux_loss_coef = config.router_aux_loss_coef  # 路由器辅助损失系数

      def forward(self, hidden_states: torch.Tensor) -> tuple[torch.Tensor, torch.Tensor]:
          """
          前向传播：输入特征 → 路由器选专家 → 专家计算 → 融合输出
          Args:
              hidden_states: 输入特征，形状为 [batch_size, seq_len, hidden_size]
          Returns:
              output: 融合后的输出特征，形状同输入
              router_aux_loss: 路由器辅助损失（用于训练时优化专家负载均衡）
          """
          # ===== 步骤1：计算路由器输出（专家权重）=====
          # 输入通过线性层得到每个专家的原始分数（logits）
          # 形状：[batch_size, seq_len, num_experts]
          router_logits = self.gate(hidden_states)

          # ===== 步骤2：选择Top-K专家并计算权重 =====
          # 对每个token，选择分数最高的num_experts_per_tok个专家
          # top_k_weights: 选中专家的权重（经softmax归一化），形状 [batch_size, seq_len, num_experts_per_tok]
          # top_k_indices: 选中专家的索引，形状 [batch_size, seq_len, num_experts_per_tok]
          top_k_weights, top_k_indices = torch.topk(router_logits, self.num_experts_per_tok, dim=-1)
          top_k_weights = nn.functional.softmax(top_k_weights, dim=-1, dtype=torch.float32)

          # ===== 步骤3：计算路由器辅助损失（可选，训练用）=====
          # 目的是鼓励专家负载均衡，避免少数专家被频繁选中
          # 计算方式：对router_logits做softmax后取均值，再求负熵（简化实现）
          if self.training:
              # 先对专家分数做softmax，得到每个专家被选中的概率
              router_probs = nn.functional.softmax(router_logits, dim=-1, dtype=torch.float32)
              # 计算每个专家的平均负载（跨batch和seq_len）
              expert_load = torch.mean(router_probs, dim=(0, 1))  # 形状 [num_experts]
              # 辅助损失：鼓励负载均衡（熵越大，分布越均衡）
              router_aux_loss = torch.sum(expert_load * torch.log(expert_load + 1e-10))  # 负熵
              router_aux_loss *= self.router_aux_loss_coef  # 乘以系数
          else:
              router_aux_loss = torch.tensor(0.0, device=hidden_states.device)  # 推理时无损失

          # ===== 步骤4：准备输入，分发到选中的专家 =====
          # 调整输入形状为 [batch_size * seq_len, hidden_size]，便于批量处理
          batch_size, seq_len, hidden_size = hidden_states.shape
          hidden_states = hidden_states.view(-1, hidden_size)  # 形状 [total_tokens, hidden_size]，total_tokens = batch_size * seq_len

          # 调整选中专家索引形状：[total_tokens, num_experts_per_tok]
          top_k_indices = top_k_indices.view(-1, self.num_experts_per_tok)  # [total_tokens, k]
          # 调整权重形状：[total_tokens, num_experts_per_tok, 1]（便于广播）
          top_k_weights = top_k_weights.view(-1, self.num_experts_per_tok, 1)  # [total_tokens, k, 1]

          # ===== 步骤5：专家计算与结果融合 =====
          # 初始化输出张量
          final_output = torch.zeros(
              (batch_size * seq_len, hidden_size),  # 与输入同形状
              dtype=hidden_states.dtype,
              device=hidden_states.device
          )

          # 遍历每个专家，处理所有选中该专家的token
          for expert_idx in range(self.num_experts):
              # 找到所有选中当前专家的token索引
              # 掩码：[total_tokens, k] → True表示该位置选中了当前专家
              expert_mask = (top_k_indices == expert_idx)  # [total_tokens, k]
              # 若没有token选中当前专家，跳过
              if not expert_mask.any():
                  continue

              # 收集选中当前专家的token及其对应的权重
              # 1. 提取这些token的输入特征
              expert_input = hidden_states[expert_mask.any(dim=1)]  # [num_tokens_for_this_expert, hidden_size]
              # 2. 提取这些token对当前专家的权重（取第一个匹配的权重，因每个位置最多选k个专家）
              expert_weights = top_k_weights[expert_mask]  # [num_tokens_for_this_expert, 1]

              # 3. 当前专家处理输入
              expert_output = self.experts[expert_idx](expert_input)  # [num_tokens_for_this_expert, hidden_size]
              # 4. 加权：用该专家的权重乘以输出
              expert_output = expert_output * expert_weights  # [num_tokens_for_this_expert, hidden_size]

              # 5. 将结果累加至最终输出（对应位置）
              final_output[expert_mask.any(dim=1)] += expert_output

          # ===== 步骤6：恢复输出形状并返回 =====
          final_output = final_output.view(batch_size, seq_len, hidden_size)  # [batch_size, seq_len, hidden_size]
          return final_output, router_aux_loss
  ```

### TransformerBlock

- 代码实现

  ```python
  class TransformerBlock(nn.Module):
      def __init__(
          self,
          hidden_size,
          num_heads,
          intermediate_size,
          attention_type="multi_head",
          num_groups=1,
          latent_dim=128,
          norm_type="layer_norm",
          pre_norm=True,
          gated_ffn=True,
      ):
          super().__init__()
          self.hidden_size = hidden_size
          self.num_heads = num_heads
          self.intermediate_size = intermediate_size
          self.pre_norm = pre_norm
          self.gated_ffn = gated_ffn

          if attention_type == "multi_head":
              self.attention = MultiHeadAttention(hidden_size, num_heads)
          elif attention_type == "multi_query":
              self.attention = MultiQueryAttention(hidden_size, num_heads)
          elif attention_type == "group_query":
              self.attention = GroupQueryAttention(hidden_size, num_heads, num_groups)
          elif attention_type == "multi_latent":
              self.attention = MultiLatentAttention(
                  hidden_size, num_heads, latent_dim=latent_dim
              )
          elif attention_type == "linear":
              self.attention = LinearAttention(hidden_size, num_heads)
          else:
              raise ValueError(f"Unsupported attention type: {attention_type}")

          if norm_type == "layer_norm":
              self.norm1 = LayerNorm(hidden_size)
              self.norm2 = LayerNorm(hidden_size)
          elif norm_type == "rms_norm":
              self.norm1 = RMSNorm(hidden_size)
              self.norm2 = RMSNorm(hidden_size)
          else:
              raise ValueError(f"Unsupported norm type: {norm_type}")

          if gated_ffn:
              self.ffn = SwiGLU(hidden_size, intermediate_size)
          else:
              self.ffn = FFN(hidden_size, intermediate_size)

      def forward(self, x, mask=None):
          # 注意力子层
          if self.pre_norm:
              attn_output, _ = self.attention(self.norm1(x), mask=mask)
              x = x + attn_output  # 残差连接
          else:
              attn_output, _ = self.attention(x, mask=mask)
              x = self.norm1(x + attn_output)  # 残差连接 + 后归一化

          # FFN 子层
          if self.pre_norm:
              x = x + self.ffn(self.norm2(x))  # 残差连接
          else:
              x = self.norm2(x + self.ffn(x))  # 残差连接 + 后归一化

          return x
  ```

### Transformer

- 代码实现

  ```python
  class Transformer(nn.Module):
      def __init__(
          self,
          vocab_size,  # 词表大小
          hidden_size,  # 隐藏层维度
          num_layers,  # Transformer 层数
          num_heads,  # 注意力头数
          intermediate_size,  # FFN 中间维度
          max_seq_len=512,  # 最大序列长度
          attention_type="multi_head",
          num_groups=1,
          latent_dim=128,
          norm_type="rms_norm",  # 默认 RMSNorm
          pre_norm=True,
          gated_ffn=True,
          dropout=0.1,
      ):
          super().__init__()
          self.hidden_size = hidden_size
          self.max_seq_len = max_seq_len

          self.embedding = nn.Embedding(vocab_size, hidden_size)
          self.pos_embedding = nn.Embedding(max_seq_len, hidden_size)  # 绝对位置编码
          self.dropout = nn.Dropout(dropout)

          self.layers = nn.ModuleList(
              [
                  TransformerBlock(
                      hidden_size=hidden_size,
                      num_heads=num_heads,
                      intermediate_size=intermediate_size,
                      attention_type=attention_type,
                      num_groups=num_groups,
                      latent_dim=latent_dim,
                      norm_type=norm_type,
                      pre_norm=pre_norm,
                      gated_ffn=gated_ffn,
                  )
                  for _ in range(num_layers)
              ]
          )

          self.norm = (
              nn.LayerNorm(hidden_size)
              if norm_type == "layer_norm"
              else RMSNorm(hidden_size)
          )

          self.lm_head = nn.Linear(hidden_size, vocab_size)

          self.apply(self._init_weights)

      def _init_weights(self, module):
          if isinstance(module, nn.Linear):
              torch.nn.init.normal_(module.weight, mean=0.0, std=0.02)
              if module.bias is not None:
                  torch.nn.init.zeros_(module.bias)
          elif isinstance(module, nn.Embedding):
              torch.nn.init.normal_(module.weight, mean=0.0, std=0.02)

      def forward(self, input_ids, mask=None):
          B, L = input_ids.shape
          device = input_ids.device

          # 1. 词嵌入 + 位置编码
          positions = torch.arange(0, L, dtype=torch.long, device=device).unsqueeze(0)
          x = self.embedding(input_ids) + self.pos_embedding(positions)  # [B, L, H]
          x = self.dropout(x)

          # 2. 过 N 层 Transformer
          for layer in self.layers:
              x = layer(x, mask=mask)

          # 3. 最后归一化
          x = self.norm(x)

          # 4. 语言模型预测（输出 logits）
          logits = self.lm_head(x)  # [B, L, vocab_size]

          return logits
  ```

## 强化学习

### PPO

- 代码实现

  ```python
  import torch
  import torch.nn.functional as F

  def masked_mean(tensor, mask):
      return (tensor * mask).sum() / (mask.sum() + 1e-8)

  def masked_whiten(tensor, mask, shift_mean=True):
      mean = masked_mean(tensor, mask)
      centered = tensor - mean
      var = masked_mean(centered**2, mask)
      std = torch.sqrt(var + 1e-8)
      whitened = (centered / std) if shift_mean else (tensor / std)
      return whitened * mask

  # =========================
  # GAE Advantage
  # =========================
  def compute_advantages(
      token_level_rewards,   # [B, T]
      values,    # [B, T]
      gamma=0.99,
      lambd=0.95,
  ):
      with torch.no_grad():
          lastgaelam = 0
          advantages_reversed = []
          gen_len = token_level_rewards.shape[-1]

          for t in reversed(range(gen_len)):
              nextvalues = values[:, t + 1] if t < gen_len - 1 else 0.0
              delta = token_level_rewards[:, t] + gamma * nextvalues - values[:, t]
              lastgaelam = delta + gamma * lambd * lastgaelam
              advantages_reversed.append(lastgaelam)
          advantages = torch.stack(advantages_reversed[::-1], dim=1)

          returns = advantages + values

          # advantages = (advantages - advantages.mean()) / (advantages.std() + 1e-8)
          advantages = masked_whiten(advantages, mask=mask) # 归一化

      return advantages, returns

  # =========================
  # PPO Loss
  # =========================
  def ppo_loss(
      logprobs,          # new log probs [B, T]
      old_logprobs,      # old log probs [B, T]
      values,            # new values [B, T]
      old_values,        # old values [B, T]
      advantages,        # [B, T]
      returns,           # [B, T]
      ref_logprobs,      # [B, T]

      clip_range=0.2,
      value_clip_range=0.2,
      kl_coef=0.1,
      vf_coef=0.5,
      ent_coef=0.01,
  ):
      # ===== ratio =====
      ratio = torch.exp(logprobs - old_logprobs)

      # ===== policy loss =====
      surr1 = ratio * advantages
      surr2 = torch.clamp(ratio, 1 - clip_range, 1 + clip_range) * advantages
      policy_loss = torch.min(surr1, surr2)
      policy_loss = - masked_mean(policy_loss, loss_mask)

      # ===== value loss =====
      value_pred_clipped = old_values + torch.clamp(
          values - old_values, -value_clip_range, value_clip_range
      )
      value_loss_1 = (values - returns) ** 2
      value_loss_2 = (value_pred_clipped - returns) ** 2
      value_loss = 0.5 * torch.max(value_loss_1, value_loss_2)
      value_loss = masked_mean(value_loss, loss_mask)

      # ===== entropy =====
      entropy = -torch.sum(torch.exp(logprobs) * logprobs, dim=-1)
      entropy_loss = - torch.mean(entropy)

      total_loss = policy_loss + vf_coef * value_loss + ent_coef * entropy_loss

      return total_loss

  # =========================
  # Training Loop（无 minibatch）
  # =========================
  for step in range(num_steps):

      # ===== 1. Rollout =====
      with torch.no_grad():
          responses, old_logprobs, old_values = model.generate(prompts)
          ref_logprobs = ref_model.forward(responses).detach()

      # ===== 2. Reward =====
      with torch.no_grad():
          # kl 惩罚直接加在 reward 中，这里使用 k1 估计
    	kl = ref_logprobs - old_logprobs
          rewards = reward_model.get_rewards(prompts, responses) - kl_coef * kl

      # ===== 3. Advantage =====
      advantages, returns = compute_advantages(
          rewards,
          old_values,
      )

      # ===== 4. PPO 多轮更新（batch）=====
      for _ in range(ppo_epochs):

          logprobs, values = model.forward(responses)

          loss, stats = ppo_loss(
              logprobs=nlogprobs, # 当前 logprobs
              old_logprobs=old_logprobs, # 旧策略 logprobs
              values=values, # 当前 values
              old_values=old_values, # 旧 values
              advantages=advantages, # 当前优势
              returns=returns, # 回报
              ref_logprobs=ref_logprobs, # 参考模型 logprobs
          )

          optimizer.zero_grad()
          loss.backward()
          optimizer.step()
  ```

### GRPO

- 代码实现

  ```python
  # =========================
  # GRPO Advantage
  # =========================
  def compute_grpo_advantages(rewards, eps=1e-8):
      mean = rewards.mean(dim=1, keepdim=True) # 求组内均值
      std = rewards.std(dim=1, keepdim=True) # 求组内标准差
      adv = (rewards - mean) / (std + eps) # 求组内优势估计
      return adv

  def compute_kl_loss(logprobs, ref_logprobs):
      log_ratio = logprobs - ref_logprobs
      kl = (torch.exp(log_ratio) - log_ratio - 1)
      return kl

  def masked_mean(tensor, mask):
      return (tensor * mask).sum() / (mask.sum() + 1e-8)

  # =========================
  # GRPO Loss
  # =========================
  def grpo_loss(
      logprobs,
      old_logprobs,
      ref_logprobs,
      advantages,
      loss_mask=None,
      clip_range=0.2,
      beta=0.1,
  ):
      # Policy loss
      ratio = torch.exp(logprobs - old_logprobs)

      surr1 = ratio * advantages
      surr2 = torch.clamp(ratio, 1 - clip_range, 1 + clip_range) * advantages

      policy_loss = torch.min(surr1, surr2)

      # kl loss
      kl_loss = compute_kl_loss(logprobs, ref_logprobs, beta)

      per_token_loss = policy_loss - beta * kl_loss

      total_loss = - masked_mean(per_token_loss, loss_mask)

      return total_loss


  for step in range(num_steps):

      # ===== 1. Rollout (Group Sampling) =====
      with torch.no_grad():
          responses, old_logprobs = model.generate(prompts, num_samples=K) # [B,K,S]
          ref_logprobs = ref_model.forward(responses).detach()

      # ===== 2. Reward =====
      with torch.no_grad():
          rewards = reward_model.get_rewards(prompts, responses)  # [B, K]

      # ===== 3. Advantage (GRPO) =====
      advantages = compute_grpo_advantages(rewards)  # [B, K]
      advantages = advantages.unsqueeze(-1)          # [B, K, 1]

      # ===== 4. PPO update =====
      for _ in range(ppo_epochs):

          logprobs = model.forward(responses)

          loss = grpo_loss(
              logprobs,
              old_logprobs,
              ref_logprobs,
              advantages,
              loss_mask=None,
          )

          optimizer.zero_grad()
          loss.backward()
          optimizer.step()
  ```

### DAPO

- 实现

  ```python
  import torch
  from typing import Dict

  def group_advantages(
      rewards: torch.Tensor,
      eps: float = 1e-6,
  ) -> torch.Tensor:
      """
      Args:
          rewards: [B, G]
      Returns:
          adv: [B, G]
      """
      mean = rewards.mean(dim=1, keepdim=True)
      std = rewards.std(dim=1, keepdim=True, unbiased=False)
      adv = (rewards - mean) / (std + eps)
      return adv


  def dynamic_sampling_filter(
      rewards: torch.Tensor,
      positive_threshold: float = 0.0,
  ) -> torch.Tensor:
      """
      rewards: [B, G]
      这里默认 reward > positive_threshold 视作 correct。
      返回保留哪些 group 的 mask: [B]
      DAPO 只保留 0 < num_correct < G 的 group
      """
      correct = (rewards > positive_threshold).to(torch.long)  # [B, G]
      num_correct = correct.sum(dim=1)                       # [B]
      G = rewards.size(1)

      keep_group = (num_correct > 0) & (num_correct < G)
      return keep_group


  def dapo_loss(
      batch,
      eps_low: float = 0.2,
      eps_high: float = 0.28,
      advantage_eps: float = 1e-6,
      token_level: bool = True,
  ) -> Dict[str, torch.Tensor]:
      """
      DAPO loss:
          1) 先做 dynamic sampling group filter
          2) 再做 decoupled clipping
          3) 默认 token-level reduction
      """
      logprobs = batch.logprobs           # [B, G, T]
      old_logprobs = batch.old_logprobs   # [B, G, T]
      token_mask = batch.token_mask.float()  # [B, G, T]
      rewards = batch.rewards.float()     # [B, G]

      assert logprobs.shape == old_logprobs.shape == token_mask.shape
      assert rewards.shape[:2] == logprobs.shape[:2]

      keep_group = dynamic_sampling_filter(rewards)  # [B]

      if keep_group.sum() == 0:
          # 一个 batch 都没保正时, 返回零损失, 外面应继续采样补 batch
          zero = logprobs.sum() * 0.0
          return {
              "loss": zero,
              "pg_loss": zero,
              "kept_groups": torch.tensor(0, device=logprobs.device),
              "total_groups": torch.tensor(logprobs.size(0), device=logprobs.device),
          }

      logprobs = logprobs[keep_group]          # [B', G, T]
      old_logprobs = old_logprobs[keep_group]
      token_mask = token_mask[keep_group]
      rewards = rewards[keep_group]

      if batch.seq_mask is not None:
          seq_mask = batch.seq_mask[keep_group].float()  # [B', G]
      else:
          seq_mask = torch.ones_like(rewards)

      adv = group_advantages(rewards, eps=advantage_eps)  # [B', G]
      adv = adv * seq_mask

      # broadcast to token level: [B', G, T]
      adv_t = adv.unsqueeze(-1)

      log_ratio = logprobs - old_logprobs
      ratio = torch.exp(log_ratio)

      clipped_ratio = torch.clamp(
          ratio,
          min=1.0 - eps_low,
          max=1.0 + eps_high,
      )

      surr1 = ratio * adv_t
      surr2 = clipped_ratio * adv_t
      pg_obj = torch.minimum(surr1, surr2)  # [B', G, T]
      pg_obj = pg_obj * token_mask

      if token_level:
          # DAPO 更强调 token-level PG loss
          denom = token_mask.sum().clamp_min(1.0)
          pg_loss = -pg_obj.sum() / denom
      else:
          # 类 GRPO 的 sample-level reduction
          token_denom = token_mask.sum(dim=-1).clamp_min(1.0)    # [B', G]
          seq_obj = pg_obj.sum(dim=-1) / token_denom             # [B', G]
          seq_denom = seq_mask.sum().clamp_min(1.0)
          pg_loss = -seq_obj.sum() / seq_denom

      return {
          "loss": pg_loss,
          "pg_loss": pg_loss,
          "kept_groups": keep_group.sum(),
          "total_groups": torch.tensor(batch.rewards.size(0), device=batch.rewards.device),
      }
  ```

### DPO

- 代码实现

  ```python
  def dpo_loss(chosen_logprobs,rejected_logprobs,ref_chosen_logprobs,ref_rejected_logprobs,beta):
      chosen = chosen_logprobs - ref_chosen_logprobs
      rejected = rejected_logprobs - ref_rejected_logprobs
      loss = -torch.nn.functional.logsigmoid(beta*(chosen-rejected))
      return loss.mean()
  ```

- DPO 实现

  ```python
  def sequence_logprob(logits, labels, mask):
      """
      logits: [B, T, V]
      labels: [B, T]
      mask:   [B, T]
      """
      log_probs = F.log_softmax(logits, dim=-1)
      token_logp = torch.gather(
          log_probs, dim=-1, index=labels.unsqueeze(-1)
      ).squeeze(-1)

      return (token_logp * mask).sum(dim=-1)  # [B]

  def dpo_loss(
      policy_chosen_logp,     # [B]
      policy_rejected_logp,   # [B]
      ref_chosen_logp,        # [B]
      ref_rejected_logp,      # [B]
      beta=0.1,
  ):
      pi_logratios = policy_chosen_logp - policy_rejected_logp
      ref_logratios = ref_chosen_logp - ref_rejected_logp

      logits = beta * (pi_logratios - ref_logratios)

      loss = -F.logsigmoid(logits).mean()

      return loss, {
          "reward_margin": logits.mean().item(),
          "accuracy": (logits > 0).float().mean().item(),
      }

  for step in range(num_steps):

      # ===== 1. batch =====
      batch = next(dataloader)
      prompt = batch["prompt"]
      chosen = batch["chosen"]
      rejected = batch["rejected"]

      # ===== 2. policy forward =====
      chosen_logits = actor_model(prompt, chosen)
      rejected_logits = actor_model(prompt, rejected)

      # ===== 3. ref forward（no grad）=====
      with torch.no_grad():
          ref_chosen_logits = ref_model(prompt, chosen)
          ref_rejected_logits = ref_model(prompt, rejected)

      # ===== 4. logprob =====
      chosen_logp = sequence_logprob(
          chosen_logits, chosen["labels"], chosen["mask"]
      )
      rejected_logp = sequence_logprob(
          rejected_logits, rejected["labels"], rejected["mask"]
      )

      ref_chosen_logp = sequence_logprob(
          ref_chosen_logits, chosen["labels"], chosen["mask"]
      )
      ref_rejected_logp = sequence_logprob(
          ref_rejected_logits, rejected["labels"], rejected["mask"]
      )

      # ===== 5. loss =====
      loss, stats = dpo_loss(
          chosen_logp,
          rejected_logp,
          ref_chosen_logp,
          ref_rejected_logp,
      )

      optimizer.zero_grad()
      loss.backward()
      optimizer.step()
  ```
