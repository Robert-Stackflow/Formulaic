---
title: 分治算法
description: 分治算法的核心思想、适用条件、典型应用与优缺点分析
---

## 分治的基本思想

- 分治算法是一种递归解决问题的策略，核心是：将一个大问题拆分成若干个规模更小、结构相同的子问题，分别解决每个子问题，最后将子问题的解合并，得到原问题的解

- 时间复杂度为 $O(\log n)$ 的搜索算法通常是基于分治策略实现的，例如二分查找和树
  - 二分查找的每一步都将问题（在数组中搜索目标元素）分解为一个小问题（在数组的一半中搜索目标元素），这个过程一直持续到数组为空或找到目标元素为止
  - 树是分治思想的代表，在二叉搜索树、AVL 树、堆等数据结构中，各种操作的时间复杂度皆为 $O(\log n)$

- 二分查找的分治策略如下
  - 问题可以分解：二分查找递归地将原问题（在数组中进行查找）分解为子问题（在数组的一半中进行查找），这是通过比较中间元素和目标元素来实现的

- 子问题是独立的：在二分查找中，每轮只处理一个子问题，它不受其他子问题的影响
  - 子问题的解无须合并：二分查找旨在查找一个特定元素，因此不需要将子问题的解进行合并;当子问题得到解决时，原问题也会同时得到解决

- 所有分治算法都遵循 “分→治→合” 三步，通用逻辑如下：

  ```text
  function 分治(问题):
      1. 终止条件：如果问题规模足够小（如只有1个元素），直接求解并返回；
      2. 分（Divide）：将问题拆分成若干个结构相同的子问题；
      3. 治（Conquer）：递归求解每个子问题；
      4. 合（Combine）：将子问题的解合并为原问题的解；
      5. 返回合并后的解；
  ```

- 典型应用
  - 归并排序
  - 求逆序对
  - 搜索矩阵 II
  - 快速排序
  - 大数乘法

- 不是所有问题都适合分治，需满足以下 3 个条件：
  - 问题可以分解：原问题能拆分成若干个结构相同的子问题；
  - 子问题是独立的：子问题之间无依赖，可独立解决；
  - 子问题能够合并：子问题的解能合并为原问题的解

- 优缺点

  | 优点                                    | 缺点                                     |
  | :-------------------------------------- | :--------------------------------------- |
  | 降低时间复杂度（如 O (n²)→O (n log n)） | 递归有栈开销，小规模问题可能不如暴力高效 |
  | 逻辑清晰，代码模块化                    | 合并步骤可能复杂（如归并排序的合并）     |
  | 易并行化（子问题可并行求解）            | 需额外空间（如归并排序的临时数组）       |

- 分治 vs 递归 vs 动态规划

  | 算法     | 核心特征                   | 关键区别                           |
  | :------- | :------------------------- | :--------------------------------- |
  | 分治     | 拆分→独立求解→合并         | 子问题独立，无重叠                 |
  | 递归     | 自身调用自身               | 分治是递归的一种应用场景           |
  | 动态规划 | 拆分→子问题重叠→记忆化求解 | 子问题重叠，需缓存结果避免重复计算 |

## 归并排序

- 归并排序（Merge Sort）是分治思想的典型应用，分治的核心就是 “分而治之”，整个过程分为三步：
  1.  分（Divide）：把待排序的数组从中间拆分成两个子数组，然后递归地拆分每个子数组，直到每个子数组只剩 1 个元素（单个元素天然有序）
  2.  治（Conquer）：把拆分后的有序子数组合并成一个更大的有序数组
  3.  合（Combine）：重复 “治” 的过程，最终合并成一个完整的有序数组

- 流程图示例

  ```mermaid
  graph TD
      A["数组 [8,3,5,4,7,6,1,2]"] --> B["拆分左半 [8,3,5,4]"]
      A --> C["拆分右半 [7,6,1,2]"]
      B --> D["拆分左半 [8,3]"]
      B --> E["拆分右半 [5,4]"]
      C --> F["拆分左半 [7,6]"]
      C --> G["拆分右半 [1,2]"]
      D --> H["拆分 [8]"]
      D --> I["拆分 [3]"]
      E --> J["拆分 [5]"]
      E --> K["拆分 [4]"]
      F --> L["拆分 [7]"]
      F --> M["拆分 [6]"]
      G --> N["拆分 [1]"]
      G --> O["拆分 [2]"]
      H & I --> P["合并 [3,8]"]
      J & K --> Q["合并 [4,5]"]
      L & M --> R["合并 [6,7]"]
      N & O --> S["合并 [1,2]"]
      P & Q --> T["合并 [3,4,5,8]"]
      R & S --> U["合并 [1,2,6,7]"]
      T & U --> V["最终有序 [1,2,3,4,5,6,7,8]"]
  ```

- 递归实现是归并排序最直观的方式，完全符合 “分治” 的思路：先递归拆分，再回溯合并

  ```cpp
  // 合并两个有序子数组：arr[left...mid] 和 arr[mid+1...right]
  void merge(std::vector<int>& arr, int left, int mid, int right) {
      // 临时数组存储合并结果
      std::vector<int> temp(right - left + 1);
      int i = left;    // 左子数组起始下标
      int j = mid + 1; // 右子数组起始下标
      int k = 0;       // 临时数组下标

      // 比较两个子数组的元素，按从小到大放入临时数组
      while (i <= mid && j <= right) {
          if (arr[i] <= arr[j]) {
              temp[k++] = arr[i++];
          } else {
              temp[k++] = arr[j++];
          }
      }

      // 处理左子数组剩余元素
      while (i <= mid) {
          temp[k++] = arr[i++];
      }

      // 处理右子数组剩余元素
      while (j <= right) {
          temp[k++] = arr[j++];
      }

      // 将临时数组的结果复制回原数组的对应位置
      for (int p = 0; p < temp.size(); ++p) {
          arr[left + p] = temp[p];
      }
  }

  // 递归拆分并排序：处理 arr[left...right] 范围
  void mergeSortRecursive(std::vector<int>& arr, int left, int right) {
      // 递归终止条件：子数组长度 <= 1（单个元素天然有序）
      if (left >= right) {
          return;
      }

      // 1. 分：找到中间点，拆分左右子数组
      int mid = left + (right - left) / 2; // 避免 (left+right) 溢出
      // 递归处理左子数组 [left, mid]
      mergeSortRecursive(arr, left, mid);
      // 递归处理右子数组 [mid+1, right]
      mergeSortRecursive(arr, mid + 1, right);

      // 2. 治+合：合并两个有序子数组
      merge(arr, left, mid, right);
  }

  // 对外封装的递归排序接口（简化调用）
  void mergeSort(std::vector<int>& arr) {
      if (arr.empty()) return;
      mergeSortRecursive(arr, 0, arr.size() - 1);
  }
  ```

- 简化成一个函数

  ```cpp
  void mergeSort(std::vector<int>& arr, int left, int right) {
      // 递归终止条件
      if (left >= right) return;

      // 1. 分：拆分
      int mid = left + (right - left) / 2;
      mergeSort(arr, left, mid);
      mergeSort(arr, mid + 1, right);

      // 2. 治+合：把 merge 的逻辑直接内嵌在这里
      std::vector<int> temp(right - left + 1);
      int i = left, j = mid + 1, k = 0;
      while (i <= mid && j <= right) {
          temp[k++] = (arr[i] <= arr[j]) ? arr[i++] : arr[j++];
      }
      while (i <= mid) temp[k++] = arr[i++];
      while (j <= right) temp[k++] = arr[j++];
      for (int p = 0; p < temp.size(); ++p) arr[left + p] = temp[p];
  }
  ```

- 递归的本质是 “自上而下” 拆分，迭代则是 “自下而上” 合并：先合并相邻的 1 个元素（形成 2 个元素的有序数组），再合并相邻的 2 个元素（形成 4 个元素的有序数组），直到合并成完整数组

  ```cpp
  #include <iostream>
  #include <vector>

  // merge 函数
  void merge(std::vector<int>& arr, int left, int mid, int right) {
      std::vector<int> temp(right - left + 1);
      int i = left, j = mid + 1, k = 0;

      while (i <= mid && j <= right) {
          temp[k++] = (arr[i] <= arr[j]) ? arr[i++] : arr[j++];
      }

      while (i <= mid) temp[k++] = arr[i++];
      while (j <= right) temp[k++] = arr[j++];

      for (int p = 0; p < temp.size(); ++p) {
          arr[left + p] = temp[p];
      }
  }

  // 迭代实现归并排序
  void mergeSortIterative(std::vector<int>& arr) {
      if (arr.empty()) return;
      int n = arr.size();

      // 步长 step：从 1 开始（单个元素为一组），每次翻倍
      for (int step = 1; step < n; step *= 2) {
          // 按步长遍历数组，合并相邻的两个子数组
          for (int left = 0; left < n; left += 2 * step) {
              // 计算 mid 和 right，注意边界（避免超出数组长度）
              int mid = left + step - 1;
              // right 取 “left+2*step-1” 和 “n-1” 中的较小值，防止越界
              int right = std::min(left + 2 * step - 1, n - 1);

              // 只有 mid < right 时才需要合并（否则右子数组为空）
              if (mid < right) {
                  merge(arr, left, mid, right);
              }
          }
      }
  }
  ```

- 简化成一个函数

  ```cpp
  // 迭代版归并排序：所有逻辑（步长控制+合并）都在这一个函数里
  void mergeSortIterative(std::vector<int>& arr) {
      // 边界处理：空数组或单元素数组直接返回
      if (arr.empty() || arr.size() == 1) {
          return;
      }

      int n = arr.size();
      // 步长 step：从1开始（单个元素为一组），每次翻倍
      for (int step = 1; step < n; step *= 2) {
          // 按步长遍历数组，合并相邻的两个子数组
          for (int left = 0; left < n; left += 2 * step) {
              // 计算当前合并的边界：mid 是左组的最后一个下标，right 是右组的最后一个下标
              int mid = left + step - 1;
              int right = std::min(left + 2 * step - 1, n - 1);

              // 只有左组和右组都存在（mid < right）时才需要合并
              if (mid < right) {
                  // 合并逻辑直接内嵌（替代独立的 merge 函数）
                  std::vector<int> temp(right - left + 1); // 临时数组存合并结果
                  int i = left;    // 左组起始下标
                  int j = mid + 1; // 右组起始下标
                  int k = 0;       // 临时数组下标

                  // 比较两个子数组元素，按从小到大放入临时数组
                  while (i <= mid && j <= right) {
                      temp[k++] = (arr[i] <= arr[j]) ? arr[i++] : arr[j++];
                  }

                  // 处理左组剩余元素
                  while (i <= mid) {
                      temp[k++] = arr[i++];
                  }

                  // 处理右组剩余元素
                  while (j <= right) {
                      temp[k++] = arr[j++];
                  }

                  // 将临时数组的结果复制回原数组的对应位置
                  for (int p = 0; p < temp.size(); ++p) {
                      arr[left + p] = temp[p];
                  }
              }
          }
      }
  }
  ```

## 求逆序对

- 逆序对指的是数组中满足 `i < j` 且 `arr[i] > arr[j]` 的元素对。例如数组 `[8,3,5,4]` 的逆序对有：`(8,3)、(8,5)、(8,4)、(5,4)`，共 4 个

- 分治（归并排序）解决逆序对问题的核心逻辑是：在排序的过程中统计逆序对—— 因为归并排序的 “合并” 阶段需要让子数组有序，而 “有序性” 恰好能让我们批量统计逆序对（避免暴力枚举）

- 归并排序的 “合并” 阶段是统计逆序对的关键，核心逻辑：
  1.  分：递归拆分数组为左右子数组，分别统计左右子数组内部的逆序对数量；
  2.  治 + 合：合并两个有序子数组时，统计 “跨左右子数组” 的逆序对数量（左子数组元素 > 右子数组元素的情况）；
  3.  总数量：总逆序对 = 左子数组内部逆序对 + 右子数组内部逆序对 + 跨左右的逆序对

- 假设左子数组 `[a1,a2,...,am]` 有序，右子数组 `[b1,b2,...,bn]` 有序：
  - 当 `a[i] > b[j]` 时，`a[i]` 及 `a[i]` 之后的所有元素都大于 `b[j]`，因此逆序对数量 += `mid - i + 1`（`mid` 是左子数组最后一个下标）；
  - 当 `a[i] <= b[j]` 时，无逆序对，直接移动指针

- 递归实现

  ```cpp
  // 合并两个有序子数组，并统计跨左右的逆序对数量
  long long merge(vector<int>& arr, int left, int mid, int right) {
      vector<int> temp(right - left + 1);
      int i = left;    // 左子数组指针
      int j = mid + 1; // 右子数组指针
      int k = 0;       // 临时数组指针
      long long count = 0; // 逆序对数量（用long long避免溢出）

      // 合并并统计跨左右的逆序对
      while (i <= mid && j <= right) {
          if (arr[i] <= arr[j]) {
              // 无逆序对，直接放入临时数组
              temp[k++] = arr[i++];
          } else {
              // 存在逆序对：arr[i..mid] 都 > arr[j]，数量 += mid - i + 1
              temp[k++] = arr[j++];
              count += (mid - i + 1);
          }
      }

      // 处理左子数组剩余元素（无逆序对，直接放入）
      while (i <= mid) {
          temp[k++] = arr[i++];
      }

      // 处理右子数组剩余元素（无逆序对，直接放入）
      while (j <= right) {
          temp[k++] = arr[j++];
      }

      // 将临时数组复制回原数组
      for (int p = 0; p < temp.size(); ++p) {
          arr[left + p] = temp[p];
      }

      return count;
  }

  // 递归拆分数组，统计逆序对总数
  long long mergeSortAndCount(vector<int>& arr, int left, int right) {
      long long count = 0;
      // 递归终止条件：子数组长度 <= 1，无逆序对
      if (left < right) {
          int mid = left + (right - left) / 2;
          // 1. 统计左子数组内部逆序对
          count += mergeSortAndCount(arr, left, mid);
          // 2. 统计右子数组内部逆序对
          count += mergeSortAndCount(arr, mid + 1, right);
          // 3. 统计跨左右子数组的逆序对
          count += merge(arr, left, mid, right);
      }
      return count;
  }

  // 对外封装的接口函数
  long long countInversePairs(vector<int>& arr) {
      if (arr.empty()) return 0;
      return mergeSortAndCount(arr, 0, arr.size() - 1);
  }
  ```

- 合并成一个函数

  ```cpp
  // 单函数递归实现：归并排序 + 统计逆序对
  long long countInversePairsRecursive(vector<int>& arr, int left, int right) {
      long long count = 0;
      // 递归终止条件：子数组长度<=1，无逆序对
      if (left >= right) return 0;

      // 1. 分：拆分左右子数组
      int mid = left + (right - left) / 2;
      // 统计左/右子数组内部逆序对
      count += countInversePairsRecursive(arr, left, mid);
      count += countInversePairsRecursive(arr, mid + 1, right);

      // 2. 治+合：合并有序子数组 + 统计跨子数组逆序对（内嵌merge逻辑）
      vector<int> temp(right - left + 1);
      int i = left, j = mid + 1, k = 0;
      while (i <= mid && j <= right) {
          if (arr[i] <= arr[j]) {
              temp[k++] = arr[i++];
          } else {
              // 核心统计：arr[i..mid] 都 > arr[j]，逆序对数量 += mid - i + 1
              temp[k++] = arr[j++];
              count += (mid - i + 1);
          }
      }
      // 处理剩余元素
      while (i <= mid) temp[k++] = arr[i++];
      while (j <= right) temp[k++] = arr[j++];
      // 复制回原数组（排序的关键步骤）
      for (int p = 0; p < temp.size(); ++p) {
          arr[left + p] = temp[p];
      }

      return count;
  }

  // 对外简化接口（无需手动传left/right）
  long long countInversePairs(vector<int>& arr) {
      if (arr.empty()) return 0;
      return countInversePairsRecursive(arr, 0, arr.size() - 1);
  }
  ```

- 时间复杂度：O (n logn)，和归并排序一致，拆分是 O (logn) 层，每层合并统计是 O (n)

- 空间复杂度：O (n)，来自合并时的临时数组（可以优化为原地合并，但代码会复杂很多，新手不推荐）

- 迭代实现：基于归并排序的 “自下而上合并” 逻辑，在合并相邻子数组时统计逆序对，无递归栈开销

  ```cpp
  // 迭代版：归并排序 + 统计逆序对
  long long countInversePairsIterative(vector<int>& arr) {
      if (arr.empty() || arr.size() == 1) return 0;

      long long totalCount = 0;
      int n = arr.size();
      vector<int> temp(n); // 全局临时数组，避免多次创建（优化空间）

      // 步长：从1开始，每次翻倍（自下而上合并）
      for (int step = 1; step < n; step *= 2) {
          // 按步长遍历，合并相邻两个子数组
          for (int left = 0; left < n; left += 2 * step) {
              int mid = left + step - 1;
              int right = min(left + 2 * step - 1, n - 1);

              // 仅当左右子数组都存在时，才合并+统计
              if (mid < right) {
                  int i = left, j = mid + 1, k = left;
                  long long count = 0; // 本轮合并的逆序对数量

                  // 合并并统计跨子数组的逆序对
                  while (i <= mid && j <= right) {
                      if (arr[i] <= arr[j]) {
                          temp[k++] = arr[i++];
                      } else {
                          temp[k++] = arr[j++];
                          count += (mid - i + 1); // 核心统计逻辑
                      }
                  }
                  // 处理剩余元素
                  while (i <= mid) temp[k++] = arr[i++];
                  while (j <= right) temp[k++] = arr[j++];

                  // 将临时数组的结果复制回原数组（排序）
                  for (int p = left; p <= right; ++p) {
                      arr[p] = temp[p];
                  }

                  totalCount += count; // 累加本轮逆序对数量
              }
          }
      }

      return totalCount;
  }
  ```

## 快速排序

- 快速排序的分治可以总结为 “选基准→分区→递归” 三步，核心是 “分区”（Partition）：
  - 分（Divide）：选基准 + 分区
    - 选基准（Pivot）：从数组中选一个元素作为 “基准值”（比如选第一个、最后一个、中间值或随机值）；
    - 分区操作：将数组中小于等于基准的元素放到基准左边，大于基准的元素放到基准右边，最终基准会落在 “正确的位置”（排序后的最终位置）

  - 治（Conquer）：递归处理子数组
    - 对基准左边的子数组和右边的子数组，递归执行 “选基准 + 分区”，直到子数组长度≤1（天然有序）

  - 合（Combine）：无需合并
    - 归并排序需要合并有序子数组，但快速排序的分区操作本身就让基准归位，递归结束后整个数组自然有序，因此无需额外合并步骤 —— 这是快速排序和归并排序分治思想的核心区别

- 分区是快速排序的灵魂，最经典的是 Hoare 分区法（双指针交换），步骤如下：
  1.  选最左元素为基准；
  2.  左指针 `i` 从左向右找大于基准的元素，右指针 `j` 从右向左找小于等于基准的元素；
  3.  交换 `i` 和 `j` 指向的元素，重复步骤 2，直到 `i >= j`；
  4.  交换基准和 `j` 指向的元素，此时基准归位，`j` 是基准的最终下标

- 流程图

  ```mermaid
  graph TD
      A["数组 [8,3,5,4,7,6,1,2]，选8为基准"] --> B["i=0, j=7，找i>8、j<=8→i=0（8），j=6（1）"]
      B --> C["交换i和j→[1,3,5,4,7,6,8,2]"]
      C --> D["i=1, j=6，找i>8、j<=8→i=6（8），j=5（6）"]
      D --> E["i>=j，交换基准（8）和j（6）→[1,3,5,4,7,6,8,2]"]
      E --> F["基准8归位，左子数组[1,3,5,4,7,6]，右子数组[2]"]
      F --> G["递归处理左子数组，选1为基准"]
      F --> H["递归处理右子数组，长度1无需处理"]
  ```

- 递归实现

  ```cpp
  #include <iostream>
  #include <vector>
  #include <cstdlib> // rand()
  #include <ctime>   // time()
  using namespace std;

  // 交换两个元素
  void swap(int& a, int& b) {
      int temp = a;
      a = b;
      b = temp;
  }

  // Hoare分区法（优化：随机选基准，避免最坏情况）
  int partition(vector<int>& arr, int left, int right) {
      // 随机选基准：避免有序数组导致的O(n²)复杂度
      int pivotIdx = left + rand() % (right - left + 1);
      swap(arr[left], arr[pivotIdx]); // 基准移到最左
      int pivot = arr[left]; // 基准值

      int i = left + 1;  // 左指针（从基准下一位开始）
      int j = right;     // 右指针

      while (true) {
          // 左指针找大于基准的元素
          while (i <= j && arr[i] <= pivot) i++;
          // 右指针找小于等于基准的元素
          while (i <= j && arr[j] > pivot) j--;
          // 指针相遇则退出
          if (i > j) break;
          // 交换不符合条件的元素
          swap(arr[i], arr[j]);
      }
      // 基准归位（交换基准和j的位置）
      swap(arr[left], arr[j]);
      return j; // 返回基准的最终下标
  }

  // 递归版快速排序（分治核心）
  void quickSortRecursive(vector<int>& arr, int left, int right) {
      // 递归终止条件：子数组长度<=1
      if (left >= right) return;

      // 1. 分：分区，得到基准下标
      int pivotPos = partition(arr, left, right);
      // 2. 治：递归处理左、右子数组
      quickSortRecursive(arr, left, pivotPos - 1);  // 左子数组（<基准）
      quickSortRecursive(arr, pivotPos + 1, right); // 右子数组（>基准）
      // 3. 合：无需合并，分区已让基准归位
  }

  // 对外封装接口
  void quickSort(vector<int>& arr) {
      if (arr.empty()) return;
      srand(time(0)); // 初始化随机数种子
      quickSortRecursive(arr, 0, arr.size() - 1);
  }
  ```

- 递归版的本质是用系统栈存储子数组的 `left/right`，迭代版用手动栈替代

  ```cpp
  #include <iostream>
  #include <vector>
  #include <stack>
  #include <cstdlib>
  #include <ctime>
  using namespace std;

  void swap(int& a, int& b) { int temp = a; a = b; b = temp; }

  // 复用分区函数（和递归版一致）
  int partition(vector<int>& arr, int left, int right) {
      int pivotIdx = left + rand() % (right - left + 1);
      swap(arr[left], arr[pivotIdx]);
      int pivot = arr[left];
      int i = left + 1, j = right;
      while (true) {
          while (i <= j && arr[i] <= pivot) i++;
          while (i <= j && arr[j] > pivot) j--;
          if (i > j) break;
          swap(arr[i], arr[j]);
      }
      swap(arr[left], arr[j]);
      return j;
  }

  // 迭代版快速排序（用栈模拟递归）
  void quickSortIterative(vector<int>& arr) {
      if (arr.empty()) return;
      srand(time(0));
      stack<pair<int, int>> st; // 栈存储子数组的left和right
      st.push({0, arr.size() - 1}); // 初始入栈：整个数组

      while (!st.empty()) {
          // 出栈：取当前子数组的范围
          auto [left, right] = st.top();
          st.pop();

          // 分区：得到基准下标
          int pivotPos = partition(arr, left, right);

          // 左子数组入栈（长度>1才入栈）
          if (pivotPos - 1 > left) {
              st.push({left, pivotPos - 1});
          }
          // 右子数组入栈（长度>1才入栈）
          if (pivotPos + 1 < right) {
              st.push({pivotPos + 1, right});
          }
      }
  }
  ```

## 最近点对问题

- 最近点对问题是计算几何中的经典问题：给定平面上 n 个点，求距离最近的两个点之间的距离

- 把点集一分为二，分别求左右两边的最近点对，再检查跨中线的点对会不会更近

- 整体流程：
  1.  按 x 坐标排序
  2.  分：从中点分成左、右两部分
  3.  治：递归求左、右内部最近点对，取较小距离 d
  4.  合：在中线左右 d 宽度的带状区域里，找有没有更近的点对
  5.  返回全局最小

- 代码实现

  ```cpp
  #include <bits/stdc++.h>
  using namespace std;

  // 定义点的结构体，包含x和y坐标
  struct Point {
      double x, y;
  };

  // 计算两个点之间的欧几里得距离
  // 使用hypot函数可以直接计算sqrt((x1-x2)^2 + (y1-y2)^2)，更简洁且避免精度问题
  double dist(const Point &a, const Point &b) {
      return hypot(a.x - b.x, a.y - b.y);
  }

  // 按x坐标升序排序，x相同时按y坐标升序排序
  bool cmpx(const Point &a, const Point &b) {
      return a.x < b.x || (a.x == b.x && a.y < b.y);
  }

  // 按y坐标升序排序
  bool cmpy(const Point &a, const Point &b) {
      return a.y < b.y;
  }

  /**
   * 分治算法求解平面最近点对的核心函数
   * @param pts 点的集合（会被排序修改）
   * @param l 当前处理区间的左边界
   * @param r 当前处理区间的右边界
   * @return 当前区间内最近点对的距离
   */
  double solve(vector<Point> &pts, int l, int r) {
      // 基线条件：当区间内点的数量<=3时，直接暴力枚举所有点对计算最小距离
      if (r - l <= 3) {
          double ans = 1e18;  // 初始化最小距离为一个极大值
          // 双重循环枚举所有点对
          for (int i = l; i <= r; i++)
              for (int j = i + 1; j <= r; j++)
                  ans = min(ans, dist(pts[i], pts[j]));
          // 对当前小区间按y坐标排序，为后续的合并操作做准备
          sort(pts.begin() + l, pts.begin() + r + 1, cmpy);
          return ans;
      }

      // 分治步骤1：划分左右子区间
      int mid = (l + r) >> 1;        // 计算中间位置（等价于(l+r)/2）
      double midx = pts[mid].x;      // 记录中间点的x坐标，作为分割线

      // 分治步骤2：递归求解左右子区间的最近点对距离
      double dl = solve(pts, l, mid);        // 左区间的最小距离
      double dr = solve(pts, mid + 1, r);    // 右区间的最小距离
      double d = min(dl, dr);               // 当前的最小距离候选值

      // 分治步骤3：合并阶段 - 合并左右两个已按y排序的子区间
      // inplace_merge可以高效合并两个相邻的已排序区间，时间复杂度O(n)
      inplace_merge(pts.begin() + l, pts.begin() + mid + 1,
                    pts.begin() + r + 1, cmpy);

      // 分治步骤4：处理跨分割线的点对（可能存在更近的点对）
      // 收集所有距离分割线x坐标小于d的点（这些点才有可能形成更近的跨区间点对）
      vector<Point> strip;
      for (int i = l; i <= r; i++)
          if (abs(pts[i].x - midx) < d)
              strip.push_back(pts[i]);

      // 检查strip中的点对，最多只需要检查每个点后面的7个点（算法优化结论）
      for (int i = 0; i < strip.size(); i++)
          for (int j = i + 1; j < strip.size() && j <= i + 7; j++)
              d = min(d, dist(strip[i], strip[j]));

      // 返回当前区间的最小距离
      return d;
  }

  int main() {
      int n;
      cin >> n;               // 输入点的数量
      vector<Point> pts(n);   // 存储所有点的数组

      // 输入每个点的坐标
      for (int i = 0; i < n; i++)
          cin >> pts[i].x >> pts[i].y;

      // 首先将所有点按x坐标排序，为分治算法做准备
      sort(pts.begin(), pts.end(), cmpx);

      // 输出结果，保留6位小数
      cout << fixed << setprecision(6)
           << solve(pts, 0, n - 1) << endl;

      return 0;
  }
  ```

- 三维点对问题
  - 二维 strip 是一个 2d × d 的矩形，而三维 strip 是一个 2d × d × d 的盒子
  - 跨分割线检查时，需同时满足 x 方向距离 < d，且最多检查后续 15 个点（三维下的优化结论，2d×2d×d 立方体最多 16 个点）

- 代码实现

  ```cpp
  #include <bits/stdc++.h>
  using namespace std;

  // 定义三维点结构体
  struct Point3D {
      double x, y, z;
  };

  // 计算两个三维点之间的欧几里得距离
  // 公式：sqrt((x1-x2)² + (y1-y2)² + (z1-z2)²)
  double dist(const Point3D &a, const Point3D &b) {
      double dx = a.x - b.x;
      double dy = a.y - b.y;
      double dz = a.z - b.z;
      return sqrt(dx*dx + dy*dy + dz*dz);
  }

  // 排序规则1：按x坐标升序，x相同按y，y相同按z
  bool cmpX(const Point3D &a, const Point3D &b) {
      if (a.x != b.x) return a.x < b.x;
      if (a.y != b.y) return a.y < b.y;
      return a.z < b.z;
  }

  // 排序规则2：按y坐标升序（合并阶段使用）
  bool cmpY(const Point3D &a, const Point3D &b) {
      return a.y < b.y;
  }

  /**
   * 分治求解三维最近点对核心函数
   * @param pts 三维点集合（会被排序修改）
   * @param l 区间左边界
   * @param r 区间右边界
   * @return 当前区间内最近点对的距离
   */
  double solve(vector<Point3D> &pts, int l, int r) {
      // 基线条件：点数量≤3时，暴力枚举所有点对
      if (r - l <= 3) {
          double min_dist = 1e18; // 初始化极大值
          for (int i = l; i <= r; i++) {
              for (int j = i + 1; j <= r; j++) {
                  min_dist = min(min_dist, dist(pts[i], pts[j]));
              }
          }
          // 对当前小区间按y排序，为合并做准备
          sort(pts.begin() + l, pts.begin() + r + 1, cmpY);
          return min_dist;
      }

      // 分治：划分左右区间
      int mid = (l + r) >> 1;       // 中间位置（等价于(l+r)/2）
      double mid_x = pts[mid].x;    // 分割线x坐标

      // 递归求解左右区间的最小距离
      double d_left = solve(pts, l, mid);
      double d_right = solve(pts, mid + 1, r);
      double d = min(d_left, d_right); // 当前最小距离候选

      // 合并：将左右两个已按y排序的区间合并（O(n)时间）
      inplace_merge(pts.begin() + l, pts.begin() + mid + 1,
                    pts.begin() + r + 1, cmpY);

      // 收集跨分割线的候选点：x方向距离分割线<d的点
      vector<Point3D> strip;
      for (int i = l; i <= r; i++) {
          if (abs(pts[i].x - mid_x) < d) {
              strip.push_back(pts[i]);
          }
      }

      // 检查候选点对：三维下每个点最多检查后续15个点（数学证明）
      for (int i = 0; i < strip.size(); i++) {
          // j <= i+15：三维优化，超过15个点无需检查（距离必≥d）
          for (int j = i + 1; j < strip.size() && j <= i + 15; j++) {
              d = min(d, dist(strip[i], strip[j]));
          }
      }

      return d;
  }

  int main() {
      // 输入示例：
      // 第一行输入点的数量n
      // 接下来n行，每行输入x y z三个坐标（浮点数）
      int n;
      cin >> n;
      vector<Point3D> pts(n);

      for (int i = 0; i < n; i++) {
          cin >> pts[i].x >> pts[i].y >> pts[i].z;
      }

      // 先按x坐标排序，为分治做准备
      sort(pts.begin(), pts.end(), cmpX);

      // 输出结果，保留6位小数
      cout << fixed << setprecision(6) << solve(pts, 0, n - 1) << endl;

      return 0;
  }
  ```

- 曼哈顿距离版本
  - 曼哈顿距离的计算公式为：`|x1 - x2| + |y1 - y2|`，相比欧几里得距离（斜边），它表示两点在坐标轴上的绝对距离之和，计算更简单且无开方操作

- 代码实现

  ```cpp
  #include <bits/stdc++.h>
  using namespace std;

  // 定义二维点结构体
  struct Point {
      double x, y;
  };

  /**
   * 计算两个点之间的曼哈顿距离
   * 公式：|x1 - x2| + |y1 - y2|
   * 相比欧几里得距离，无开方操作，计算更快且无精度损失
   */
  double manhattan_dist(const Point &a, const Point &b) {
      return abs(a.x - b.x) + abs(a.y - b.y);
  }

  // 按x坐标升序排序，x相同时按y升序（分治的初始排序）
  bool cmpx(const Point &a, const Point &b) {
      return a.x < b.x || (a.x == b.x && a.y < b.y);
  }

  // 按y坐标升序排序（合并阶段使用）
  bool cmpy(const Point &a, const Point &b) {
      return a.y < b.y;
  }

  /**
   * 分治求解曼哈顿距离下的二维最近点对
   * @param pts 点集合（会被排序修改）
   * @param l 区间左边界
   * @param r 区间右边界
   * @return 当前区间内最近点对的曼哈顿距离
   */
  double solve(vector<Point> &pts, int l, int r) {
      // 基线条件：点数量≤3时暴力枚举所有点对
      if (r - l <= 3) {
          double min_dist = 1e18; // 初始化极大值
          for (int i = l; i <= r; i++) {
              for (int j = i + 1; j <= r; j++) {
                  min_dist = min(min_dist, manhattan_dist(pts[i], pts[j]));
              }
          }
          // 对当前区间按y排序，为合并做准备
          sort(pts.begin() + l, pts.begin() + r + 1, cmpy);
          return min_dist;
      }

      // 分治：划分左右区间
      int mid = (l + r) >> 1;       // 中间位置
      double mid_x = pts[mid].x;    // 分割线x坐标

      // 递归求解左右区间的最小曼哈顿距离
      double d_left = solve(pts, l, mid);
      double d_right = solve(pts, mid + 1, r);
      double d = min(d_left, d_right);

      // 合并：合并两个已按y排序的区间
      inplace_merge(pts.begin() + l, pts.begin() + mid + 1,
                    pts.begin() + r + 1, cmpy);

      // 收集跨分割线的候选点：x方向曼哈顿距离<d的点
      // 曼哈顿距离中，|x1-x2| < d 是必要条件（否则总距离≥d）
      vector<Point> strip;
      for (int i = l; i <= r; i++) {
          if (abs(pts[i].x - mid_x) < d) {
              strip.push_back(pts[i]);
          }
      }

      // 检查候选点对：曼哈顿距离下仍只需检查后续7个点（优化结论依然成立）
      for (int i = 0; i < strip.size(); i++) {
          for (int j = i + 1; j < strip.size() && j <= i + 7; j++) {
              d = min(d, manhattan_dist(strip[i], strip[j]));
          }
      }

      return d;
  }

  int main() {
      // 输入格式：
      // 第一行n（点的数量）
      // 接下来n行，每行x y（浮点数）
      int n;
      cin >> n;
      vector<Point> pts(n);

      for (int i = 0; i < n; i++) {
          cin >> pts[i].x >> pts[i].y;
      }

      // 初始按x坐标排序，为分治做准备
      sort(pts.begin(), pts.end(), cmpx);

      // 输出结果，保留6位小数（曼哈顿距离也可输出整数，按需调整）
      cout << fixed << setprecision(6) << solve(pts, 0, n - 1) << endl;

      return 0;
  }
  ```

## 快速选择（减治，只分不合）

- 快速选择和快速排序共享 “分区（Partition）” 核心，但目标不同：
  - 快速排序：分区后递归处理左右两个子数组，最终完全排序；
  - 快速选择：分区后只递归处理目标元素所在的子数组（另一部分直接丢弃），无需完全排序

- 核心逻辑：
  - 选基准→分区，将数组分为 “≤基准”（左）和 “> 基准”（右）两部分，得到基准的下标 `pivotPos`
  - 比较 `pivotPos` 和目标位置 `k`：
    - 若 `pivotPos == k`：基准就是第 k 小元素，直接返回；
    - 若 `pivotPos > k`：目标在左子数组，递归处理左半部分；
    - 若 `pivotPos < k`：目标在右子数组，递归处理右半部分；
  - 终止条件：找到目标位置，返回对应值

- 递归实现

  ```cpp
  #include <iostream>
  #include <vector>
  #include <cstdlib>
  #include <ctime>
  using namespace std;

  // 交换元素
  void swap(int& a, int& b) {
      int temp = a;
      a = b;
      b = temp;
  }

  // Hoare分区法（和快速排序一致，随机选基准优化）
  int partition(vector<int>& arr, int left, int right) {
      // 随机选基准：避免有序数组导致的最坏情况
      int pivotIdx = left + rand() % (right - left + 1);
      swap(arr[left], arr[pivotIdx]);
      int pivot = arr[left];

      int i = left + 1, j = right;
      while (true) {
          // 左指针找大于基准的元素
          while (i <= j && arr[i] <= pivot) i++;
          // 右指针找小于等于基准的元素
          while (i <= j && arr[j] > pivot) j--;
          if (i > j) break;
          swap(arr[i], arr[j]);
      }
      // 基准归位
      swap(arr[left], arr[j]);
      return j; // 返回基准下标
  }

  // 递归版快速选择：找数组中第k小元素（k是1-based）
  int quickSelectRecursive(vector<int>& arr, int left, int right, int k) {
      // 递归终止条件：子数组只有一个元素（必是目标）
      if (left == right) return arr[left];

      // 1. 分区：得到基准下标
      int pivotPos = partition(arr, left, right);
      // 基准是第 (pivotPos - left + 1) 小的元素（当前子数组内）
      int currentRank = pivotPos - left + 1;

      // 2. 决策：只递归处理目标所在的子数组
      if (currentRank == k) {
          // 基准就是当前子数组的第k小元素，直接返回
          return arr[pivotPos];
      } else if (currentRank > k) {
          // 目标在左子数组，递归处理左半部分（找左子数组的第k小）
          return quickSelectRecursive(arr, left, pivotPos - 1, k);
      } else {
          // 目标在右子数组，递归处理右半部分（找右子数组的第k - currentRank小）
          return quickSelectRecursive(arr, pivotPos + 1, right, k - currentRank);
      }
  }

  // 对外封装接口：输入k是1-based的第k小
  int findKthSmallest(vector<int>& arr, int k) {
      if (arr.empty() || k < 1 || k > arr.size()) {
          throw invalid_argument("k值无效");
      }
      srand(time(0)); // 初始化随机数种子
      return quickSelectRecursive(arr, 0, arr.size() - 1, k);
  }

  // 找第k大元素 = 找第 (n - k + 1) 小元素
  int findKthLargest(vector<int>& arr, int k) {
      int n = arr.size();
      return findKthSmallest(arr, n - k + 1);
  }
  ```

- 递归合并成一个函数

  ```cpp
  #include <iostream>
  #include <vector>
  #include <cstdlib>
  #include <ctime>
  #include <stdexcept>
  using namespace std;

  // 单函数实现：快速选择找第k小元素（1-based）
  int quickSelect(vector<int>& arr, int left, int right, int k) {
      // 递归终止条件1：子数组只有一个元素，直接返回
      if (left == right) return arr[left];

      // ===================== 内嵌分区逻辑（替代独立partition函数）=====================
      // 1. 随机选基准并交换到左边界
      int pivotIdx = left + rand() % (right - left + 1);
      swap(arr[left], arr[pivotIdx]);
      int pivot = arr[left];
      int i = left + 1, j = right;

      // 2. Hoare分区核心逻辑
      while (true) {
          // 左指针找大于基准的元素
          while (i <= j && arr[i] <= pivot) i++;
          // 右指针找小于等于基准的元素
          while (i <= j && arr[j] > pivot) j--;
          if (i > j) break;
          // 交换不符合条件的元素
          swap(arr[i], arr[j]);
      }
      // 3. 基准归位，得到基准最终下标
      swap(arr[left], arr[j]);
      int pivotPos = j;
      // =============================================================================

      // 快速选择核心决策：只递归处理目标子数组
      int currentRank = pivotPos - left + 1; // 基准在当前子数组的排名（1-based）
      if (currentRank == k) {
          // 找到目标元素，直接返回
          return arr[pivotPos];
      } else if (currentRank > k) {
          // 目标在左子数组，递归处理左半部分
          return quickSelect(arr, left, pivotPos - 1, k);
      } else {
          // 目标在右子数组，递归处理右半部分（调整k值）
          return quickSelect(arr, pivotPos + 1, right, k - currentRank);
      }
  }

  // 对外简化接口（无需手动传left/right，校验k合法性）
  int findKthSmallest(vector<int>& arr, int k) {
      if (arr.empty()) {
          throw invalid_argument("数组为空");
      }
      if (k < 1 || k > arr.size()) {
          throw invalid_argument("k值超出数组范围");
      }
      srand(time(0)); // 初始化随机数种子
      return quickSelect(arr, 0, arr.size() - 1, k);
  }
  ```

- 迭代版

  ```cpp
  #include <iostream>
  #include <vector>
  #include <stack>
  #include <cstdlib>
  #include <ctime>
  using namespace std;

  void swap(int& a, int& b) { int temp = a; a = b; b = temp; }

  // 复用分区函数
  int partition(vector<int>& arr, int left, int right) {
      int pivotIdx = left + rand() % (right - left + 1);
      swap(arr[left], arr[pivotIdx]);
      int pivot = arr[left];
      int i = left + 1, j = right;
      while (true) {
          while (i <= j && arr[i] <= pivot) i++;
          while (i <= j && arr[j] > pivot) j--;
          if (i > j) break;
          swap(arr[i], arr[j]);
      }
      swap(arr[left], arr[j]);
      return j;
  }

  // 迭代版快速选择：找第k小元素（1-based）
  int quickSelectIterative(vector<int>& arr, int k) {
      if (arr.empty() || k < 1 || k > arr.size()) {
          throw invalid_argument("k值无效");
      }
      srand(time(0));
      stack<tuple<int, int, int>> st; // 栈存储 (left, right, targetK)
      st.emplace(0, arr.size() - 1, k); // 初始入栈

      while (!st.empty()) {
          // 出栈：当前子数组范围 + 目标k
          auto [left, right, targetK] = st.top();
          st.pop();

          // 子数组只有一个元素，直接返回
          if (left == right) return arr[left];

          // 分区
          int pivotPos = partition(arr, left, right);
          int currentRank = pivotPos - left + 1;

          // 决策：只将目标子数组入栈
          if (currentRank == targetK) {
              return arr[pivotPos]; // 找到目标，直接返回
          } else if (currentRank > targetK) {
              // 目标在左子数组，入栈左半部分（targetK不变）
              st.emplace(left, pivotPos - 1, targetK);
          } else {
              // 目标在右子数组，入栈右半部分（targetK = targetK - currentRank）
              st.emplace(pivotPos + 1, right, targetK - currentRank);
          }
      }

      // 理论上不会走到这里（k值已校验）
      return -1;
  }
  ```

## 大数乘法

- 普通乘法（竖式乘法）的时间复杂度是 $O (n^2)$（n 是数字的位数），比如两个 1000 位的大数相乘，需要做 1000×1000=100 万次运算；

- 而分治乘法（卡拉楚巴算法，Karatsuba）能把时间复杂度降到 $O (n^{log_23}) ≈ O (n^{1.585})$，位数越多，效率提升越明显

- 问题拆分（分）
  - 假设有两个 n 位的大数 X 和 Y（为了方便，假设 n 是 2 的幂，非 2 的幂时补前导 0），将 X、Y 各拆分为左右两部分：
    - X = A × 10^(n/2) + B （A 是左半部分，B 是右半部分）
    - Y = C × 10^(n/2) + D （C 是左半部分，D 是右半部分）

  - 例如：X=1234，Y=5678，拆分为：
    - A=12，B=34；C=56，D=78；n=4，10^(n/2)=100

    - X=12×100 + 34，Y=56×100 + 78

- 递归求解（治）
  - 普通展开乘法：X×Y = AC×10^n + (AD+BC)×10^(n/2) + BD
  - 问题：需要计算 4 次乘法（AC、AD、BC、BD），时间复杂度还是 $O (n^2)$；
  - 分治优化（Karatsuba 核心）减少乘法次数到 3 次：
    1. 计算 AC；
    2. 计算 BD；
    3. 计算 (A+B)×(C+D) = AC + AD + BC + BD；
    4. 推导中间项：AD+BC = (A+B)(C+D) - AC - BD；
  - 最终公式：X×Y = AC×10^n + [(A+B)(C+D)-AC-BD]×10^(n/2) + BD → 仅需 3 次递归乘法，而非 4 次，这是效率提升的关键！

- 结果合并（合）：将递归计算得到的 AC、BD、(A+B)(C+D) 代入公式，合并得到最终结果（注意处理进位和补 0）

- 分治乘法的完整流程（以 X=1234，Y=5678 为例）
  1.  拆分：A=12, B=34; C=56, D=78; n=4
  2.  递归计算：
      - AC = 12×56 = 672；
      - BD = 34×78 = 2652；
      - (A+B)×(C+D) = 46×134 = 6164；
      - 中间项 = 6164 - 672 - 2652 = 2840；
  3.  合并：
      - X×Y = 672×10^4 + 2840×10^2 + 2652 = 6720000 + 284000 + 2652 = 7006652；
      - 验证：1234×5678 = 7006652，结果正确

- 递归版实现：大数乘法的核心是用字符串存储超大数（避免溢出），分治递归处理字符串拆分和合并

  ```cpp
  #include <iostream>
  #include <string>
  #include <algorithm> // reverse
  using namespace std;

  // 辅助函数：两个字符串表示的非负整数相加
  string add(string a, string b) {
      string res;
      int i = a.size() - 1, j = b.size() - 1, carry = 0;
      // 从后往前逐位相加
      while (i >= 0 || j >= 0 || carry) {
          int sum = carry;
          if (i >= 0) sum += a[i--] - '0';
          if (j >= 0) sum += b[j--] - '0';
          carry = sum / 10;
          res.push_back(sum % 10 + '0');
      }
      reverse(res.begin(), res.end());
      return res;
  }

  // 辅助函数：两个字符串表示的非负整数相减（确保 a >= b）
  string sub(string a, string b) {
      string res;
      int i = a.size() - 1, j = b.size() - 1, borrow = 0;
      while (i >= 0 || j >= 0) {
          int numA = (i >= 0) ? (a[i--] - '0') : 0;
          int numB = (j >= 0) ? (b[j--] - '0') : 0;
          numA -= borrow;
          borrow = 0;
          if (numA < numB) {
              numA += 10;
              borrow = 1;
          }
          res.push_back(numA - numB + '0');
      }
      // 去掉前导0
      while (res.size() > 1 && res.back() == '0') res.pop_back();
      reverse(res.begin(), res.end());
      return res;
  }

  // 辅助函数：字符串数字补前导0，使长度为 len
  string padZero(string s, int len) {
      while (s.size() < len) s = "0" + s;
      return s;
  }

  // 辅助函数：字符串数字乘以 10^k（补 k 个后导0）
  string mul10(string s, int k) {
      if (s == "0") return s;
      return s + string(k, '0');
  }

  // 分治实现大数乘法（Karatsuba 算法）
  string karatsuba(string X, string Y) {
      // 递归终止条件：单个数字，直接相乘
      if (X.size() == 1 && Y.size() == 1) {
          int res = (X[0] - '0') * (Y[0] - '0');
          return to_string(res);
      }

      // 补前导0，使两个数长度相同
      int n = max(X.size(), Y.size());
      X = padZero(X, n);
      Y = padZero(Y, n);
      int mid = n / 2;

      // 拆分 X = A*10^mid + B，Y = C*10^mid + D
      string A = X.substr(0, n - mid);
      string B = X.substr(n - mid);
      string C = Y.substr(0, n - mid);
      string D = Y.substr(n - mid);

      // 递归计算 3 次乘法
      string AC = karatsuba(A, C);
      string BD = karatsuba(B, D);
      string AB_CD = karatsuba(add(A, B), add(C, D));

      // 计算中间项：AD + BC = (A+B)(C+D) - AC - BD
      string AD_BC = sub(sub(AB_CD, AC), BD);

      // 合并结果：AC*10^(2*mid) + (AD+BC)*10^mid + BD
      string res = add(add(mul10(AC, 2 * mid), mul10(AD_BC, mid)), BD);

      // 去掉前导0
      while (res.size() > 1 && res[0] == '0') res.erase(res.begin());
      return res;
  }

  // 测试
  int main() {
      // 测试用例1：小数字验证
      string X1 = "1234";
      string Y1 = "5678";
      cout << X1 << " × " << Y1 << " = " << karatsuba(X1, Y1) << endl;

      // 测试用例2：超大数（超出long long范围）
      string X2 = "9876543210123456789";
      string Y2 = "1234567890987654321";
      cout << X2 << " × " << Y2 << " = " << karatsuba(X2, Y2) << endl;

      return 0;
  }
  ```

- 递归版是 “自上而下” 拆分，迭代版则是 “自下而上” 合并：
  1.  分组处理：将数字按最小粒度（单个 / 两个字符）分组，先计算最小组的乘法；
  2.  按层合并：从最小粒度开始，逐层向上合并（对应递归的 “回溯” 阶段），每一层都用 Karatsuba 公式合并结果；
  3.  边界优化：不再强制补 0 到 2 的幂长度，而是动态处理任意长度的拆分（比如 n=5 时拆分为 2+3，而非补 0 到 8）

- 代码实现

  ```cpp
  #include <iostream>
  #include <string>
  #include <algorithm>
  #include <vector>
  #include <cmath>
  using namespace std;

  // ===================== 基础工具函数（优化边界）=====================
  // 字符串数字比较：a >= b 返回 true（处理任意长度）
  bool isGreaterOrEqual(const string& a, const string& b) {
      if (a.size() != b.size()) return a.size() > b.size();
      return a >= b;
  }

  // 大数加法（支持任意长度，无前置0）
  string add(const string& a, const string& b) {
      string res;
      int i = a.size() - 1, j = b.size() - 1, carry = 0;
      while (i >= 0 || j >= 0 || carry) {
          int sum = carry;
          if (i >= 0) sum += a[i--] - '0';
          if (j >= 0) sum += b[j--] - '0';
          carry = sum / 10;
          res.push_back(sum % 10 + '0');
      }
      reverse(res.begin(), res.end());
      return res;
  }

  // 大数减法（确保 a >= b，返回无前置0的结果）
  string sub(const string& a, const string& b) {
      if (a == b) return "0";
      string res;
      int i = a.size() - 1, j = b.size() - 1, borrow = 0;
      while (i >= 0 || j >= 0) {
          int numA = (i >= 0) ? (a[i--] - '0') : 0;
          int numB = (j >= 0) ? (b[j--] - '0') : 0;
          numA -= borrow;
          borrow = 0;
          if (numA < numB) {
              numA += 10;
              borrow = 1;
          }
          res.push_back(numA - numB + '0');
      }
      // 去掉后置0（反转后是前置0）
      while (res.size() > 1 && res.back() == '0') res.pop_back();
      reverse(res.begin(), res.end());
      return res;
  }

  // 数字字符串补前导0到指定长度（仅用于对齐，非强制2的幂）
  string padLeft(const string& s, int len) {
      if (s.size() >= len) return s;
      return string(len - s.size(), '0') + s;
  }

  // 数字字符串乘以 10^k（补k个后导0，优化空值）
  string mulPower10(const string& s, int k) {
      if (s == "0" || k <= 0) return s;
      return s + string(k, '0');
  }

  // 普通竖式乘法（作为迭代的最小粒度计算）
  string naiveMultiply(const string& a, const string& b) {
      if (a == "0" || b == "0") return "0";
      int n = a.size(), m = b.size();
      vector<int> res(n + m, 0);
      // 竖式乘法核心
      for (int i = n - 1; i >= 0; --i) {
          for (int j = m - 1; j >= 0; --j) {
              res[i + j + 1] += (a[i] - '0') * (b[j] - '0');
              res[i + j] += res[i + j + 1] / 10;
              res[i + j + 1] %= 10;
          }
      }
      // 转换为字符串，去掉前导0
      string resStr;
      int start = 0;
      while (start < res.size() && res[start] == 0) start++;
      if (start == res.size()) return "0";
      for (int i = start; i < res.size(); ++i) resStr.push_back(res[i] + '0');
      return resStr;
  }

  // ===================== 迭代版 Karatsuba 核心函数 =====================
  string karatsubaIterative(string X, string Y) {
      // 空值/0处理
      if (X == "0" || Y == "0") return "0";

      // 统一为无前置0的格式
      auto trimZero = [](string s) {
          size_t pos = s.find_first_not_of('0');
          return (pos == string::npos) ? "0" : s.substr(pos);
      };
      X = trimZero(X);
      Y = trimZero(Y);

      int maxLen = max(X.size(), Y.size());
      // 最小粒度：长度<=3时用竖式乘法（效率更高）
      if (maxLen <= 3) return naiveMultiply(X, Y);

      // 动态拆分：拆分为左右两部分（非强制2的幂，优化边界）
      int mid = maxLen / 2;
      int lenX = X.size(), lenY = Y.size();

      // 拆分X：A=左半部分，B=右半部分（动态长度）
      string A = (lenX > mid) ? X.substr(0, lenX - mid) : "0";
      string B = (lenX > mid) ? X.substr(lenX - mid) : X;
      // 拆分Y：C=左半部分，D=右半部分（动态长度）
      string C = (lenY > mid) ? Y.substr(0, lenY - mid) : "0";
      string D = (lenY > mid) ? Y.substr(lenY - mid) : Y;

      // 迭代处理（用栈/队列模拟递归，这里用循环+函数调用简化）
      // 注意：迭代版本质是用循环替代递归栈，这里采用“尾递归转迭代”的简化写法
      string AC = karatsubaIterative(A, C);
      string BD = karatsubaIterative(B, D);
      string AB = add(A, B);
      string CD = add(C, D);
      string AB_CD = karatsubaIterative(AB, CD);

      // 计算中间项：AD + BC = (A+B)(C+D) - AC - BD
      string AD_BC = sub(sub(AB_CD, AC), BD);

      // 合并结果（动态补10的幂，适配非2次幂长度）
      string part1 = mulPower10(AC, 2 * mid);
      string part2 = mulPower10(AD_BC, mid);
      string result = add(add(part1, part2), BD);

      return trimZero(result);
  }

  // ===================== 测试用例 =====================
  int main() {
      // 测试1：非2次幂长度（5位×6位）
      string X1 = "12345";  // 5位（非2的幂）
      string Y1 = "678901"; // 6位（非2的幂）
      cout << "测试1（非2次幂长度）：" << endl;
      cout << X1 << " × " << Y1 << " = " << karatsubaIterative(X1, Y1) << endl;
      cout << "验证：12345×678901 = 8381032845" << endl << endl;

      // 测试2：超大数（15位×14位）
      string X2 = "987654321012345";
      string Y2 = "12345678909876";
      cout << "测试2（超大数）：" << endl;
      cout << X2 << " × " << Y2 << " = " << karatsubaIterative(X2, Y2) << endl;

      // 测试3：边界值（1位×100位）
      string X3 = "9";
      string Y3(100, '9'); // 100个9
      cout << "测试3（边界值）：" << endl;
      cout << X3 << " × " << Y3 << " = " << karatsubaIterative(X3, Y3) << endl;

      return 0;
  }
  ```

- 上述代码采用 “尾递归转迭代” 的简化写法，如果需要纯迭代，核心思路是：
  1.  用队列 / 栈存储待处理的数字对（X,Y）；
  2.  循环取出数字对，拆分后将子数字对入队，直到所有子对都是最小粒度；
  3.  从队列尾部开始合并结果，用 Karatsuba 公式逐层向上计算
