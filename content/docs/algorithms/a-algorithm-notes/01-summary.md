---
title: 算法总结
description: 枚举、滑动窗口、双指针等常用算法技巧的总结与代码模板
---

## 枚举技巧

- 暴力，但有技巧地暴力，也能够降低时间复杂度的维度
- 当发现暴力枚举时间复杂度过高时，可以考虑枚举一个值，另一个值用适当的数据结构来维护
- 常用枚举技巧
  - 使用哈希表解决两数之和为 K 的问题
  - 使用有序集合、单调队列、单调栈等维护最值
  - 使用前缀和数组来处理子数组的和
  - 使用预处理前缀最小值、前缀最大值等处理最值问题

## 滑动窗口 / 双指针

- 一种遍历的技巧，往往能够将两层遍历的时间复杂度降低为一遍遍历 $O(n)$

- 滑动窗口
  - 适合具有单调性的问题，能够根据是否满足条件来收缩和扩展窗口
  - 往往需要某种数据结构来维护窗口内的信息，并在元素移出窗口时删除该元素的信息
  - 分为定长、不定长窗口、单调队列等

- 滑动窗口代码模板

  ```cpp
  // 通用滑动窗口模板
  int slidingWindowTemplate(string s, /* 其他参数，如k、target等 */) {
      int n = s.size();
      int l = 0; // 左指针，初始为0
      int res = 0; // 最终结果（根据题目调整，如最大值/最小值/数量）
      // 定义窗口内的状态变量（根据题目调整，如计数、和、哈希表等）
      int windowState = 0;

      for (int r = 0; r < n; r++) { // 右指针遍历整个数组/字符串
          // 1. 扩大窗口：将s[r]纳入窗口，更新窗口状态
          updateWindowState(s[r], true); // 入窗：true表示添加

          // 2. 收缩窗口：根据题目约束条件，判断是否需要收缩左边界
          // 【关键】定长窗口用if，变长窗口用while
          while (/* 变长窗口：l <= r && 窗口不满足约束条件 */) {
              // 或 if (/* 定长窗口：窗口长度超过k */) {
              updateWindowState(s[l], false); // 出窗：false表示移除
              l++; // 左指针右移，收缩窗口
          }

          // 3. 更新结果：此时窗口[l, r]满足约束条件，计算结果
          res = calculateResult(res, windowState);
      }
      return res;
  }

  // 辅助函数：更新窗口状态（示例，根据题目调整）
  void updateWindowState(char c, bool isAdd) {
      if (isAdd) {
          // 添加字符c到窗口，更新状态（如元音计数+1）
      } else {
          // 移除字符c，更新状态（如元音计数-1）
      }
  }

  // 辅助函数：计算结果（示例，根据题目调整）
  int calculateResult(int res, int windowState) {
      // 如返回max(res, windowState)
      return res;
  }
  ```

- 双指针
  - 数组 / 字符串最常考，两个指针来回移动
  - 分为相向指针、同向指针、快慢指针等
  - 往往也需要具备单调性，以能够收缩移动两个指针
  - 快慢指针可以用于解决判圈算法等问题
  - 在双序列双指针问题中，一般用一个指针维护结果的下标，另一个指针遍历原数组/字符串

## 前缀和 / 差分

- 两者都是靠空间来换时间，可以先预处理得到数组再遍历求答案，也可以一次遍历的过程中边维护前缀和/差分边求答案

- 前缀和
  - 快速求任意区间和，一般是求开区间的前缀和
  - 如 `presum[i+1]=presum[i]+nums[i]`，因此前缀和数组一般初始化为数组大小+1
  - 二维前缀和：`presum[i+1][j+1]=presum[i][j + 1] + presum[i + 1][j] - presum[i][j] + matrix[i][j]`
  - 二维前缀和求任意矩阵的和（左上角 r1,c1、右下角 r2,r2）：`res=presum[r2 + 1][c2 + 1] - presum[r2 + 1][c1] - presum[r1][c2 + 1] + presum[r1][c1]`
  - 对前缀和数组求差分就是原始数组
- 差分
  - 快速对区间批量加减

  - 初始化：`diff[0] = nums[0]`，`diff[i] = nums[i] - nums[i-1]`（`i ≥ 1`）

  - 对区间 `[i,j]` 加上一个值 x：`diff[i]+=x, diff[j+1]-=x`

  - 还原原数组：通过前缀和计算 `nums[i] = nums[i-1] + diff[i]`

  - 差分数组的大小一般初始化为数组大小+2
    - 当需要对原数组的最后一个元素（索引 `n-1`）所在区间操作时，`r = n-1`，此时 `r+1 = n`
    - 如果差分数组只开 `n` 个空间（索引 `0~n-1`），访问 `diff[n]` 就会越界
    - 如果开 `n+1` 个空间，能覆盖 `r+1 = n`，但有些场景下（比如循环处理时）可能会触达 `n+1` 位置，`n+2` 能进一步兜底

  - 二维差分

    ```
    diff[x1][y1] += val;
    diff[x1][y2+1] -= val;
    diff[x2+1][y1] -= val;
    diff[x2+1][y2+1] += val;
    ```

## 二分查找

- 可以统一用一个 lower_bound 函数来实现所有需求，其返回第一个大于等于 x 的下标，如果不存在，返回数组长度 n

  ```cpp
  // lower_bound 返回最小的满足 nums[i] >= target 的下标 i
  // 如果数组为空，或者所有数都 < target，则返回 nums.size()
  // 要求 nums 是非递减的，即 nums[i] <= nums[i + 1]
  int lower_bound(vector<int>& nums, int target) {
      int left = 0, right = (int) nums.size() - 1; // 闭区间 [left, right]
      while (left <= right) { // 区间不为空
          // 循环不变量：
          // nums[left-1] < target
          // nums[right+1] >= target
          int mid = left + (right - left) / 2;
          if (nums[mid] >= target) {
              right = mid - 1; // 范围缩小到 [left, mid-1]
          } else {
              left = mid + 1; // 范围缩小到 [mid+1, right]
          }
      }
      // 循环结束后 left = right+1
      // 此时 nums[left-1] < target 而 nums[left] = nums[right+1] >= target
      // 所以 left 就是第一个 >= target 的元素下标
      return left;
  }
  ```

- upper_bound 函数，返回第一个大于 x 的下标

  ```cpp
  // upper_bound 返回最小的满足 nums[i] > target 的下标 i
  // 如果数组为空，或者所有数都 <= target，则返回 nums.size()
  // 要求 nums 是非递减的，即 nums[i] <= nums[i + 1]
  int upper_bound(vector<int>& nums, int target) {
      int left = 0, right = (int) nums.size() - 1; // 闭区间 [left, right]
      while (left <= right) { // 区间不为空
          // 循环不变量：
          // nums[left-1] <= target
          // nums[right+1] > target
          int mid = left + (right - left) / 2; // 避免整数溢出，等价于 (left+right)/2
          if (nums[mid] > target) {
              right = mid - 1; // 范围缩小到 [left, mid-1]
          } else {
              left = mid + 1; // 范围缩小到 [mid+1, right]
          }
      }
      // 循环结束后 left = right+1
      // 此时 nums[left-1] <= target 而 nums[left] = nums[right+1] > target
      // 所以 left 就是第一个 > target 的元素下标
      return left;
  }
  ```

- 常用转化

  | 需求                         | 写法                          | 如果不存在  |
  | ---------------------------- | ----------------------------- | ----------- |
  | $\ge x$ 的第一个元素的下标   | `lowerBound(nums, x)`         | 结果为 $n$  |
  | $> x$ 的第一个元素的下标     | `lowerBound(nums, x + 1)`     | 结果为 $n$  |
  | $< x$ 的最后一个元素的下标   | `lowerBound(nums, x) - 1`     | 结果为 $-1$ |
  | $\le x$ 的最后一个元素的下标 | `lowerBound(nums, x + 1) - 1` | 结果为 $-1$ |

- 求个数

  | 需求               | 写法                                 |
  | ------------------ | ------------------------------------ |
  | $< x$ 的元素个数   | `lowerBound(nums, x)`                |
  | $\le x$ 的元素个数 | `lowerBound(nums, x + 1)`            |
  | $\ge x$ 的元素个数 | $n - \text{lowerBound}(nums, x)$     |
  | $> x$ 的元素个数   | $n - \text{lowerBound}(nums, x + 1)$ |

- 注意：$< x$ 和 $\ge x$ 互为补集，元素个数之和为 $n$；$\le x$ 和 $> x$​ 同理

## 二分答案

- 猜答案 → 验证 → 缩范围（最小的最大值、最大的最小值）
- 第一步，验证能否用二分答案解决
  - 先将原问题用符号定义表达，判断是否满足所求答案越大/越小就越不可能，越小/越大就越可能，此时就可以用二分答案来收缩答案的区间范围
- 第二步，确定答案的上下界
  - 可以先根据题意确定比较大的上下界
  - 然后可以根据数学推导等来推导紧凑的上下界
  - 一些具有上下取整符号的题目最容易出错
- 第三步，确定二分过程的逻辑
  - 在收缩时，一般要求一个端点不满足条件，一个端点满足条件，当当前 mid 满足条件时，收缩满足条件的那个端点
  - 对于求最小值问题（越大越满足），一般是右端点一定满足条件，并收缩 right，最后的答案就是 left
  - 对于求最大值问题（越小越满足），一般是左端点一定满足条件，并收缩 left，最后的答案就是 right
- 第四步，确定 check 函数怎么写，以分割数组的最大值为例
  - 给定一个 mid，判断能否把数组分成 ≤m 段，每段和都 ≤mid？
  - 如果能：说明 `mid` 是一个可行解，尝试更小的值 → 收缩右边界
  - 如果不能：说明 `mid` 太小，满足所有子数组的和都小于等于 mid 时，已经划分出了多于 m 段，因此该最大值必须变大 → 收缩左边界

- 二分答案的代码模板

  ```cpp
  class Solution {
  public:
      // 计算满足 check(x) == true 的最小整数 x
      int binarySearchMin(vector<int>& nums) {
          // 二分猜答案：判断 mid 是否满足题目要求
          auto check = [&](int mid) -> bool {

          };

          int left = ; // 循环不变量：check(left) 恒为 false
          int right = ; // 循环不变量：check(right) 恒为 true
          // 闭区间写法：[left, right] 不为空时继续循环
          while (left <= right) {
              int mid = left + (right - left) / 2;
              if (check(mid)) { // 说明 check(>= mid 的数) 均为 true
                  right = mid - 1; // 收缩右边界，在 [left, mid-1] 中找更小的解
              } else { // 说明 check(<= mid 的数) 均为 false
                  left = mid + 1; // 收缩左边界，在 [mid+1, right] 中找解
              }
          }
          // 循环结束后 left > right
          // 此时 check(right) == false 而 check(left) == true
          // 所以 left 就是最小的满足 check 的值
          return left;
      }
  };
  ```

## 单调栈 / 单调队列 / 堆

- 单调（双端）队列：滑动窗口最值
  - 维护队列内元素的单调性（递增 / 递减），主要解决「滑动窗口类的极值问题」，能在 O (n) 时间内找到每个滑动窗口的最大值 / 最小值
  - 注意有些问题需要先对所求答案进行转化，以可以使用枚举技巧
  - 有些题目可能需要同时维护窗口内的最大值和最小值，并使最值之间的差距小于 target
- 单调栈：找左边 / 右边第一个大 / 小
  - 在 O (n) 时间内找到数组中每个元素的「左右第一个极值（更大 / 更小）元素」
  - 找左侧第一个更大/小值：从左往右遍历，每次更新当前元素的答案
  - 找右侧第一个更大/小值
    - 从左往右遍历，每次更新弹出的栈顶元素的答案
    - 从右往左遍历，每次更新当前元素的答案
  - 分为一维数组、矩形面积、贡献法、最小字典序等类型
- 堆：维护最值，贪心专用
  - 堆是一种完全二叉树，主要分为两种：
    - 最大堆：每个父节点的值都大于或等于其子节点的值
    - 最小堆：每个父节点的值都小于或等于其子节点的值
  - 通常用数组来存储堆（因为完全二叉树的数组存储效率最高），数组索引的对应关系（对于索引为 `i`的节点）：
    - 左子节点索引：`2*i + 1`
    - 右子节点索引：`2*i + 2`
    - 父节点索引：`(i - 1) / 2`（整数除法）
  - 小顶堆的核心价值是「快速获取 / 维护动态数据的最小值」，常见场景：
    - Top K 最大元素：维护大小为 K 的小顶堆，遍历数组时，若元素大于堆顶则替换堆顶，最终堆内就是 Top K 最大元素；
    - 数据流的中位数：结合大顶堆（存左半部分）和小顶堆（存右半部分），动态维护中位数；
    - 合并 K 个有序链表：用小顶堆存储各链表当前节点，每次取堆顶（最小节点），再插入该节点的下一个节点；
    - 任务调度 / 最短路径：如 Dijkstra 算法中，用小顶堆快速找到当前距离最短的节点；
    - 滑动窗口的中位数

## 分治算法

- 分治算法是一种递归解决问题的策略，核心是
  - 将一个大问题拆分成若干个规模更小、结构相同的子问题
  - 分别解决每个子问题
  - 最后将子问题的解合并，得到原问题的解

- 分治需满足以下 3 个条件：
  - 问题可以分解：原问题能拆分成若干个结构相同的子问题；
  - 子问题是独立的：子问题之间无依赖，可独立解决；
  - 子问题能够合并：子问题的解能合并为原问题的解

- 分治的一般步骤

  ```cpp
  function 分治(问题):
      1. 终止条件：如果问题规模足够小（如只有1个元素），直接求解并返回；
      2. 分（Divide）：将问题拆分成若干个结构相同的子问题；
      3. 治（Conquer）：递归求解每个子问题；
      4. 合（Combine）：将子问题的解合并为原问题的解；
      5. 返回合并后的解；
  ```

- 归并排序
  - 分（Divide）：把待排序的数组从中间拆分成两个子数组，然后递归地拆分每个子数组，直到每个子数组只剩 1 个元素（单个元素天然有序）
  - 治（Conquer）：把拆分后的有序子数组合并成一个更大的有序数组
  - 合（Combine）：重复 “治” 的过程，最终合并成一个完整的有序数组

- 求逆序对
  - 在归并排序的过程中统计逆序对，归并排序的 “合并” 阶段需要让子数组有序，而 “有序性” 恰好能让我们批量统计逆序对（避免暴力枚举）
  - 分：递归拆分数组为左右子数组，分别统计左右子数组内部的逆序对数量；
  - 治 + 合：合并两个有序子数组时，统计 “跨左右子数组” 的逆序对数量（左子数组元素 > 右子数组元素的情况）；
  - 总数量：总逆序对 = 左子数组内部逆序对 + 右子数组内部逆序对 + 跨左右的逆序对

- 快速排序
  - 分（Divide）：选基准 + 分区
    - 选基准（Pivot）：从数组中选一个元素作为 “基准值”（比如选第一个、最后一个、中间值或随机值）；
    - 分区操作：将数组中小于等于基准的元素放到基准左边，大于基准的元素放到基准右边，最终基准会落在 “正确的位置”（排序后的最终位置）
  - 治（Conquer）：递归处理子数组
    - 对基准左边的子数组和右边的子数组，递归执行 “选基准 + 分区”，直到子数组长度≤1（天然有序）

  - 合（Combine）：无需合并
    - 归并排序需要合并有序子数组
    - 但快速排序的分区操作本身就让基准归位，递归结束后整个数组自然有序，因此无需额外合并步骤
    - 这是快速排序和归并排序分治思想的核心区别

- 最近点对问题
  - 按 x 坐标排序
  - 分：从中点分成左、右两部分
  - 治：递归求左、右内部最近点对，取较小距离 d
  - 合：在中线左右 d 宽度的带状区域里，找有没有更近的点对
  - 返回全局最小

- 快速选择（减治，只分不合）
  - O (n) 找第 K 大 / 小
  - 选基准→分区，将数组分为 “≤基准”（左）和 “> 基准”（右）两部分，得到基准的下标 `pivotPos`
  - 比较 `pivotPos` 和目标位置 `k`：
    - 若 `pivotPos == k`：基准就是第 k 小元素，直接返回；
    - 若 `pivotPos > k`：目标在左子数组，递归处理左半部分；
    - 若 `pivotPos < k`：目标在右子数组，递归处理右半部分；
  - 终止条件：找到目标位置，返回对应值

## 字符串

- ## KMP
- Trie（字典树）
  - 存字符串前缀，快速查找

## 链表

- 双向链表的写法
-

## 二叉树

- 二叉树遍历的核心是按照特定顺序访问树中每个节点且仅访问一次：
  - 前序遍历：根节点 → 左子树 → 右子树
  - 中序遍历：左子树 → 根节点 → 右子树
  - 后序遍历：左子树 → 右子树 → 根节点
  - 层序遍历：从上到下、从左到右逐层访问节点

- 各种遍历算法的实现
  - 前序遍历（递归）：先访问当前根节点，再递归处理左子树，最后递归处理右子树；利用递归的栈特性，天然满足 “根→左→右” 的顺序

    ```cpp
    class Solution {
    public:
        void traversal(TreeNode* cur, vector<int>& vec) {
            if (cur == NULL) return;
            vec.push_back(cur->val);    // 中
            traversal(cur->left, vec);  // 左
            traversal(cur->right, vec); // 右
        }
        vector<int> preorderTraversal(TreeNode* root) {
            vector<int> result;
            traversal(root, result);
            return result;
        }
    };
    ```

  - 前序遍历（迭代）：用栈模拟递归，先将根节点入栈；每次弹出栈顶节点并访问，再按 “右子树→左子树” 的顺序入栈（栈后进先出，保证左子树先被处理），最终实现 “根→左→右”

    ```cpp
    class Solution {
    public:
        vector<int> preorderTraversal(TreeNode* root) {
            stack<TreeNode*> st;
            vector<int> result;
            if (root == NULL) return result;
            st.push(root);
            while (!st.empty()) {
                TreeNode* node = st.top();                       // 中
                st.pop();
                result.push_back(node->val);
                if (node->right) st.push(node->right);           // 右（空节点不入栈）
                if (node->left) st.push(node->left);             // 左（空节点不入栈）
            }
            return result;
        }
    };
    ```

  - 中序遍历（递归）：先递归深入左子树直到叶子节点，再访问当前根节点，最后递归处理右子树；递归的深度优先特性保证 “左→根→右” 的顺序

    ```cpp
    void traversal(TreeNode* cur, vector<int>& vec) {
        if (cur == NULL) return;
        traversal(cur->left, vec);  // 左
        vec.push_back(cur->val);    // 中
        traversal(cur->right, vec); // 右
    }
    ```

  - 中序遍历（迭代）：用栈保存待访问的节点，先遍历到左子树最深处（沿途节点入栈）；弹出栈顶节点并访问，再将指针指向其右子树，重复上述过程，直到栈空且无待处理节点

    ```cpp
    class Solution {
    public:
        vector<int> inorderTraversal(TreeNode* root) {
            vector<int> result;
            stack<TreeNode*> st;
            TreeNode* cur = root;
            while (cur != NULL || !st.empty()) {
                if (cur != NULL) { // 指针来访问节点，访问到最底层
                    st.push(cur); // 将访问的节点放进栈
                    cur = cur->left;                // 左
                } else {
                    cur = st.top(); // 从栈里弹出的数据，就是要处理的数据（放进result数组里的数据）
                    st.pop();
                    result.push_back(cur->val);     // 中
                    cur = cur->right;               // 右
                }
            }
            return result;
        }
    };
    ```

  - 后序遍历（递归）：先递归处理左子树，再递归处理右子树，最后访问当前根节点；递归的回溯特性保证 “左→右→根” 的顺序

    ```cpp
    void traversal(TreeNode* cur, vector<int>& vec) {
        if (cur == NULL) return;
        traversal(cur->left, vec);  // 左
        traversal(cur->right, vec); // 右
        vec.push_back(cur->val);    // 中
    }
    ```

  - 后序遍历（迭代）：基于前序遍历变形，先按 “根→右→左” 的顺序遍历（入栈时先左后右），再将结果反转，即可得到 “左→右→根” 的后序遍历结果，是最易理解的迭代实现方式

    ```cpp
    class Solution {
    public:
        vector<int> postorderTraversal(TreeNode* root) {
            stack<TreeNode*> st;
            vector<int> result;
            if (root == NULL) return result;
            st.push(root);
            while (!st.empty()) {
                TreeNode* node = st.top();
                st.pop();
                result.push_back(node->val);
                if (node->left) st.push(node->left); // 相对于前序遍历，这更改一下入栈顺序 （空节点不入栈）
                if (node->right) st.push(node->right); // 空节点不入栈
            }
            reverse(result.begin(), result.end()); // 将结果反转之后就是左右中的顺序了
            return result;
        }
    };
    ```

  - 层序遍历（迭代）：用队列实现广度优先搜索（BFS），先将根节点入队；每次遍历当前队列中所有节点（即当前层），访问节点后将其左、右子节点依次入队，直到队列为空，保证 “逐层、从左到右” 访问——可以用于求解树的深度

    ```cpp
    class Solution {
    public:
        vector<vector<int>> levelOrder(TreeNode* root) {
            queue<TreeNode*> que;
            if (root != NULL) que.push(root);
            vector<vector<int>> result;
            while (!que.empty()) {
                int size = que.size();
                vector<int> vec;
                // 这里一定要使用固定大小size，不要使用que.size()，因为que.size是不断变化的
                for (int i = 0; i < size; i++) {
                    TreeNode* node = que.front();
                    que.pop();
                    vec.push_back(node->val);
                    if (node->left) que.push(node->left);
                    if (node->right) que.push(node->right);
                }
                result.push_back(vec);
            }
            return result;
        }
    };
    ```

- 自顶向下与自底向上
  - 前序遍历（根→左→右）：天然对应自顶向下的解题视角
    - 前序遍历的第一步是访问 “当前根节点”，再递归处理子节点
    - 这和自顶向下的思路完全一致：先利用当前节点的信息（比如传递 “当前深度”“当前路径和”），再把状态传递给子节点，让子节点继续处理

  - 后序遍历（左→右→根）：天然对应自底向上的解题视角
    - 后序遍历的最后一步才访问 “当前根节点”，必须等左右子节点都处理完才能处理当前节点
    - 这和自底向上的思路完全一致：先让子节点计算出结果（比如子树的深度、子树的和），再汇总子节点的结果，计算当前节点的答案并返回给父节点

  - 中序遍历（左→根→右）很少作为 “自顶向下 / 自底向上” 的核心视角，它的核心价值体现在二叉搜索树（BST）中：中序遍历 BST 的结果是升序的，这是 BST 的核心特征

- 无论用递归还是迭代实现前序 / 后序遍历，“自顶向下 / 自底向上” 的核心视角都不变：
  - 迭代前序：先弹出根节点处理 → 再压入右 / 左子节点 → 还是先处理父、后处理子；
  - 迭代后序：先处理完左右子节点 → 再处理根节点 → 还是先处理子、后处理父

- 只有前序 + 中序，或者后序 + 中序的组合可以唯一确定一棵二叉树（前序 + 后序无法唯一确定）
  - 前序遍历：根节点 → 左子树 → 右子树（第一个元素是根）

  - 中序遍历：左子树 → 根节点 → 右子树（根节点把序列分成左右子树）

  - 后序遍历：左子树 → 右子树 → 根节点（最后一个元素是根）

- 根据一棵树的中序遍历与后序遍历构造二叉树
  - 第一步：如果数组大小为零的话，说明是空节点了
  - 第二步：如果不为空，那么取后序数组最后一个元素作为节点元素
  - 第三步：找到后序数组最后一个元素在中序数组的位置，作为切割点
  - 第四步：切割中序数组，切成中序左数组和中序右数组 （顺序别搞反了，一定是先切中序数组）
  - 第五步：切割后序数组，切成后序左数组和后序右数组
  - 第六步：递归处理左区间和右区间

- 代码实现

  ```cpp
  class Solution {
  private:
      TreeNode* traversal (vector<int>& inorder, vector<int>& postorder) {
          if (postorder.size() == 0) return NULL;

          // 后序遍历数组最后一个元素，就是当前的中间节点
          int rootValue = postorder[postorder.size() - 1];
          TreeNode* root = new TreeNode(rootValue);

          // 叶子节点
          if (postorder.size() == 1) return root;

          // 找到中序遍历的切割点
          int delimiterIndex;
          for (delimiterIndex = 0; delimiterIndex < inorder.size(); delimiterIndex++) {
              if (inorder[delimiterIndex] == rootValue) break;
          }

          // 切割中序数组
          // 左闭右开区间：[0, delimiterIndex)
          vector<int> leftInorder(inorder.begin(), inorder.begin() + delimiterIndex);
          // [delimiterIndex + 1, end)
          vector<int> rightInorder(inorder.begin() + delimiterIndex + 1, inorder.end() );

          // postorder 舍弃末尾元素
          postorder.resize(postorder.size() - 1);

          // 切割后序数组
          // 依然左闭右开，注意这里使用了左中序数组大小作为切割点
          // [0, leftInorder.size)
          vector<int> leftPostorder(postorder.begin(), postorder.begin() + leftInorder.size());
          // [leftInorder.size(), end)
          vector<int> rightPostorder(postorder.begin() + leftInorder.size(), postorder.end());

          root->left = traversal(leftInorder, leftPostorder);
          root->right = traversal(rightInorder, rightPostorder);

          return root;
      }
  public:
      TreeNode* buildTree(vector<int>& inorder, vector<int>& postorder) {
          if (inorder.size() == 0 || postorder.size() == 0) return NULL;
          return traversal(inorder, postorder);
      }
  };
  ```

- 求解最近公共祖先

  ```cpp
  class Solution {
  public:
      TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
          if (root == q || root == p || root == NULL) return root;
          TreeNode* left = lowestCommonAncestor(root->left, p, q);
          TreeNode* right = lowestCommonAncestor(root->right, p, q);
          if (left != NULL && right != NULL) return root;
          if (left == NULL) return right;
          return left;
      }
  };
  ```

## 回溯

- 回溯是一种搜索的方式

- 回溯的本质是穷举，穷举所有可能，然后选出想要的答案，如果想让回溯法高效一些，可以进行剪枝，但也改不了回溯法就是穷举的本质

- 回溯法一般可以解决如下几种问题：
  - 组合问题：N个数里面按一定规则找出k个数的集合
  - 切割问题：一个字符串按一定规则有几种切割方式
  - 子集问题：一个N个数的集合里有多少符合条件的子集
  - 排列问题：N个数按一定规则全排列，有几种排列方式
  - 棋盘问题：N皇后，解数独等等

- 回溯问题的树形结构
  - 回溯法解决的问题都可以抽象为树形结构，因为回溯法解决的都是在集合中递归查找子集，集合的大小就构成了树的宽度，递归的深度就构成了树的深度
  - 在遍历时，需要考虑在不同类型场景中，横向遍历和纵向遍历的意义
  - 树的节点：表示当前的决策状态（已选元素、当前位置等）
  - 树的分支：表示当前步的可选决策（选哪个元素、切在哪里等）
  - 树的深度：表示决策的步骤（比如组合选第 k 个元素、切割切第 k 刀）
  - 回溯（回退）：从子节点回到父节点，撤销当前决策，尝试下一个分支

- 不同场景树结构的差异
  - 组合 / 子集：树的分支是「从当前位置往后选」，避免重复；子集是「每个节点都收集结果」，组合是「仅叶子节点收集」
  - 切割：树的分支是「当前切割点的所有回文子串」，结束条件是「切割到末尾」
  - 排列：树的分支是「所有未选元素」，需用 `used` 标记，允许选前面的元素（因此有顺序）
  - 棋盘（N 皇后）：树的每一层是「一行」，分支是「该行的合法列」，需检查列 / 对角线约束

- 回溯的终止条件
  - 一般来说，找到了满足条件的一条答案，旧保存起来并结束本层递归
  - 不一定是要等到回溯终止才记录答案，如果题目要求的是回溯的叶子节点，那么在回溯终止时记录答案，如果中间节点也是合法的，那么也可以记录答案

- 如何进行回溯
  - 回溯可以通过两种方法实现
  - 一种是在 backtracking 函数中显式进行回溯
  - 一种是通过值传递参数来实现隐式回溯，一般用于 idx 或字符串

- 回溯算法的技巧
  - 进行有效的剪枝：提前排除无效选择（如组合的剩余元素检查、N 皇后的对角线检查），大幅提升效率
  - 状态回退：递归后必须撤销选择（`pop()`、`used`重置等），恢复到父节点状态
  - 结果收集：注意拷贝路径（`path.copy()`），避免后续修改覆盖结果

- 如何计算回溯的时间复杂度
  - 一般而言，首先要确定横向遍历的宽度、纵向遍历的深度
  - 结合宽度和深度来计算时间复杂度

- 回溯的模板写法

  ```cpp
  void backtracking(参数) {
      if (终止条件) {
          存放结果;
          return;
      }

      for (选择：本层集合中元素（树中节点孩子的数量就是集合的大小）) {
          处理节点;
          backtracking(路径，选择列表); // 递归
          回溯，撤销处理结果
      }
  }
  ```

## 图论

- 深度优先搜索（DFS）
  - 搜索策略：在搜索过程中，始终沿着当前选定的路径进行深度遍历，直至遇到边界条件（如无后续节点、达到目标状态或判定为无效路径）时，再切换搜索方向

  - 回溯机制：当当前路径搜索失败（碰壁）时，需回退至路径上的上一决策节点，撤销当前路径的状态记录，选择该节点的下一个未探索邻接路径继续搜索，这一状态回退与路径切换的过程即为回溯

  - 二叉树遍历的实现本质：
    - 递归方式实现的二叉树遍历，其底层逻辑等价于深度优先搜索（DFS），通过函数调用栈天然实现了路径的深度遍历与回溯；
    - 迭代方式实现的二叉树遍历（通常借助队列结构），其核心逻辑对应广度优先搜索（BFS），按层级遍历节点，逐层探索二叉树的宽度维度

  - 代码框架

    ```cpp
    void dfs(参数) {
        if (终止条件) {
            存放结果;
            return;
        }

        for (选择：本节点所连接的其他节点) {
            处理节点;
            dfs(图，选择的节点); // 递归
            回溯，撤销处理结果
        }
    }
    ```

  - DFS 的流程
    - 确认递归函数、递归函数的参数：一般情况下，深度搜索需要二维数组结构保存所有路径，需要一维数组保存单一路径

      ```cpp
      vector<vector<int>> result; // 保存符合条件的所有路径
      vector<int> path; // 起点到终点的路径
      void dfs (图，目前搜索的节点)
      ```

    - 确认终止条件

    - 处理目前搜索节点发出的路径

  - DFS 通常可以用来计算图中的连通块个数

    ```cpp
    #include <iostream>
    #include <vector>
    using namespace std;

    int dir[4][2] = {0, 1, 1, 0, -1, 0, 0, -1}; // 四个方向
    void dfs(const vector<vector<int>>& grid, vector<vector<bool>>& visited, int x, int y) {
        for (int i = 0; i < 4; i++) {
            int nextx = x + dir[i][0];
            int nexty = y + dir[i][1];
            if (nextx < 0 || nextx >= grid.size() || nexty < 0 || nexty >= grid[0].size()) continue;  // 越界了，直接跳过
            if (!visited[nextx][nexty] && grid[nextx][nexty] == 1) { // 没有访问过的 同时 是陆地的

                visited[nextx][nexty] = true;
                dfs(grid, visited, nextx, nexty);
            }
        }
    }

    int main() {
        int n, m;
        cin >> n >> m;
        vector<vector<int>> grid(n, vector<int>(m, 0));
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                cin >> grid[i][j];
            }
        }

        vector<vector<bool>> visited(n, vector<bool>(m, false));

        int result = 0;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (!visited[i][j] && grid[i][j] == 1) {
                    visited[i][j] = true;
                    result++; // 遇到没访问过的陆地，+1
                    dfs(grid, visited, i, j); // 将与其链接的陆地都标记上 true
                }
            }
        }

        cout << result << endl;
    }
    ```

- 广度优先搜索（BFS）
  - 用于最短路径问题
    - BFS 是解决无权图（或边权相等的图）中两点间最短路径问题的最优策略之一
    - 其底层逻辑为从起始节点出发，以起始节点为中心按「层序遍历」的方式向外逐层扩展搜索范围
    - 由于每一层对应与起点的距离相等，因此首次访问到目标节点时，所经过的路径即为两点间的最短路径

  - BFS 的数据结构基础
    - BFS 依赖一个具备「先进先出」特性的容器来存储待遍历的节点（即已发现但未访问的节点）
    - 常见的实现容器包括队列、数组（需手动维护遍历顺序），栈并非 BFS 的标准容器（易破坏层序特性）

  - 队列在 BFS 中的作用
    - 使用队列作为存储容器时，可严格保证节点按「层级」顺序遍历
    - 先入队的节点（当前层）优先被处理，后入队的节点（下一层）延后处理，确保每一轮遍历的节点均属于同一层级，符合 BFS 「一圈一圈扩展」的核心逻辑

  - 栈对遍历顺序的影响
    - 若误用栈作为存储容器，遍历顺序会变为「后进先出」，导致层级遍历的方向发生交替（如第一层顺时针遍历，第二层逆时针遍历）
    - 此时遍历逻辑已偏离标准 BFS，本质上属于非规范的深度优先变体，无法保证最短路径的求解

  - 代码示例

    ```cpp
    int dir[4][2] = {0, 1, 1, 0, -1, 0, 0, -1}; // 表示四个方向
    // grid 是地图，也就是一个二维数组
    // visited标记访问过的节点，不要重复访问
    // x,y 表示开始搜索节点的下标
    void bfs(vector<vector<char>>& grid, vector<vector<bool>>& visited, int x, int y) {
        queue<pair<int, int>> que; // 定义队列
        que.push({x, y}); // 起始节点加入队列
        visited[x][y] = true; // 只要加入队列，立刻标记为访问过的节点
        while(!que.empty()) { // 开始遍历队列里的元素
            pair<int ,int> cur = que.front(); que.pop(); // 从队列取元素
            int curx = cur.first;
            int cury = cur.second; // 当前节点坐标
            for (int i = 0; i < 4; i++) { // 开始想当前节点的四个方向左右上下去遍历
                int nextx = curx + dir[i][0];
                int nexty = cury + dir[i][1]; // 获取周边四个方向的坐标
                if (nextx < 0 || nextx >= grid.size() || nexty < 0 || nexty >= grid[0].size()) continue;  // 坐标越界了，直接跳过
                if (!visited[nextx][nexty]) { // 如果节点没被访问过
                    que.push({nextx, nexty});  // 队列添加该节点为下一轮要遍历的节点
                    visited[nextx][nexty] = true; // 只要加入队列立刻标记，避免重复访问
                }
            }
        }

    }
    ```

- 连通块（Connected Component）
  - 连通块也叫连通分量，是图论与网格问题中最基础的概念之一
  - 表示一个极大的连通子图 / 区域，内部任意两点可达，且无法再加入其他点仍保持连通
  - 可以通过 DFS、BFS、并查集来实现
  - 其中并查集适用于动态连通块、多次查询的情况
  - 在某些题目中，可以将数组问题转换为连通块问题
    - 抽象节点：把数组 / 矩阵中的元素（城市、变量、位置）抽象成图的「节点」；
    - 定义连通：把元素间的关系（相邻、相等、相连）抽象成图的「边」；
    - 解决问题：用 DFS/BFS/ 并查集 统计连通块数量，或验证连通性

- 拓扑排序
  - 给出一个有向图，将这个有向图转换为线性的排序，就叫做拓扑排序

  - 拓扑排序也用于检测有向图是否有环，即存在循环依赖的情况，这种情况是无法给出线性排序的，因此拓扑排序也是图论中判断有向无环图（DAG）的常用方法

  - Kahn 算法（基于入度的 BFS 实现）
    - 计算所有节点的入度（指向该节点的边的数量）
    - 将所有入度为 0 的节点加入队列（无前置依赖的节点）
    - 依次取出队列中的节点，将其加入拓扑序列，并遍历该节点的所有邻接节点，将邻接节点的入度减 1
    - 若邻接节点入度减为 0，则加入队列
    - 重复步骤 3-4，直到队列为空。若最终拓扑序列的长度等于节点总数，说明无环且排序完成；否则图中存在环，无法拓扑排序

    ```cpp
    vector<int> topologicalSortKahn(int numNodes, const vector<vector<int>>& edges) {
        // 1. 初始化入度数组和邻接表
        vector<int> inDegree(numNodes, 0);
        vector<vector<int>> adj(numNodes);

        // 2. 构建邻接表和入度数组
        for (const auto& edge : edges) {
            int u = edge[0];
            int v = edge[1];
            adj[u].push_back(v);
            inDegree[v]++;
        }

        // 3. 初始化队列：入度为0的节点入队
        queue<int> q;
        for (int i = 0; i < numNodes; ++i) {
            if (inDegree[i] == 0) {
                q.push(i);
            }
        }

        // 4. 执行BFS生成拓扑序列
        vector<int> topoOrder;
        while (!q.empty()) {
            int curr = q.front();
            q.pop();
            topoOrder.push_back(curr);

            // 遍历邻接节点，入度减1
            for (int neighbor : adj[curr]) {
                inDegree[neighbor]--;
                if (inDegree[neighbor] == 0) {
                    q.push(neighbor);
                }
            }
        }

        // 5. 检测环：拓扑序列长度 != 节点数则存在环
        if (topoOrder.size() != numNodes) {
            return {};  // 空数组表示有环，无合法拓扑序列
        }
        return topoOrder;
    }
    ```

  - DFS + 回溯实现（基于后序遍历）
    - 维护一个访问状态数组（0：未访问，1：访问中，2：已访问），用于检测环；
    - 对每个未访问的节点执行 DFS：
      - 标记节点为「访问中」，若遍历过程中遇到「访问中」的节点，说明存在环；
      - 递归遍历该节点的所有邻接节点；
      - 邻接节点遍历完成后，将当前节点加入临时栈（后序遍历特性）；
    - 所有节点遍历完成后，将栈中元素逆序，即为拓扑序列

    ```cpp
    // 辅助DFS函数
    void dfs(int node, vector<vector<int>>& adj, vector<int>& state, vector<int>& stack, bool& hasCycle) {
        if (hasCycle) return;
        state[node] = 1;  // 标记为「访问中」

        // 递归遍历所有邻接节点
        for (int neighbor : adj[node]) {
            if (state[neighbor] == 0) {
                dfs(neighbor, adj, state, stack, hasCycle);
            } else if (state[neighbor] == 1) {
                // 遇到「访问中」的节点，说明存在环
                hasCycle = true;
                return;
            }
        }

        state[node] = 2;  // 标记为「已访问」
        stack.push_back(node);  // 后序遍历：邻接节点处理完后入栈
    }

    vector<int> topologicalSortDFS(int numNodes, const vector<vector<int>>& edges) {
        // 1. 构建邻接表
        vector<vector<int>> adj(numNodes);
        for (const auto& edge : edges) {
            int u = edge[0];
            int v = edge[1];
            adj[u].push_back(v);
        }

        // 2. 状态数组：0=未访问，1=访问中，2=已访问
        vector<int> state(numNodes, 0);
        vector<int> stack;  // 存储后序遍历结果
        bool hasCycle = false;

        // 3. 遍历所有未访问节点，执行DFS
        for (int i = 0; i < numNodes; ++i) {
            if (state[i] == 0 && !hasCycle) {
                dfs(i, adj, state, stack, hasCycle);
            }
        }

        // 4. 存在环则返回空，否则逆序栈得到拓扑序列
        if (hasCycle) {
            return {};
        }
        reverse(stack.begin(), stack.end());  // 后序结果逆序
        return stack;
    }
    ```

- 并查集

- 最小生成树
  - Prim 算法从节点的角度采用贪心的策略每次寻找距离最小生成树最近的节点并加入到最小生成树中
    - 从任意顶点（如顶点 0）开始，初始化 “已选顶点集合”
    - 维护一个优先队列（最小堆），存储从已选集合到未选集合的边
    - 每次取出堆中权值最小的边，将对应未选顶点加入集合，并将该顶点的所有邻边加入堆
    - 重复步骤 3，直到所有顶点都被加入（选够`n-1`条边）
  - Prim（不使用堆）
    - 使用minDist 数组来记录每一个节点距离最小生成树的最近距离，初始化为距离的最大数
    - 在最初的时候，还没有被加入最小生成树的节点，可以随便选取一个节点
    - 选取一个节点后，加入到最小生成树中，然后更新所有非生成树节点与已经生成的生成树中最新节点的距离
  - Prim 算法是维护节点的集合，而 Kruskal 算法是维护边的集合
    - 将边的权值排序，因为要优先选最小的边加入到生成树里
    - 遍历排序后的边
      - 如果边首尾的两个节点在同一个集合，说明如果连上这条边图中会出现环
      - 如果边首尾的两个节点不在同一个集合，加入到最小生成树，并把两个节点加入同一个集合
    - 可以使用并查集来判断两个节点是否在同一个集合中
  - 使用 Kruskal 和 Prim 算法哪个更合适？
    - 如果一个图中，节点多但边相对较少，那么使用Kruskal 算法更优；因为 Kruskal 是对边进行排序的后进行操作是否加入到最小生成树，边如果少，那么遍历操作的次数就少
    - 而 Prim 算法是对节点进行操作的，节点数量越少，Prim 算法效率就越优
    - 所以在稀疏图中，用 Kruskal 更优；在稠密图中，用 Prim 算法更优

- 最短路径
  - 基础算法：Dijkstra 算法
    - Dijkstra 算法用于求解**单源最短路径**（从一个起点到所有其他顶点），适用于**无负权边**的有向 / 无向带权图
    - 初始化起点到所有顶点的距离为无穷大，起点到自身距离为 0
    - 维护一个优先队列（最小堆），每次取出「当前距离起点最近的未访问顶点」
    - 松弛该顶点的所有邻接边（更新邻接顶点的最短距离），并将更新后的顶点加入队列
    - 重复直到所有顶点被访问

  - Dijkstra 最大局限：无法处理负权边 / 负权环
    - 负权边场景（如网络延迟补偿、金融交易成本）中，Dijkstra 的 “贪心选择” 会失效（一旦顶点被标记为 “已确定最短路径”，后续负权边无法更新其距离）；
    - 若图中存在负权环，最短路径可能不存在（绕环无限次可让路径权值趋近负无穷），Dijkstra 既无法检测也无法处理

  - 处理负权边：Bellman-Ford 算法
    - Bellman-Ford 算法解决单源最短路径，支持存在负权边的图，且能检测负权环（若存在则告知 “无最短路径”）
    - 初始化起点到所有顶点的距离为无穷大，起点到自身为 0
    - 对所有边执行 V-1 轮松弛操作（每轮遍历所有边，更新邻接顶点的最短距离）—— 因为任意两点的最短路径最多包含 V-1 条边
    - 第 V 轮遍历所有边，若仍能松弛，则说明存在负权环

  - Bellman-Ford 解决了负权边问题，但效率极低：
    - 即使大部分边无需松弛，仍需遍历 V-1 轮所有边，在稀疏图中（E ≈ V），性能远差于 Dijkstra
    - 无针对性优化，无法利用图的稀疏特性

  - SPFA 算法（队列优化的 Bellman-Ford）
    - 用队列替代 “全量遍历”：只有顶点的最短距离被更新时，才将其加入队列，后续仅处理该顶点的邻边
    - 时间复杂度：平均 O (E)，最坏仍为 O (V×E)（退化为 Bellman-Ford）
    - 在稀疏图 / 无负权环的负权图中，大幅降低无效松弛操作，提升实际运行效率

  - 多源最短路径：Floyd-Warshall 算法
    - Floyd-Warshall 算法解决全源最短路径（任意两点间的最短路径），支持负权边，也能检测负权环

    - 核心思想是动态规划，两个节点之间的最短距离，可以由中间节点分割得到的子问题来推导得到整体最优方案

      $$
      d[i][j] = min(d[i][j], d[i][k] + d[k][j])
      $$

    - dp 数组即“i 到 j 的最短路径” = min(原路径, i 经 k 到 j 的路径)）
      - 初始化距离矩阵 $d[i][j]$：i=j 时为 0，有边时为边权，无边时为无穷大；
      - 遍历所有中间顶点 k，再遍历所有顶点对 (i,j)，按状态方程更新距离；
      - 若 $d[i][i] < 0$​，说明存在包含 i 的负权环

  - Floyd-Warshall 复杂度为 O (V³)，仅适用于小规模图（如 V ≤ 200）；当 V 较大时（如城市路网、社交网络），效率完全无法满足需求，因此衍生出 “Johnson 算法”（结合 Bellman-Ford 和 Dijkstra 的全源算法）

  - Johnson 算法解决大规模图的全源最短路径，兼容负权边（无负权环），平衡“单源算法”和“全源算法”的效率
    - 新增一个虚拟顶点 s，向所有顶点连一条权值为 0 的边
    2. 用 Bellman-Ford 计算 s 到所有顶点的距离 $h[v]$（消除负权边：若原边权为 w(u,v)，则新边权为 $w'(u,v) = w(u,v) + h[u] - h[v]$，保证新边权非负）
    3. 对每个顶点作为起点，用 Dijkstra 算法计算新边权下的最短路径，再还原为原边权的最短路径（$d(u,v) = d'(u,v) - h[u] + h[v]$​）

- A\* 算法
  - 在搜索最短路时， 如果是无权图（边的权值都是1） 那么可以使用 BFS，代码简洁，时间效率和 dijkstra 差不多 （具体要取决于图的稠密）；而如果是有权图（边有不同的权值），优先考虑 dijkstra
  - A\* 是一种带启发式的最优路径搜索算法，结合了 BFS/ Dijkstra 的「最短路径保证」与贪心思想「更快找到终点」
  - A\* 算法的关键在于启发式函数， 也就是影响 BFS 或者 dijkstra 从容器（队列）里取元素的优先顺序
  - 那么启发式函数如何影响队列里元素的排序？就需要给每一个节点权值，设每个节点的权值为 F，给出公式为：F = G + H
    - G：起点达到目前遍历节点的距离
    - H：目前遍历的节点到达终点的距离

  - A\* 算法并不能保证一定是最短路，因为在设计启发式函数的时候，要考虑 时间效率与准确度之间的一个权衡

## 贪心

- 贪心的本质是选择每一阶段的局部最优，从而达到全局最优
- 贪心算法的唯一难点就是如何通过局部最优，推出整体最优，而这个特征如何判断？最好用的策略是举反例
- 而一般的数学证明有如下两种方法
  - 数学归纳法
  - 反证法
- 数学证明思路
  - 贪心选择性质：假设存在一个最优解，它一步不选贪心选的那个，你一定可以把它替换成贪心选择，得到同样优或更优的解
  - 最优子结构：全局最优 = 本次贪心最优 + 剩下子问题的最优
- 贪心算法一般分为如下四步：
  - 将问题分解为若干个子问题
  - 找出适合的贪心策略
  - 求解每一个子问题的最优解
  - 将局部最优解堆叠成全局最优解
- 贪心问题的类型
  - 贪心选择类问题（资源分配 / 找最优解）
    - 这类问题核心是 “选什么” 能让结果最优，每一步选当前最优的选项
    - 常见子场景：
      - 零钱兑换（当硬币面额满足 “贪心性质” 时，如人民币面额：1/5/10/20/50/100）
      - 分饼干（用最少饼干满足最多孩子，每个孩子只能要 1 块）
      - 买卖股票的最佳时机（只能买卖一次 / 多次，多次时贪心更简单）

  - 区间问题（贪心核心：按右边界排序）
    - 所有题均需「按右边界（结束时间）升序排序」，最大化后续空间利用率
    - 常见场景
      - 区间调度（选最多不重叠区间）

      - 区间合并（合并重叠 / 相邻区间）

      - 区间覆盖（用最少区间覆盖整个目标区间）

- 常配合堆、排序使用

## 动态规划

- 把大问题拆成小问题，记录答案不重复算
- 状态
- 转移
- 边界
- 子数组、子序列、路径、简单背包
- 要点
  - 动态规划如何进行空间优化
  - 动态规划的常见类型、代码细节总结
    - 不同 DP 问题如何进行遍历
    - 子序列（连续/不连续）问题如何定义 DP 数组
  - 做区间类型 DP 的题目

## 技巧

- 位运算
- 下一个排列问题
- 计数排序
- 矩阵快速幂
