---
title: 贪心算法
description: 贪心算法的核心思想、适用场景、常见题型与解题策略
---

## 贪心算法基础知识

- 贪心的本质是选择每一阶段的局部最优，从而达到全局最优
- 以拿钞票为例：每次取面额最大的钞票，每一步都做出局部最优选择，最终就能得到总金额最大的全局最优解，这就是贪心算法的典型应用
- 而在背包问题中，如果仍用贪心思路每次选体积最大的物品，往往无法得到最优装法，因为局部最优无法推导出全局最优，这类问题必须使用动态规划求解
- 贪心算法的唯一难点就是如何通过局部最优，推出整体最优，而这个特征如何判断？最好用的策略是举反例
- 一般数学证明有如下两种方法
  - 数学归纳法
  - 反证法
- 数学证明思路
  - 贪心选择性质：假设存在一个最优解，它一步不选贪心选的那个，你一定可以把它替换成贪心选择，得到同样优或更优的解
  - 最优子结构：全局最优 = 本次贪心最优 + 剩下子问题的最优
- 最简单、最实用的验证方法（刷题 / 面试用）
  - 手动模拟几步，看局部最优能不能推到全局最优
  - 使劲想反例，想不出来 → 贪心基本可行
  - 能构造出反例 → 贪心不行，用 DP
- 贪心算法一般分为如下四步：
  - 将问题分解为若干个子问题
  - 找出适合的贪心策略
  - 求解每一个子问题的最优解
  - 将局部最优解堆叠成全局最优解
- 不是所有问题都能用贪心，比如：
  - 零钱兑换如果面额是 [1,3,4]，要凑 6 元，贪心选 4+1+1（总 3 张），但最优是 3+3（总 2 张），此时贪心失效，需用动态规划
  - 核心判断：问题是否满足 “贪心选择性质”—— 即局部最优能推导出全局最优

### 贪心选择类问题（资源分配 / 找最优解）

- 这类问题核心是 “选什么” 能让结果最优，每一步选当前最优的选项
- 常见子场景：
  - 零钱兑换（当硬币面额满足 “贪心性质” 时，如人民币面额：1/5/10/20/50/100）
  - 分饼干（用最少饼干满足最多孩子，每个孩子只能要 1 块）
  - 买卖股票的最佳时机（只能买卖一次 / 多次，多次时贪心更简单）
- 贪心策略：
  - 零钱兑换：每次选最大面额的硬币，直到金额为 0（仅适用于规范面额）
  - 分饼干：先排序饼干和孩子需求，用最小的能满足孩子的饼干匹配孩子
  - 股票买卖（多次）：只要后一天价格比前一天高，就买卖（累加所有上涨差值）

- 常识类（局部最优 = 直观判断）：靠生活常识就能推导局部最优，无复杂逻辑，入门级贪心

  | 题目                     | 核心贪心思路                                                                      |
  | :----------------------- | :-------------------------------------------------------------------------------- |
  | 分发饼干                 | 局部最优：小饼干优先给小胃口的孩子 → 全局最优：满足最多孩子                       |
  | K 次取反后最大化的数组和 | 局部最优：优先反转绝对值最大的负数（无负数则反转最小正数） → 全局最优：数组和最大 |
  | 柠檬水找零               | 局部最优：优先用 10 美元找零（保留更多 5 美元） → 全局最优：能找零所有顾客        |

- 需拆解逻辑，初现贪心巧思：不能直接靠常识，需拆解问题找到「局部最优路径」

  | 题目           | 核心贪心思路                                                                 |
  | :------------- | :--------------------------------------------------------------------------- |
  | 摆动序列       | 局部最优：删除连续相同趋势的元素，只保留「峰 / 谷」 → 全局最优：最长摆动序列 |
  | 单调递增的数字 | 局部最优：从后往前找下降位，减 1 后后续全置 9 → 全局最优：最大的单调递增数   |

- 股票问题（动规可解，但贪心更高效）：聚焦「价格差」，通过贪心捕捉所有盈利机会，避开动规的状态推导

  | 题目                       | 核心贪心思路                                                                                                  |
  | :------------------------- | :------------------------------------------------------------------------------------------------------------ |
  | 买卖股票的最佳时机 II      | 局部最优：只要当天价格 > 前一天价格，就买卖（赚差价） → 全局最优：总利润最大                                  |
  | 买卖股票的最佳时机含手续费 | 局部最优：低买高卖（卖出时扣除手续费，避免频繁交易） → 全局最优：净利润最大（注：贪心思路较绕，动规更易理解） |

- 两个维度权衡问题（先定一维，再定另一维）：两个维度相互影响，无法同时优化，需先固定一个维度，再贪心优化另一个

  | 题目             | 核心贪心思路                                                                                                                |
  | :--------------- | :-------------------------------------------------------------------------------------------------------------------------- |
  | 分发糖果         | 局部最优：先从左到右按评分发糖，再从右到左修正 → 全局最优：满足「相邻高分多拿糖」且总糖数最少                               |
  | 根据身高重建队列 | 局部最优：先按身高降序排序（高个子先排），再按 k 值插入位置 → 全局最优：满足「h≥当前的有 k 人」（C++ 用 list 插入效率更高） |

### 区间问题（贪心核心：按右边界排序）

- 核心特征：所有题均需「按右边界（结束时间）升序排序」，最大化后续空间利用率

- 常见场景
  - 区间调度（选最多不重叠区间）

  - 区间合并（合并重叠 / 相邻区间）

  - 区间覆盖（用最少区间覆盖整个目标区间）

- 不同问题的策略不同，但核心是 “排序后选基准”：
  - 选最多不重叠区间：按区间结束位置升序排序，每次选结束最早的区间
  - 区间合并：按区间起始位置升序排序，依次合并重叠区间
  - 划分字母区间：记录字符最后出现位置，遍历中动态更新区间结束位置

- 题目列表

  | 题目                   | 核心贪心思路                                                                        |
  | :--------------------- | :---------------------------------------------------------------------------------- |
  | 跳跃游戏               | 局部最优：遍历中更新能跳的最远距离 → 全局最优：能到达终点                           |
  | 跳跃游戏 II            | 局部最优：在当前可跳范围内，选能跳最远的位置 → 全局最优：最少跳跃次数               |
  | 用最少数量的箭引爆气球 | 局部最优：按右边界排序，一箭射爆最多重叠气球 → 全局最优：最少箭数（端点接触算重叠） |
  | 无重叠区间             | 局部最优：选结束最早的区间 → 全局最优：最多不重叠区间（移除最少区间）               |
  | 划分字母区间           | 局部最优：记录每个字母最后出现位置，扩展区间边界 → 全局最优：划分最少的不重叠区间   |
  | 合并区间               | 局部最优：按左边界排序，合并重叠 / 相邻区间 → 全局最优：最少合并后的区间数          |

### 哈夫曼编码（数据压缩）

- 这是贪心在工程中的经典应用，广泛用于文件压缩（如 ZIP、JPG）

- 核心问题：给字符分配二进制编码，使总编码长度最短（无歧义）

- 核心贪心策略：
  1.  统计每个字符出现的频率
  2.  每次选频率最低的两个节点合并成一个新节点（权重为两者之和）
  3.  重复直到只剩一个根节点，从根到叶子的路径就是字符的编码（左 0 右 1）

- 应用价值：频率高的字符编码短，频率低的编码长，整体压缩效率最优

- 代码实现

  ```cpp
  #include <iostream>
  #include <vector>
  #include <queue>
  #include <unordered_map>
  #include <string>
  #include <memory>

  using namespace std;

  // 哈夫曼树节点结构
  struct HuffmanNode {
      char ch;                // 存储的字符（非叶子节点可为空字符'\0'）
      int freq;               // 字符出现频率
      shared_ptr<HuffmanNode> left;  // 左子节点（0）
      shared_ptr<HuffmanNode> right; // 右子节点（1）

      // 构造函数
      HuffmanNode(char c, int f) : ch(c), freq(f), left(nullptr), right(nullptr) {}
  };

  // 优先队列（最小堆）的比较规则：频率小的节点优先
  struct CompareNode {
      bool operator()(const shared_ptr<HuffmanNode>& a, const shared_ptr<HuffmanNode>& b) {
          return a->freq > b->freq; // 大顶堆转小顶堆
      }
  };

  class HuffmanCoding {
  private:
      unordered_map<char, string> huffmanCode; // 存储每个字符的哈夫曼编码
      shared_ptr<HuffmanNode> root;            // 哈夫曼树根节点

      // 递归遍历哈夫曼树，生成每个字符的编码
      void generateCode(const shared_ptr<HuffmanNode>& node, const string& code) {
          if (!node) return;
          // 叶子节点（存储字符）
          if (!node->left && !node->right) {
              huffmanCode[node->ch] = code.empty() ? "0" : code; // 处理只有一个字符的情况
              return;
          }
          // 左子树加0，右子树加1
          generateCode(node->left, code + "0");
          generateCode(node->right, code + "1");
      }

  public:
      // 构建哈夫曼树并生成编码
      void build(const string& text) {
          // 1. 统计字符频率
          unordered_map<char, int> freqMap;
          for (char c : text) {
              freqMap[c]++;
          }

          // 2. 初始化优先队列（最小堆）
          priority_queue<shared_ptr<HuffmanNode>, vector<shared_ptr<HuffmanNode>>, CompareNode> minHeap;
          for (const auto& pair : freqMap) {
              minHeap.push(make_shared<HuffmanNode>(pair.first, pair.second));
          }

          // 3. 构建哈夫曼树：每次合并两个频率最小的节点
          while (minHeap.size() > 1) {
              // 取出频率最小的两个节点
              auto left = minHeap.top();
              minHeap.pop();
              auto right = minHeap.top();
              minHeap.pop();

              // 合并成新节点（频率为两者之和，字符为空）
              auto merged = make_shared<HuffmanNode>('\0', left->freq + right->freq);
              merged->left = left;
              merged->right = right;

              // 新节点入堆
              minHeap.push(merged);
          }

          // 根节点
          root = minHeap.top();

          // 4. 生成每个字符的哈夫曼编码
          generateCode(root, "");
      }

      // 获取哈夫曼编码表
      unordered_map<char, string> getHuffmanCode() const {
          return huffmanCode;
      }

      // 编码文本
      string encode(const string& text) {
          string encodedStr;
          for (char c : text) {
              encodedStr += huffmanCode.at(c);
          }
          return encodedStr;
      }

      // 解码哈夫曼编码
      string decode(const string& encodedStr) {
          string decodedStr;
          auto current = root;
          for (char bit : encodedStr) {
              // 根据0/1遍历左/右子树
              if (bit == '0') {
                  current = current->left;
              } else {
                  current = current->right;
              }

              // 到达叶子节点，找到对应字符
              if (!current->left && !current->right) {
                  decodedStr += current->ch;
                  current = root; // 重置到根节点，继续解码下一个字符
              }
          }
          return decodedStr;
      }
  };

  // 测试示例
  int main() {
      string text = "abracadabra";
      HuffmanCoding hc;

      // 构建哈夫曼树并生成编码
      hc.build(text);

      // 输出字符频率和哈夫曼编码
      cout << "字符频率与哈夫曼编码：" << endl;
      auto codeMap = hc.getHuffmanCode();
      for (const auto& pair : codeMap) {
          cout << "'" << pair.first << "' : " << pair.second << endl;
      }

      // 编码
      string encoded = hc.encode(text);
      cout << "\n原始文本：" << text << endl;
      cout << "哈夫曼编码：" << encoded << endl;

      // 解码
      string decoded = hc.decode(encoded);
      cout << "解码结果：" << decoded << endl;

      return 0;
  }
  ```

### 活动选择问题（调度类）

- 和区间调度本质相同，但更偏向 “事件安排” 场景
- 核心问题：在同一时间段内，选最多的互不冲突的活动
- 核心贪心策略：按活动结束时间升序排序，每次选结束最早的活动，为后续留出更多时间
- 实际应用：会议室预约、任务调度等

### 图论应用

- 最小生成树：
  - Prim 算法：每次选 “连接已选节点和未选节点的最小权值边”（局部最优）；
  - Kruskal 算法：按边权升序排序，每次选不形成环的最小边（局部最优）
- 最短路径（Dijkstra 算法）：
  - 每次选 “当前距离起点最近的未访问节点”，更新其邻接节点的距离（仅适用于非负权边）

### 其他题目

- 其他难题：易误以为是模拟 / 动规题，贪心能大幅降低时间复杂度

  | 题目       | 核心贪心思路                                                                                            |
  | :--------- | :------------------------------------------------------------------------------------------------------ |
  | 最大子序和 | 局部最优：当前子数组和为负则重置，从当前元素重新开始 → 全局最优：最大连续子数组和（贪心比动规更优）     |
  | 加油站     | 局部最优：累计油量 <0 则重置起点，总油量≥总消耗则必有解 → 全局最优：找到可行起点（时间复杂度 O (n)）    |
  | 监控二叉树 | 局部最优：从叶子节点往上，优先给父节点装监控（覆盖更多节点） → 全局最优：最少监控数（需熟练操作二叉树） |
  | 拼接最大数 | 给定一组非负整数，拼接成最大的数（如 [3,30,34,5,9]→9534330），贪心策略是按 “两两拼接后更大” 的规则排序  |

## 美团 2027 届实习第三次笔试

- 给定正整数数组，操作 a：元素向下整除 2；b：元素减 k
- 全局至多 m 次 a、n 次 b；每个元素最多 1 次 a、1 次 b，求操作后数组最小和
- 对数组进行排序，选取最大的 m 个数进行 a 操作即可
- 进阶 1：取消「每个元素限 1 次 a/b」，可对同一元素无限反复用 a、b，求最小数组和
- 用大顶堆维护数组的最大值，不断对堆顶进行 a 操作
- 进阶 2：在进阶 1 基础上，数组允许包含负数、0，求最小数组和
- 不能对非正数进行 a 操作
- 进阶 3：任意上述版本规则，目标改为：让操作后数组最大值尽可能小
- 也需要用大顶堆来进行 b 操作

## 分发饼干

- 假设你是一位很棒的家长，想要给你的孩子们一些小饼干。但是，每个孩子最多只能给一块饼干

- 对每个孩子 `i`，都有一个胃口值 `g[i]`，这是能让孩子们满足胃口的饼干的最小尺寸；并且每块饼干 `j`，都有一个尺寸 `s[j]` 。如果 `s[j] >= g[i]`，我们可以将这个饼干 `j` 分配给孩子 `i` ，这个孩子会得到满足

- 最终目标是满足尽可能多的孩子，并输出这个最大数值

- 示例一
  - 输入: g = [1,2,3], s = [1,1]
  - 输出: 1 解释:你有三个孩子和两块小饼干，3 个孩子的胃口值分别是：1,2,3。虽然你有两块小饼干，由于他们的尺寸都是 1，你只能让胃口值是 1 的孩子满足。所以你应该输出 1

- 示例二
  - 输入: g = [1,2], s = [1,2,3]
  - 输出: 2
  - 解释:你有两个孩子和三块小饼干，2 个孩子的胃口值分别是 1,2。你拥有的饼干数量和尺寸都足以让所有孩子满足。所以你应该输出 2

- 这里的局部最优就是大饼干喂给胃口大的，充分利用饼干尺寸喂饱一个，全局最优就是喂饱尽可能多的小孩

- 因此可以利用贪心策略，将饼干数组和小孩胃口数组排序，从后向前遍历数组，优先满足胃口大的

- 示例代码

  ```cpp
  class Solution {
  public:
      int findContentChildren(vector<int>& g, vector<int>& s) {
          sort(g.begin(), g.end());
          sort(s.begin(), s.end());
          int index = s.size() - 1; // 饼干数组的下标
          int result = 0;
          for (int i = g.size() - 1; i >= 0; i--) { // 遍历胃口
              if (index >= 0 && s[index] >= g[i]) { // 遍历饼干
                  result++;
                  index--;
              }
          }
          return result;
      }
  };
  ```

- 相关题目
  - [455. 分发饼干](https://leetcode.cn/problems/assign-cookies/description/)

## 摆动序列

- 如果连续数字之间的差严格地在正数和负数之间交替，则数字序列称为摆动序列。第一个差（如果存在的话）可能是正数或负数。仅有一个元素或者含两个不等元素的序列也视作摆动序列。
  - 例如， `[1, 7, 4, 9, 2, 5]` 是一个摆动序列，因为差值 `(6, -3, 5, -7, 3)` 是正负交替出现的。
  - 相反，`[1, 4, 7, 2, 5]` 和 `[1, 7, 4, 5, 5]` 不是摆动序列，第一个序列是因为它的前两个差值都是正数，第二个序列是因为它的最后一个差值为零

- 子序列可以通过从原始序列中删除一些（也可以不删除）元素来获得，剩下的元素保持其原始顺序

- 给一个整数数组 `nums` ，返回 `nums` 中作为摆动序列的最长子序列的长度

- 局部最优：删除单调坡度上的节点（不包括单调坡度两端的节点），那么这个坡度就可以有两个局部峰值

- 整体最优：整个序列有最多的局部峰值，从而达到最长摆动序列

- 三种情况
  - 平坡
  - 数组首尾
  - 单调坡度有平坡

- 示例代码

  ```cpp
  class Solution {
  public:
      int wiggleMaxLength(vector<int>& nums) {
          if (nums.size() <= 1) return nums.size();
          int curDiff = 0; // 当前一对差值
          int preDiff = 0; // 前一对差值
          int result = 1;  // 记录峰值个数，序列默认序列最右边有一个峰值
          for (int i = 0; i < nums.size() - 1; i++) {
              curDiff = nums[i + 1] - nums[i];
              // 出现峰值
              if ((preDiff <= 0 && curDiff > 0) || (preDiff >= 0 && curDiff < 0)) {
                  result++;
                  preDiff = curDiff; // 注意这里，只在摆动变化的时候更新prediff
              }
          }
          return result;
      }
  };
  ```

- 动态规划方法
  - 当前考虑到数字，要么是作为山峰，要么是作为山谷
  - 设 dp 状态 `dp[i][0]`，表示考虑前 i 个数，第 i 个数作为山峰的摆动子序列的最长长度
  - 设 dp 状态 `dp[i][1]`，表示考虑前 i 个数，第 i 个数作为山谷的摆动子序列的最长长度
  - 则转移方程为：
    - `dp[i][0] = max(dp[i][0], dp[j][1] + 1)`，其中 `0 < j < i` 且 `nums[j] < nums[i]`，表示将 nums[i] 接到前面某个山谷后面，作为山峰
    - `dp[i][1] = max(dp[i][1], dp[j][0] + 1)`，其中 `0 < j < i`且`nums[j] > nums[i]`，表示将 nums[i] 接到前面某个山峰后面，作为山谷
  - 由于一个数可以接到前面的某个数后面，也可以以自身为子序列的起点，所以初始状态为：`dp[0][0] = dp[0][1] = 1`

- 代码实现

  ```cpp
  class Solution {
  public:
      int dp[1005][2];
      int wiggleMaxLength(vector<int>& nums) {
          memset(dp, 0, sizeof dp);
          dp[0][0] = dp[0][1] = 1;
          for (int i = 1; i < nums.size(); ++i) {
              dp[i][0] = dp[i][1] = 1;
              for (int j = 0; j < i; ++j) {
                  if (nums[j] > nums[i]) dp[i][1] = max(dp[i][1], dp[j][0] + 1);
              }
              for (int j = 0; j < i; ++j) {
                  if (nums[j] < nums[i]) dp[i][0] = max(dp[i][0], dp[j][1] + 1);
              }
          }
          return max(dp[nums.size() - 1][0], dp[nums.size() - 1][1]);
      }
  };
  ```

- 时间复杂度为 $O(n^2)$

- 线段树：可以用两棵线段树来维护区间的最大值
  - 每次更新 `dp[i][0]`，则在 `tree1` 的 `nums[i]` 位置值更新为 `dp[i][0]`
  - 每次更新 `dp[i][1]`，则在 `tree2` 的 `nums[i] `位置值更新为 `dp[i][1]`
  - 则 dp 转移方程中就没有必要 j 从 0 遍历到 i-1，可以直接在线段树中查询指定区间的值即可

- 时间复杂度为 $O(n\log n)$

- 相关题目
  - [376. 摆动序列](https://leetcode.cn/problems/wiggle-subsequence/)
  - [2149. 按符号重排数组](https://leetcode.cn/problems/rearrange-array-elements-by-sign/)

## 最大子序和

- 给定一个整数数组 nums ，找到一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和

- 负数一定会拉低总和，因此当连续和
  - 局部最优：当前“连续和”为负数的时候立刻放弃，从下一个元素重新计算“连续和”，因为负数加上下一个元素 “连续和”只会越来越小
  - 全局最优：选取最大“连续和”、
  - 局部最优的情况下，并记录最大的“连续和”，可以推出全局最优

- 贪心实现

  ```cpp
  class Solution {
  public:
      int maxSubArray(vector<int>& nums) {
          int result = INT32_MIN;
          int count = 0;
          for (int i = 0; i < nums.size(); i++) {
              count += nums[i];
              if (count > result) { // 取区间累计的最大值（相当于不断确定最大子序终止位置）
                  result = count;
              }
              if (count <= 0) count = 0; // 相当于重置最大子序起始位置，因为遇到负数一定是拉低总和
          }
          return result;
      }
  };
  ```

- 动态规划方法

  ```cpp
  class Solution {
  public:
      int maxSubArray(vector<int>& nums) {
          if (nums.size() == 0) return 0;
          vector<int> dp(nums.size(), 0); // dp[i]表示包括i之前的最大连续子序列和
          dp[0] = nums[0];
          int result = dp[0];
          for (int i = 1; i < nums.size(); i++) {
              dp[i] = max(dp[i - 1] + nums[i], nums[i]); // 状态转移公式
              if (dp[i] > result) result = dp[i]; // result 保存dp[i]的最大值
          }
          return result;
      }
  };
  ```

- 上述方法的时间复杂度都是 $O(n)$

- 分治法的时间复杂度为 $O(n\log n)$
  - 把数组分成左、右两部分
  - 分别求左半部分的最大子数组和、右半部分的最大子数组和
  - 求「跨越中间点」的最大子数组和（必须包含中间元素，向左 / 右扩展找最大和）
  - 最终结果是三者的最大值

- 代码实现

  ```cpp
  // 分治核心函数：计算[left, right]区间内的最大子数组和
  int divideConquer(vector<int>& nums, int left, int right) {
      // 递归终止条件：区间只有一个元素，最大和就是它本身
      if (left == right) {
          return nums[left];
      }

      // 1. 分：将数组拆分为左右两部分
      int mid = left + (right - left) / 2; // 避免(left+right)溢出

      // 2. 治：递归计算左半区、右半区的最大子数组和
      int leftMax = divideConquer(nums, left, mid);       // 左半区[left, mid]
      int rightMax = divideConquer(nums, mid + 1, right); // 右半区[mid+1, right]

      // 3. 合并：计算「跨越中间点」的最大子数组和（核心步骤）
      // 3.1 向左扩展：从mid向左找以mid为终点的最大和
      int crossLeftMax = INT_MIN;
      int tempSum = 0;
      for (int i = mid; i >= left; --i) {
          tempSum += nums[i];
          crossLeftMax = max(crossLeftMax, tempSum);
      }

      // 3.2 向右扩展：从mid+1向右找以mid+1为起点的最大和
      int crossRightMax = INT_MIN;
      tempSum = 0;
      for (int i = mid + 1; i <= right; ++i) {
          tempSum += nums[i];
          crossRightMax = max(crossRightMax, tempSum);
      }

      // 3.3 跨中间区的最大和 = 向左最大和 + 向右最大和
      int crossMax = crossLeftMax + crossRightMax;

      // 4. 返回左、右、跨中间区三者的最大值
      return max(max(leftMax, rightMax), crossMax);
  }

  // 主函数：对外暴露的接口
  int maxSubArray(vector<int>& nums) {
      if (nums.empty()) {
          return 0; // 题目要求子数组至少一个元素，此情况仅防御性处理
      }
      return divideConquer(nums, 0, nums.size() - 1);
  }
  ```

- 参考题目
  - [53. 最大子数组和](https://leetcode.cn/problems/maximum-subarray/description/)

## 买卖股票的最佳时机

- 给定一个数组，它的第 i 个元素是一支给定股票第 i 天的价格

- 设计一个算法来计算所能获取的最大利润，可以尽可能地完成更多的交易（多次买卖一支股票）

- 不能同时参与多笔交易（必须在再次购买前出售掉之前的股票）

- 朴素地想，可以选一个低的买入，再选一个高的卖出，循环反复，但是其实最终利润是可以分解的

- 假如第 0 天买入，第 3 天卖出，那么利润为：prices[3] - prices[0]，相当于(prices[3] - prices[2]) + (prices[2] - prices[1]) + (prices[1] - prices[0])

- 此时就是把利润分解为每天为单位的维度，而不是从 0 天到第 3 天整体去考虑

- 那么根据 prices 可以得到每天的利润序列：(prices[i] - prices[i - 1]).....(prices[1] - prices[0])

- 那么可以得到每天的利润数组，且利润数组要比股票数组少一天，得到利润数组后
  - 局部最优：收集每天的正利润
  - 全局最优：求得最大利润

- 贪心实现

  ```cpp
  class Solution {
  public:
      int maxProfit(vector<int>& prices) {
          int result = 0;
          for (int i = 1; i < prices.size(); i++) {
              result += max(prices[i] - prices[i - 1], 0);
          }
          return result;
      }
  };
  ```

- 动态规划

  ```cpp
  class Solution {
  public:
      int maxProfit(vector<int>& prices) {
          // dp[i][1]第i天持有的最多现金
          // dp[i][0]第i天持有股票后的最多现金
          int n = prices.size();
          vector<vector<int>> dp(n, vector<int>(2, 0));
          dp[0][0] -= prices[0]; // 持股票
          for (int i = 1; i < n; i++) {
              // 第i天持股票所剩最多现金 = max(第i-1天持股票所剩现金, 第i-1天持现金-买第i天的股票)
              dp[i][0] = max(dp[i - 1][0], dp[i - 1][1] - prices[i]);
              // 第i天持有最多现金 = max(第i-1天持有的最多现金，第i-1天持有股票的最多现金+第i天卖出股票)
              dp[i][1] = max(dp[i - 1][1], dp[i - 1][0] + prices[i]);
          }
          return max(dp[n - 1][0], dp[n - 1][1]);
      }
  };
  ```

- 参考题目
  - [121. 买卖股票的最佳时机](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/)
  - [122. 买卖股票的最佳时机 II](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-ii/description/)
  - [123. 买卖股票的最佳时机 III](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-iii/)
  - [188. 买卖股票的最佳时机 IV](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-iv/)
  - [309. 买卖股票的最佳时机含冷冻期](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-with-cooldown/)
  - [714. 买卖股票的最佳时机含手续费](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/)

## 买卖股票的最佳时机含手续费

- 给定一个整数数组 `prices`，其中 `prices[i]`表示第 `i` 天的股票价格 ；整数 `fee` 代表了交易股票的手续费用

- 可以无限次地完成交易，但是你每笔交易都需要付手续费。如果你已经购买了一个股票，在卖出它之前你就不能再继续购买股票了；返回获得利润的最大值

- 注意：这里的一笔交易指买入持有并卖出股票的整个过程，每笔交易你只需要为支付一次手续费

- 相比于基本问题，这里添加了手续费的额外要求

- 采用「最低值买入、满足盈利条件则卖出」的策略，核心是找到买入日期和卖出日期（无需精确到具体某天，只需判断区间）：
  - 买入日期：遍历过程中遇到价格更低的点，更新记录的最低价格；
  - 卖出日期：无需计算精确日期，只要当前价格 >（最低价格 + 手续费），即可收获利润，真正的卖出点为「连续盈利区间的最后一天」

- 在遍历价格数组、计算利润时，主要分为以下三种操作场景：
  - 情况一：当前收获利润的当天，并非盈利区间的最后一天（仅为「虚拟卖出」，实际仍持有股票）；此时仅计算当前可收获的利润，不更新最低价格，后续继续跟踪价格以获取更多利润
  - 情况二：前一天是盈利区间的最后一天（已「真正卖出」）；今天需重新记录新的最低价格，为下一次买入做准备
  - 情况三：无操作，保持原有状态；既不满足买入条件（未遇到更低价格），也不满足卖出条件（当前价格 ≤ 最低价格 + 手续费），维持「持有 / 空仓」状态不变

- 代码实现

  ```cpp
  class Solution {
  public:
      int maxProfit(vector<int>& prices, int fee) {
          int result = 0;
          int minPrice = prices[0]; // 记录最低价格
          for (int i = 1; i < prices.size(); i++) {
              // 情况二：相当于买入
              if (prices[i] < minPrice) minPrice = prices[i];

              // 情况三：保持原有状态（因为此时买则不便宜，卖则亏本）
              if (prices[i] >= minPrice && prices[i] <= minPrice + fee) {
                  continue;
              }

              // 计算利润，可能有多次计算利润，最后一次计算利润才是真正意义的卖出
              if (prices[i] > minPrice + fee) {
                  result += prices[i] - minPrice - fee;
                  minPrice = prices[i] - fee; // 情况一，这一步很关键，避免重复扣手续费
              }
          }
          return result;
      }
  };
  ```

## 跳跃游戏

- 给你一个非负整数数组 `nums` ，你最初位于数组的第一个下标。数组中的每个元素代表你在该位置可以跳跃的最大长度。

- 判断是否能够到达最后一个下标，如果可以，返回 `true` ；否则，返回 `false`

- 示例 1：

  ```
  输入：nums = [2,3,1,1,4]
  输出：true
  解释：可以先跳 1 步，从下标 0 到达下标 1, 然后再从下标 1 跳 3 步到达最后一个下标。
  ```

- 示例 2：

  ```
  输入：nums = [3,2,1,0,4]
  输出：false
  解释：无论怎样，总会到达下标为 3 的位置。但该下标的最大跳跃长度是 0 ， 所以永远不可能到达最后一个下标。
  ```

- 不一定非要明确一次究竟跳几步，每次取最大的跳跃步数，这个就是可以跳跃的覆盖范围

- 那么这个问题就转化为跳跃覆盖范围究竟可不可以覆盖到终点，每次移动取最大跳跃步数（得到最大的覆盖范围），每移动一个单位，就更新最大覆盖范围

- 局部最优解：每次取最大跳跃步数（取最大覆盖范围）

- 整体最优解：最后得到整体最大覆盖范围，看是否能到终点

- 代码示例

  ```cpp
  class Solution {
  public:
      bool canJump(vector<int>& nums) {
          int cover = 0;
          if (nums.size() == 1) return true; // 只有一个元素，就是能达到
          for (int i = 0; i <= cover; i++) { // 注意这里是小于等于cover
              cover = max(i + nums[i], cover);
              if (cover >= nums.size() - 1) return true; // 说明可以覆盖到终点了
          }
          return false;
      }
  };
  ```

- 在刚刚的基础上，要求使用最少的跳跃次数到达数组的最后一个位置，并返回最小跳跃次数

- 局部最优：当前可移动距离尽可能多走，如果还没到终点，步数再加一

- 整体最优：一步尽可能多走，从而达到最少步数

- 代码实现

  ```cpp
  class Solution {
  public:
      int jump(vector<int>& nums) {
          if (nums.size() == 1) return 0;
          int curDistance = 0;    // 当前覆盖最远距离下标
          int ans = 0;            // 记录走的最大步数
          int nextDistance = 0;   // 下一步覆盖最远距离下标
          for (int i = 0; i < nums.size(); i++) {
              nextDistance = max(nums[i] + i, nextDistance);  // 更新下一步覆盖最远距离下标
              if (i == curDistance) {                         // 遇到当前覆盖最远距离下标
                  ans++;                                  // 需要走下一步
                  curDistance = nextDistance;             // 更新当前覆盖最远距离下标（相当于加油了）
                  if (nextDistance >= nums.size() - 1) break;  // 当前覆盖最远距到达集合终点，不用做ans++操作了，直接结束
              }
          }
          return ans;
      }
  };
  ```

- 移动下标只要遇到当前覆盖最远距离的下标，直接步数加一，不考虑是不是终点的情况

  ```cpp
  class Solution {
  public:
      int jump(vector<int>& nums) {
          int curDistance = 0;    // 当前覆盖的最远距离下标
          int ans = 0;            // 记录走的最大步数
          int nextDistance = 0;   // 下一步覆盖的最远距离下标
          for (int i = 0; i < nums.size() - 1; i++) { // 注意这里是小于nums.size() - 1，这是关键所在
              nextDistance = max(nums[i] + i, nextDistance); // 更新下一步覆盖的最远距离下标
              if (i == curDistance) {                 // 遇到当前覆盖的最远距离下标
                  curDistance = nextDistance;         // 更新当前覆盖的最远距离下标
                  ans++;
              }
          }
          return ans;
      }
  };
  ```

- 其关键在于：以最小的步数增加最大的覆盖范围，直到覆盖范围覆盖了终点，这个范围内最少步数一定可以跳到，不用管具体是怎么跳的，不纠结于一步究竟跳一个单位还是两个单位

- 参考题目
  - [55. 跳跃游戏](https://leetcode.cn/problems/jump-game/)
  - [45. 跳跃游戏 II](https://leetcode.cn/problems/jump-game-ii/)
  - [1306. 跳跃游戏 III](https://leetcode.cn/problems/jump-game-iii/)
  - [1345. 跳跃游戏 IV](https://leetcode.cn/problems/jump-game-iv/description/)
  - [1340. 跳跃游戏 V](https://leetcode.cn/problems/jump-game-v/description/)
  - [1696. 跳跃游戏 VI](https://leetcode.cn/problems/jump-game-vi/description/)
  - [1871. 跳跃游戏 VII](https://leetcode.cn/problems/jump-game-vii/)
  - [2297. 跳跃游戏 VIII](https://leetcode.cn/problems/jump-game-viii/description/)
  - [2617. 网格图中最少访问的格子数](https://leetcode.cn/problems/minimum-number-of-visited-cells-in-a-grid/description/)
  - [2789. 合并后数组中的最大元素](https://leetcode.cn/problems/largest-element-in-an-array-after-merge-operations/description/)
  - [198. 打家劫舍](https://leetcode.cn/problems/house-robber/)

## K 次取反后最大化的数组和

- 给定一个整数数组 A，我们只能用以下方法修改该数组：我们选择某个索引 i 并将 A[i] 替换为 -A[i]，然后总共重复这个过程 K 次。（可以多次选择同一个索引 i）

- 以这种方式修改数组后，返回数组可能的最大和

- 显然，应该优先选择取反最大的负数，如果负数都变为正数后，还有剩余次数，优先选择绝对值最小的数

- 解题步骤为：
  - 第一步：将数组按照绝对值大小从大到小排序，注意要按照绝对值的大小
  - 第二步：从前向后遍历，遇到负数将其变为正数，同时K--
  - 第三步：如果K还大于0，那么反复转变数值最小的元素，将K用完
  - 第四步：求和

- 示例代码

  ```cpp
  class Solution {
  static bool cmp(int a, int b) {
      return abs(a) > abs(b);
  }
  public:
      int largestSumAfterKNegations(vector<int>& A, int K) {
          sort(A.begin(), A.end(), cmp);       // 第一步
          for (int i = 0; i < A.size(); i++) { // 第二步
              if (A[i] < 0 && K > 0) {
                  A[i] *= -1;
                  K--;
              }
          }
          if (K % 2 == 1) A[A.size() - 1] *= -1; // 第三步
          int result = 0;
          for (int a : A) result += a;        // 第四步
          return result;
      }
  };
  ```

- 参考题目
  - [1005. K 次取反后最大化的数组和](https://leetcode.cn/problems/maximize-sum-of-array-after-k-negations/description/)
  - [2099. 找到和最大的长度为 K 的子序列](https://leetcode.cn/problems/find-subsequence-of-length-k-with-the-largest-sum/)

## 加油站

- 在一条环路上有 `n` 个加油站，其中第 `i` 个加油站有汽油 `gas[i]` 升

- 你有一辆油箱容量无限的的汽车，从第 `i` 个加油站开往第 `i+1` 个加油站需要消耗汽油 `cost[i]` 升

- 你从其中的一个加油站出发，开始时油箱为空

- 给定两个整数数组 `gas` 和 `cost` ，如果你可以按顺序绕环路行驶一周，则返回出发时加油站的编号，否则返回 `-1` 。如果存在解，则保证它是唯一的

- 示例 1：

  ```
  输入: gas = [1,2,3,4,5], cost = [3,4,5,1,2]
  输出: 3
  解释:
  从 3 号加油站(索引为 3 处)出发，可获得 4 升汽油。此时油箱有 = 0 + 4 = 4 升汽油
  开往 4 号加油站，此时油箱有 4 - 1 + 5 = 8 升汽油
  开往 0 号加油站，此时油箱有 8 - 2 + 1 = 7 升汽油
  开往 1 号加油站，此时油箱有 7 - 3 + 2 = 6 升汽油
  开往 2 号加油站，此时油箱有 6 - 4 + 3 = 5 升汽油
  开往 3 号加油站，你需要消耗 5 升汽油，正好足够你返回到 3 号加油站。
  因此，3 可为起始索引。
  ```

- 示例 2：

  ```
  输入: gas = [2,3,4], cost = [3,4,3]
  输出: -1
  解释:
  你不能从 0 号或 1 号加油站出发，因为没有足够的汽油可以让你行驶到下一个加油站。
  我们从 2 号加油站出发，可以获得 4 升汽油。 此时油箱有 = 0 + 4 = 4 升汽油
  开往 0 号加油站，此时油箱有 4 - 3 + 2 = 3 升汽油
  开往 1 号加油站，此时油箱有 3 - 3 + 3 = 3 升汽油
  你无法返回 2 号加油站，因为返程需要消耗 4 升汽油，但是你的油箱只有 3 升汽油。
  因此，无论怎样，你都不可能绕环路行驶一周
  ```

- 那么怎么选取应该从哪个加油站出发？

- 暴力解法

  ```cpp
  class Solution {
  public:
      int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
          for (int i = 0; i < cost.size(); i++) {
              int rest = gas[i] - cost[i]; // 记录剩余油量
              int index = (i + 1) % cost.size();
              while (rest > 0 && index != i) { // 模拟以i为起点行驶一圈（如果有rest==0，那么答案就不唯一了）
                  rest += gas[index] - cost[index];
                  index = (index + 1) % cost.size();
              }
              // 如果以i为起点跑一圈，剩余油量>=0，返回该起始位置
              if (rest >= 0 && index == i) return i;
          }
          return -1;
      }
  };
  ```

- 贪心算法：直接从全局进行贪心选择
  - 情况一：如果 gas 的总和小于 cost 总和，那么无论从哪里出发，一定是跑不了一圈的
  - 情况二：rest[i] = gas[i]-cost[i] 为一天剩下的油，i从 0 开始计算累加到最后一站，如果累加没有出现负数，说明从 0 出发，油就没有断过，那么 0 就是起点。
  - 情况三：如果累加的最小值是负数，汽车就要从非 0 节点出发，从后向前，看哪个节点能把这个负数填平，能把这个负数填平的节点就是出发节点

- 示例代码

  ```cpp
  class Solution {
  public:
      int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
          int curSum = 0;
          int min = INT_MAX; // 从起点出发，油箱里的油量最小值
          for (int i = 0; i < gas.size(); i++) {
              int rest = gas[i] - cost[i];
              curSum += rest;
              if (curSum < min) {
                  min = curSum;
              }
          }
          if (curSum < 0) return -1;  // 情况1
          if (min >= 0) return 0;     // 情况2
                                      // 情况3
          for (int i = gas.size() - 1; i >= 0; i--) {
              int rest = gas[i] - cost[i];
              min += rest;
              if (min >= 0) {
                  return i;
              }
          }
          return -1;
      }
  };
  ```

- 第二种贪心算法
  - 若总油量 ≥ 总消耗，则必定能跑完一圈 —— 这意味着所有站点的剩余油量 `rest[i]`（当前站点油量 - 消耗）之和必然 ≥ 0
  - 从下标 0 开始累加 `rest[i]` 得到 `curSum`，若 `curSum` 小于 0，说明`[0, i]`区间内任意位置都无法作为起点（选该区间内任一位置起步，到 i 处都会断油），因此需将起始位置更新为`i+1`，并重置`curSum` 重新累加

- 代码示例

  ```cpp
  class Solution {
  public:
      int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
          int curSum = 0;
          int totalSum = 0;
          int start = 0;
          for (int i = 0; i < gas.size(); i++) {
              curSum += gas[i] - cost[i];
              totalSum += gas[i] - cost[i];
              if (curSum < 0) {   // 当前累加rest[i]和 curSum一旦小于0
                  start = i + 1;  // 起始位置更新为i+1
                  curSum = 0;     // curSum从0开始
              }
          }
          if (totalSum < 0) return -1; // 说明怎么走都不可能跑一圈了
          return start;
      }
  };
  ```

- 相关题目
  - [134. 加油站](https://leetcode.cn/problems/gas-station/description/)
  - [2202. K 次操作后最大化顶端元素](https://leetcode.cn/problems/maximize-the-topmost-element-after-k-moves/)

## 分发糖果

- `n` 个孩子站成一排，给一个整数数组 `ratings` 表示每个孩子的评分

- 需要按照以下要求，给这些孩子分发糖果：
  - 每个孩子至少分配到 `1` 个糖果
  - 相邻两个孩子中，评分更高的那个会获得更多的糖果

- 请给每个孩子分发糖果，计算并返回需要准备的最少糖果数目

- 示例 1：

  ```
  输入：ratings = [1,0,2]
  输出：5
  解释：你可以分别给第一个、第二个、第三个孩子分发 2、1、2 颗糖果。
  ```

- 示例 2：

  ```
  输入：ratings = [1,2,2]
  输出：4
  解释：你可以分别给第一个、第二个、第三个孩子分发 1、2、1 颗糖果。
       第三个孩子只得到 1 颗糖果，这满足题面中的两个条件。
  ```

- 可以从两个方向遍历，从左往右遍历一遍，遇到大的就进行max 比较；然后再从右往左遍历，遇到大的就进行 max 比较

- 示例代码

  ```cpp
  class Solution {
  public:
      int candy(vector<int>& ratings) {
          vector<int> candyVec(ratings.size(), 1);
          // 从前向后
          for (int i = 1; i < ratings.size(); i++) {
              if (ratings[i] > ratings[i - 1]) candyVec[i] = candyVec[i - 1] + 1;
          }
          // 从后向前
          for (int i = ratings.size() - 2; i >= 0; i--) {
              if (ratings[i] > ratings[i + 1] ) {
                  candyVec[i] = max(candyVec[i], candyVec[i + 1] + 1);
              }
          }
          // 统计结果
          int result = 0;
          for (int i = 0; i < candyVec.size(); i++) result += candyVec[i];
          return result;
      }
  };
  ```

- 相关题目
  - [135. 分发糖果](https://leetcode.cn/problems/candy/)
  - [3142. 判断矩阵是否满足条件](https://leetcode.cn/problems/check-if-grid-satisfies-conditions/)
  - [3122. 使矩阵满足条件的最少操作次数](https://leetcode.cn/problems/minimum-number-of-operations-to-satisfy-conditions/description/)

## 柠檬水找零

- 在柠檬水摊上，每一杯柠檬水的售价为 `5` 美元。顾客排队购买你的产品，（按账单 `bills` 支付的顺序）一次购买一杯

- 每位顾客只买一杯柠檬水，然后向你付 `5` 美元、`10` 美元或 `20` 美元。你必须给每个顾客正确找零，也就是说净交易是每位顾客向你支付 `5` 美元

- 注意，一开始你手头没有任何零钱

- 给你一个整数数组 `bills` ，其中 `bills[i]` 是第 `i` 位顾客付的账。如果你能给每位顾客正确找零，返回 `true` ，否则返回 `false`

- 示例 1：

  ```
  输入：bills = [5,5,5,10,20]
  输出：true
  解释：
  前 3 位顾客那里，我们按顺序收取 3 张 5 美元的钞票。
  第 4 位顾客那里，我们收取一张 10 美元的钞票，并返还 5 美元。
  第 5 位顾客那里，我们找还一张 10 美元的钞票和一张 5 美元的钞票。
  由于所有客户都得到了正确的找零，所以我们输出 true。
  ```

- 示例 2:

  ```
  输入：bills = [5,5,10,10,20]
  输出：false
  解释：
  前 2 位顾客那里，我们按顺序收取 2 张 5 美元的钞票。
  对于接下来的 2 位顾客，我们收取一张 10 美元的钞票，然后返还 5 美元。
  对于最后一位顾客，我们无法退回 15 美元，因为我们现在只有两张 10 美元的钞票。
  由于不是每位顾客都得到了正确的找零，所以答案是 false。
  ```

- 显然，每次记录 5、10、20 的钞票数量，每次优先找 10 块钱面额的零钱即可

- 局部最优：遇到账单20，优先消耗美元10，完成本次找零

- 全局最优：完成全部账单的找零

- 示例代码

  ```cpp
  class Solution {
  public:
      bool lemonadeChange(vector<int>& bills) {
          int five = 0, ten = 0, twenty = 0;
          for (int bill : bills) {
              // 情况一
              if (bill == 5) five++;
              // 情况二
              if (bill == 10) {
                  if (five <= 0) return false;
                  ten++;
                  five--;
              }
              // 情况三
              if (bill == 20) {
                  // 优先消耗10美元，因为5美元的找零用处更大，能多留着就多留着
                  if (five > 0 && ten > 0) {
                      five--;
                      ten--;
                      twenty++; // 其实这行代码可以删了，因为记录20已经没有意义了，不会用20来找零
                  } else if (five >= 3) {
                      five -= 3;
                      twenty++; // 同理，这行代码也可以删了
                  } else return false;
              }
          }
          return true;
      }
  };
  ```

- 参考题目
  - [860. 柠檬水找零](https://leetcode.cn/problems/lemonade-change/)

## 根据身高重建队列

- 假设有打乱顺序的一群人站成一个队列，数组 `people` 表示队列中一些人的属性（不一定按顺序）。每个 `people[i] = [hi, ki]` 表示第 `i` 个人的身高为 `hi` ，前面正好有 `ki` 个身高大于或等于 `hi` 的人

- 请你重新构造并返回输入数组 `people` 所表示的队列。返回的队列应该格式化为数组 `queue` ，其中 `queue[j] = [hj, kj]` 是队列中第 `j` 个人的属性（`queue[0]` 是排在队列前面的人）

- 示例 1：

  ```
  输入：people = [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]
  输出：[[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]
  解释：
  编号为 0 的人身高为 5 ，没有身高更高或者相同的人排在他前面。
  编号为 1 的人身高为 7 ，没有身高更高或者相同的人排在他前面。
  编号为 2 的人身高为 5 ，有 2 个身高更高或者相同的人排在他前面，即编号为 0 和 1 的人。
  编号为 3 的人身高为 6 ，有 1 个身高更高或者相同的人排在他前面，即编号为 1 的人。
  编号为 4 的人身高为 4 ，有 4 个身高更高或者相同的人排在他前面，即编号为 0、1、2、3 的人。
  编号为 5 的人身高为 7 ，有 1 个身高更高或者相同的人排在他前面，即编号为 1 的人。
  因此 [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]] 是重新构造后的队列。
  ```

- 示例 2：

  ```
  输入：people = [[6,0],[5,0],[4,0],[3,2],[2,2],[1,4]]
  输出：[[4,0],[5,0],[2,2],[3,2],[1,4],[6,0]]
  ```

- 按照身高从大到小排序后：
  - 局部最优：优先按身高高的 people 的 k 来插入，插入操作过后的 people 满足队列属性；即使身高低的插入到前面，也不会影响已经构造好的顺序
  - 全局最优：最后都做完插入操作，整个队列满足题目队列属性

- 代码实现

  ```cpp
  class Solution {
  public:
      static bool cmp(const vector<int>& a, const vector<int>& b) {
          if (a[0] == b[0]) return a[1] < b[1];
          return a[0] > b[0];
      }
      vector<vector<int>> reconstructQueue(vector<vector<int>>& people) {
          sort (people.begin(), people.end(), cmp);
          vector<vector<int>> que;
          for (int i = 0; i < people.size(); i++) {
              int position = people[i][1];
              que.insert(que.begin() + position, people[i]);
          }
          return que;
      }
  };
  ```

- 使用 vector 进行操作比较费时，可以使用链表

  ```cpp
  class Solution {
  public:
      // 身高从大到小排（身高相同k小的站前面）
      static bool cmp(const vector<int>& a, const vector<int>& b) {
          if (a[0] == b[0]) return a[1] < b[1];
          return a[0] > b[0];
      }
      vector<vector<int>> reconstructQueue(vector<vector<int>>& people) {
          sort (people.begin(), people.end(), cmp);
          list<vector<int>> que; // list底层是链表实现，插入效率比vector高的多
          for (int i = 0; i < people.size(); i++) {
              int position = people[i][1]; // 插入到下标为position的位置
              std::list<vector<int>>::iterator it = que.begin();
              while (position--) { // 寻找在插入位置
                  it++;
              }
              que.insert(it, people[i]);
          }
          return vector<vector<int>>(que.begin(), que.end());
      }
  };
  ```

- 与分发糖果问题类似，在有两个维度需要考虑时，应该先确定一个维度，再贪心处理另一个维度

- 参考题目
  - [406. 根据身高重建队列](https://leetcode.cn/problems/queue-reconstruction-by-height/description/)
  - [2512. 奖励最顶尖的 K 名学生](https://leetcode.cn/problems/reward-top-k-students/)
  - [315. 计算右侧小于当前元素的个数](https://leetcode.cn/problems/count-of-smaller-numbers-after-self/description/)

## 用最少数量的箭引爆气球

- 有一些球形气球贴在一堵用 XY 平面表示的墙面上。墙面上的气球记录在整数数组 `points` ，其中`points[i] = [xstart, xend]` 表示水平直径在 `xstart` 和 `xend`之间的气球。你不知道气球的确切 y 坐标

- 一支弓箭可以沿着 x 轴从不同点完全垂直地射出。在坐标 `x` 处射出一支箭，若有一个气球的直径的开始和结束坐标为 `xstart`，`xend`， 且满足 `xstart ≤ x ≤ xend`，则该气球会被引爆。可以射出的弓箭的数量没有限制。 弓箭一旦被射出之后，可以无限地前进。

- 给你一个数组 `points` ，返回引爆所有气球所必须射出的 最小弓箭数

- 示例 1：

  ```
  输入：points = [[10,16],[2,8],[1,6],[7,12]]
  输出：2
  解释：气球可以用2支箭来爆破:
  -在x = 6处射出箭，击破气球[2,8]和[1,6]。
  -在x = 11处发射箭，击破气球[10,16]和[7,12]。
  ```

- 示例 2：

  ```
  输入：points = [[1,2],[3,4],[5,6],[7,8]]
  输出：4
  解释：每个气球需要射出一支箭，总共需要4支箭。
  ```

- 示例 3：

  ```
  输入：points = [[1,2],[2,3],[3,4],[4,5]]
  输出：2
  解释：气球可以用2支箭来爆破:
  - 在x = 2处发射箭，击破气球[1,2]和[2,3]。
  - 在x = 4处射出箭，击破气球[3,4]和[4,5]。
  ```

- 局部最优：当气球出现重叠，一起射，所用弓箭最少

- 全局最优：把所有气球射爆所用弓箭最少

- 按照起始位置排序，从前往后遍历，如果气球重叠了，重叠气球中右边边界的最小值之前的区间一定需要一个弓箭

- 示例代码

  ```cpp
  class Solution {
  private:
      static bool cmp(const vector<int>& a, const vector<int>& b) {
          return a[0] < b[0];
      }
  public:
      int findMinArrowShots(vector<vector<int>>& points) {
          if (points.size() == 0) return 0;
          sort(points.begin(), points.end(), cmp);

          int result = 1; // points 不为空至少需要一支箭
          for (int i = 1; i < points.size(); i++) {
              if (points[i][0] > points[i - 1][1]) {  // 气球i和气球i-1不挨着，注意这里不是>=
                  result++; // 需要一支箭
              }
              else {  // 气球i和气球i-1挨着
                  points[i][1] = min(points[i - 1][1], points[i][1]); // 更新重叠气球最小右边界
              }
          }
          return result;
      }
  };
  ```

- 参考题目
  - [452. 用最少数量的箭引爆气球](https://leetcode.cn/problems/minimum-number-of-arrows-to-burst-balloons/)
  - [435. 无重叠区间](https://leetcode.cn/problems/non-overlapping-intervals/description/)

## 无重叠区间

- 给定一个区间的集合 `intervals` ，其中 `intervals[i] = [starti, endi]` 。返回需要移除区间的最小数量，使剩余区间互不重叠

- 注意只在一点上接触的区间是不重叠的。例如 `[1, 2]` 和 `[2, 3]` 是不重叠的

- 示例 1：

  ```
  输入: intervals = [[1,2],[2,3],[3,4],[1,3]]
  输出: 1
  解释: 移除 [1,3] 后，剩下的区间没有重叠。
  ```

- 示例 2：

  ```
  输入: intervals = [ [1,2], [1,2], [1,2] ]
  输出: 2
  解释: 你需要移除两个 [1,2] 来使剩下的区间没有重叠。
  ```

- 示例 3：

  ```
  输入: intervals = [ [1,2], [2,3] ]
  输出: 0
  解释: 你不需要移除任何区间，因为它们已经是无重叠的了。
  ```

- 贪心思路
  - 排序：将所有区间按「结束时间」升序排列（核心操作，保证每次选的区间结束最早）；
  - 遍历筛选：
    - 初始化「上一个保留区间的结束时间」为第一个区间的结束值；
    - 遍历后续区间：
      - 若当前区间的「起始时间 ≥ 上一个区间的结束时间」→ 不重叠，保留该区间，更新「上一个结束时间」；
      - 否则 → 重叠，需要移除该区间（计数 + 1）；
  - 结果：总移除数量 = 遍历中统计的重叠区间数

  - 结束越早的区间，留给后面的空间越大，能选的区间就越多，移除的就越少

- 代码实现

  ```cpp
  class Solution {
  public:
      // 按照区间右边界排序
      static bool cmp (const vector<int>& a, const vector<int>& b) {
          return a[1] < b[1];
      }
      int eraseOverlapIntervals(vector<vector<int>>& intervals) {
          if (intervals.size() == 0) return 0;
          sort(intervals.begin(), intervals.end(), cmp);
          int count = 1; // 记录非交叉区间的个数
          int end = intervals[0][1]; // 记录区间分割点
          for (int i = 1; i < intervals.size(); i++) {
              if (end <= intervals[i][0]) {
                  end = intervals[i][1];
                  count++;
              }
          }
          return intervals.size() - count;
      }
  };
  ```

## 划分字母区间

- 给你一个字符串 `s` 。我们要把这个字符串划分为尽可能多的片段，同一字母最多出现在一个片段中。例如，字符串 `"ababcc"` 能够被分为 `["abab", "cc"]`，但类似 `["aba", "bcc"]` 或 `["ab", "ab", "cc"]` 的划分是非法的

- 注意，划分结果需要满足：将所有划分结果按顺序连接，得到的字符串仍然是 `s`

- 返回一个表示每个字符串片段的长度的列表

- 示例 1：

  ```
  输入：s = "ababcbacadefegdehijhklij"
  输出：[9,7,8]
  解释：
  划分结果为 "ababcbaca"、"defegde"、"hijhklij" 。
  每个字母最多出现在一个片段中。
  像 "ababcbacadefegde", "hijhklij" 这样的划分是错误的，因为划分的片段数较少。
  ```

- 示例 2：

  ```
  输入：s = "eccbbbbdec"
  输出：[10]
  ```

- 可以统计每种字母所覆盖的区间，那么所能划分的最多片段数，就是不重叠的区间数

- 代码实现

  ```cpp
  class Solution {
  public:
      static bool cmp(vector<int> &a, vector<int> &b) {
          return a[0] < b[0];
      }
      // 记录每个字母出现的区间
      vector<vector<int>> countLabels(string s) {
          vector<vector<int>> hash(26, vector<int>(2, INT_MIN));
          vector<vector<int>> hash_filter;
          for (int i = 0; i < s.size(); ++i) {
              if (hash[s[i] - 'a'][0] == INT_MIN) {
                  hash[s[i] - 'a'][0] = i;
              }
              hash[s[i] - 'a'][1] = i;
          }
          // 去除字符串中未出现的字母所占用区间
          for (int i = 0; i < hash.size(); ++i) {
              if (hash[i][0] != INT_MIN) {
                  hash_filter.push_back(hash[i]);
              }
          }
          return hash_filter;
      }
      vector<int> partitionLabels(string s) {
          vector<int> res;
          // 这一步得到的 hash 即为无重叠区间题意中的输入样例格式：区间列表
          // 只不过现在我们要求的是区间分割点
          vector<vector<int>> hash = countLabels(s);
          // 按照左边界从小到大排序
          sort(hash.begin(), hash.end(), cmp);
          // 记录最大右边界
          int rightBoard = hash[0][1];
          int leftBoard = 0;
          for (int i = 1; i < hash.size(); ++i) {
              // 由于字符串一定能分割，因此,
              // 一旦下一区间左边界大于当前右边界，即可认为出现分割点
              if (hash[i][0] > rightBoard) {
                  res.push_back(rightBoard - leftBoard + 1);
                  leftBoard = hash[i][0];
              }
              rightBoard = max(rightBoard, hash[i][1]);
          }
          // 最右端
          res.push_back(rightBoard - leftBoard + 1);
          return res;
      }
  };
  ```

- 可以简化为找到字母的最远边界，如果找到之前遍历过的所有字母的最远边界，说明这个边界就是分割点了

- 代码实现

  ```cpp
  class Solution {
  public:
      vector<int> partitionLabels(string S) {
          int hash[27] = {0}; // i为字符，hash[i]为字符出现的最后位置
          for (int i = 0; i < S.size(); i++) { // 统计每一个字符最后出现的位置
              hash[S[i] - 'a'] = i;
          }
          vector<int> result;
          int left = 0;
          int right = 0;
          for (int i = 0; i < S.size(); i++) {
              right = max(right, hash[S[i] - 'a']); // 找到字符出现的最远边界
              if (i == right) {
                  result.push_back(right - left + 1);
                  left = i + 1;
              }
          }
          return result;
      }
  };
  ```

- 参考题目
  - [763. 划分字母区间](https://leetcode.cn/problems/partition-labels/)
  - [56. 合并区间](https://leetcode.cn/problems/merge-intervals/description/)
  - [2405. 子字符串的最优划分](https://leetcode.cn/problems/optimal-partition-of-string/description/)

## 合并区间

- 以数组 `intervals` 表示若干个区间的集合，其中单个区间为 `intervals[i] = [starti, endi]` 。请你合并所有重叠的区间，并返回一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间

- 示例 1：

  ```
  输入：intervals = [[1,3],[2,6],[8,10],[15,18]]
  输出：[[1,6],[8,10],[15,18]]
  解释：区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6].
  ```

- 示例 2：

  ```
  输入：intervals = [[1,4],[4,5]]
  输出：[[1,5]]
  解释：区间 [1,4] 和 [4,5] 可被视为重叠区间。
  ```

- 示例 3：

  ```
  输入：intervals = [[4,7],[1,4]]
  输出：[[1,7]]
  解释：区间 [1,4] 和 [4,7] 可被视为重叠区间
  ```

- 首先排序，让所有的相邻区间尽可能的重叠在一起，按左边界，或者右边界排序都可以

- 按照左边界从小到大排序之后，如果 `intervals[i][0] <= intervals[i - 1][1]` 即 intervals[i] 的左边界 <= intervals[i - 1] 的右边界，则一定有重叠

- 代码实现

  ```cpp
  class Solution {
  public:
      vector<vector<int>> merge(vector<vector<int>>& intervals) {
          vector<vector<int>> result;
          if (intervals.size() == 0) return result; // 区间集合为空直接返回
          // 排序的参数使用了lambda表达式
          sort(intervals.begin(), intervals.end(), [](const vector<int>& a, const vector<int>& b){return a[0] < b[0];});

          // 第一个区间就可以放进结果集里，后面如果重叠，在result上直接合并
          result.push_back(intervals[0]);

          for (int i = 1; i < intervals.size(); i++) {
              if (result.back()[1] >= intervals[i][0]) { // 发现重叠区间
                  // 合并区间，只更新右边界就好，因为result.back()的左边界一定是最小值，因为我们按照左边界排序的
                  result.back()[1] = max(result.back()[1], intervals[i][1]);
              } else {
                  result.push_back(intervals[i]); // 区间不重叠
              }
          }
          return result;
      }
  };
  ```

## 单调递增的数字

- 当且仅当每个相邻位数上的数字 `x` 和 `y` 满足 `x <= y` 时，称这个整数是单调递增的

- 给定一个整数 `n` ，返回小于或等于 `n` 的最大数字，且数字呈单调递增

- 示例 1：

  ```
  输入: n = 10
  输出: 9
  ```

- 示例 2：

  ```
  输入: n = 1234
  输出: 1234
  ```

- 示例 3：

  ```
  输入: n = 332
  输出: 299
  ```

- 从后往前遍历，遇到右边的数小于左边的数时，优先将左边的数减1，并把右边的数置为 9

- 示例代码

  ```cpp
  class Solution {
  public:
      int monotoneIncreasingDigits(int N) {
          string strNum = to_string(N);
          // flag用来标记赋值9从哪里开始
          // 设置为这个默认值，为了防止第二个for循环在flag没有被赋值的情况下执行
          int flag = strNum.size();
          for (int i = strNum.size() - 1; i > 0; i--) {
              if (strNum[i - 1] > strNum[i] ) {
                  flag = i;
                  strNum[i - 1]--;
              }
          }
          for (int i = flag; i < strNum.size(); i++) {
              strNum[i] = '9';
          }
          return stoi(strNum);
      }
  };
  ```

- 参考题目
  - [738. 单调递增的数字](https://leetcode.cn/problems/monotone-increasing-digits/)
  - [402. 移掉 K 位数字](https://leetcode.cn/problems/remove-k-digits/)

## 监控二叉树

- 给定一个二叉树，我们在树的节点上安装摄像头

- 节点上的每个摄影头都可以监视其父对象、自身及其直接子对象

- 计算监控树的所有节点所需的最小摄像头数量

- 可以从叶子节点向上遍历
  - 局部最优：让叶子节点的父节点安摄像头，所用摄像头最少
  - 整体最优：全部摄像头数量所用最少

- 然后隔两个节点放一个摄像头，直到二叉树头节点

- 如果左右节点都有覆盖，那么该节点应该是无覆盖

- 如果左右节点至少有一个无覆盖，那么该节点应该放摄像头

- 左右节点至少有一个摄像头，那么该节点一定是覆盖状态

- 遍历完后，如果根节点没有覆盖，则必须放摄像头

- 代码实现

  ```cpp
  class Solution {
  private:
      int result;
      int traversal(TreeNode* cur) {
          if (cur == NULL) return 2;
          int left = traversal(cur->left);    // 左
          int right = traversal(cur->right);  // 右
          if (left == 2 && right == 2) return 0;
          else if (left == 0 || right == 0) {
              result++;
              return 1;
          } else return 2;
      }
  public:
      int minCameraCover(TreeNode* root) {
          result = 0;
          if (traversal(root) == 0) { // root 无覆盖
              result++;
          }
          return result;
      }
  };
  ```

- 参考题目
  - [968. 监控二叉树](https://leetcode.cn/problems/binary-tree-cameras/description/)
  - [979. 在二叉树中分配硬币](https://leetcode.cn/problems/distribute-coins-in-binary-tree/)
