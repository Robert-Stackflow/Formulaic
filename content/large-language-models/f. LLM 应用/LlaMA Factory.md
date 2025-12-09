---
title: LlaMA Factory
description: 介绍 LlaMA Factory 的配置参数及其在大语言模型微调中的应用
---

## 一、基本参数

| 参数名称              | 参数值与解释                                                        |
| ----------------- | ------------------------------------------------------------- |
| `stage`           | 微调阶段，可选以下类型：                                                  |
|                   | `pt`（Pretraining）：预训练阶段。                                      |
|                   | `sft`（Supervised Fine-tuning）：监督微调阶段。                         |
|                   | `rm`（Reward Modeling）：奖励建模阶段。                                 |
|                   | `ppo`（Proximal Policy Optimization）：基于奖励的强化微调阶段。              |
|                   | `dpo`（Direct Preference Optimization）：偏好优化阶段。                 |
|                   | `kto`（Knowledge Transfer Optimization）：知识迁移优化阶段。              |
| `do_train`        | 是否执行训练。`true` 表示执行训练，`false` 表示跳过训练过程，仅用于推理或验证。               |
| `finetuning_type` | 微调类型，可选以下模式：                                                  |
|                   | `full`：全量微调，更新模型的所有参数。                                        |
|                   | `freeze`：冻结大部分模型参数，仅更新特定层（如顶层全连接层）。                           |
|                   | `lora`（Low-Rank Adaptation）：通过低秩矩阵更新模型，减少参数开销，适合高效微调场景。       |
|                   | `qlora`（Quantized Low-Rank Adaptation）：结合量化和低秩矩阵更新，进一步降低资源需求。 |

## 二、调优方法参数

### 2.1 Freeze (冻结微调)

|            参数名称            |  类型 |  必需 | 介绍                                                       |
| :------------------------: | :-: | :-: | :------------------------------------------------------- |
|  `freeze_trainable_layers` | int |  必需 | 可训练层的数量。正数表示最后 n 层被设置为可训练的，负数表示前 n 层被设置为可训练的。默认值为 `2`    |
| `freeze_trainable_modules` | str |  必需 | 可训练层的名称。使用 `all` 来指定所有模块。默认值为 `all`                      |
|   `freeze_extra_modules`   | str | 非必需 | 除了隐藏层外可以被训练的模块名称，被指定的模块将会被设置为可训练的。使用逗号分隔多个模块。默认值为 `None` |

### 2.2 LoRA

|           参数名称           |    类型   |  必需 | 介绍                                                                                                                             |
| :----------------------: | :-----: | :-: | ------------------------------------------------------------------------------------------------------------------------------ |
|     **`lora_alpha`**     |   int   | 非必需 | LoRA 的缩放系数，用于平衡模型的学习率和训练稳定性。一般情况下为`lora_rank*2`, 默认值为`None`                                                                    |
|    **`lora_dropout`**    |  float  |  必需 | LoRA 中权重随机丢弃的概率，防止过拟合，通常在 0 和 0.1 之间选择。默认值为`0`                                                                                 |
|      **`lora_rank`**     |   int   |  必需 | LoRA 微调的本征维数`r`，`r`越大可训练的参数越多。默认值为`8`                                                                                          |
|       `lora_target`      |   str   |  必需 | 应用 LoRA 方法的模块名称。使用逗号分隔多个模块，使用 `all` 指定所有模块。默认值为 `all`。可选如`"q_proj"` 和 `"v_proj"` ，这两者是` Transformer`中的查询投影和键投影层，通常是注意力机制的核心部分。 |
|  **`loraplus_lr_ratio`** |  float  | 非必需 | LoRA + 中的学习率比例 ($λ=η_B/η_A$)，其中 ${η_B}$ 和 ${η_A}$ 分别是适配层矩阵中 $A$ 和 $B$ 的学习率。该值的理想取值与所选择的模型和任务有关。默认值为`None`                      |
|  `loraplus_lr_embedding` |  float  | 非必需 | LoRA + 嵌入层的学习率，默认值为 `1e-6`                                                                                                     |
|       `use_rslora`       |   bool  |  必需 | 是否使用秩稳定缩放方法（Rank-Stabilized LoRA），默认值为`False`                                                                                  |
|        `use_dora`        |   bool  |  必需 | 是否使用权重分解的 LoRA（Weight-Decomposed LoRA），默认值为`False`                                                                             |
|       `pissa_init`       |   bool  |  必需 | 是否初始化 PiSSA 适配器，默认值为`False`                                                                                                    |
|       `pissa_iter`       |   int   |  必需 | PiSSA 中 FSVD 执行的迭代步数。使用`-1`将其禁用，默认值为`16`                                                                                       |
|      `pissa_convert`     |   bool  |  必需 | 是否将 PiSSA 适配器转换为正常的 LoRA 适配器，默认值为`False`                                                                                       |
| **`create_new_adapter`** |   bool  |  必需 | 是否创建一个具有随机初始化权重的新适配器，默认值为`False`                                                                                               |
|    `additional_target`   | \[str,] | 非必需 | 除 LoRA 层之外设置为可训练并保存在最终检查点中的模块名称。使用逗号分隔多个模块。默认值为`None`                                                                          |

### 2.3 LoRA 变种

#### 2.3.1 LoRA+

- 在 LoRA 中，适配器矩阵 $A$ 和 $B$ 的学习率相同
- 在 LoRA + 中，可以通过设置`loraplus_lr_ratio`来调整学习率比例
- 适配器矩阵 $A$ 的学习率 ${η_A}$ 即为优化器学习率，而适配器矩阵 $B$ 的学习率 ${η_B}$ 为 ${λ\times η_A}$，其中 $λ$ 为`loraplus_lr_ratio`的值

#### 2.3.2 rsLoRA

- LoRA 通过添加低秩适配器进行微调，然而`lora_rank`的增大往往会导致梯度塌陷，使得训练变得不稳定。这使得在使用较大的`lora_rank`进行 LoRA 微调时较难取得令人满意的效果
- rsLoRA (Rank-Stabilized LoRA) 通过修改缩放因子使得模型训练更加稳定

#### 2.3.3 DoRA

- DoRA (Weight-Decomposed Low-Rank Adaptation) 提出：尽管 LoRA 大幅降低了推理成本，但这种方式取得的性能与全量微调之间仍有差距
- DoRA 将权重矩阵分解为大小与单位方向矩阵的乘积，并进一步微调二者（对方向矩阵则进一步使用 LoRA 分解），从而实现 LoRA 与 Full Fine-tuning 之间的平衡

#### 2.3.4 PiSSA

- 在 LoRA 中，适配器矩阵 $A$ 由`kaiming_uniform`初始化，而适配器矩阵 $B$ 则全初始化为 0
- 这导致一开始的输入并不会改变模型输出并且使得梯度较小，收敛较慢
- PiSSA 通过奇异值分解直接分解原权重矩阵进行初始化，可以更快更好地收敛

#### 2.3.5 QLoRA

| 参数名称        | 参数值与解释                                                                                    |
| ----------- | ----------------------------------------------------------------------------------------- |
| `pref_beta` | 表示偏好模型训练中的正则化强度，用于控制奖励模型（preference model）与目标模型预测之间的一致性权衡                                 |
|             | 小值（如 0.1）表示训练更倾向于遵循偏好标签（标注数据中的选择）                                                         |
|             | 大值更注重保持模型输出的多样性，避免过于依赖偏好数据                                                                |
| `pref_loss` | 定义偏好模型训练中使用的损失函数，用于优化模型根据用户或标注偏好的输出能力，可选以下值：                                              |
|             | `sigmoid`：采用对数逻辑回归损失函数，通过 sigmoid 计算偏好得分，常用于偏好优化（如 DPO, Direct Preference Optimization）   |
|             | `orpo`：Online Reward Preference Optimization，动态调整偏好奖励分布，适合频繁更新奖励模型的场景。在线优化，更适合实时调整偏好分布    |
|             | `simpo`：Similarity Preference Optimization，基于相似性进行偏好优化，通过最大化与标注偏好的相似性更新模型，适合复杂的多模态或嵌套偏好场景 |

### 2.4 Galore

GaLore，梯度低秩投影（Gradient Low-Rank Projection），使用 Galore 时，将`finetuning_type`设置为`full`。

|             参数名称             |    类型   | 介绍                                                                            |
| :--------------------------: | :-----: | :---------------------------------------------------------------------------- |
|         `use_galore`         |   bool  | 是否使用 GaLore 算法，默认值为 `False`。                                                  |
|        `galore_target`       |   str   | 应用 GaLore 的模块名称。使用逗号分隔多个模块，使用 `all` 指定所有线性模块。默认值为 `all`。                      |
|       **`galore_rank`**      |   int   | GaLore 梯度的秩，默认值为 `16`。                                                        |
| **`galore_update_interval`** |   int   | 更新 GaLore 投影的步数间隔，默认值为 `200`。                                                 |
|      **`galore_scale`**      |  float  | GaLore 的缩放系数，默认值为 `0.25`。                                                     |
|      `galore_proj_type`      | Literal | GaLore 投影的类型，可选值有： `std` , `reverse_std`, `right`, `left`, `full`。默认值为 `std`。 |
|      `galore_layerwise`      |   bool  | 是否启用逐层更新以进一步节省内存，默认值为 `False`。                                                |

### 2.5 BAdam

BAdam，一种内存高效的全参数优化算法，使用 BAdam 时，将`finetuning_type`设置为`full`， 且将`pure_bf16`设置为`True`。

|             参数名称            |         类型         | 介绍                                                                                           |
| :-------------------------: | :----------------: | -------------------------------------------------------------------------------------------- |
|         `use_badam`         |        bool        | 是否使用 BAdam 优化器，默认值为 `False`。                                                                 |
|       **`badam_mode`**      |       Literal      | BAdam 的使用模式，可选值为 `layer` 或 `ratio`，默认值为 `layer`。                                             |
|     `badam_start_block`     |   Optional\[int]   | layer-wise BAdam 的起始块索引，默认值为 `None`。                                                         |
|   **`badam_switch_mode`**   | Optional\[Literal] | layer-wise BAdam 中块更新策略，可选值有： `ascending`, `descending`, `random`, `fixed`。默认值为 `ascending`。 |
| **`badam_switch_interval`** |   Optional\[int]   | layer-wise BAdam 中块更新步数间隔。使用 `-1` 禁用块更新，默认值为 `50`。                                           |
|   **`badam_update_ratio`**  |        float       | ratio-wise BAdam 中的更新比例，默认值为 `0.05`。                                                         |
|      `badam_mask_mode`      |       Literal      | BAdam 优化器的掩码模式，可选值为 `adjacent` 或 `scatter`，默认值为 `adjacent`。                                  |
|       `badam_verbose`       |         int        | BAdam 优化器的详细输出级别，0 表示无输出，1 表示输出块前缀，2 表示输出可训练参数。默认值为 `0`。                                     |

## 三、数据集参数

| 参数名称                        | 解释                                               |
| --------------------------- | ------------------------------------------------ |
| `dataset`                   | 在 `dataset_info.json` 中预设的数据集名称，以 `,` 分隔启用多个数据集。 |
| `template`                  | 数据处理模板。设置为 `llama3`，表明按照适配 Llama 3 模型的格式预处理数据。   |
| `cutoff_len`                | 输入序列的最大长度。2048 表示限制每条样本的最大 token 数。              |
| **`max_samples`**           | 数据集中的最大样本数量，设置为 1000，用于减少训练规模或调试。                |
| `overwrite_cache`           | 是否覆盖缓存的预处理数据，`true` 表示重新处理。                      |
| `preprocessing_num_workers` | 数据预处理的并行线程数，设置为 16，提高处理效率。                       |

## 四、输出参数

| 参数名称                   |  典型值 | 解释                         |
| ---------------------- | :--: | -------------------------- |
| `output_dir`           |   -  | 保存训练输出（模型权重、日志等）的路径。       |
| `logging_steps`        |  10  | 每两次日志输出间的更新步数。             |
| `save_steps`           |  500 | 每两次断点保存间的更新步数。             |
| `plot_loss`            | true | 是否记录并绘制损失变化曲线。`true` 表示开启。 |
| `overwrite_output_dir` | true | 是否覆盖输出目录中的内容。`true` 表示覆盖。  |

## 五、训练参数

| 参数名称                              |    典型值    | 解释                                                                                                                      |
| --------------------------------- | :-------: | ----------------------------------------------------------------------------------------------------------------------- |
| **`per_device_train_batch_size`** |     1     | 每张 GPU 上的训练批量大小，影响梯度的估计质量。较大的批量能提供更稳定的梯度，适合较大的学习率；较小的批量可能导致噪声较大。小批量大小（例如 1）需要配合`gradient_accumulation_steps`才能等效于更大的批量。 |
| **`gradient_accumulation_steps`** |     8     | 梯度累积步数，累积梯度可等效增大批量大小，影响模型的收敛性和泛化性能。                                                                                     |
| **`learning_rate`**               |    2e-4   | 初始学习率，最关键的超参数之一，直接影响训练的稳定性和收敛性。                                                                                         |
| **`num_train_epochs`**            |    3.0    | 训练总轮数，微调过程中，模型通常已经有良好的初始化，因此较少的轮数往往就足够。                                                                                 |
| `lr_scheduler_type`               |   cosine  | 学习率调度策略，决定了学习率如何变化；`cosine` 表示采用余弦退火策略，能够有效降低后期的学习率，通常对大模型训练表现较好。                                                       |
| `warmup_ratio`                    |    0.1    | 学习率预热阶段的比例，预热阶段可以防止训练一开始因为学习率过高而导致的梯度爆炸；`0.1`表示前 10% 的训练步数用于学习率预热。                                                      |
| `bf16`                            |    true   | 是否启用 bfloat16 混合精度训练，启用可减小内存占用并加速训练。                                                                                    |
| `ddp_timeout`                     | 180000000 | 分布式数据并行的超时时间，设置为非常大的值，确保分布式训练不会因为超时失败。                                                                                  |

> 加粗的参数为影响微调效果的重要参数

## 六、验证参数

| 参数名称                         |  典型值  | 解释                            |
| ---------------------------- | :---: | ----------------------------- |
| `val_size`                   |  0.1  | 验证集比例，`0.1` 表示训练数据中 10% 用于验证。 |
| `per_device_eval_batch_size` |   1   | 每张 GPU 上的验证批量大小。              |
| `eval_strategy`              | steps | 验证策略， `steps`表示每隔固定步数进行验证。    |
| `eval_steps`                 |  500  | 验证间隔步数，与 `save_steps` 保持一致。   |
