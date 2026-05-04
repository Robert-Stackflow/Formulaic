---
title: 动态规划
description: 动态规划的核心思想、解题步骤及经典题型
---

## 动态规划基础知识

- 动态规划（Dynamic Programming，DP）：如果某一问题有很多重叠子问题，使用动态规划是最有效的
- 动态规划的解题步骤
  - 分析并转化问题，找到子问题结构
  - 确定 dp 数组（dp table）以及下标的含义
  - 确定递推公式
  - dp 数组如何初始化
  - 确定遍历顺序
  - 举例推导 dp 数组

### 贪心算法与动态规划

- 动态规划中每一个状态一定是由上一个状态推导出来的，这一点就区分于贪心，因为贪心没有状态推导，而是从局部直接选最优的
  - 以 0-1 背包问题为例：给定 N 件物品和承重为 W 的背包，每件物品仅能使用一次，需选择物品装入背包使总价值最大
  - 动态规划的核心是`dp[j]`由前序状态推导 ——`dp[j] = max(dp[j], dp[j - weight[i]] + value[i])`，即当前状态依赖于「不选第 i 件物品」或「选第 i 件物品」的最优解；
  - 而贪心算法仅能做「单次局部选择」（比如每次选价值最大 / 重量最小的物品），完全不依赖前序状态，无法兼顾后续选择的影响
  - 因此，贪心算法无法解决这类需要依赖状态转移的动态规划问题

- 所有贪心能解决的问题，理论上都可以用动态规划解决，但反过来不成立

- 贪心和 DP 都依赖「最优子结构」（全局最优包含子问题最优），但两者的核心区别是
  - 贪心是「走捷径」—— 直接选当前最好的路，就能到终点
  - DP 是「穷举所有路」—— 把所有可能的路都走一遍，再选最好的，自然也能走到贪心的那条最优路

  | 特性               | 贪心算法                         | 动态规划                             |
  | :----------------- | :------------------------------- | :----------------------------------- |
  | 选择方式           | 每一步直接选「局部最优」，不回头 | 枚举所有可能的子问题选择，记录最优解 |
  | 最优子结构利用方式 | 只选当前最优的子问题路径         | 遍历所有子问题路径，选最优           |
  | 时间复杂度         | O (n) / O (nlogn)（极优）        | O (n) / O (n²)（更高）               |

- 以「分发饼干」（贪心经典题）为例：
  - 问题：小饼干给小胃口，大饼干给大胃口，求最多满足多少孩子；

  - 贪心解法：排序后双指针，$O (n\log n)$；

  - DP 解法（可行但没必要）：定义 `dp[i][j]` 为「前 i 个饼干满足前 j 个孩子的最大数量」，状态转移

    ```text
    if 饼干i ≥ 胃口j: dp[i][j] = max(dp[i-1][j], dp[i-1][j-1]+1)
    else: dp[i][j] = dp[i-1][j]
    ```

  - 最终 `dp[m][n]` 就是答案，时间复杂度 $O (mn)$，比贪心的 $O (nlogn)$​ 慢很多

- DP 能解的问题，贪心不一定能解
  - DP 的适用范围更广，因为它不要求「局部最优能推全局最优」，只要求「最优子结构 + 重叠子问题」
  - 0-1 背包问题：贪心选最大价值 / 重量比会出错，必须用 DP
  - 最长公共子序列（LCS）：无局部最优路径，只能用 DP
  - 打家劫舍：不能贪心选当前最大金额（会影响后续选择），必须 DP

### 动态规划问题的几种类型

- 线性 DP ：状态沿着一维数组 / 序列转移
  - 最长递增子序列 LIS

  - 最长公共子序列 LCS

  - 最大子数组和（Kadane）

  - 打家劫舍系列

  - 爬楼梯、斐波那契类

  - 单词拆分

- 区间 DP：在区间 `[i,j]` 上做决策，从小区间推到大区间
  - 矩阵链乘法

  - 最长回文子序列

  - 戳气球

  - 合并石子

  - 括号匹配类问题

- 背包 DP：几乎所有资源分配、选或不选问题
  - 01 背包

  - 完全背包

  - 多重背包

  - 分组背包

  - 背包方案数、恰好装满、最大最小价值

- 树形 DP ：在树上做 DP，子节点推父节点
  - 树的最大独立集

  - 树的直径

  - 树的最大路径和

  - 打家劫舍 III

  - 子树统计类

- 状态压缩 DP（状压 DP）：用二进制表示状态，常见于小集合问题
  - 旅行商问题 TSP

  - 排列问题、分配问题

  - 棋盘类状压（如铺地砖）

- 数位 DP：求 `[L, R]` 内满足某种数字性质的数的个数
  - 不包含连续 1

  - 数字和为 k

  - 数字 0~9 出现次数统计

- 计数 DP / 概率 DP：求方案数、概率、期望
  - 路径方案数

  - 掷骰子概率

  - 期望 DP

- 坐标 / 网格 DP ：在二维网格上移动
  - 最小路径和

  - 不同路径

  - 地下城游戏

  - 机器人路径

- 双序列 DP：两个字符串 / 序列互相匹配
  - LCS

  - 编辑距离

  - 正则表达式匹配

  - 通配符匹配

- 博弈 DP：两个人轮流取，求谁必胜
  - 取石子游戏

  - 预测赢家

  - 数字博弈类

### 动态规划问题的几种场景

- 背包问题：专门解决 “有限资源下的选择优化” 问题（如选物品使价值最大 / 数量最多），核心是 “选或不选” 的状态转移
  - 01 背包（每个物品选 / 不选）：给定容量的背包，选物品以满足优化目标
  - 完全背包（物品可重复选）：如零钱兑换、完全平方数
  - 多重背包（物品有数量限制）

- 背包问题又分为几大类：
  - 最大价值
  - 最小价值：所需的最小物品数，如零钱兑换
  - 刚好满足：如分割等和子集
  - 能否满足：如零钱兑换
  - 有几种方法 / 方案数：如目标和

- 子序列（不连续）：DP 状态通常定义为「前 i 个元素 / 前 i 个字符的最优解」，转移时考虑 “选 / 不选当前元素”
  - 最长递增子序列（LIS）
  - 最长公共子序列（LCS）

- 子序列（连续）：DP 状态通常定义为「以第 i 个元素结尾的最长 / 最优连续子串」，转移仅依赖相邻的子问题
  - 最长有效括号
  - 最大子数组和
  - 最长连续递增序列
  - 最长公共子数组

- 编辑距离：衡量两个字符串的相似程度，通过「插入、删除、替换」三种操作将一个字符串转为另一个，求最少操作数（属于二维线性 DP）
- 回文：回文是 “正读和反读相同” 的序列，DP 解法以区间 DP为主（状态定义为区间 [i,j]），按区间长度从小到大求解
  - 最长回文子串（连续）：用区间 DP，状态是「是否为回文」，按区间长度从小到大遍历
  - 最长回文子序列（不连续）：用区间 DP，状态是「最长长度」，从后往前枚举起点

### 子序列问题

- 子序列问题的本质是「从原序列中选若干元素组成新序列」，但选出来的元素之间是否有 “相邻依赖关系”，直接决定了最优的状态设计方式

  | 分类           | 核心特征                                   | 状态设计思路            | 典型例子               | 空间复杂度（最优） |
  | :------------- | :----------------------------------------- | :---------------------- | :--------------------- | :----------------- |
  | 相邻无关子序列 | 选出来的元素之间无顺序 / 大小 / 匹配等依赖 | 选或不选                | 0-1 背包、子集和       | O (容量) / O (n)   |
  | 相邻相关子序列 | 选出来的元素之间有顺序 / 大小 / 匹配等依赖 | 枚举选哪个（以 i 结尾） | LIS、最长有效括号、LCS | O(n) / O(n\*m)     |

- 相邻无关子序列问题，适合「选或不选」：因为每个元素互相独立，只需依次考虑每个元素选或不选
- 相邻相关子序列问题，适合「枚举选哪个」：选出来的子序列中，元素之间有明确的 “相邻依赖”（比如 LIS 需要前一个元素 < 当前元素，最长有效括号需要括号匹配），此时 “选或不选” 的思路会因为需要记录「上一个选的元素」而变得复杂，最优方式是固定 “以第 i 个元素结尾”（枚举选 i 作为子序列最后一个元素），然后枚举前一个元素 j，显式处理 i 和 j 的依赖关系

## 基础题目

### 斐波那契数

- 斐波那契数，通常用 F(n) 表示，形成的序列称为 斐波那契数列 。该数列由 0 和 1 开始，后面的每一项数字都是前面两项数字的和。也就是： F(0) = 0，F(1) = 1，F(n) = F(n - 1) + F(n - 2)，其中 n > 1

- 给定 n ，请计算 F(n)

- 确定 dp 数组（dp table）以及下标的含义：dp[i] 定义为第 i 个数的斐波那契数

- 递推公式：dp[i] = dp[i-1] + dp[i-2]

- dp 数组如何初始化：dp[0] = 0，dp[1] = 1

- 确定遍历顺序：从前向后遍历

- 举例推导 dp 数组
  - dp[2] = dp[1] + dp[0] = 1
  - dp[3] = dp[2] + dp[1] = 2

- 代码如下

  ```cpp
  class Solution {
  public:
      int fib(int N) {
          if (N <= 1) return N;
          vector<int> dp(N + 1);
          dp[0] = 0;
          dp[1] = 1;
          for (int i = 2; i <= N; i++) {
              dp[i] = dp[i - 1] + dp[i - 2];
          }
          return dp[N];
      }
  };

  // 优化，只需维护两个数值
  class Solution2 {
  public:
      int fib(int N) {
          if (N <= 1) return N;
          int dp[2];
          dp[0] = 0;
          dp[1] = 1;
          for (int i = 2; i <= N; i++) {
              int sum = dp[0] + dp[1];
              dp[0] = dp[1];
              dp[1] = sum;
          }
          return dp[1];
      }
  };

  // 递归解法
  class Solution {
  public:
      int fib(int N) {
          if (N < 2) return N;
          return fib(N - 1) + fib(N - 2);
      }
  };
  ```

- 参考题目
  - [509. 斐波那契数](https://leetcode.cn/problems/fibonacci-number/description/)
  - [70. 爬楼梯](https://leetcode.cn/problems/climbing-stairs/description/)

### 爬楼梯

- 假设你正在爬楼梯。需要 n 阶你才能到达楼顶

- 每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？

- 注意：给定 n 是一个正整数

- 确定 dp 数组（dp table）以及下标的含义：dp[i] 定义为 i 个台阶有几种爬楼梯的方法

- 递推公式：dp[i] 可以有两个方向推出来，dp[i] = dp[i-1] + dp[i-2]

- dp 数组如何初始化：dp[1] = 1，dp[2] = 2

- 确定遍历顺序：从前向后遍历

- 举例推导 dp 数组
  - dp[3] = dp[2] + dp[1] = 3
  - dp[4] = dp[3] + dp[2] = 5

- 代码实现

  ```cpp
  class Solution {
  public:
      int climbStairs(int n) {
          if (n <= 1) return n; // 因为下面直接对dp[2]操作了，防止空指针
          vector<int> dp(n + 1);
          dp[1] = 1;
          dp[2] = 2;
          for (int i = 3; i <= n; i++) { // 注意i是从3开始的
              dp[i] = dp[i - 1] + dp[i - 2];
          }
          return dp[n];
      }
  };

  // 只用两个值
  class Solution {
  public:
      int climbStairs(int n) {
          if (n <= 1) return n;
          int dp[3];
          dp[1] = 1;
          dp[2] = 2;
          for (int i = 3; i <= n; i++) {
              int sum = dp[1] + dp[2];
              dp[1] = dp[2];
              dp[2] = sum;
          }
          return dp[2];
      }
  };
  ```

- 进阶：一步一个台阶，两个台阶，三个台阶，直到 m 个台阶，有多少种方法爬到 n 阶楼顶

- 代码实现

  ```cpp
  class Solution {
  public:
      int climbStairs(int n) {
          vector<int> dp(n + 1, 0);
          dp[0] = 1;
          for (int i = 1; i <= n; i++) {
              for (int j = 1; j <= m; j++) { // 把m换成2，就可以AC爬楼梯这道题
                  if (i - j >= 0) dp[i] += dp[i - j];
              }
          }
          return dp[n];
      }
  };
  ```

### 使用最小花费爬楼梯

- 给你一个整数数组 `cost` ，其中 `cost[i]` 是从楼梯第 `i` 个台阶向上爬需要支付的费用。一旦你支付此费用，即可选择向上爬一个或者两个台阶

- 你可以选择从下标为 `0` 或下标为 `1` 的台阶开始爬楼梯——跳到 下标 0 或者 下标 1 是不花费体力的

- 请你计算并返回达到楼梯顶部的最低花费

- 确定 dp 数组（dp table）以及下标的含义：dp[i] 定义为 i 个台阶的最小花费

- 递推公式：dp[i] 可以有两个方向推出来，dp[i] = min(dp[i-1]+cost[i-1], dp[i-2]+cost[i-2])

- dp 数组如何初始化：dp[0] = 0，dp[1] = 0

- 确定遍历顺序：从前向后遍历

- 举例推导 dp 数组
  - 以 cost = [1, 100, 1, 1, 1, 100, 1, 1, 100, 1] 为例
  - dp[2] = min(dp[0]+cost[0],dp[1]+cost[1]) = 1
  - dp[3] = min(dp[2]+cost[2],dp[1]+cost[1]) = 2

- 示例代码

  ```cpp
  class Solution {
  public:
      int minCostClimbingStairs(vector<int>& cost) {
          vector<int> dp(cost.size() + 1);
          dp[0] = 0; // 默认第一步都是不花费体力的
          dp[1] = 0;
          for (int i = 2; i <= cost.size(); i++) {
              dp[i] = min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2]);
          }
          return dp[cost.size()];
      }
  };

  // 优化空间
  class Solution {
  public:
      int minCostClimbingStairs(vector<int>& cost) {
          int dp0 = 0;
          int dp1 = 0;
          for (int i = 2; i <= cost.size(); i++) {
              int dpi = min(dp1 + cost[i - 1], dp0 + cost[i - 2]);
              dp0 = dp1; // 记录一下前两位
              dp1 = dpi;
          }
          return dp1;
      }
  };
  ```

- 参考题目
  - [746. 使用最小花费爬楼梯](https://leetcode.cn/problems/min-cost-climbing-stairs/)
  - [3154. 到达第 K 级台阶的方案数](https://leetcode.cn/problems/find-number-of-ways-to-reach-the-k-th-stair/)

### 不同路径

- 一个机器人位于一个 `m x n` 网格的左上角 （起始点在下图中标记为 “Start” ）

- 机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish” ）

- 问总共有多少条不同的路径？

- 深度搜索方法

  ```cpp
  class Solution {
  private:
      int dfs(int i, int j, int m, int n) {
          if (i > m || j > n) return 0; // 越界了
          if (i == m && j == n) return 1; // 找到一种方法，相当于找到了叶子节点
          return dfs(i + 1, j, m, n) + dfs(i, j + 1, m, n);
      }
  public:
      int uniquePaths(int m, int n) {
          return dfs(1, 1, m, n);
      }
  };
  ```

- 这棵树的深度就是 m+n-1（深度按从 1 开始计算），二叉树的节点个数就是 $2^{m + n - 1} - 1$

- 确定 dp 数组（dp table）以及下标的含义：`dp[i][j]` 定义为到达位置 `i,j` 总共有多少种不同的路径

- 递推公式：`dp[i][j]` 可以从两个方向推出来，`dp[i][j] = dp[i-1][j] + dp[i][j-1]`

- dp 数组如何初始化：`dp[0][0]=0,dp[0][j]=1,dp[i][0]=1`

- 确定遍历顺序：逐行从左到右遍历，遍历到右下角 `dp[m-1][n-1]` 即为最终结果

- 代码实现

  ```cpp
  class Solution {
  public:
      int uniquePaths(int m, int n) {
          vector<vector<int>> dp(m, vector<int>(n, 0));
          for (int i = 0; i < m; i++) dp[i][0] = 1;
          for (int j = 0; j < n; j++) dp[0][j] = 1;
          for (int i = 1; i < m; i++) {
              for (int j = 1; j < n; j++) {
                  dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
              }
          }
          return dp[m - 1][n - 1];
      }
  };
  ```

- 时间复杂度：$O(m × n)$、空间复杂度：$O(m × n)$

- 使用一维数组

  ```cpp
  class Solution {
  public:
      int uniquePaths(int m, int n) {
          vector<int> dp(n);
          for (int i = 0; i < n; i++) dp[i] = 1;
          for (int j = 1; j < m; j++) {
              for (int i = 1; i < n; i++) {
                  dp[i] += dp[i - 1];
              }
          }
          return dp[n - 1];
      }
  };
  ```

- 数论方法：在这 m+n-2 步中，一定有 m-1 步向下走，即 m+n-2 个格子中，随便选 m-1 个格子填写为向下走，这是一个组合问题，即 $C_{m+n-2}^{m-1}$​

  ```cpp
  // 求组合的时候，要防止两个int相乘溢出
  // 不能把算式的分子都算出来，分母都算出来再做除法
  class Solution {
  public:
      int uniquePaths(int m, int n) {
          long long numerator = 1; // 分子
          int denominator = m - 1; // 分母
          int count = m - 1;
          int t = m + n - 2;
          while (count--) {
              numerator *= (t--);
              while (denominator != 0 && numerator % denominator == 0) {
                  numerator /= denominator;
                  denominator--;
              }
          }
          return numerator;
      }
  };
  ```

- 参考题目
  - [62. 不同路径](https://leetcode.cn/problems/unique-paths/description/)
  - [63. 不同路径 II](https://leetcode.cn/problems/unique-paths-ii/)
  - [64. 最小路径和](https://leetcode.cn/problems/minimum-path-sum/)

### 不同路径 II

- 在不同路径 I 的基础上，路径中可能会存在障碍物

- 递推公式：`dp[i][j]` 可以从两个方向推出来，`dp[i][j] = dp[i-1][j] + dp[i][j-1]`，注意如果 `i,j` 是障碍物的话，应该保持初始状态

- dp 数组如何初始化：`dp[0][0]=0,dp[0][j]=1,dp[i][0]=1`；同时注意，首行和首列的障碍物之后或之下应该保持为 0

- 代码示例

  ```cpp
  class Solution {
  public:
      int uniquePathsWithObstacles(vector<vector<int>>& obstacleGrid) {
          int m = obstacleGrid.size();
          int n = obstacleGrid[0].size();
          if (obstacleGrid[m - 1][n - 1] == 1 || obstacleGrid[0][0] == 1) //如果在起点或终点出现了障碍，直接返回0
              return 0;
          vector<vector<int>> dp(m, vector<int>(n, 0));
          for (int i = 0; i < m && obstacleGrid[i][0] == 0; i++) dp[i][0] = 1;
          for (int j = 0; j < n && obstacleGrid[0][j] == 0; j++) dp[0][j] = 1;
          for (int i = 1; i < m; i++) {
              for (int j = 1; j < n; j++) {
                  if (obstacleGrid[i][j] == 1) continue;
                  dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
              }
          }
          return dp[m - 1][n - 1];
      }
  };
  ```

- 空间优化版本

  ```cpp
  class Solution {
  public:
      int uniquePathsWithObstacles(vector<vector<int>>& obstacleGrid) {
          if (obstacleGrid[0][0] == 1)
              return 0;
          vector<int> dp(obstacleGrid[0].size());
          for (int j = 0; j < dp.size(); ++j)
              if (obstacleGrid[0][j] == 1)
                  dp[j] = 0;
              else if (j == 0)
                  dp[j] = 1;
              else
                  dp[j] = dp[j-1];

          for (int i = 1; i < obstacleGrid.size(); ++i)
              for (int j = 0; j < dp.size(); ++j){
                  if (obstacleGrid[i][j] == 1)
                      dp[j] = 0;
                  else if (j != 0)
                      dp[j] = dp[j] + dp[j-1];
              }
          return dp.back();
      }
  };
  ```

### 整数拆分

- 给定一个正整数 `n` ，将其拆分为 `k` 个正整数的和（ `k >= 2` ），并使这些整数的乘积最大化；返回可以获得的最大乘积

- 拆分一个数 n 使之乘积最大，那么一定是拆分成m个近似相同的子数相乘才是最大的

- 确定 dp 数组（dp table）以及下标的含义：dp[i] 定义为给定正整数 i 的最大乘积

- 递推公式：` dp[i] = max(dp[i], max((i - j) * j, dp[i - j] * j))`

- dp 数组如何初始化：dp[1] = 1

- 确定遍历顺序：从前向后遍历

- 举例推导 dp 数组
  - dp[2] = 1
  - dp[3] = 2
  - dp[4] = 4

- 代码实现

  ```cpp
  class Solution {
  public:
      int integerBreak(int n) {
          vector<int> dp(n + 1);
          dp[2] = 1;
          for (int i = 3; i <= n ; i++) {
              for (int j = 1; j <= i / 2; j++) {
                  dp[i] = max(dp[i], max((i - j) * j, dp[i - j] * j));
              }
          }
          return dp[n];
      }
  };
  ```

- 贪心算法

  ```cpp
  class Solution {
  public:
      int integerBreak(int n) {
          if (n == 2) return 1;
          if (n == 3) return 2;
          if (n == 4) return 4;
          int result = 1;
          while (n > 4) {
              result *= 3;
              n -= 3;
          }
          result *= n;
          return result;
      }
  };
  ```

- 参考题目
  - [343. 整数拆分](https://leetcode.cn/problems/integer-break/description/)
  - [1808. 好因子的最大数目](https://leetcode.cn/problems/maximize-number-of-nice-divisors/)

### 不同的二叉搜索树

- 给你一个整数 `n` ，求恰由 `n` 个节点组成且节点值从 `1` 到 `n` 互不相同的二叉搜索树有多少种？返回满足题意的二叉搜索树的种数

- 确定 dp 数组（dp table）以及下标的含义：dp[i] 定义为包含 i 个节点的二叉搜索树种类

- 递推公式：`dp[i] += dp[以j为头结点左子树节点数量] * dp[以j为头结点右子树节点数量]`，即 `dp[i] += dp[j - 1] * dp[i - j]，j-1 为j为头结点左子树节点数量，i-j 为以j为头结点右子树节点数量`

- dp 数组如何初始化：dp[0] = 1

- 确定遍历顺序：从前向后遍历，同时两层遍历，外层遍历是 i，内层遍历是小于 i 的 j

- 举例推导 dp 数组
  - dp[2] = 1
  - dp[3] = 5
  - dp[4] = 14

- 代码实现

  ```cpp
  class Solution {
  public:
      int numTrees(int n) {
          vector<int> dp(n + 1);
          dp[0] = 1;
          for (int i = 1; i <= n; i++) {
              for (int j = 1; j <= i; j++) {
                  dp[i] += dp[j - 1] * dp[i - j];
              }
          }
          return dp[n];
      }
  };
  ```

- 参考题目
  - [96. 不同的二叉搜索树](https://leetcode.cn/problems/unique-binary-search-trees/)
  - [95. 不同的二叉搜索树 II](https://leetcode.cn/problems/unique-binary-search-trees-ii/)
  - [241. 为运算表达式设计优先级](https://leetcode.cn/problems/different-ways-to-add-parentheses/)

## 01 背包

- 背包问题的分类

  ![背包问题分类](/img/algorithm/背包问题分类.png)

### 二维 01 背包

- 01 背包问题
  - 有 n 件物品和一个最多能背重量为 w 的背包
  - 第 i 件物品的重量是weight[i]，得到的价值是value[i]
  - 每件物品只能用一次，求解将哪些物品装入背包里物品价值总和最大

- 暴力搜索：每件物品只有两个状态，取或者不取，可以使用回溯法搜索出所有的情况，时间复杂度就是 $O(2^n)$

- 确定 dp 数组及下标的含义
  - 需要使用二维数组 `dp[i][j]` 来处理物品和背包容量
  - `dp[i][j]` 表示的是背包容量为 j 的情况下，放入 [0-i] 中的任意物品的最大价值

- 递推公式
  - 对于 i 而言，只有两种情况，放 i 还是不放 i
  - `dp[i][j]=max(dp[i-1][j],dp[i-1][j-weight[i]]+value[i])`

- 如何初始化 dp 数组
  - 初始化 j=0 时所有 i 的数组元素为 0
  - 初始化对于 i=0，0<j<=max_weight 的数组元素，当 j< weight[0] 时 `dp[0][j]=0`，否则为 value[0]
  - 其他区域初始化为 0 或任意值都可以

- 遍历顺序
  - 先遍历物品，还是先遍历背包数量？
  - 先遍历物品更容易理解

- 示例代码

  ```cpp
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      int n, bagweight;// bagweight代表行李箱空间

      cin >> n >> bagweight;

      vector<int> weight(n, 0); // 存储每件物品所占空间
      vector<int> value(n, 0);  // 存储每件物品价值

      for(int i = 0; i < n; ++i) {
          cin >> weight[i];
      }
      for(int j = 0; j < n; ++j) {
          cin >> value[j];
      }
      // dp数组, dp[i][j]代表行李箱空间为j的情况下,从下标为[0, i]的物品里面任意取,能达到的最大价值
      vector<vector<int>> dp(weight.size(), vector<int>(bagweight + 1, 0));

      // 初始化, 因为需要用到dp[i - 1]的值
      // j < weight[0]已在上方被初始化为0
      // j >= weight[0]的值就初始化为value[0]
      for (int j = weight[0]; j <= bagweight; j++) {
          dp[0][j] = value[0];
      }

      for(int i = 1; i < weight.size(); i++) { // 遍历科研物品
          for(int j = 0; j <= bagweight; j++) { // 遍历行李箱容量
              if (j < weight[i]) dp[i][j] = dp[i - 1][j]; // 如果装不下这个物品,那么就继承dp[i - 1][j]的值
              else {
                  dp[i][j] = max(dp[i - 1][j], dp[i - 1][j - weight[i]] + value[i]);
              }
          }
      }
      cout << dp[n - 1][bagweight] << endl;

      return 0;
  }
  ```

- 参考题目
  - [46. 携带研究材料（第六期模拟笔试）](https://kamacoder.com/problempage.php?pid=1046)

### 一维 01 背包

- 背包问题中，二维 DP 数组的状态是可以被高效压缩的，先回顾二维 DP 的核心逻辑：
  - 二维 DP 数组定义：`dp[i][j]` 表示从下标为 `[0-i]` 的物品中任选，放入容量为 `j` 的背包时，能获得的最大价值总和。

  - 二维 DP 递推公式：

    ```
    dp[i][j] = max(dp[i - 1][j], dp[i - 1][j - weight[i]] + value[i])
    ```

  - 这个公式的核心是：第 `i` 个物品的状态（选或不选），完全依赖于第 `i-1` 个物品的状态（即上一层的结果）

  - 从这个递推关系能发现一个关键规律：如果先把 `dp[i-1]` 这一层的所有值完整拷贝到 `dp[i]` 层，那么递推公式可以等价改写为：

    ```
    dp[i][j] = max(dp[i][j], dp[i][j - weight[i]] + value[i])
    ```

- 既然每一层的计算只依赖前一层的结果，且拷贝操作本质上是重复利用前一层的数据，那么完全不需要维护二维数组的 “层维度”（物品维度 `i`），只需用一个一维数组（也叫滚动数组） `dp[j]` 即可实现状态压缩

- 这就是滚动数组的核心由来：当 DP 的当前层状态仅依赖上一层状态时，无需保留所有历史层，只需复用一个一维数组，让 “上一层” 的数据直接覆盖为 “当前层” 的数据

- 确定 dp 数组的定义：在一维 dp 数组中，dp[j] 表示：容量为 j 的背包，所背的物品价值可以最大为 dp[j]

- 递推公式为：`dp[j] = max(dp[j], dp[j - weight[i]] + value[i])`
  - `dp[j]`：表示容量为 j 的背包，在遍历到第 i 个物品时，能装下的最大价值总和
  - 选项 1：不放物品 i → 对应值为 `dp[j]`
    - 此时的 `dp[j]` 保留的是遍历到第 i-1 个物品时的结果（等价于二维 DP 中的 `dp[i-1][j]`）
    - 也就是不考虑当前物品 i 时，容量 j 的背包能装的最大价值
  - 选项 2：放入物品 i → 对应值为 `dp[j - weight[i]] + value[i]`
    - `dp[j - weight[i]]`：容量为 `j - weight[i]` 的背包，在遍历到第 i-1 个物品时的最大价值（即先留出物品 i 的重量空间，剩下的容量能装的最大价值）；
    - `+ value[i]`：加上物品 i 本身的价值，就得到 “容量 j 的背包放入物品 i 后的总价值”
  - `max(不放物品i的价值, 放入物品i的价值)` → 最终得到容量 j 的背包在考虑物品 i 后，能装的最大价值

- 初始化 dp 数组
  - 当物品价值均为正整数时，`dp` 数组（包括 `dp[0]`）全部初始化为 `0` 是最优且正确的选择
  - `dp[j]`：容量为 `j` 的背包能装下的最大价值
  - `dp[0] = 0`：容量为 0 的背包无法装任何物品，最大价值必然为 0，这是天然的边界条件
  - 其他元素也都初始化为 0
    - 若物品价值均为正整数：非 0 下标初始化为 `0` 时，`dp[j]` 的初始值（0）代表 “未放入任何物品时的价值”，而 `dp[j - weight[i]] + value[i]` 是 “放入第 i 个物品后的价值”（正数）。此时公式会自然选择 “放入物品后的更大价值”，不会被初始值覆盖，符合 “求最大价值” 的目标
    - 反例（若初始化为非 0 值）：比如初始化为负数，那么第一次计算时，`max(负数, 正数)` 仍能得到正确结果，但无意义且增加复杂度；若初始化为正数（比如 10），则可能出现 `max(10, 5)` 错误选择初始值的情况，导致结果偏离

- 一维 dp 数组遍历顺序
  - 背包容量要倒序遍历，防止物品重复选取
  - 一维 DP 的本质是复用同一个数组，`dp[j]` 同时存储 “上一层（i-1 个物品）” 和 “当前层（i 个物品）” 的状态
  - 正序遍历的问题：会导致同一物品被重复放入
  - 举例子：物品 0（weight=1，value=15），背包容量从 1 到 2 正序遍历：
    - `dp[1] = dp[1-1] + 15 = 15`（放入物品 0，正确）；
    - `dp[2] = dp[2-1] + 15 = dp[1] + 15 = 30`（此时`dp[1]`已经是 “放入物品 0 后” 的状态，相当于物品 0 被放入两次，违背 01 背包 “每个物品只能选一次” 的规则）
  - 倒序遍历的原理：保证计算`dp[j]`时，`dp[j-weight[i]]`仍是 “上一层（未选物品 i）” 的状态
  - 同样以物品 0 为例，背包容量从 2 到 1 倒序遍历：
    - `dp[2] = dp[2-1] + 15 = dp[1]（初始0） + 15 = 15`（用的是未选物品 0 的初始值，只放一次）；
    - `dp[1] = dp[0] + 15 = 15`（同理，只放一次）
  - 倒序的核心是先更新大容量的 dp [j]，再更新小容量的，避免小容量的更新结果被重复利用，确保每个物品仅被选取一次

- 示例代码

  ```cpp
  // 一维dp数组实现
  #include <iostream>
  #include <vector>
  using namespace std;

  int main() {
      // 读取 M 和 N
      int M, N;
      cin >> M >> N;

      vector<int> costs(M);
      vector<int> values(M);

      for (int i = 0; i < M; i++) {
          cin >> costs[i];
      }
      for (int j = 0; j < M; j++) {
          cin >> values[j];
      }

      // 创建一个动态规划数组dp，初始值为0
      vector<int> dp(N + 1, 0);

      // 外层循环遍历每个类型的研究材料
      for (int i = 0; i < M; ++i) {
          // 内层循环从 N 空间逐渐减少到当前研究材料所占空间
          for (int j = N; j >= costs[i]; --j) {
              // 考虑当前研究材料选择和不选择的情况，选择最大值
              dp[j] = max(dp[j], dp[j - costs[i]] + values[i]);
          }
      }

      // 输出dp[N]，即在给定 N 行李空间可以携带的研究材料最大价值
      cout << dp[N] << endl;

      return 0;
  }
  ```

### 分割等和子集

- 给你一个只包含正整数的非空数组 `nums` ，请你判断是否可以将这个数组分割成两个子集，使得两个子集的元素和相等

- 要把这个数组划分为两个子集，也即寻找一个子集，使得其总和为 sum / 2，显然可以通过回溯遍历子集

- 示例代码

  ```cpp
  #include <vector>
  #include <algorithm> // 用于排序，优化剪枝
  using namespace std;

  class Solution {
  public:
      bool canPartition(vector<int>& nums) {
          // 步骤1：计算数组总和，判断是否为偶数
          int sum = 0;
          for (int num : nums) {
              sum += num;
          }
          // 总和为奇数，直接返回false（无法分割为两个等和子集）
          if (sum % 2 != 0) {
              return false;
          }
          int target = sum / 2; // 目标和：子集需要达到的和

          // 步骤2：排序（降序），优化剪枝（先选大数，更快触发剪枝条件）
          sort(nums.rbegin(), nums.rend());

          // 步骤3：回溯查找是否存在子集和为target
          return backtrack(nums, 0, 0, target);
      }

  private:
      // 回溯函数：
      // nums: 原数组
      // start: 当前遍历的起始索引（避免重复选取同一元素）
      // currentSum: 当前子集的和
      // target: 目标和
      bool backtrack(vector<int>& nums, int start, int currentSum, int target) {
          // 终止条件1：当前和等于目标和，找到有效子集
          if (currentSum == target) {
              return true;
          }
          // 终止条件2：当前和超过目标和，剪枝（无需继续递归）
          if (currentSum > target) {
              return false;
          }

          // 遍历数组，从start开始（避免重复组合，如[1,2]和[2,1]视为同一组合）
          for (int i = start; i < nums.size(); ++i) {
              // 剪枝：若当前元素和前一个元素相同，且前一个元素未选，跳过（避免重复递归）
              if (i > start && nums[i] == nums[i-1]) {
                  continue;
              }
              // 选择当前元素，加入子集
              currentSum += nums[i];
              // 递归：下一层从i+1开始（每个元素只能选一次）
              if (backtrack(nums, i + 1, currentSum, target)) {
                  return true; // 找到有效解，直接返回
              }
              // 回溯：撤销选择
              currentSum -= nums[i];
          }

          // 所有组合尝试完毕，未找到有效子集
          return false;
      }
  };
  ```

- 其次，也可以使用 01 背包来解决，即背包容量为 sum/2，每个数字的重量和价值就是数字大小本身，而这里要求背包装满，因此最大价值就是 sum/2 时，说明背包正好装满了

- 确定dp数组以及下标的含义：dp[j] 表示： 容量（所能装的重量）为 j 的背包，所背的物品价值最大可以为 dp[j]，当 `dp[target]==target` 是说明背包装满了

- 递推公式：`dp[j] = max(dp[j], dp[j - nums[i]] + nums[i])`

- 初始化：`dp[0]=0`，物品价值均为正整数时，dp 数组非 0 下标初始化为 0，避免初始值覆盖正价值的选取；物品价值含负数时，非 0 下标需初始化为负无穷，确保递推能正确选择实际价值（即使为负）

- 题目中说明数字总和不会大于 20000，因此背包最大只需要 10000，可以初始化数组大小为 10001

- 遍历顺序：外层遍历物品，内层遍历背包容量，内层从后往前遍历

- 代码实现

  ```cpp
  class Solution {
  public:
      bool canPartition(vector<int>& nums) {
          int sum = 0;

          // dp[i]中的i表示背包内总和
          // 题目中说：每个数组中的元素不会超过 100，数组的大小不会超过 200
          // 总和不会大于20000，背包最大只需要其中一半，所以10001大小就可以了
          vector<int> dp(10001, 0);
          for (int i = 0; i < nums.size(); i++) {
              sum += nums[i];
          }
          // 也可以使用库函数一步求和
          // int sum = accumulate(nums.begin(), nums.end(), 0);
          if (sum % 2 == 1) return false;
          int target = sum / 2;

          // 开始 01背包
          for(int i = 0; i < nums.size(); i++) {
              for(int j = target; j >= nums[i]; j--) { // 每一个元素一定是不可重复放入，所以从大到小遍历
                  dp[j] = max(dp[j], dp[j - nums[i]] + nums[i]);
              }
          }
          // 集合中的元素正好可以凑成总和target
          if (dp[target] == target) return true;
          return false;
      }
  };
  ```

- 由此可见，背包问题不仅可以求背包能被的最大价值，还可以求这个背包是否可以装满

- 参考题目
  - [416. 分割等和子集](https://leetcode.cn/problems/partition-equal-subset-sum/)
  - [698. 划分为k个相等的子集](https://leetcode.cn/problems/partition-to-k-equal-sum-subsets/)
  - [473. 火柴拼正方形](https://leetcode.cn/problems/matchsticks-to-square/)
  - [2397. 被列覆盖的最多行数](https://leetcode.cn/problems/maximum-rows-covered-by-columns/)
  - [1981. 最小化目标值与所选元素的差](https://leetcode.cn/problems/minimize-the-difference-between-target-and-chosen-elements/)
  - [2025. 分割数组的最多方案数](https://leetcode.cn/problems/maximum-number-of-ways-to-partition-an-array/)
  - [2035. 将数组分成两个数组并最小化数组和的差](https://leetcode.cn/problems/partition-array-into-two-arrays-to-minimize-sum-difference/)

### 最后一块石头的重量 II

- 有一堆石头，用整数数组 `stones` 表示。其中 `stones[i]` 表示第 `i` 块石头的重量

- 每一回合，从中选出任意两块石头，然后将它们一起粉碎。假设石头的重量分别为 `x` 和 `y`，且 `x <= y`。那么粉碎的可能结果如下：
  - 如果 `x == y`，那么两块石头都会被完全粉碎；
  - 如果 `x != y`，那么重量为 `x` 的石头将会完全粉碎，而重量为 `y` 的石头新重量为 `y-x`

- 最后，最多只会剩下一块石头。返回此石头最小的可能重量 。如果没有石头剩下，就返回 `0`

- 示例 1：

  ```
  输入：stones = [2,7,4,1,8,1]
  输出：1
  解释：
  组合 2 和 4，得到 2，所以数组转化为 [2,7,1,8,1]，
  组合 7 和 8，得到 1，所以数组转化为 [2,1,1,1]，
  组合 2 和 1，得到 1，所以数组转化为 [1,1,1]，
  组合 1 和 1，得到 0，所以数组转化为 [1]，这就是最优值。
  ```

- 示例 2：

  ```
  输入：stones = [31,26,33,21,40]
  输出：5
  ```

- 这道题其实是尽量让石头分成重量相同的两堆（尽可能相同），相撞之后剩下的石头就是最小的，那么此时问题就是有一堆石头，每个石头都有自己的重量，是否可以装满最大重量为 sum / 2的背包，最后 `abs(sum-2*dp[target])` 即为最后一块石头的重量

- 确定 dp 数组以及下标的含义：dp[j] 表示容量为 j 的背包，最多可以背最大重量为 dp[j]

- 递推公式：`dp[j] = max(dp[j], dp[j - stones[i]] + stones[i])`

- dp 数组如何初始化
  - 提示中给出 1 <= stones.length <= 30，1 <= stones[i] <= 1000，所以最大重量就是 30 \* 1000
  - 因此 dp 数组大小为 15000
  - 显然 dp 数组全部初始化为 0

- 遍历顺序：外层遍历物品，内层遍历背包容量，内层从后往前遍历

- 代码实现

  ```cpp
  class Solution {
  public:
      int lastStoneWeightII(vector<int>& stones) {
          vector<int> dp(15001, 0);
          int sum = 0;
          for (int i = 0; i < stones.size(); i++) sum += stones[i];
          int target = sum / 2;
          for (int i = 0; i < stones.size(); i++) { // 遍历物品
              for (int j = target; j >= stones[i]; j--) { // 遍历背包
                  dp[j] = max(dp[j], dp[j - stones[i]] + stones[i]);
              }
          }
          return sum - dp[target] - dp[target];
      }
  };
  ```

- 参考题目
  - [1046. 最后一块石头的重量](https://leetcode.cn/problems/last-stone-weight/description/)
  - [1049. 最后一块石头的重量 II](https://leetcode.cn/problems/last-stone-weight-ii/)
  - [2035. 将数组分成两个数组并最小化数组和的差](https://leetcode.cn/problems/partition-array-into-two-arrays-to-minimize-sum-difference/description/)

### 目标和

- 给你一个非负整数数组 `nums` 和一个整数 `target`

- 向数组中的每个整数前添加 `'+'` 或 `'-'` ，然后串联起所有整数，可以构造一个表达式：

- 例如，`nums = [2, 1]` ，可以在 `2` 之前添加 `'+'` ，在 `1` 之前添加 `'-'` ，然后串联起来得到表达式 `"+2-1"`

- 返回可以通过上述方法构造的、运算结果等于 `target` 的不同表达式的数目

- 显然，可以利用回溯的方法，遍历所有可能的情况，然后判断是否等于 target 即可，但是这种方法的时间复杂度是指数级的

  ```cpp
  class Solution {
  private:
      vector<vector<int>> result;
      vector<int> path;
      void backtracking(vector<int>& candidates, int target, int sum, int startIndex) {
          if (sum == target) {
              result.push_back(path);
          }
          // 如果 sum + candidates[i] > target 就终止遍历
          for (int i = startIndex; i < candidates.size() && sum + candidates[i] <= target; i++) {
              sum += candidates[i];
              path.push_back(candidates[i]);
              backtracking(candidates, target, sum, i + 1);
              sum -= candidates[i];
              path.pop_back();

          }
      }
  public:
      int findTargetSumWays(vector<int>& nums, int S) {
          int sum = 0;
          for (int i = 0; i < nums.size(); i++) sum += nums[i];
          if (S > sum) return 0; // 此时没有方案
          if ((S + sum) % 2) return 0; // 此时没有方案，两个int相加的时候要格外小心数值溢出的问题
          int bagSize = (S + sum) / 2; // 转变为组合总和问题，bagsize就是要求的和

          // 以下为回溯法代码
          result.clear();
          path.clear();
          sort(nums.begin(), nums.end()); // 需要排序
          backtracking(nums, bagSize, 0, 0);
          return result.size();
      }
  };
  ```

- 实际上，可以看作现在的物品有 nums 和 -nums，问是否能够正好装满 target，并返回所有装满的情况的个数；但是这样思考有个问题，需要正好选 n 个物品（每个原始数必须选且仅选其一：要么 + num，要么 - num），但该思路直接实现会有冗余（负数容量、互斥选项），效率低于数学推导后的 01 背包解法

- 假设加法的总和为 x，那么减法对应的总和就是 sum - x，所以要求的是 x - (sum - x) = target，即 x = (target + sum) / 2

- 此时问题就转化为用 nums 装满容量为 x 的背包，有几种方法

- 确定 dp 数组以及下标的含义：`dp[i][j]` 表示使用下标为 [0, i] 的 nums[i] 能够凑满 j（包括 j ）这么大容量的包，有`dp[i][j]` 种方法

- 确定递推公式
  - 这里需要累加数目：`dp[i][j] = dp[i-1][j] + dp[i-1][j - nums[i-1]]`
  - 注意到 `j - nums[i]` 作为数组下标，那么如果 `j - nums[i]` 小于零怎么办？说明背包容量放不下物品，此时 `dp[i][j]=dp[i-1][j]`

- 初始化 dp 数组
  - 对于 `dp[i][0]`，都是只有一种方法，即不放置，故 `dp[i][0]=1`
  - 如果物品数值就是 0 呢？需要统计数组里物品数值为 0 的个数，然后按照组合数量求，初始化为 $2^t$

- 代码实现

  ```cpp
  class Solution {
  public:
      int findTargetSumWays(vector<int>& nums, int target) {
          int sum = 0;
          for (int i = 0; i < nums.size(); i++) sum += nums[i];
          if (abs(target) > sum) return 0; // 此时没有方案
          if ((target + sum) % 2 == 1) return 0; // 此时没有方案
          int bagSize = (target + sum) / 2;

          vector<vector<int>> dp(nums.size(), vector<int>(bagSize + 1, 0));

          // 初始化最上行
          if (nums[0] <= bagSize) dp[0][nums[0]] = 1;

          // 初始化最左列，最左列其他数值在递推公式中就完成了赋值
          dp[0][0] = 1;

          int numZero = 0;
          for (int i = 0; i < nums.size(); i++) {
              if (nums[i] == 0) numZero++;
              dp[i][0] = (int) pow(2.0, numZero);
          }

          // 以下遍历顺序行列可以颠倒
          for (int i = 1; i < nums.size(); i++) { // 行，遍历物品
              for (int j = 0; j <= bagSize; j++) { // 列，遍历背包
                  if (nums[i] > j) dp[i][j] = dp[i - 1][j];
                  else dp[i][j] = dp[i - 1][j] + dp[i - 1][j - nums[i]];
              }
          }
          return dp[nums.size() - 1][bagSize];
      }
  };
  ```

- 一维数组

- 确定递推公式
  - 二维DP数组递推公式： `dp[i][j] = dp[i - 1][j] + dp[i - 1][j - nums[i]];`
  - 去掉维度 i 之后，递推公式：`dp[j] = dp[j] + dp[j - nums[i]]` ，即：`dp[j] += dp[j - nums[i]]`

- 初始化：`dp[0]=1`

- 代码实现

  ```cpp
  class Solution {
  public:
      int findTargetSumWays(vector<int>& nums, int target) {
          int sum = 0;
          for (int i = 0; i < nums.size(); i++) sum += nums[i];
          if (abs(target) > sum) return 0; // 此时没有方案
          if ((target + sum) % 2 == 1) return 0; // 此时没有方案
          int bagSize = (target + sum) / 2;
          vector<int> dp(bagSize + 1, 0);
          dp[0] = 1;
          for (int i = 0; i < nums.size(); i++) {
              for (int j = bagSize; j >= nums[i]; j--) {
                  dp[j] += dp[j - nums[i]];
              }
          }
          return dp[bagSize];
      }
  };
  ```

- 参考题目
  - [494. 目标和](https://leetcode.cn/problems/target-sum/)
  - [282. 给表达式添加运算符](https://leetcode.cn/problems/expression-add-operators/)
  - [2787. 将一个数字表示成幂的和的方案数](https://leetcode.cn/problems/ways-to-express-an-integer-as-sum-of-powers/description/)

### 一和零

- 给你一个二进制字符串数组 `strs` 和两个整数 `m` 和 `n`

- 请你找出并返回 `strs` 的最大子集的长度，该子集中最多有 `m` 个 `0` 和 `n` 个 `1`

- 如果 `x` 的所有元素也是 `y` 的元素，集合 `x` 是集合 `y` 的子集

- 示例 1：

  ```
  输入：strs = ["10", "0001", "111001", "1", "0"], m = 5, n = 3
  输出：4
  解释：最多有 5 个 0 和 3 个 1 的最大子集是 {"10","0001","1","0"} ，因此答案是 4 。
  其他满足题意但较小的子集包括 {"0001","1"} 和 {"10","1","0"} 。{"111001"} 不满足题意，因为它含 4 个 1 ，大于 n 的值 3 。
  ```

- 示例 2：

  ```
  输入：strs = ["10", "0", "1"], m = 1, n = 1
  输出：2
  解释：最大的子集是 {"0", "1"} ，所以答案是 2 。
  ```

- 即背包中最多装 m 个 0 和 n 个 1，而每个物品 i 包含 one[i] 个 1 和 zero[i] 个 0，求最多能装多少个物品，可见物品的价值为 1

- 这应该是一个三维 dp 数组：`dp[i][j][k]` 表示在下标为 0~i 的数组中，最多有 j 个 0 和 k 个 1 的背包的最大价值

- 递推公式：`dp[i][j][k]=max(dp[i-1][j][k],dp[i-1][j-zero[i]][k-one[i]]`

- 初始 dp 数组：`dp[i][0][0]=0`，同时根据 zero[0] 和 one[0] 初始化 `dp[0][j][k]`

- 代码实现

  ```cpp
  class Solution {
  public:
      int findMaxForm(vector<string>& strs, int m, int n) {
          int num_of_str = strs.size();

  		vector<vector<vector<int>>> dp(num_of_str, vector<vector<int>>(m + 1,vector<int>(n + 1, 0)));

  		/* 	dp[i][j][k] represents, if choosing items among strs[0] to strs[i] to form a subset,
  			what is the maximum size of this subset such that there are no more than m 0's and n 1's in this subset.
  			Each entry of dp[i][j][k] is initialized with 0

  			transition formula:
  			using x[i] to indicates the number of 0's in strs[i]
  			using y[i] to indicates the number of 1's in strs[i]

  			dp[i][j][k] = max(dp[i-1][j][k], dp[i-1][j - x[i]][k - y[i]] + 1)

  		*/

  		// num_of_zeros records the number of 0's for each str
  		// num_of_ones records the number of 1's for each str
  		// find the number of 0's and the number of 1's for each str in strs
  		vector<int> num_of_zeros;
  		vector<int> num_of_ones;
  		for (auto& str : strs){
  			int count_of_zero = 0;
  			int count_of_one = 0;
  			for (char &c : str){
  				if(c == '0') count_of_zero ++;
  				else count_of_one ++;
  			}
  			num_of_zeros.push_back(count_of_zero);
  			num_of_ones.push_back(count_of_one);

  		}

  		// num_of_zeros[0] indicates the number of 0's for str[0]
  		// num_of_ones[0] indiates the number of 1's for str[1]

  		// initialize the 1st plane of dp[i][j][k], i.e., dp[0][j][k]
  		// if num_of_zeros[0] > m or num_of_ones[0] > n, no need to further initialize dp[0][j][k],
  		// because they have been intialized to 0 previously
  		if(num_of_zeros[0] <= m && num_of_ones[0] <= n){
  			// for j < num_of_zeros[0] or k < num_of_ones[0], dp[0][j][k] = 0
  			for(int j = num_of_zeros[0]; j <= m; j++){
  				for(int k = num_of_ones[0]; k <= n; k++){
  					dp[0][j][k] = 1;
  				}
  			}
  		}

  		/*	if j - num_of_zeros[i] >= 0 and k - num_of_ones[i] >= 0:
  				dp[i][j][k] = max(dp[i-1][j][k], dp[i-1][j - num_of_zeros[i]][k - num_of_ones[i]] + 1)
  			else:
  				dp[i][j][k] = dp[i-1][j][k]
  		*/

  		for (int i = 1; i < num_of_str; i++){
  			int count_of_zeros = num_of_zeros[i];
  			int count_of_ones = num_of_ones[i];
  			for (int j = 0; j <= m; j++){
  				for (int k = 0; k <= n; k++){
  					if( j < count_of_zeros || k < count_of_ones){
  						dp[i][j][k] = dp[i-1][j][k];
  					}else{
  						dp[i][j][k] = max(dp[i-1][j][k], dp[i-1][j - count_of_zeros][k - count_of_ones] + 1);
  					}
  				}
  			}

  		}

  		return dp[num_of_str-1][m][n];

  	  }
  };
  ```

- 对其进行降维，得到二维 dp 数组：`dp[i][j]` 表示最多有 i个 0 和 j 个 1 的 strs 的最大子集的大小为 `dp[i][j]`

- 递推公式：`dp[i][j] = max(dp[i][j], dp[i - zeroNum][j - oneNum] + 1)`，其中每个字符串的价值都是 1，因此可以简写为 1

- 代码实现

  ```cpp
  class Solution {
  public:
      int findMaxForm(vector<string>& strs, int m, int n) {
          vector<vector<int>> dp(m + 1, vector<int> (n + 1, 0)); // 默认初始化0
          for (string str : strs) { // 遍历物品
              int oneNum = 0, zeroNum = 0;
              for (char c : str) {
                  if (c == '0') zeroNum++;
                  else oneNum++;
              }
              for (int i = m; i >= zeroNum; i--) { // 遍历背包容量且从后向前遍历！
                  for (int j = n; j >= oneNum; j--) {
                      dp[i][j] = max(dp[i][j], dp[i - zeroNum][j - oneNum] + 1);
                  }
              }
          }
          return dp[m][n];
      }
  };
  ```

- 参考题目
  - [474. 一和零](https://leetcode.cn/problems/ones-and-zeroes/description/)
  - [2155. 分组得分最高的所有下标](https://leetcode.cn/problems/all-divisions-with-the-highest-score-of-a-binary-array/)
  - [600. 不含连续1的非负整数](https://leetcode.cn/problems/non-negative-integers-without-consecutive-ones/description/)

## 完全背包

### 二维完全背包

- 有 N 件物品和一个最多能背重量为 W 的背包。第 i 件物品的重量是 weight[i]，得到的价值是 value[i]

- 每件物品都有无限个（也就是可以放入背包多次），求解将哪些物品装入背包里物品价值总和最大

- 完全背包和 01 背包问题唯一不同的地方就是，每种物品有无限个

- 确定dp数组以及下标的含义：`dp[i][j]` 表示从下标为 [0-i] 的物品，每个物品可以取无限次，放进容量为 j 的背包，价值总和最大是多少

- 递推公式：`dp[i][j] = max(dp[i-1][j], dp[i][j - weight[i]] + value[i])`

- 与 01 背包不同的是，当选取物品 i 时，其价值应该是 `dp[i][j - weight[i]] + value[i]` 而不是 `dp[i-1][j - weight[i]] + value[i]`，这是因为物品 i 是可以重复选取的

- 初始化 dp 数组
  - 如果背包容量 j 为 0，那么 `dp[i][0]=0`
  - 从状态转移方程 `dp[i][j] = max(dp[i - 1][j], dp[i][j - weight[i]] + value[i]);` 可以看出有一个方向 i 是由 i-1 推导出来，那么 i 为 0 的时候就一定要初始化
  - `dp[0][j]`，即：存放编号 0 的物品的时候，各个容量的背包所能存放的最大价值，那么很明显当 `j < weight[0]` 的时候，`dp[0][j]` 应该是 0，因为背包容量比编号 0 的物品重量还小；当`j >= weight[0] `时，`dp[0][j]` 如果能放下 weight[0] ，就一直假如物品 0，每一种物品有无限个

- 确定遍历顺序：先遍历物品再遍历背包或先遍历背包再遍历物品都可以

- 代码实现

  ```cpp
  #include <iostream>
  #include <vector>
  using namespace std;

  int main() {
      int n, bagWeight;
      int w, v;
      cin >> n >> bagWeight;
      vector<int> weight(n);
      vector<int> value(n);
      for (int i = 0; i < n; i++) {
          cin >> weight[i] >> value[i];
      }

      vector<vector<int>> dp(n, vector<int>(bagWeight + 1, 0));

      // 初始化
      for (int j = weight[0]; j <= bagWeight; j++)
          dp[0][j] = dp[0][j - weight[0]] + value[0];

      for (int i = 1; i < n; i++) { // 遍历物品
          for(int j = 0; j <= bagWeight; j++) { // 遍历背包容量
              if (j < weight[i]) dp[i][j] = dp[i - 1][j];
              else dp[i][j] = max(dp[i - 1][j], dp[i][j - weight[i]] + value[i]);
          }
      }

      cout << dp[n - 1][bagWeight] << endl;

      return 0;
  }
  ```

- 相关题目
  - [52. 携带研究材料（第七期模拟笔试）](https://kamacoder.com/problempage.php?pid=1052)

### 一维完全背包

- 二维完全背包的核心递推公式：

  ```
  dp[i][j] = max(dp[i-1][j], dp[i][j - weight[i]] + value[i])
  ```

- `dp[i][j]`表示前 `i` 个物品、容量 `j`的背包能装的最大价值，完全背包允许物品重复选，因此选物品 `i` 时依赖当前层`dp[i][j - weight[i]]` 而非上一层

- 状态拷贝简化：若先将上一层 `dp[i-1]` 的所有值完整拷贝到当前层 `dp[i]`，则 `dp[i-1][j]` 等价于拷贝后的 `dp[i][j]`，此时递推公式可改写为：

  ```
  dp[i][j] = max(dp[i][j], dp[i][j - weight[i]] + value[i])
  ```

- 该拷贝不会导致数值覆盖 —— 因为拷贝时当前层 `dp[i][j]` 尚未进行任何计算，处于 “空状态”，拷贝的 `dp[i-1][j]` 是当前层的初始值，而非已更新的结果

- 一维数组压缩（滚动数组）：既然 `dp[i][j]` 仅依赖当前层`dp[i][...] `的状态，无需保留 “物品维度 `i` ”，直接去掉层数维度，得到一维完全背包的递推公式：

  ```
  dp[j] = max(dp[j], dp[j - weight[i]] + value[i])
  ```

- 一维`dp[j]`表示容量`j`的背包能装的最大价值，通过正序遍历背包容量，自然实现 “当前层状态复用”，满足完全背包物品可重复选的需求

- 在纯完全背包问题中，物品和背包遍历顺序可以互换
  - 完全背包允许物品重复选，正序遍历的本质是：计算 `dp[j]` 时，`dp[j - weight[i]] `已经是当前物品更新后的状态（即已选过该物品的状态）

  - 因此，无论先遍历物品、后遍历背包，还是先遍历背包、后遍历物品，最终都是让 “每个物品能被重复选取，且所有物品的组合都能被覆盖”

  - 先物品后背包

    ```cpp
    for (int i = 0; i < weight.size(); i++) { // 物品
        for (int j = weight[i]; j <= bagSize; j++) { // 背包正序
            dp[j] = max(dp[j], dp[j - weight[i]] + value[i]);
        }
    }
    ```

  - 先背包后物品

    ```cpp
    for (int j = 0; j <= bagSize; j++) { // 背包
        for (int i = 0; i < weight.size(); i++) { // 物品
            if (j >= weight[i]) {
                dp[j] = max(dp[j], dp[j - weight[i]] + value[i]);
            }
        }
    }
    ```

- 在 01 背包中，必须先遍历物品再遍历背包
  - 01 背包要求物品仅选一次，倒序遍历的本质是：计算 `dp[j]` 时，`dp[j - weight[i]]` 仍是上一层（未选当前物品）的状态
  - 因此，若颠倒顺序（先背包，后物品），会导致 “每个容量 `j` 只能选一个物品”，无法实现多物品组合
  - 如果先背包，后物品，对每个容量 `j`，依次尝试放入所有物品，但由于倒序遍历的限制（`j` 从 0 到`bagSize`，无法倒序），最终 `dp[j]` 只会保留 “放入单个物品的最大价值”，而非多个物品的组合价值
  - 举例：`weight=[1,2], value=[3,4], bagSize=3`，错误顺序下 `dp[3] `会是 `4`（仅选物品 2），而非正确的 `7`（选物品 1+2）
  - 01 背包的核心是 “物品仅选一次”，倒序遍历要求 “先固定物品，再更新所有容量”—— 若先遍历背包，每个容量`j`只能独立尝试放入单个物品，无法叠加多个物品的选择，导致组合失效

- 代码实现

  ```cpp
  #include <iostream>
  #include <vector>
  using namespace std;

  int main() {
      int N, bagWeight;
      cin >> N >> bagWeight;
      vector<int> weight(N, 0);
      vector<int> value(N, 0);
      for (int i = 0; i < N; i++) {
          int w;
          int v;
          cin >> w >> v;
          weight[i] = w;
          value[i] = v;
      }

      vector<int> dp(bagWeight + 1, 0);
      for(int j = 0; j <= bagWeight; j++) { // 遍历背包容量
          for(int i = 0; i < weight.size(); i++) { // 遍历物品
              if (j - weight[i] >= 0) dp[j] = max(dp[j], dp[j - weight[i]] + value[i]);
          }
      }
      cout << dp[bagWeight] << endl;

      return 0;
  }
  ```

### 零钱兑换 II

- 给你一个整数数组 `coins` 表示不同面额的硬币，另给一个整数 `amount` 表示总金额

- 请你计算并返回可以凑成总金额的硬币组合数。如果任何硬币组合都无法凑出总金额，返回 `0`

- 假设每一种面额的硬币有无限个，题目数据保证结果符合 32 位带符号整数

- 可见，这个问题是，不同面额的硬币各有无数个，求能够用这些硬币正好装满背包容量为 amount 的组合数有多少个

- 注意，这里需要的是组合数，对于 5=2+2+1 和 5=2+1+2 这是一种组合，如果是排列，那么就是两种排列

- 首先，使用二维 dp 实现

- dp 数组的定义：`dp[i][j]` 表示使用下标为 0~i 的面额，正好装满背包容量为 j 的背包的组合数

- 确定递推公式：`dp[i][j] = dp[i - 1][j] + dp[i][j - nums[i]]`

- 初始化 dp 数组
  - `dp[0][0]=0`
  - `dp[0][j]`：`if (j % coins[0] == 0) dp[0][j] = 1;`
  - `dp[i][0]=1`

- 代码实现

  ```cpp
  class Solution {
  public:
      int change(int amount, vector<int>& coins) {
          int bagSize = amount;

          vector<vector<uint64_t>> dp(coins.size(), vector<uint64_t>(bagSize + 1, 0));

          // 初始化最上行
          for (int j = 0; j <= bagSize; j++) {
              if (j % coins[0] == 0) dp[0][j] = 1;
          }
          // 初始化最左列
          for (int i = 0; i < coins.size(); i++) {
              dp[i][0] = 1;
          }
          // 以下遍历顺序行列可以颠倒
          for (int i = 1; i < coins.size(); i++) { // 行，遍历物品
              for (int j = 0; j <= bagSize; j++) { // 列，遍历背包
                  if (coins[i] > j) dp[i][j] = dp[i - 1][j];
                  else dp[i][j] = dp[i - 1][j] +  dp[i][j - coins[i]];
              }
          }
          return dp[coins.size() - 1][bagSize];
      }
  };

  ```

- 接下来压缩为一维 dp

- dp 数组的含义：dp[j] 表示凑成总金额 j 的货币组合数为 dp[j]

- 二维dp 递推公式： `dp[i][j] = dp[i - 1][j] + dp[i][j - coins[i]]`

- 压缩成一维：`dp[j] += dp[j - coins[i]]`

- 初始化：装满背包容量为 0 的方法是 1，即不放任何物品，`dp[0] = 1`

- 在纯完全背包问题中，求得装满背包的最大价值是多少，和凑成总和的元素的顺序没有关系；但是本题要求凑成总和的组合数，元素之间明确要求没有顺序，因此遍历的顺序不能随便更改

- 对于外层遍历物品，内层遍历背包的情况

  ```cpp
  for (int i = 0; i < coins.size(); i++) { // 遍历物品
      for (int j = coins[i]; j <= amount; j++) { // 遍历背包容量
          dp[j] += dp[j - coins[i]];
      }
  }
  ```

- 以 coins=[1,5]，amount=6 为例
  - 第一步：先遍历物品`1`，更新所有金额`j≥1`的`dp[j]`：`dp[1]=1`（[1]）、`dp[2]=1`（[1,1]）、…、`dp[6]=1`（[1,1,1,1,1,1]）；
  - 第二步：再遍历物品`5`，更新所有金额`j≥5`的`dp[j]`：
    - `dp[5] = dp[5] + dp[0] = 1 + 1 = 2`（[1×5]、[5]）；
    - `dp[6] = dp[6] + dp[1] = 1 + 1 = 2`（[1×6]、[1+5]）；
  - 结果：`dp[6]=2`，仅包含`{1,5}`（先1后5），不包含{5,1}（先5后1）——因为物品遍历是“先1后5”，且每个物品的更新是独立的，不会回头重新组合，因此是「组合数」（顺序无关，{1,5}和{5,1}视为同一种）

- 而对于先遍历背包，再遍历物品的情况，同样以 coins=[1,5]，amount=6 为例
  - 遍历金额`j=1`：依次尝试物品`1`和`5`，仅`1`有效 → `dp[1] = dp[0] = 1`（[1]）；
  - 遍历金额`j=5`：
    - 先尝试物品`1` → `dp[5] += dp[4] = 1`（[1×5]）；
    - 再尝试物品`5` → `dp[5] += dp[0] = 1` → 最终`dp[5]=2`（[1×5]、[5]）；
  - 遍历金额`j=6`：
    - 先尝试物品`1` → `dp[6] += dp[5] = 2`（[1×6]、[1+5]）；
    - 再尝试物品`5` → `dp[6] += dp[1] = 1`（[5+1]）；
    - 最终`dp[6] = 3`（[1×6]、[1+5]、[5+1]）；
  - 结果：`dp[6]=3`，包含`{1,5}`和`{5,1}`两种顺序——因为每个金额会“反复尝试所有物品”，物品选取顺序被计入，因此是「排列数」（顺序相关，{1,5}和{5,1}视为不同种）

- 其关键区别在于，外层物品、内层背包中每个物品只被 “批量处理一次”，后续物品基于前序结果叠加；外层背包、内层物品中每个金额都 “遍历所有物品”，物品可按任意顺序选取

- 因此，如果求组合数就是外层for循环遍历物品，内层for遍历背包；如果求排列数就是外层for遍历背包，内层for循环遍历物品

- 完整代码如下

  ```cpp
  class Solution {
  public:
      int change(int amount, vector<int>& coins) {
          vector<uint64_t> dp(amount + 1, 0); // 防止相加数据超int
          dp[0] = 1; // 只有一种方式达到0
          for (int i = 0; i < coins.size(); i++) { // 遍历物品
              for (int j = coins[i]; j <= amount; j++) { // 遍历背包
                  dp[j] += dp[j - coins[i]];
              }
          }
          return dp[amount]; // 返回组合数
      }
  };
  ```

- 为了防止相加的数据超 int 也可以这么写

  ```cpp
  class Solution {
  public:
      int change(int amount, vector<int>& coins) {
          vector<int> dp(amount + 1, 0);
          dp[0] = 1; // 只有一种方式达到0
          for (int i = 0; i < coins.size(); i++) { // 遍历物品
              for (int j = coins[i]; j <= amount; j++) { // 遍历背包
                  if (dp[j] < INT_MAX - dp[j - coins[i]]) { //防止相加数据超int
                      dp[j] += dp[j - coins[i]];
                  }
              }
          }
          return dp[amount]; // 返回组合数
      }
  };
  ```

- 参考题目
  - [322. 零钱兑换](https://leetcode.cn/problems/coin-change/description/)
  - [518. 零钱兑换 II](https://leetcode.cn/problems/coin-change-ii/)
  - [2218. 从栈中取出 K 个硬币的最大面值和](https://leetcode.cn/problems/maximum-value-of-k-coins-from-piles/)
  - [3592. 硬币面值还原](https://leetcode.cn/problems/inverse-coin-change/)
  - [2585. 获得分数的方法数](https://leetcode.cn/problems/number-of-ways-to-earn-points/description/)
  - [2902. 和带限制的子多重集合的数目](https://leetcode.cn/problems/count-of-sub-multisets-with-bounded-sum/description/)
  - [2915. 和为目标值的最长子序列的长度](https://leetcode.cn/problems/length-of-the-longest-subsequence-that-sums-to-target/description/)

### 组合总和 IV

- 给你一个由不同整数组成的数组 `nums` ，和一个目标整数 `target` 。请从 `nums` 中找出并返回总和为 `target` 的元素排列的个数；题目数据保证答案符合 32 位整数范围

- 这道题和零钱兑换 II 一脉相承，区别就是求排列

- dp 数组的含义：dp[i] 表示凑成目标正整数为 i 的排列个数为 dp[i]

- 递推公式：`dp[i] += dp[i - nums[j]]`

- 初始化 dp 数组：`dp[0]=1`，其他初始化为 0

- 遍历顺序：target（背包）放在外循环，将nums（物品）放在内循环，内循环从前到后遍历

- 代码实现

  ```cpp
  class Solution {
  public:
      int combinationSum4(vector<int>& nums, int target) {
          vector<int> dp(target + 1, 0);
          dp[0] = 1;
          for (int i = 0; i <= target; i++) { // 遍历背包
              for (int j = 0; j < nums.size(); j++) { // 遍历物品
                  if (i - nums[j] >= 0 && dp[i] <= INT_MAX - dp[i - nums[j]]) {
                      dp[i] += dp[i - nums[j]];
                  }
              }
          }
          return dp[target];
      }
  };
  ```

- 相关题目
  - [377. 组合总和 Ⅳ](https://leetcode.cn/problems/combination-sum-iv/)
  - [2787. 将一个数字表示成幂的和的方案数](https://leetcode.cn/problems/ways-to-express-an-integer-as-sum-of-powers/)

### 零钱兑换

- 给定不同面额的硬币 coins 和一个总金额 amount。编写一个函数来计算可以凑成总金额所需的最少的硬币个数。如果没有任何一种硬币组合能组成总金额，返回 -1

- 与零钱兑换 II 相比，这里要求的是最少硬币个数

- 确定dp数组以及下标的含义：dp[j] 表示凑足总额为 j 所需钱币的最少个数为 dp[j]

- 递推公式：`dp[j]=min(dp[j-coins[i]]+1,dp[j])`

- 初始化：`dp[0]=0`，考虑到递推是在求最小值，其他元素应该初始化为 `INT_MAX`

- 遍历顺序：不要求组合还是排列，因此内外层循环无要求

- 代码实现

  ```cpp
  class Solution {
  public:
      int coinChange(vector<int>& coins, int amount) {
          vector<int> dp(amount + 1, INT_MAX);
          dp[0] = 0;
          for (int i = 0; i < coins.size(); i++) { // 遍历物品
              for (int j = coins[i]; j <= amount; j++) { // 遍历背包
                  if (dp[j - coins[i]] != INT_MAX) { // 如果dp[j - coins[i]]是初始值则跳过
                      dp[j] = min(dp[j - coins[i]] + 1, dp[j]);
                  }
              }
          }
          if (dp[amount] == INT_MAX) return -1;
          return dp[amount];
      }
  };
  ```

### 爬楼梯

- 假设你正在爬楼梯。需要 n 阶你才能到达楼顶

- 每次你可以爬至多 m (1 <= m < n)个台阶。你有多少种不同的方法可以爬到楼顶呢？

- 注意：给定 n 是一个正整数

- 这是一个背包问题，每次可以选择 1-m 的物品（台阶），可以无限选择，最终到达 n 的背包（楼顶）

- 确定dp数组以及下标的含义：dp[i] 表示爬到有 i 个台阶的楼顶，有 dp[i] 种方法

- 确定递推公式：`dp[i]+=dp[i-j]`

- 初始化 dp 数组：`dp[0]=1`

- 遍历顺序：这是一个排列问题，因为先爬 1、2步和爬 2、1 步是不一样的，因此需要将背包放在外循环，物品放在内循环

- 代码实现

  ```cpp
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      int n, m;
      while (cin >> n >> m) {
          vector<int> dp(n + 1, 0);
          dp[0] = 1;
          for (int i = 1; i <= n; i++) { // 遍历背包
              for (int j = 1; j <= m; j++) { // 遍历物品
                  if (i - j >= 0) dp[i] += dp[i - j];
              }
          }
          cout << dp[n] << endl;
      }
  }
  ```

- 参考题目
  - [57. 爬楼梯（第八期模拟笔试）](https://kamacoder.com/problempage.php?pid=1067)

### 完全平方数

- 给你一个整数 n ，返回和为 n 的完全平方数的最少数量

- 完全平方数是一个整数，其值等于另一个整数的平方；换句话说，其值等于一个整数自乘的积。例如，1、4、9 和 16 都是完全平方数，而 3 和 11 不是

- 其中，`1 <= n <= 10^4`

- 因此，可以选择的物品就是 1^2 到 100^2 共100个数字，背包大小为 n

- 确定 dp 数组以及下标的含义：dp[j] 表示和为 n 所需完全平方数的最少数量为 dp[j]

- 递推公式：`dp[j]=min(dp[j-i*i]+1,dp[j])`

- 初始化：`dp[0]=0`，考虑到递推是在求最小值，其他元素应该初始化为 `INT_MAX`

- 遍历顺序：不要求组合还是排列，因此内外层循环无要求

- 代码实现

  ```cpp
  class Solution {
  public:
      int numSquares(int n) {
          vector<int> dp(n + 1, INT_MAX);
          dp[0] = 0;
          for (int i = 0; i <= n; i++) { // 遍历背包
              for (int j = 1; j * j <= i; j++) { // 遍历物品
                  dp[i] = min(dp[i - j * j] + 1, dp[i]);
              }
          }
          return dp[n];
      }
  };
  ```

- 参考题目
  - [279. 完全平方数](https://leetcode.cn/problems/perfect-squares/description/)
  - [204. 计数质数](https://leetcode.cn/problems/count-primes/description/)
  - [263. 丑数](https://leetcode.cn/problems/ugly-number/description/)
  - [264. 丑数 II](https://leetcode.cn/problems/ugly-number-ii/description/)
  - [2787. 将一个数字表示成幂的和的方案数](https://leetcode.cn/problems/ways-to-express-an-integer-as-sum-of-powers/description/)

## 分组背包

- 基本问题定义
  - 有 n 件物品，被分为 k 组，每组内的物品最多选 1 件（也可以不选）
  - 每件物品有：体积 w[i]、价值 v[i]
  - 背包容量为 V，求在不超过容量的前提下能装的最大价值

- 二维 DP 定义：`dp[i][j] = 前 i 组，背包容量 j 时的最大价值`

- 对第 i 组，有两种选择：
  - 不选这组任何物品：`dp[i][j] = dp[i-1][j]`
  - 选这组里某一个物品 t：`dp[i][j] = max(dp[i-1][j- w[t]] + v[t])`

- 状态转移

  ```text
  dp[i][j] = max( 不选, 选组内第1个, 选组内第2个, ... )
  ```

- 完整代码

  ```cpp
  // groups[i] 表示第 i 组的物品列表 {w, v}
  int groupKnapsack(vector<vector<pair<int, int>>>& groups, int C) {
      int n = groups.size();
     vector<vector<int>> dp(n + 1, vector<int>(C + 1, 0));

      for (int i = 1; i <= n; ++i) {          // 枚举每组
          for (int j = 0; j <= C; ++j) {       // 枚举容量
              // 先继承：不选第i组
              dp[i][j] = dp[i-1][j];

              // 尝试选组内每个物品
              for (auto& [w, v] : groups[i-1]) {
                  if (j >= w) {
                      dp[i][j] = max(dp[i][j], dp[i-1][j - w] + v);
                  }
              }
          }
      }

      return dp[n][C];
  }
  ```

- `dp[i][j] 只依赖 dp[i-1][...]`，也就是只依赖上一层，因此可以只用一维数组，通过遍历方向控制保留上一层状态

- 一维 DP 定义：`dp[j] = 容量 j 时的最大价值`

- 遍历思路
  - 遍历每一组
  - 逆序遍历背包容量（同 01 背包，防止重复选）
  - 遍历组内每个物品，尝试选它

- 倒序原因：保证每个状态用的是 上一组的旧值，防止同组物品被重复选择

- 代码实现

  ```cpp
  int groupKnapsack(vector<vector<pair<int, int>>>& groups, int C) {
      vector<int> dp(C + 1, 0);

      for (auto& group : groups) {        // 每组
          for (int j = C; j >= 0; --j) {  // 倒序！
              for (auto& [w, v] : group) {// 组内物品
                  if (j >= w) {
                      dp[j] = max(dp[j], dp[j - w] + v);
                  }
              }
          }
      }

      return dp[C];
  }
  ```

### 最小化目标值与所选元素的差

- [最小化目标值与所选元素的差](https://leetcode.cn/problems/minimize-the-difference-between-target-and-chosen-elements/)

## 多重背包

### 多重背包

- 有 N 种物品和一个容量为 V 的背包。第 i 种物品最多有 Mi 件可用，每件耗费的空间是 Ci ，价值是 Wi

- 求解将哪些物品装入背包可使这些物品的耗费的空间总和不超过背包容量，且价值总和最大

- 多重背包和 01 背包是非常像的，因为每件物品最多有 Mi 件可用，把 Mi 件摊开，其实就是一个 01 背包问题

- 示例代码

  ```cpp
  #include<iostream>
  #include<vector>
  using namespace std;
  int main() {
      int bagWeight,n;
      cin >> bagWeight >> n;
      vector<int> weight(n, 0);
      vector<int> value(n, 0);
      vector<int> nums(n, 0);
      for (int i = 0; i < n; i++) cin >> weight[i];
      for (int i = 0; i < n; i++) cin >> value[i];
      for (int i = 0; i < n; i++) cin >> nums[i];

      for (int i = 0; i < n; i++) {
          while (nums[i] > 1) { // 物品数量不是一的，都展开
              weight.push_back(weight[i]);
              value.push_back(value[i]);
              nums[i]--;
          }
      }

      vector<int> dp(bagWeight + 1, 0);
      for(int i = 0; i < weight.size(); i++) { // 遍历物品，注意此时的物品数量不是n
          for(int j = bagWeight; j >= weight[i]; j--) { // 遍历背包容量
              dp[j] = max(dp[j], dp[j - weight[i]] + value[i]);
          }
      }
      cout << dp[bagWeight] << endl;
  }
  ```

- 这种方法存在一个问题，假如物品数量很多，此时将其展开时，vector 底层进行扩容操作十分耗时，可以采用以下方式

  ```cpp
  #include<iostream>
  #include<vector>
  using namespace std;
  int main() {
      int bagWeight,n;
      cin >> bagWeight >> n;
      vector<int> weight(n, 0);
      vector<int> value(n, 0);
      vector<int> nums(n, 0);
      for (int i = 0; i < n; i++) cin >> weight[i];
      for (int i = 0; i < n; i++) cin >> value[i];
      for (int i = 0; i < n; i++) cin >> nums[i];

      vector<int> dp(bagWeight + 1, 0);

      for(int i = 0; i < n; i++) { // 遍历物品
          for(int j = bagWeight; j >= weight[i]; j--) { // 遍历背包容量
              // 以上为01背包，然后加一个遍历个数
              for (int k = 1; k <= nums[i] && (j - k * weight[i]) >= 0; k++) { // 遍历个数
                  dp[j] = max(dp[j], dp[j - k * weight[i]] + k * value[i]);
              }
          }
      }

      cout << dp[bagWeight] << endl;
  }
  ```

- 多重背包问题中，每个物品有`nums[i]`个，直接遍历每个数量会导致时间复杂度较高（O (背包容量 × 总物品数量)）

- 二进制优化的核心是：将`nums[i]`个相同物品拆分成若干组（每组对应不同数量的该物品），每组视为一个 “新物品”（只能选或不选，符合 01 背包规则），拆分规则是用 2 的幂次（1,2,4,8...）来组合出 1~nums [i] 的所有数量，最后剩下的余数单独作为一组

- 例如：nums [i]=10，拆分为 1+2+4+3，这 4 组数可以组合出 1~10 的任意数量

- 示例代码

  ```cpp
  #include<iostream>
  #include<vector>
  using namespace std;

  int main() {
      int bagWeight, n;
      cin >> bagWeight >> n;

      // 存储拆分后的新物品的重量和价值
      vector<int> new_weight;
      vector<int> new_value;

      // 读取原始物品信息并进行二进制拆分
      for (int i = 0; i < n; i++) {
          int weight, value, nums;
          cin >> weight >> value >> nums;

          // 二进制拆分核心逻辑
          int k = 1; // 初始拆分数量为1（2^0）
          while (nums > k) {
              new_weight.push_back(k * weight);  // 拆分后组的重量
              new_value.push_back(k * value);    // 拆分后组的价值
              nums -= k;  // 剩余数量减去已拆分的k
              k *= 2;     // 下一次拆分数量翻倍（2^1,2^2...）
          }
          // 处理最后剩下的余数
          new_weight.push_back(nums * weight);
          new_value.push_back(nums * value);
      }

      // 01背包求解（完全复用01背包逻辑）
      vector<int> dp(bagWeight + 1, 0);
      for (int i = 0; i < new_weight.size(); i++) { // 遍历拆分后的新物品
          for (int j = bagWeight; j >= new_weight[i]; j--) { // 逆序遍历背包容量
              dp[j] = max(dp[j], dp[j - new_weight[i]] + new_value[i]);
          }
      }

      cout << dp[bagWeight] << endl;
      return 0;
  }
  ```

- 将多重背包的 “遍历物品数量” 转化为 01 背包的 “拆分物品组”，时间复杂度从 O (背包容量 × 总物品数量) 降低到 O (背包容量 × 总物品数 ×log (最大数量))，效率大幅提升

- 参考题目
  - [56. 携带矿石资源（第八期模拟笔试）](https://kamacoder.com/problempage.php?pid=1066)

## 背包问题总结

- 前置定义
  - `weight[i]`：第 `i` 个物品的重量（体积）；
  - `value[i]`：第 `i`个物品的价值；
  - `bagSize`：背包最大容量；
  - 二维 `dp[i][j]`：前 `i+1 `个物品（下标`0~i`），放入容量 `j`的背包，满足目标的结果；
  - 一维 `dp[j]`：容量 `j` 的背包，满足目标的结果（滚动数组，覆盖上一层状态）
- 下面以 01 背包为例总结几种问题的递推式

- 求 “最大价值”（01 背包核心）
  - 二维递推

    ```text
    // 初始化：dp[0][j] = (j >= weight[0]) ? value[0] : 0；其余dp[i][0] = 0
    if (j < weight[i]) {
        dp[i][j] = dp[i-1][j];  // 装不下当前物品，继承上一层结果
    } else {
        dp[i][j] = max(dp[i-1][j], dp[i-1][j - weight[i]] + value[i]);
    }
    ```

  - 一维递推

    ```
    // 初始化：dp[j] = 0（价值全为正）
    for (遍历物品) {
        for (j = bagSize; j >= weight[i]; j--) {  // 背包倒序（防重复选）
            dp[j] = max(dp[j], dp[j - weight[i]] + value[i]);
        }
    }
    ```

- 求 “能否装满背包”（如分割等和子集，最后一块石头的重量）
  - 二维递推

    ```
    // 初始化：dp[0][0] = true；dp[0][j] = (j == weight[0]) ? true : false
    if (j < weight[i]) {
        dp[i][j] = dp[i-1][j];  // 装不下，继承上一层结果
    } else {
        dp[i][j] = dp[i-1][j] || dp[i-1][j - weight[i]];
    }
    ```

  - 一维递推

    ```
    // 初始化：dp[0] = true，其余dp[j] = false
    for (遍历物品) {
        for (j = bagSize; j >= weight[i]; j--) {  // 01背包倒序
            dp[j] = dp[j] || dp[j - weight[i]];
        }
    }
    ```

- 求 “有几种方法 / 方案数”（如目标和、分割等和子集）
  - 二维递推

    ```
    // 初始化：dp[0][0] = 1（前0个物品凑和为0的方案数=1）；
    // dp[0][j] = (j == weight[0]) ? 1 : 0（j=weight[0]时方案数=1，否则0）
    if (j < weight[i]) {
        dp[i][j] = dp[i-1][j];  // 装不下当前物品，继承上一层方案数
    } else {
        dp[i][j] = dp[i-1][j] + dp[i-1][j - weight[i]];
    }
    ```

  - 一维递推

    ```cpp
    // 初始化：dp[0] = 1（凑和为0的方案数=1），其余dp[j] = 0
    for (遍历物品) {
        for (j = bagSize; j >= weight[i]; j--) {  // 01背包倒序
            dp[j] += dp[j - weight[i]];  // 累加方案数（而非取max）
        }
    }
    ```

- 求 “装满背包的最小物品数”（如零钱兑换、完全平方数）
  - 二维递推

    ```
    // 初始化：dp[0][0] = 0；dp[0][j] = INF（无穷大，代表无法装满）
    if (j < weight[i]) {
        dp[i][j] = dp[i-1][j];
    } else {
        dp[i][j] = min(dp[i-1][j], dp[i-1][j - weight[i]] + 1);
    }
    ```

  - 一维递推

    ```
    // 初始化：dp[0] = 0，其余dp[j] = INF
    for (遍历物品) {
        for (j = weight[i]; j <= bagSize; j++) {  // 完全背包正序（零钱可重复选）
            if (dp[j - weight[i]] != INF) {
                dp[j] = min(dp[j], dp[j - weight[i]] + 1);
            }
        }
    }
    ```

## 线性 DP

### 单词拆分

- 给你一个字符串 `s` 和一个字符串列表 `wordDict` 作为字典。如果可以利用字典中出现的一个或多个单词拼接出 `s` 则返回 `true`

- 注意：不要求字典中出现的单词全部都使用，并且字典中的单词可以重复使用

- 回溯思路：枚举分割所有字符串，判断是否在字典里出现过

  ```cpp
  class Solution {
  private:
      bool backtracking (const string& s, const unordered_set<string>& wordSet, int startIndex) {
          if (startIndex >= s.size()) {
              return true;
          }
          for (int i = startIndex; i < s.size(); i++) {
              string word = s.substr(startIndex, i - startIndex + 1);
              if (wordSet.find(word) != wordSet.end() && backtracking(s, wordSet, i + 1)) {
                  return true;
              }
          }
          return false;
      }
  public:
      bool wordBreak(string s, vector<string>& wordDict) {
          unordered_set<string> wordSet(wordDict.begin(), wordDict.end());
          return backtracking(s, wordSet, 0);
      }
  };
  ```

- 记忆递归过程中计算的结果

  ```cpp
  class Solution {
  private:
      bool backtracking (const string& s,
              const unordered_set<string>& wordSet,
              vector<bool>& memory,
              int startIndex) {
          if (startIndex >= s.size()) {
              return true;
          }
          // 如果memory[startIndex]不是初始值了，直接使用memory[startIndex]的结果
          if (!memory[startIndex]) return memory[startIndex];
          for (int i = startIndex; i < s.size(); i++) {
              string word = s.substr(startIndex, i - startIndex + 1);
              if (wordSet.find(word) != wordSet.end() && backtracking(s, wordSet, memory, i + 1)) {
                  return true;
              }
          }
          memory[startIndex] = false; // 记录以startIndex开始的子串是不可以被拆分的
          return false;
      }
  public:
      bool wordBreak(string s, vector<string>& wordDict) {
          unordered_set<string> wordSet(wordDict.begin(), wordDict.end());
          vector<bool> memory(s.size(), 1); // -1 表示初始化状态
          return backtracking(s, wordSet, memory, 0);
      }
  };
  ```

- 实际上，单词就是物品，字符串 s 就是背包，单词能否组成字符串 s，就是问物品能不能把背包装满

- 确定dp数组以及下标的含义：dp[i] 表示字符串长度为 i 时，dp[i] 为 true，表示可以拆分为一个或多个在字典中出现的单词

- 递推公式
  - 如果 `dp[j]==true`，且 `[j,i]` 区间的子串出现在字典中，那么 `dp[i]` 一定是 true（j<i）

  - 因此递推公式为

    ```
    if([j, i]子串出现在字典里 && dp[j]==true)
    	dp[i] = true
    ```

- 如何初始化 dp 数组
  - `dp[0]=true`：表示如果字符串为空，说明出现在字典中
  - 其他非零的元素初始化为 false

- 遍历顺序：这道题求的是排列数，比如对于 applepenapple，字典为 ["apple", "pen"]，那么要求的排列应该是 "apple" + "pen" + "apple"，而 "apple" + "apple" + "pen" 或者 "pen" + "apple" + "apple" 是不可以的

- 代码示例

  ```cpp
  class Solution {
  public:
      bool wordBreak(string s, vector<string>& wordDict) {
          unordered_set<string> wordSet(wordDict.begin(), wordDict.end());
          vector<bool> dp(s.size() + 1, false);
          dp[0] = true;
          for (int i = 1; i <= s.size(); i++) {   // 遍历背包
              for (int j = 0; j < i; j++) {       // 遍历物品
                  string word = s.substr(j, i - j); //substr(起始位置，截取的个数)
                  if (wordSet.find(word) != wordSet.end() && dp[j]) {
                      dp[i] = true;
                  }
              }
          }
          return dp[s.size()];
      }
  };
  ```

- 遍历物品再遍历背包是不行的，代码如下

  ```cpp
  class Solution {
  public:
      bool wordBreak(string s, vector<string>& wordDict) {
          unordered_set<string> wordSet(wordDict.begin(), wordDict.end());
          vector<bool> dp(s.size() + 1, false);
          dp[0] = true;
          for (int j = 0; j < wordDict.size(); j++) { // 物品
              for (int i = wordDict[j].size(); i <= s.size(); i++) { // 背包
                  string word = s.substr(i - wordDict[j].size(), wordDict[j].size());
                  // cout << word << endl;
                  if ( word == wordDict[j] && dp[i - wordDict[j].size()]) {
                      dp[i] = true;
                  }
                  // for (int k = 0; k <= s.size(); k++) cout << dp[k] << " "; //这里打印 dp数组的情况
                  // cout << endl;
              }
          }
          return dp[s.size()];
      }
  };
  ```

- 参考题目
  - [139. 单词拆分](https://leetcode.cn/problems/word-break/)

### 跳跃游戏 VII

- 给你一个下标从**0**开始的二进制字符串 `s` 和两个整数 `minJump` 和 `maxJump` 。一开始，你在下标 `0` 处，且该位置的值一定为 `'0'` 。当同时满足如下条件时，你可以从下标 `i` 移动到下标 `j` 处：
  - `i + minJump <= j <= min(i + maxJump, s.length - 1)` 且
  - `s[j] == '0'`.

- 如果你可以到达 `s` 的下标 `s.length - 1` 处，请你返回 `true` ，否则返回 `false`

- 对于这道题，显然可以用动态规划解决，设 dp[i] 表示下标为 i 的位置是否可达，那么遍历 [i-max,i-min]，有一个可达，那么 dp[i] 即可达

- 代码实现

  ```cpp
  class Solution {
  public:
      bool canReach(string s, int minJump, int maxJump) {
          int n = s.size();
          vector<bool> dp(n, false);
          dp[0] = true;

          for (int i = 1; i < n; ++i) {
              if (s[i] != '0')
                  continue;

              // 暴力往前找 [i-maxJump, i-minJump]
              int L = max(0, i - maxJump);
              int R = i - minJump;
              for (int j = L; j <= R; ++j) {
                  if (dp[j]) {
                      dp[i] = true;
                      break;
                  }
              }
          }
          return dp[n - 1];
      }
  };
  ```

- 但是当区间很大时，这个做法会超时，如何快速维护某个区间内是否有 true？使用前缀和

  ```cpp
  class Solution {
  public:
      bool canReach(string s, int minJump, int maxJump) {
          int n = s.size();
          vector<bool> dp(n, false);
          vector<int> pre(n + 1, 0);
          dp[0] = true;
          pre[1] = 1;

          for (int i = 1; i < n; ++i) {
              if (s[i] == '0') {
                  int L = max(0, i - maxJump);
                  int R = i - minJump;
                  if (R >= 0) {
                      int cnt = pre[R + 1] - pre[L];
                      dp[i] = (cnt > 0);
                  }
              }
              pre[i + 1] = pre[i] + dp[i];
          }
          return dp[n - 1];
      }
  };
  ```

- 当然，也可以是用滑动窗口，维护这一段固定窗口内是否包含 true，而这个窗口比较特殊，其右边界不是当前的 i，而是 i-minJump

  ```cpp
  class Solution {
  public:
      bool canReach(string s, int minJump, int maxJump) {
          int n = s.size();
          vector<bool> dp(n, false);
          dp[0] = true;

          int cnt = 1; // 窗口内可达点数量，初始 dp[0]=1
          int left = 0;

          for (int i = 1; i < n; ++i) {
              // 右边界：i - minJump
              int right = i - minJump;
              // 左边界：i - maxJump
              while (left < max(0, i - maxJump)) {
                  if (dp[left]) cnt--;
                  left++;
              }

              if (s[i] == '0' && right >= 0 && cnt > 0)
                  dp[i] = true;

              // 把 right 位置加入窗口（下一轮会用到）
              if (right >= 0 && dp[right])
                  cnt++;
          }

          return dp.back();
      }
  };
  ```

## 打家劫舍

### 打家劫舍

- 你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警

- 给定一个代表每个房屋存放金额的非负整数数组，计算你不触动警报装置的情况下 ，一夜之内能够偷窃到的最高金额

- dp 数组的含义：dp[i] 表示盗窃 0-i 的房屋所能偷窃到的最高金额

- 递推公式：`dp[i]=max(dp[i-2]+value[i],dp[i-1])`

- 初始化 dp 数组：`dp[0]=value[0],dp[1]=max(value[0],value[1])`

- 遍历顺序：从前往后遍历

- 代码实现

  ```cpp
  class Solution {
  public:
      int rob(vector<int>& nums) {
          if (nums.size() == 0) return 0;
          if (nums.size() == 1) return nums[0];
          vector<int> dp(nums.size());
          dp[0] = nums[0];
          dp[1] = max(nums[0], nums[1]);
          for (int i = 2; i < nums.size(); i++) {
              dp[i] = max(dp[i - 2] + nums[i], dp[i - 1]);
          }
          return dp[nums.size() - 1];
      }
  };
  ```

- 参考题目
  - [198. 打家劫舍](https://leetcode.cn/problems/house-robber/description/)
  - [213. 打家劫舍 II](https://leetcode.cn/problems/house-robber-ii/description/)
  - [337. 打家劫舍 III](https://leetcode.cn/problems/peaks-and-valleys-lcci/)
  - [2560. 打家劫舍 IV](https://leetcode.cn/problems/house-robber-iv/description/)
  - [152. 乘积最大子数组](https://leetcode.cn/problems/maximum-product-subarray/description/)
  - [600. 不含连续1的非负整数](https://leetcode.cn/problems/non-negative-integers-without-consecutive-ones/description/)

### 打家劫舍 II

- 你是一个专业的小偷，计划偷窃沿街的房屋，每间房内都藏有一定的现金。这个地方所有的房屋都围成一圈 ，这意味着第一个房屋和最后一个房屋是紧挨着的。同时，相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警

- 给定一个代表每个房屋存放金额的非负整数数组，计算你在不触动警报装置的情况下 ，今晚能够偷窃到的最高金额

- 这个问题和打家劫舍 I 问题比较类似，不同的是这道题目成了一个环形，形成了三种情况
  - 不包含首尾元素
  - 包含首元素，不包含尾元素
  - 包含尾元素，不包含首元素

- 代码实现

  ```cpp
  class Solution {
  public:
      int rob(vector<int>& nums) {
          if (nums.size() == 0) return 0;
          if (nums.size() == 1) return nums[0];
          int result1 = robRange(nums, 0, nums.size() - 2); // 情况二
          int result2 = robRange(nums, 1, nums.size() - 1); // 情况三
          return max(result1, result2);
      }
      // 198.打家劫舍的逻辑
      int robRange(vector<int>& nums, int start, int end) {
          if (end == start) return nums[start];
          vector<int> dp(nums.size());
          dp[start] = nums[start];
          dp[start + 1] = max(nums[start], nums[start + 1]);
          for (int i = start + 2; i <= end; i++) {
              dp[i] = max(dp[i - 2] + nums[i], dp[i - 1]);
          }
          return dp[end];
      }
  };
  ```

### 打家劫舍 III

- 小偷又发现了一个新的可行窃的地区。这个地区只有一个入口，我们称之为 `root`

- 除了 `root` 之外，每栋房子有且只有一个“父“房子与之相连。一番侦察之后，聪明的小偷意识到“这个地方的所有房屋的排列类似于一棵二叉树”。 如果两个直接相连的房子在同一天晚上被打劫 ，房屋将自动报警

- 给定二叉树的 `root` 。返回在不触动警报的情况下，小偷能够盗取的最高金额

- 与前面的问题一样，关键是讨论当前节点是抢还是不抢；如果抢了当前节点，两个孩子节点就不能动，如果没抢当前节点，就可以考虑抢左右孩子节点

- 暴力递归

  ```cpp
  class Solution {
  public:
      int rob(TreeNode* root) {
          if (root == NULL) return 0;
          if (root->left == NULL && root->right == NULL) return root->val;
          // 偷父节点
          int val1 = root->val;
          if (root->left) val1 += rob(root->left->left) + rob(root->left->right); // 跳过root->left，相当于不考虑左孩子了
          if (root->right) val1 += rob(root->right->left) + rob(root->right->right); // 跳过root->right，相当于不考虑右孩子了
          // 不偷父节点
          int val2 = rob(root->left) + rob(root->right); // 考虑root的左右孩子
          return max(val1, val2);
      }
  };
  ```

- 记忆化递推

  ```cpp
  class Solution {
  public:
      unordered_map<TreeNode* , int> umap; // 记录计算过的结果
      int rob(TreeNode* root) {
          if (root == NULL) return 0;
          if (root->left == NULL && root->right == NULL) return root->val;
          if (umap[root]) return umap[root]; // 如果umap里已经有记录则直接返回
          // 偷父节点
          int val1 = root->val;
          if (root->left) val1 += rob(root->left->left) + rob(root->left->right); // 跳过root->left
          if (root->right) val1 += rob(root->right->left) + rob(root->right->right); // 跳过root->right
          // 不偷父节点
          int val2 = rob(root->left) + rob(root->right); // 考虑root的左右孩子
          umap[root] = max(val1, val2); // umap记录一下结果
          return max(val1, val2);
      }
  };
  ```

- 动态规划
  - dp 数组的含义：下标为 0 记录不偷该节点所得到的最大金钱，下标为 1 记录偷该节点所得到的最大金钱
  - dp 数组只需要 2 位，因为在递归的过程中，系统栈会保存每一层递归的参数
  - 显然需要使用后序遍历，因为要使用左节点和右节点的递归函数的返回值做下一步计算
  - 实际上，这个就是树形 DP 的一种形式

- 代码实现

  ```cpp
  lass Solution {
  public:
      int rob(TreeNode* root) {
          vector<int> result = robTree(root);
          return max(result[0], result[1]);
      }
      // 长度为2的数组，0：不偷，1：偷
      vector<int> robTree(TreeNode* cur) {
          if (cur == NULL) return vector<int>{0, 0};
          vector<int> left = robTree(cur->left);
          vector<int> right = robTree(cur->right);
          // 偷cur，那么就不能偷左右节点。
          int val1 = cur->val + left[0] + right[0];
          // 不偷cur，那么可以偷也可以不偷左右节点，则取较大的情况
          int val2 = max(left[0], left[1]) + max(right[0], right[1]);
          return {val2, val1};
      }
  };
  ```

## 股票问题

- 参考题目
  - [121. 买卖股票的最佳时机](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/)
  - [122. 买卖股票的最佳时机 II](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-ii/description/)
  - [123. 买卖股票的最佳时机 III](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-iii/)
  - [188. 买卖股票的最佳时机 IV](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-iv/)
  - [309. 买卖股票的最佳时机含冷冻期](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-with-cooldown/)
  - [714. 买卖股票的最佳时机含手续费](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/)

### 买卖股票的最佳时机

- 给定一个数组 `prices` ，它的第 `i` 个元素 `prices[i]` 表示一支给定股票第 `i` 天的价格

- 你只能选择某一天买入这只股票，并选择在未来的某一个不同的日子卖出该股票。设计一个算法来计算你所能获取的最大利润

- 返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 `0`

- 暴力方法

  ```cpp
  class Solution {
  public:
      int maxProfit(vector<int>& prices) {
          int result = 0;
          for (int i = 0; i < prices.size(); i++) {
              for (int j = i + 1; j < prices.size(); j++){
                  result = max(result, prices[j] - prices[i]);
              }
          }
          return result;
      }
  };
  ```

- 贪心：因为股票只买卖一次，那么贪心的想法很自然就是取最左最小值，取最右最大值，那么得到的差值就是最大利润

  ```cpp
  class Solution {
  public:
      int maxProfit(vector<int>& prices) {
          int low = INT_MAX;
          int result = 0;
          for (int i = 0; i < prices.size(); i++) {
              low = min(low, prices[i]);  // 取最左最小价格
              result = max(result, prices[i] - low); // 直接取最大区间利润
          }
          return result;
      }
  };
  ```

- 动态规划
  - dp 数组的含义：`dp[i][0]` 表示第 i 天持有股票所得最多现金；`dp[i][1]` 表示第 i 天不持有股票所得最多现金

  - 如果第 i 天持有股票即 `dp[i][0]`， 那么可以由两个状态推出来
    - 第 i-1 天就持有股票，那么就保持现状，所得现金就是昨天持有股票的所得现金，即：`dp[i - 1][0]`
    - 第 i 天买入股票，所得现金就是买入今天的股票后所得现金即：`-prices[i]`

    - 那么 `dp[i][0]` 应该选所得现金最大的，所以 `dp[i][0] = max(dp[i - 1][0], -prices[i]);`

  - 如果第 i 天不持有股票即 `dp[i][1]`， 也可以由两个状态推出来
    - 第 i-1 天就不持有股票，那么就保持现状，所得现金就是昨天不持有股票的所得现金 即：`dp[i - 1][1]`
    - 第 i 天卖出股票，所得现金就是按照今天股票价格卖出后所得现金即：`prices[i] + dp[i - 1][0]`

    - 同样 `dp[i][1]` 取最大的，`dp[i][1] = max(dp[i - 1][1], prices[i] + dp[i - 1][0]);`

  - 初始化 `dp[0][0]-=prices[0]`，`dp[0][1]=0`

- 代码实现

  ```cpp
  class Solution {
  public:
      int maxProfit(vector<int>& prices) {
          int len = prices.size();
          if (len == 0) return 0;
          vector<vector<int>> dp(len, vector<int>(2));
          dp[0][0] -= prices[0];
          dp[0][1] = 0;
          for (int i = 1; i < len; i++) {
              dp[i][0] = max(dp[i - 1][0], -prices[i]);
              dp[i][1] = max(dp[i - 1][1], prices[i] + dp[i - 1][0]);
          }
          return dp[len - 1][1];
      }
  };
  ```

- 压缩 dp 数组，dp[i] 只是依赖于 dp[i - 1] 的状态

- 那么只需要记录当前天的 dp 状态和前一天的 dp 状态就可以，可以使用滚动数组来节省空间

  ```cpp
  class Solution {
  public:
      int maxProfit(vector<int>& prices) {
          int len = prices.size();
          vector<vector<int>> dp(2, vector<int>(2)); // 注意这里只开辟了一个2 * 2大小的二维数组
          dp[0][0] -= prices[0];
          dp[0][1] = 0;
          for (int i = 1; i < len; i++) {
              dp[i % 2][0] = max(dp[(i - 1) % 2][0], -prices[i]);
              dp[i % 2][1] = max(dp[(i - 1) % 2][1], prices[i] + dp[(i - 1) % 2][0]);
          }
          return dp[(len - 1) % 2][1];
      }
  };
  ```

### 买卖股票的最佳时机 II

- 给定一个数组，它的第 i 个元素是一支给定股票第 i 天的价格

- 设计一个算法来计算所能获取的最大利润，可以尽可能地完成更多的交易（多次买卖一支股票）

- 不能同时参与多笔交易（必须在再次购买前出售掉之前的股票）

- dp 数组的含义：`dp[i][0]` 表示第 i 天持有股票所得最多现金；`dp[i][1]` 表示第 i 天不持有股票所得最多现金

- 如果第 i 天持有股票即 `dp[i][0]`， 那么可以由两个状态推出来
  - 第 i-1 天就持有股票，那么就保持现状，所得现金就是昨天持有股票的所得现金，即：`dp[i - 1][0]`
  - 第 i 天买入股票，所得现金就是昨天不持有股票所的现金减去买入今天的股票后所得现金即：`dp[i-1][1]-prices[i]`——这是与 I 的不同之处，因为 II 中可以买卖多次一支股票

  - 那么 `dp[i][0]` 应该选所得现金最大的，所以 `dp[i][0] = max(dp[i - 1][0], dp[i-1][1]--prices[i]);`

- 如果第 i 天不持有股票即 `dp[i][1]`， 也可以由两个状态推出来
  - 第 i-1 天就不持有股票，那么就保持现状，所得现金就是昨天不持有股票的所得现金 即：`dp[i - 1][1]`
  - 第 i 天卖出股票，所得现金就是按照今天股票价格卖出后所得现金即：`prices[i] + dp[i - 1][0]`

  - 同样 `dp[i][1]` 取最大的，`dp[i][1] = max(dp[i - 1][1], prices[i] + dp[i - 1][0]);`

- 初始化 `dp[0][0]-=prices[0]`，`dp[0][1]=0`

- 代码实现

  ```cpp
  class Solution {
  public:
      int maxProfit(vector<int>& prices) {
          int len = prices.size();
          vector<vector<int>> dp(len, vector<int>(2, 0));
          dp[0][0] -= prices[0];
          dp[0][1] = 0;
          for (int i = 1; i < len; i++) {
              dp[i][0] = max(dp[i - 1][0], dp[i - 1][1] - prices[i]); // 注意这里是和121. 买卖股票的最佳时机唯一不同的地方。
              dp[i][1] = max(dp[i - 1][1], dp[i - 1][0] + prices[i]);
          }
          return dp[len - 1][1];
      }
  };
  ```

- 滚动数组

  ```cpp
  class Solution {
  public:
      int maxProfit(vector<int>& prices) {
          int len = prices.size();
          vector<vector<int>> dp(2, vector<int>(2)); // 注意这里只开辟了一个2 * 2大小的二维数组
          dp[0][0] -= prices[0];
          dp[0][1] = 0;
          for (int i = 1; i < len; i++) {
              dp[i % 2][0] = max(dp[(i - 1) % 2][0], dp[(i - 1) % 2][1] - prices[i]);
              dp[i % 2][1] = max(dp[(i - 1) % 2][1], prices[i] + dp[(i - 1) % 2][0]);
          }
          return dp[(len - 1) % 2][1];
      }
  };
  ```

### 买卖股票的最佳时机 III

- 给定一个数组，它的第 `i` 个元素是一支给定的股票在第 `i` 天的价格

- 设计一个算法来计算你所能获取的最大利润。你最多可以完成 两笔交易

- 注意：你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）

- III 相比 II 的区别是，限制了买卖股票次数的限制

- 分析可以看出，一天一共包括五个状态
  - 没有操作 （其实也可以不设置这个状态）
  - 第一次持有股票
  - 第一次不持有股票
  - 第二次持有股票
  - 第二次不持有股票
  - 那么 `dp[i][j]` 中 i 表示第 i 天，j 为 [0 - 4] 五个状态，`dp[i][j]` 表示第 i 天状态 j 所剩最大现金

- 递推公式
  - 达到 `dp[i][1]` 状态，有两个具体操作：
    - 操作一：第 i 天买入股票了，那么 `dp[i][1] = dp[i-1][0] - prices[i]`
    - 操作二：第 i 天没有操作，而是沿用前一天买入的状态，即：`dp[i][1] = dp[i - 1][1]`
    - `dp[i][1] = max(dp[i-1][0] - prices[i], dp[i - 1][1]);`
  - `dp[i][2]` 也有两个操作：
    - 操作一：第 i 天卖出股票了，那么 `dp[i][2] = dp[i - 1][1] + prices[i]`
    - 操作二：第 i 天没有操作，沿用前一天卖出股票的状态，即：`dp[i][2] = dp[i - 1][2]`
    - `dp[i][2] = max(dp[i - 1][1] + prices[i], dp[i - 1][2])`
  - `dp[i][3] = max(dp[i - 1][3], dp[i - 1][2] - prices[i]);`
  - `dp[i][4] = max(dp[i - 1][4], dp[i - 1][3] + prices[i]);`

- 初始化：`dp[0][0]=0,dp[0][1]=-prices[0],dp[0][2]=0,dp[0][3] = -prices[0],dp[0][4] = 0`

- 代码实现

  ```cpp
  class Solution {
  public:
      int maxProfit(vector<int>& prices) {
          if (prices.size() == 0) return 0;
          vector<vector<int>> dp(prices.size(), vector<int>(5, 0));
          dp[0][1] = -prices[0];
          dp[0][3] = -prices[0];
          for (int i = 1; i < prices.size(); i++) {
              dp[i][0] = dp[i - 1][0];
              dp[i][1] = max(dp[i - 1][1], dp[i - 1][0] - prices[i]);
              dp[i][2] = max(dp[i - 1][2], dp[i - 1][1] + prices[i]);
              dp[i][3] = max(dp[i - 1][3], dp[i - 1][2] - prices[i]);
              dp[i][4] = max(dp[i - 1][4], dp[i - 1][3] + prices[i]);
          }
          return dp[prices.size() - 1][4];
      }
  };
  ```

- 优化空间

  ```cpp
  class Solution {
  public:
      int maxProfit(vector<int>& prices) {
          if (prices.size() == 0) return 0;
          vector<int> dp(5, 0);
          dp[1] = -prices[0];
          dp[3] = -prices[0];
          for (int i = 1; i < prices.size(); i++) {
              dp[1] = max(dp[1], dp[0] - prices[i]);
              dp[2] = max(dp[2], dp[1] + prices[i]);
              dp[3] = max(dp[3], dp[2] - prices[i]);
              dp[4] = max(dp[4], dp[3] + prices[i]);
          }
          return dp[4];
      }
  };
  ```

- 此处，dp[2] 利用的是当天的 dp[1]
  - 若`dp[1]`取原本的`dp[1]`（即保持 “之前买入股票” 的状态）：此时`dp[2]`中`dp[1] + prices[i]`的含义是 “卖出之前持有的股票”，也就是当天执行卖出操作，这是符合交易逻辑的有效操作
  - 若`dp[1]`取`dp[0] - prices[i]`（即当天刚买入股票）：此时`dp[2]`中`dp[1] + prices[i]`就等价于`(dp[0] - prices[i]) + prices[i] = dp[0]`，也就是 “当天买入后立刻卖出”。这种操作的收益为 0，对现金总量没有任何影响，本质上等同于 “保持昨天卖出股票的状态”，因此不会改变最终的最优解

### 买卖股票的最佳时机 IV

- 给你一个整数数组 `prices` 和一个整数 `k` ，其中 `prices[i]` 是某支给定的股票在第 `i` 天的价格

- 设计一个算法来计算你所能获取的最大利润。你最多可以完成 `k` 笔交易。也就是说，你最多可以买 `k` 次，卖 `k` 次

- 注意：你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）

- IV 是 III 的推广版本，最多可以交易 K 次

- 此时 `dp[i][j]` 数组表示第 i 天的状态为 j，所剩下的最大现金是 `dp[i][j]`，j 的状态表示为：
  - 0 表示不操作
  - 1 第一次买入
  - 2 第一次卖出
  - 3 第二次买入
  - 4 第二次卖出
  - .....

- 即 j 的状态数为 2k+1 个

- 递推公式

  ```cpp
  for (int j = 0; j < 2 * k - 1; j += 2) {
      dp[i][j + 1] = max(dp[i - 1][j + 1], dp[i - 1][j] - prices[i]);
      dp[i][j + 2] = max(dp[i - 1][j + 2], dp[i - 1][j + 1] + prices[i]);
  }
  ```

- 初始化：`dp[0][j]` 当 j 为奇数都初始化为 `-prices[0]`，当 j 为偶数时都初始化为 0

- 代码实现

  ```cpp
  class Solution {
  public:
      int maxProfit(int k, vector<int>& prices) {

          if (prices.size() == 0) return 0;
          vector<vector<int>> dp(prices.size(), vector<int>(2 * k + 1, 0));
          for (int j = 1; j < 2 * k; j += 2) {
              dp[0][j] = -prices[0];
          }
          for (int i = 1;i < prices.size(); i++) {
              for (int j = 0; j < 2 * k - 1; j += 2) {
                  dp[i][j + 1] = max(dp[i - 1][j + 1], dp[i - 1][j] - prices[i]);
                  dp[i][j + 2] = max(dp[i - 1][j + 2], dp[i - 1][j + 1] + prices[i]);
              }
          }
          return dp[prices.size() - 1][2 * k];
      }
  };
  ```

### 买卖股票的最佳时机含冷冻期

- 给定一个整数数组`prices`，其中第 `prices[i]` 表示第 `i` 天的股票价格

- 设计一个算法计算出最大利润。在满足以下约束条件下，你可以尽可能地完成更多的交易（多次买卖一支股票）

- 卖出股票后，你无法在第二天买入股票 (即冷冻期为 1 天)

- 注意：你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）

- 具体包括四个状态
  - 状态一：持有股票状态（今天买入股票，或者是之前就买入股票后没有操作，一直持有）
  - 不持有股票状态
    - 状态二：保持卖出股票的状态（两天前就卖出了股票，度过一天冷冻期；或者是前一天就是卖出股票状态，一直没操作）
    - 状态三：今天卖出股票
  - 状态四：今天为冷冻期状态，但冷冻期状态不可持续，只有一天
  - 在含冷冻期的股票买卖问题中，不能将「当天卖出股票」简单归入「不持有股票」的笼统状态，必须将其单独定义为独立状态。原因在于，冷冻期的前一天只能是卖出操作，若仅使用「不持有股票」这一模糊状态，无法区分是刚卖出还是已度过冷冻期，只有单独设立「当天卖出股票」状态，才能准确约束状态转移关系

- 确定递推公式
  - 持有股票状态（`dp[i][0]`）：可通过两种操作达成，取收益最大值
    - 操作一：前一天已持有股票（延续状态），即 `dp[i][0] = dp[i - 1][0]`；

    - 操作二：当天买入股票，需满足前一天为冷冻期或保持卖出状态：
      - 前一天是冷冻期：`dp[i - 1][3] - prices[i]`
      - 前一天是保持卖出状态：`dp[i - 1][1] - prices[i]`

    - 最终转移方程：

      ```
      dp[i][0] = max(dp[i - 1][0], dp[i - 1][3] - prices[i], dp[i - 1][1] - prices[i]);
      ```

  - 保持卖出股票状态（`dp[i][1]`）：可通过两种操作达成，取收益最大值
    - 操作一：前一天已是保持卖出状态（延续状态），即 `dp[i][1] = dp[i - 1][1]`；

    - 操作二：前一天是冷冻期（冷冻期结束后未操作），即 `dp[i][1] = dp[i - 1][3]`

    - 最终转移方程：

      ```
      dp[i][1] = max(dp[i - 1][1], dp[i - 1][3]);
      ```

  - 当天卖出股票状态（`dp[i][2]`）
    - 仅有一种达成方式，即前一天持有股票，当天卖出获利

    - 转移方程：

      ```
      dp[i][2] = dp[i - 1][0] + prices[i];
      ```

  - 冷冻期状态（`dp[i][3]`）
    - 仅有一种达成方式：前一天完成股票卖出操作（卖出后次日进入冷冻期）

    - 转移方程：

      ```
      dp[i][3] = dp[i - 1][2];
      ```

- 递推代码如下

  ```cpp
  dp[i][0] = max(dp[i - 1][0], max(dp[i - 1][3], dp[i - 1][1]) - prices[i]);
  dp[i][1] = max(dp[i - 1][1], dp[i - 1][3]);
  dp[i][2] = dp[i - 1][0] + prices[i];
  dp[i][3] = dp[i - 1][2];
  ```

- 初始化 dp 数组
  - `dp[0][0]=-prices[0]`
  - `dp[0][1]=dp[0][2]=dp[0][3]=0`

- 代码实现

  ```cpp
  class Solution {
  public:
      int maxProfit(vector<int>& prices) {
          int n = prices.size();
          if (n == 0) return 0;
          vector<vector<int>> dp(n, vector<int>(4, 0));
          dp[0][0] -= prices[0]; // 持股票
          for (int i = 1; i < n; i++) {
              dp[i][0] = max(dp[i - 1][0], max(dp[i - 1][3] - prices[i], dp[i - 1][1] - prices[i]));
              dp[i][1] = max(dp[i - 1][1], dp[i - 1][3]);
              dp[i][2] = dp[i - 1][0] + prices[i];
              dp[i][3] = dp[i - 1][2];
          }
          return max(dp[n - 1][3], max(dp[n - 1][1], dp[n - 1][2]));
      }
  };
  ```

### 买卖股票的最佳时机含手续费

- 给定一个整数数组 `prices`，其中 `prices[i]`表示第 `i` 天的股票价格 ；整数 `fee` 代表了交易股票的手续费用

- 可以无限次地完成交易，但是你每笔交易都需要付手续费。如果你已经购买了一个股票，在卖出它之前你就不能再继续购买股票了；返回获得利润的最大值

- 注意：这里的一笔交易指买入持有并卖出股票的整个过程，每笔交易你只需要为支付一次手续费

- dp数组的含义：`dp[i][0]` 表示第 i 天持有股票所得最多现金，`dp[i][1]` 表示第 i 天不持有股票所得最多现金

- 如果第 i 天持有股票即 `dp[i][0]`， 可以由两个状态推出
  - 第 i-1 天就持有股票，那么就保持现状，所得现金就是昨天持有股票的所得现金，即 `dp[i - 1][0]`
  - 第 i 天买入股票，所得现金就是昨天不持有股票的所得现金减去今天的股票价格，即：`dp[i - 1][1] - prices[i]`
  - `dp[i][0] = max(dp[i - 1][0], dp[i - 1][1] - prices[i]);`

- 如果第 i 天不持有股票即 `dp[i][1]` 的情况，可以由两个状态推出
  - 第 i-1 天就不持有股票，保持现状，所得现金就是昨天不持有股票的所得现金，即 `dp[i - 1][1]`
  - 第 i 天卖出股票，所得现金就是按照今天股票价格卖出后所得现金，需要扣除手续费，即 `dp[i - 1][0] + prices[i] - fee`
  - `dp[i][1] = max(dp[i - 1][1], dp[i - 1][0] + prices[i] - fee);`

- 代码实现

  ```cpp
  class Solution {
  public:
      int maxProfit(vector<int>& prices, int fee) {
          int n = prices.size();
          vector<vector<int>> dp(n, vector<int>(2, 0));
          dp[0][0] -= prices[0]; // 持股票
          for (int i = 1; i < n; i++) {
              dp[i][0] = max(dp[i - 1][0], dp[i - 1][1] - prices[i]);
              dp[i][1] = max(dp[i - 1][1], dp[i - 1][0] + prices[i] - fee);
          }
          return max(dp[n - 1][0], dp[n - 1][1]);
      }
  };
  ```

## 子序列（不连续）

### 最长递增子序列

- 给你一个整数数组 `nums` ，找到其中最长严格递增子序列的长度

- 子序列是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。例如，`[3,6,2,7]` 是数组 `[0,3,1,6,2,2,7]` 的子序列

- dp 数组的含义：dp[i] 表示下标在 0-i 内的数组以 nums[i] 结尾的最长严格递增子序列的长度；这里一定表示以 nums[i] 结尾的最长递增子序，因为在做递增比较的时候，那么两个递增子序列一定要以 nums[j] 和 nums[i] 结尾，否则没有比较意义

- 状态转移方程

  ```cpp
  if (nums[i] > nums[j]) dp[i] = max(dp[i], dp[j] + 1);
  ```

- 初始化：`dp[i]=1`

- 遍历顺序：从前往后遍历

- 代码实现

  ```cpp
  class Solution {
  public:
      int lengthOfLIS(vector<int>& nums) {
          if (nums.size() <= 1) return nums.size();
          vector<int> dp(nums.size(), 1);
          int result = 0;
          for (int i = 1; i < nums.size(); i++) {
              for (int j = 0; j < i; j++) {
                  if (nums[i] > nums[j]) dp[i] = max(dp[i], dp[j] + 1);
              }
              if (dp[i] > result) result = dp[i]; // 取长的子序列
          }
          return result;
      }
  };
  ```

- 相关题目
  - [300. 最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence/)
  - [2407. 最长递增子序列 II](https://leetcode.cn/problems/longest-increasing-subsequence-ii/description/)

### 最长递增子序列的个数

- 给定一个未排序的整数数组 nums ， 返回最长递增子序列的个数，注意这个数列必须是严格递增的

- 维护两个动态规划数组：
  - `dp[i]`：表示以 `nums[i]` 结尾的最长严格递增子序列的长度
  - `count[i]`：表示以 `nums[i]` 结尾的、长度为 `dp[i]` 的严格递增子序列的个数

- 具体步骤：
  - 初始化：每个元素自身构成长度为 1 的子序列，因此 `dp[i] = 1`，`count[i] = 1`

  - 遍历数组：对于每个元素 `nums[i]`，向前遍历所有 `j < i` 的元素：
    - 若 `nums[j] < nums[i]`：说明 `nums[i]` 可以接在 `nums[j]` 结尾的子序列后，形成更长的子序列
      - 若 `dp[j] + 1 > dp[i]`：更新 `dp[i] = dp[j] + 1`，同时 `count[i] = count[j]`（新长度的子序列个数等于来源的个数）

  - 若 `dp[j] + 1 == dp[i]`：说明找到多条路径能形成相同长度的子序列，`count[i] += count[j]`
  - 结果计算：先找到 `dp` 数组中的最大值（最长长度 `max_len`），再累加所有 `dp[i] == max_len` 对应的 `count[i]`，即为最终答案

- 代码实现

  ```cpp
  #include <iostream>
  #include <vector>
  #include <algorithm> // 用于max函数

  using namespace std;

  int findNumberOfLIS(vector<int>& nums) {
      // 边界条件：空数组直接返回0
      if (nums.empty()) {
          return 0;
      }

      int n = nums.size();
      // dp[i]：以nums[i]结尾的最长严格递增子序列的长度
      vector<int> dp(n, 1);
      // count[i]：以nums[i]结尾的、长度为dp[i]的递增子序列的个数
      vector<int> count(n, 1);

      // 遍历每个元素，计算dp和count
      for (int i = 0; i < n; ++i) {
          for (int j = 0; j < i; ++j) {
              // 严格递增条件
              if (nums[j] < nums[i]) {
                  // 情况1：找到更长的子序列，更新长度和个数
                  if (dp[j] + 1 > dp[i]) {
                      dp[i] = dp[j] + 1;
                      count[i] = count[j];
                  }
                  // 情况2：找到等长的子序列，累加个数
                  else if (dp[j] + 1 == dp[i]) {
                      count[i] += count[j];
                  }
              }
          }
      }

      // 第一步：找到最长递增子序列的长度
      int max_len = *max_element(dp.begin(), dp.end());
      // 第二步：累加所有长度为max_len的子序列个数
      int result = 0;
      for (int i = 0; i < n; ++i) {
          if (dp[i] == max_len) {
              result += count[i];
          }
      }

      return result;
  }
  ```

- 参考题目
  - [673. 最长递增子序列的个数](https://leetcode.cn/problems/number-of-longest-increasing-subsequence/description/)

### 最长递增子序列 II

- 给你一个整数数组 `nums` 和一个整数 `k`

- 找到 `nums` 中满足以下要求的最长子序列：
  - 子序列严格递增
  - 子序列中相邻元素的差值不超过 `k`

- 请返回满足上述要求的最长子序列的长度

- 子序列是从一个数组中删除部分元素后，剩余元素不改变顺序得到的数组

- 状态定义：`dp[i]` 表示以 `nums[i]` 结尾的、满足条件的最长子序列长度，初始值为 1（单个元素自身是长度为 1 的子序列）

- 状态转移：对于每个 `nums[i]`，需要找到所有满足 `nums[i] - nums[j] ≤ k` 且 `nums[j] < nums[i]`（严格递增）的 `j < i`，取 `dp[j] + 1` 的最大值作为 `dp[i]`

- 优化手段：直接遍历所有 `j < i` 会导致 $O(n^2)$ 的时间复杂度，因此用 `map`（有序集合）记录「数值-该数值对应的最大 dp 值」，通过 `upper_bound` 快速找到符合 `nums[i] - k ≤ x < nums[i]` 的数值范围，直接取该范围内的最大 dp 值，将时间复杂度优化到 $O(n\log n)$​

- 代码实现

  ```cpp
  #include <iostream>
  #include <vector>
  #include <map>
  #include <algorithm> // 用于max函数

  using namespace std;

  int longestIncreasingSubsequenceWithK(vector<int>& nums, int k) {
      if (nums.empty()) {
          return 0;
      }

      int n = nums.size();
      vector<int> dp(n, 1); // dp[i]：以nums[i]结尾的最长符合条件的子序列长度
      // map<数值, 该数值对应的最大dp值>，自动按数值升序排列
      map<int, int> num_to_max_dp;

      int max_len = 1; // 记录全局最长长度
      for (int i = 0; i < n; ++i) {
          int current_num = nums[i];
          // 目标范围：[current_num - k, current_num)，即x < current_num且x >= current_num - k
          int target_min = current_num - k;
          int target_max = current_num - 1; // 严格递增，所以最大是current_num-1

          int best_prev = 0; // 符合条件的前驱的最大dp值
          // 找到第一个大于等于target_min的迭代器
          auto it = num_to_max_dp.lower_bound(target_min);
          // 遍历到第一个大于target_max的迭代器为止
          while (it != num_to_max_dp.end() && it->first <= target_max) {
              best_prev = max(best_prev, it->second);
              ++it;
          }

          // 更新当前dp值
          dp[i] = best_prev + 1;
          max_len = max(max_len, dp[i]);

          // 更新map：如果当前数值已存在，保留更大的dp值；否则直接插入
          if (num_to_max_dp.find(current_num) != num_to_max_dp.end()) {
              num_to_max_dp[current_num] = max(num_to_max_dp[current_num], dp[i]);
          } else {
              num_to_max_dp[current_num] = dp[i];
          }
      }

      return max_len;
  }
  ```

### 最长公共子序列

- 给定两个字符串 `text1` 和 `text2`，返回这两个字符串的最长公共子序列的长度。如果不存在公共子序列，返回 `0`

- 一个字符串的子序列是指这样一个新的字符串：它是由原字符串在不改变字符的相对顺序的情况下删除某些字符（也可以不删除任何字符）后组成的新字符串

- 例如，`"ace"` 是 `"abcde"` 的子序列，但 `"aec"` 不是 `"abcde"` 的子序列

- 两个字符串的公共子序列是这两个字符串所共同拥有的子序列

- dp 数组的含义：`dp[i][j]` 表示长度为 [0, i - 1] 的字符串从text1 与长度为 [0, j - 1] 的字符串 text2 的最长公共子序列为`dp[i][j]`

- 递推情况：
  - 如果 text1[i - 1] 与 text2[j - 1] 相同，那么找到了一个公共元素，所以 `dp[i][j] = dp[i - 1][j - 1] + 1`
  - 如果 text1[i - 1] 与 text2[j - 1] 不相同，那么就看text1[0, i - 2] 与 text2[0, j - 1] 的最长公共子序列和 text1[0, i - 1] 与 text2[0, j - 2] 的最长公共子序列，取最大值，即 `dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);`

- 初始化 dp 数组
  - `dp[i][0]=0`
  - `dp[0][j]=0`

- 代码实现

  ```cpp
  class Solution {
  public:
      int longestCommonSubsequence(string text1, string text2) {
          vector<vector<int>> dp(text1.size() + 1, vector<int>(text2.size() + 1, 0));
          for (int i = 1; i <= text1.size(); i++) {
              for (int j = 1; j <= text2.size(); j++) {
                  if (text1[i - 1] == text2[j - 1]) {
                      dp[i][j] = dp[i - 1][j - 1] + 1;
                  } else {
                      dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
                  }
              }
          }
          return dp[text1.size()][text2.size()];
      }
  };
  ```

- 参考题目
  - [1143. 最长公共子序列](https://leetcode.cn/problems/longest-common-subsequence/)
  - [1092. 最短公共超序列](https://leetcode.cn/problems/shortest-common-supersequence/description/)

### 不相交的线

- 在两条独立的水平线上按给定的顺序写下 `nums1` 和 `nums2` 中的整数

- 现在，可以绘制一些连接两个数字 `nums1[i]` 和 `nums2[j]` 的直线，这些直线需要同时满足：
  - `nums1[i] == nums2[j]`
  - 且绘制的直线不与任何其他连线（非水平线）相交

- 请注意，连线即使在端点也不能相交：每个数字只能属于一条连线

- 以这种方法绘制线条，并返回可以绘制的最大连线数

- 直线不能相交，说明在字符串 nums1 中 找到一个与字符串nums2 相同的子序列，且这个子序列不能改变相对顺序，只要相对顺序不改变，连接相同数字的直线就不会相交

- 可见，实际上就是在求最长公共子序列的长度

- 代码实现

  ```cpp
  class Solution {
  public:
      int maxUncrossedLines(vector<int>& nums1, vector<int>& nums2) {
          vector<vector<int>> dp(nums1.size() + 1, vector<int>(nums2.size() + 1, 0));
          for (int i = 1; i <= nums1.size(); i++) {
              for (int j = 1; j <= nums2.size(); j++) {
                  if (nums1[i - 1] == nums2[j - 1]) {
                      dp[i][j] = dp[i - 1][j - 1] + 1;
                  } else {
                      dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
                  }
              }
          }
          return dp[nums1.size()][nums2.size()];
      }
  };
  ```

- 参考题目
  - [1035. 不相交的线](https://leetcode.cn/problems/uncrossed-lines/)

## 子序列（连续）

### 最长连续递增序列

- 给定一个未经排序的整数数组，找到最长且连续递增的子序列，并返回该序列的长度、

- 连续递增的子序列可以由两个下标 `l` 和 `r`（`l < r`）确定，如果对于每个 `l <= i < r`，都有 `nums[i] < nums[i + 1]` ，那么子序列 `[nums[l], nums[l + 1], ..., nums[r - 1], nums[r]]` 就是连续递增子序列

- 与最长递增子序列相比，最长连续递增子序列要求子序列是连续的，那么 dp 数组的含义：以下标 i 为结尾的连续递增的子序列长度为 dp[i]

- 递推公式：`dp[i] = dp[i - 1] + 1;`

- 因为本题要求连续递增子序列，因此只需要比较 nums[i] 与 nums[i - 1]，而不用去比较 nums[j] 与 nums[i] （j 是在 0 到 i 之间遍历）

- dp 数组如何初始化：`dp[i]=1`

- 代码实现

  ```cpp
  class Solution {
  public:
      int findLengthOfLCIS(vector<int>& nums) {
          if (nums.size() == 0) return 0;
          int result = 1;
          vector<int> dp(nums.size() ,1);
          for (int i = 1; i < nums.size(); i++) {
              if (nums[i] > nums[i - 1]) { // 连续记录
                  dp[i] = dp[i - 1] + 1;
              }
              if (dp[i] > result) result = dp[i];
          }
          return result;
      }
  }
  ```

- 贪心做法：遇到 nums[i] > nums[i - 1] 的情况，count 就++，否则 count 为 1，记录 count 的最大值

  ```cpp
  class Solution {
  public:
      int findLengthOfLCIS(vector<int>& nums) {
          if (nums.size() == 0) return 0;
          int result = 1; // 连续子序列最少也是1
          int count = 1;
          for (int i = 1; i < nums.size(); i++) {
              if (nums[i] > nums[i - 1]) { // 连续记录
                  count++;
              } else { // 不连续，count从头开始
                  count = 1;
              }
              if (count > result) result = count;
          }
          return result;
      }
  };
  ```

- 参考题目
  - [674. 最长连续递增序列](https://leetcode.cn/problems/longest-continuous-increasing-subsequence/)

### 最长公共子数组（最长重复子数组）

- 给两个整数数组 nums1 和 nums2 ，返回两个数组中公共的 、长度最长的子数组的长度

- 这里的子数组指的就是连续子序列，可以使用动态规划，用二维数组记录两个数组的所有比较情况

- dp 数组的含义：以下标 i - 1 为结尾的 A，和以下标 j - 1 为结尾的 B，最长重复子数组长度为 `dp[i][j]`

- `dp[i][j]` 的状态只能由 `dp[i - 1][j - 1]` 推导得到，即当 `A[i-1]` 和 `B[j-1]` 相等时，`dp[i][j] = dp[i-1][j-1] + 1`

- 事实上，`dp[i][0]` 和 `dp[0][j]` 是没有意义的，但是其却需要出示在，可以初始化为 0

- 遍历顺序：遍历 A 和 B 无先后顺序

- 代码示例

  ```cpp
  class Solution {
  public:
      int findLength(vector<int>& nums1, vector<int>& nums2) {
          vector<vector<int>> dp (nums1.size() + 1, vector<int>(nums2.size() + 1, 0));
          int result = 0;
          for (int i = 1; i <= nums1.size(); i++) {
              for (int j = 1; j <= nums2.size(); j++) {
                  if (nums1[i - 1] == nums2[j - 1]) {
                      dp[i][j] = dp[i - 1][j - 1] + 1;
                  }
                  if (dp[i][j] > result) result = dp[i][j];
              }
          }
          return result;
      }
  };
  ```

- 时间复杂度和空间复杂度都为 $O(n\times m)$

- 滚动数组优化
  - `dp[i][j]` 都是由 `dp[i - 1][j - 1]` 推导得到的
  - 压缩为一维数组时，可以把上一层 `dp[i-1][j]` 拷贝到下一层 `dp[i][j]` 使用

- 代码实现

  ```cpp
  class Solution {
  public:
      int findLength(vector<int>& A, vector<int>& B) {
          vector<int> dp(vector<int>(B.size() + 1, 0));
          int result = 0;
          for (int i = 1; i <= A.size(); i++) {
              // 反向遍历j，避免覆盖 dp[j-1] 的旧值
              for (int j = B.size(); j > 0; j--) {
                  if (A[i - 1] == B[j - 1]) {
                      dp[j] = dp[j - 1] + 1;
                  } else dp[j] = 0; // 注意这里不相等的时候要有赋0的操作
                  if (dp[j] > result) result = dp[j];
              }
          }
          return result;
      }
  };
  ```

- 参考题目
  - [718. 最长重复子数组](https://leetcode.cn/problems/maximum-length-of-repeated-subarray/description/)
  - [209. 长度最小的子数组](https://leetcode.cn/problems/minimum-size-subarray-sum/description/)
  - [1923. 最长公共子路径](https://leetcode.cn/problems/longest-common-subpath/)
  - [3176. 求出最长好子序列 I](https://leetcode.cn/problems/find-the-maximum-length-of-a-good-subsequence-i/)
  - [3177. 求出最长好子序列 II](https://leetcode.cn/problems/find-the-maximum-length-of-a-good-subsequence-ii/description/)

### 最大子序和

- 给你一个整数数组 `nums` ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和

- dp 数组的含义：以 nums[i] 结尾的最大连续子序列和为 dp[i]

- 递推公式：`dp[i] = max(dp[i-1]+nums[i],nums[i])`

- 初始化：`dp[0]=nums[0]`

- 代码实现

  ```cpp
  class Solution {
  public:
      int maxSubArray(vector<int>& nums) {
          if (nums.size() == 0) return 0;
          vector<int> dp(nums.size());
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

- 参考题目
  - [53. 最大子数组和](https://leetcode.cn/problems/maximum-subarray/)

## 编辑距离

### 判断子序列

- 给定字符串 s 和 t，判断 s 是否为 t 的子序列

- 字符串的一个子序列是原始字符串删除一些（也可以不删除）字符而不改变剩余字符相对位置形成的新字符串。（例如，`"ace"`是`"abcde"`的一个子序列，而`"aec"`不是）

- 如果有大量输入的 S，称作 S1, S2, ... , Sk 其中 k >= 10亿，你需要依次检查它们是否为 T 的子序列。在这种情况下，会怎样改变代码？

- 双指针法（单次查询效率较高），用两个指针分别指向 `s` 和 `t` 的起始位置，遍历 `t`：
  - 若 `s[i] == t[j]`，则 `i` 后移（匹配下一个字符），`j` 后移；
  - 若不相等，仅 `j` 后移（跳过 `t` 的当前字符）；
  - 最终若 `i` 遍历完 `s`，说明全部匹配成功

- 代码实现

  ```cpp
  #include <iostream>
  #include <string>
  using namespace std;

  bool isSubsequence(string s, string t) {
      int i = 0, j = 0; // i指向s，j指向t
      int len_s = s.size(), len_t = t.size();

      while (i < len_s && j < len_t) {
          if (s[i] == t[j]) {
              i++; // 匹配成功，s指针后移
          }
          j++; // 无论是否匹配，t指针都后移
      }

      // 若i遍历完s，说明所有字符都匹配上了
      return i == len_s;
  }
  ```

- 动态规划法
  - `dp[i][j]` 表示以下标 i-1 为结尾的字符串 s，和以下标 j-1 为结尾的字符串 t，相同子序列的长度为`dp[i][j]`
  - 递推公式
    - `if (s[i - 1] == t[j - 1]) dp[i][j] = dp[i-1][j-1] +1`
    - `if (s[i - 1] != t[j - 1]) dp[i][j] = dp[i-1][j-2]`
  - 初始化：`dp[0][0]=0,dp[i][0]=0`
  - 这里，在定义 `dp[i][j]` 含义时，要表示以下标 i-1 为结尾的字符串 s，和以下标 j-1 为结尾的字符串 t，就是为了在 dp 二维矩阵中可以留出初始化的区间

- 代码实现

  ```cpp
  class Solution {
  public:
      bool isSubsequence(string s, string t) {
          vector<vector<int>> dp(s.size() + 1, vector<int>(t.size() + 1, 0));
          for (int i = 1; i <= s.size(); i++) {
              for (int j = 1; j <= t.size(); j++) {
                  if (s[i - 1] == t[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
                  else dp[i][j] = dp[i][j - 1];
              }
          }
          if (dp[s.size()][t.size()] == s.size()) return true;
          return false;
      }
  };
  ```

- 动态规划法（适合多次查询 `s` 的场景）,若需要多次判断不同的 `s` 是否为 `t` 的子序列，双指针每次都要遍历 `t` 效率低，动态规划可预处理 `t` 的信息
  1.  状态定义：`dp[i][j]` 表示 `t` 中第 `i` 个位置之后，字符 `j`（`j` 对应 `a-z`，0-25）第一次出现的位置；
  2.  状态转移：从后往前遍历 `t`，
      - 若 `t[i]` 对应字符为 `c`，则 `dp[i][c] = i`；
      - 其他字符 `j`，`dp[i][j] = dp[i+1][j]`（继承后面位置的结果）；
  3.  查询逻辑：遍历 `s`，用 `dp` 快速找到 `t` 中匹配的位置，若中途找不到则返回 `false`

- 代码实现

  ```cpp
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;

  // 预处理t的dp数组，供多次查询使用
  vector<vector<int>> preprocess(string& t) {
      int n = t.size();
      // dp[i][j]：t[i...]中字符j（0-25）第一次出现的位置，初始为n（表示不存在）
      vector<vector<int>> dp(n + 1, vector<int>(26, n));

      // 从后往前遍历，填充dp数组
      for (int i = n - 1; i >= 0; --i) {
          // 先继承后一个位置的结果
          dp[i] = dp[i + 1];
          // 更新当前字符的位置
          int c = t[i] - 'a';
          dp[i][c] = i;
      }
      return dp;
  }

  // 判断s是否为t的子序列（基于预处理的dp数组）
  bool isSubsequence_dp(string s, string t, vector<vector<int>>& dp) {
      int m = s.size(), n = t.size();
      int idx = 0; // 当前在t中的位置

      for (char ch : s) {
          int c = ch - 'a';
          // 若当前位置之后没有该字符，直接返回false
          if (dp[idx][c] == n) return false;
          // 跳到该字符的下一个位置，继续匹配
          idx = dp[idx][c] + 1;
      }
      return true;
  }
  ```

- 参考题目
  - [392. 判断子序列](https://leetcode.cn/problems/is-subsequence/description/)
  - [792. 匹配子序列的单词数](https://leetcode.cn/problems/number-of-matching-subsequences/)
  - [2486. 追加字符以获得子序列](https://leetcode.cn/problems/append-characters-to-string-to-make-subsequence/description/)
  - [2825. 循环增长使字符串子序列等于另一个字符串](https://leetcode.cn/problems/make-string-a-subsequence-using-cyclic-increments/description/)

### 不同的子序列

- 给你两个字符串 `s` 和 `t` ，统计并返回在 `s` 的子序列中 `t` 出现的个数，测试用例保证结果在 32 位有符号整数范围内

- 如果考虑的是连续序列（子串），而不是子序列，就可以考虑 KMP 算法

- dp 数组的定义：以 i-1 为结尾的 s 子序列中出现以 j-1 为结尾的 t 的个数为 `dp[i][j]`

- s[i - 1] 与 t[j - 1] 相等
  - 用 s[i - 1] 来匹配，那么个数为 `dp[i - 1][j - 1]`，即不需要考虑当前 s 子串和 t 子串的最后一位字母，所以只需要 `dp[i-1][j-1]`
  - 不用 s[i - 1] 来匹配，个数为 `dp[i - 1][j]`
  - `dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];`

- s[i - 1] 与 t[j - 1] 不相等
  - `dp[i][j]` 只有一部分组成，不用 s[i - 1] 来匹配（就是模拟在 s 中删除这个元素），即 `dp[i - 1][j]`
  - `dp[i][j] = dp[i - 1][j];`

- `dp[i][0]` 表示以 i-1 为结尾的 s 可以随便删除元素，出现空字符串的个数，那么 `dp[i][0]=1`

- `dp[0][j]` 表示空字符串 s 可以随便删除元素，出现以 j-1 为结尾的字符串 t 的个数，那么 `dp[0][j]=0`

- `dp[0][0]=1`：空字符串 s，可以删除 0 个元素，变成空字符串 t

- 代码实现

  ```cpp
  class Solution {
  public:
      int numDistinct(string s, string t) {
          vector<vector<uint64_t>> dp(s.size() + 1, vector<uint64_t>(t.size() + 1));
          for (int i = 0; i < s.size(); i++) dp[i][0] = 1;
          for (int j = 1; j < t.size(); j++) dp[0][j] = 0;
          for (int i = 1; i <= s.size(); i++) {
              for (int j = 1; j <= t.size(); j++) {
                  if (s[i - 1] == t[j - 1]) {
                      dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
                  } else {
                      dp[i][j] = dp[i - 1][j];
                  }
              }
          }
          return dp[s.size()][t.size()];
      }
  };
  ```

- 参考题目
  - [115. 不同的子序列](https://leetcode.cn/problems/distinct-subsequences/description/)

### 两个字符串的删除操作

- 给定两个单词 `word1` 和 `word2` ，返回使得 `word1` 和 `word2` 相同所需的最小步数

- 每步可以删除任意一个字符串中的一个字符

- 与不同的子序列相比，这里两个字符串都可以删除

- 确定dp数组（dp table）以及下标的含义：`dp[i][j]` 表示以 i-1 为结尾的字符串 word1，和以 j-1 位结尾的字符串 word2，想要达到相等，所需要删除元素的最少次数

- 当 word1[i - 1] 与 word2[j - 1] 相同时，`dp[i][j] = dp[i - 1][j - 1]`

- 当 word1[i - 1] 与 word2[j - 1] 不相同的时候，有三种情况：
  - 情况一：删word1[i - 1]，最少操作次数为 `dp[i - 1][j] + 1`
  - 情况二：删 word2[j - 1]，最少操作次数为 `dp[i][j - 1] + 1`
  - 情况三：同时删 word1[i - 1] 和 word2[j - 1]，操作的最少次数为 `dp[i - 1][j - 1] + 2`
  - 递推公式：`dp[i][j] = min({dp[i - 1][j - 1] + 2, dp[i - 1][j] + 1, dp[i][j - 1] + 1});`

  - 因为 `dp[i][j - 1] + 1 = dp[i - 1][j - 1] + 2`，所以递推公式可简化为：`dp[i][j] = min(dp[i - 1][j] + 1, dp[i][j - 1] + 1);`

- 初始化 dp 数组
  - `dp[i][0]`：word2 为空字符串，以 i-1 为结尾的字符串 word1 要删除多少个元素，才能和 word2相同，显然 `dp[i][0] = i`
  - `dp[0][j]`：word1 为空字符串，以 j-1 为结尾的字符串 word2 要删除多少个元素，才能和 word1相同，显然 `dp[0][j] = j`

- 代码实现

  ```cpp
  class Solution {
  public:
      int minDistance(string word1, string word2) {
          vector<vector<int>> dp(word1.size() + 1, vector<int>(word2.size() + 1));
          for (int i = 0; i <= word1.size(); i++) dp[i][0] = i;
          for (int j = 0; j <= word2.size(); j++) dp[0][j] = j;
          for (int i = 1; i <= word1.size(); i++) {
              for (int j = 1; j <= word2.size(); j++) {
                  if (word1[i - 1] == word2[j - 1]) {
                      dp[i][j] = dp[i - 1][j - 1];
                  } else {
                      dp[i][j] = min(dp[i - 1][j] + 1, dp[i][j - 1] + 1);
                  }
              }
          }
          return dp[word1.size()][word2.size()];
      }
  };
  ```

- 实际上，与最长公共子序列类似，只要求出两个字符串的最长公共子序列长度即可，除了最长公共子序列之外的字符都必须删除，最后用两个字符串的总长度减去两个最长公共子序列的长度就是删除的最少步数

- 参考题目
  - [583. 两个字符串的删除操作](https://leetcode.cn/problems/delete-operation-for-two-strings/description/)

### 编辑距离

- 给两个单词 `word1` 和 `word2`， 返回将 `word1` 转换成 `word2` 所使用的最少操作数

- 可以对一个单词进行如下三种操作：
  - 插入一个字符
  - 删除一个字符
  - 替换一个字符

- dp 数组定义：`dp[i][j]` 表示以下标 i-1 为结尾的字符串 word1，和以下标 j-1 为结尾的字符串 word2，最近编辑距离为 `dp[i][j]`

- 递推公式

  ```cpp
  if (word1[i - 1] == word2[j - 1])
      //不操作，不用编辑，编辑距离就是上一个编辑距离
      dp[i][j] = dp[i - 1][j - 1];
  if (word1[i - 1] != word2[j - 1])
      //增或删
      // word1 删除元素，即以下标 i - 2 为结尾的 word1 与 j-1 为结尾的 word2 的最近编辑距离再加一个操
      dp[i][j]=dp[i-1][j]+1;
  	// word2 删除元素
  	dp[i][j]=dp[i][j-1]+1;
  	// word2 添加元素，相当于 word1 删除元素
      //换
  	dp[i][j] = dp[i - 1][j - 1] + 1;
  	// 取最小值
  	dp[i][j] = min({dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]}) + 1;
  ```

- 如何初始化
  - `dp[i][0]`：以下标 i-1 为结尾的字符串 word1，和空字符串 word2，最近编辑距离，即为 i
  - `dp[0][j]`：同理为 j

- 代码实现

  ```cpp
  class Solution {
  public:
      int minDistance(string word1, string word2) {
          vector<vector<int>> dp(word1.size() + 1, vector<int>(word2.size() + 1, 0));
          for (int i = 0; i <= word1.size(); i++) dp[i][0] = i;
          for (int j = 0; j <= word2.size(); j++) dp[0][j] = j;
          for (int i = 1; i <= word1.size(); i++) {
              for (int j = 1; j <= word2.size(); j++) {
                  if (word1[i - 1] == word2[j - 1]) {
                      dp[i][j] = dp[i - 1][j - 1];
                  }
                  else {
                      dp[i][j] = min({dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]}) + 1;
                  }
              }
          }
          return dp[word1.size()][word2.size()];
      }
  };
  ```

- 参考题目
  - [72. 编辑距离](https://leetcode.cn/problems/edit-distance/description/)
  - [3579. 字符串转换需要的最小操作数](https://leetcode.cn/problems/minimum-steps-to-convert-string-with-operations/description/)
  - [2209. 用地毯覆盖后的最少白色砖块](https://leetcode.cn/problems/minimum-white-tiles-after-covering-with-carpets/description/)
  - [3503. 子字符串连接后的最长回文串 I](https://leetcode.cn/problems/longest-palindrome-after-substring-concatenation-i/description/)
  - [3504. 子字符串连接后的最长回文串 II](https://leetcode.cn/problems/longest-palindrome-after-substring-concatenation-ii/description/)

## 回文

### 回文子串

- 给一个字符串 `s` ，请统计并返回这个字符串中回文子串的数目

- 判断字符串 S 是否是回文的，如果知道中间的子串是回文的，那么只需要比较首尾两个元素是否相同，如果相同说明就是回文串

- 也即，判断一个子字符串 [i,j] 是否回文，依赖于子字符串 [i+1, j-1] 是否回文

- dp 数组的含义：`dp[i][j]` 表示区间范围 [i,j] 内的子串是否为回文子串（布尔类型）

- 当 s[i] 与 s[j] 不相等时，`dp[i][j]=false`

- 当 s[i] 与 s[j] 相等时
  - 如果 `i==j`，是回文子串
  - 如果 `|i-j|==1`，是回文子串
  - 如果 `|i-j|>1`，则 `dp[i][j]=dp[i+1][j-1]`

- dp 数组初始化，显然 `dp[i][j]=false`

- 在二维数组中，`dp[i][j]` 依赖于 `dp[i+1][j-1]`，即依赖左下角的值，因此需要从下到上，从左往右遍历

- 代码实现

  ```cpp
  class Solution {
  public:
      int countSubstrings(string s) {
          vector<vector<bool>> dp(s.size(), vector<bool>(s.size(), false));
          int result = 0;
          for (int i = s.size() - 1; i >= 0; i--) {  // 注意遍历顺序
              for (int j = i; j < s.size(); j++) {
                  if (s[i] == s[j]) {
                      if (j - i <= 1) { // 情况一 和 情况二
                          result++;
                          dp[i][j] = true;
                      } else if (dp[i + 1][j - 1]) { // 情况三
                          result++;
                          dp[i][j] = true;
                      }
                  }
              }
          }
          return result;
      }
  };
  ```

- 精简后代码

  ```cpp
  class Solution {
  public:
      int countSubstrings(string s) {
          vector<vector<bool>> dp(s.size(), vector<bool>(s.size(), false));
          int result = 0;
          for (int i = s.size() - 1; i >= 0; i--) {
              for (int j = i; j < s.size(); j++) {
                  if (s[i] == s[j] && (j - i <= 1 || dp[i + 1][j - 1])) {
                      result++;
                      dp[i][j] = true;
                  }
              }
          }
          return result;
      }
  };
  ```

- 双指针法

- 回文串的对称性决定了：任何回文串都有一个 “中心”——
  - 奇数长度回文：中心是单个字符（如 `"aba"` 的中心是`b`）
  - 偶数长度回文：中心是两个字符之间的间隙（如 `"abba"`的中心在两个 `b`之间）
  - 遍历每个可能的中心，向左右扩展，直到字符不相等，记录扩展出的最长回文子串

  ```cpp
  class Solution {
  public:
      int countSubstrings(string s) {
          int result = 0;
          for (int i = 0; i < s.size(); i++) {
              result += extend(s, i, i, s.size()); // 以i为中心
              result += extend(s, i, i + 1, s.size()); // 以i和i+1为中心
          }
          return result;
      }
      int extend(const string& s, int i, int j, int n) {
          int res = 0;
          while (i >= 0 && j < n && s[i] == s[j]) {
              i--;
              j++;
              res++;
          }
          return res;
      }
  };
  ```

- 参考题目
  - [647. 回文子串](https://leetcode.cn/problems/palindromic-substrings/)
  - [5. 最长回文子串](https://leetcode.cn/problems/longest-palindromic-substring/description/)
  - [516. 最长回文子序列](https://leetcode.cn/problems/longest-palindromic-subsequence/description/)
  - [336. 回文对](https://leetcode.cn/problems/palindrome-pairs/description/)
  - [2472. 不重叠回文子字符串的最大数目](https://leetcode.cn/problems/maximum-number-of-non-overlapping-palindrome-substrings/description/)

### 最长回文子串

- 给一个字符串 `s`，找到 `s` 中最长的回文子串

- 在回文子串的基础上，进行修改即可

  ```cpp
  class Solution {
  public:
      string longestPalindrome(string s) {
          int n = s.size();
          if (n < 2) return s; // 边界：单字符直接返回

          // dp[i][j] 表示s[i..j]是否为回文子串
          vector<vector<bool>> dp(n, vector<bool>(n, false));
          int start = 0; // 最长回文子串的起始索引
          int max_len = 1; // 最长回文子串的长度（初始为1，单字符）

          // 遍历顺序：i从下到上（n-1 -> 0），j从i到n-1
          for (int i = n - 1; i >= 0; i--) {
              for (int j = i; j < n; j++) {
                  // 判断s[i..j]是否为回文
                  if (s[i] == s[j]) {
                      if (j - i <= 1) { // 长度1或2，直接是回文
                          dp[i][j] = true;
                      } else { // 长度>2，依赖内部子串
                          dp[i][j] = dp[i+1][j-1];
                      }
                  }

                  // 如果是回文，且长度超过当前最大值，更新记录
                  if (dp[i][j] && (j - i + 1) > max_len) {
                      max_len = j - i + 1;
                      start = i;
                  }
              }
          }

          // 截取最长回文子串
          return s.substr(start, max_len);
      }
  };
  ```

- 双指针法

  ```cpp
  class Solution {
  public:
      string longestPalindrome(string s) {
          int n = s.size();
          if (n < 2) return s;

          int start = 0; // 最长回文起始索引
          int max_len = 1; // 最长回文长度

          // 中心扩展函数：返回以i/j为中心的最长回文子串的【起始索引, 长度】
          auto extend = [&](int i, int j) -> pair<int, int> {
              while (i >= 0 && j < n && s[i] == s[j]) {
                  i--;
                  j++;
              }
              // 退出循环时，有效回文是[i+1..j-1]，长度为 (j-1)-(i+1)+1 = j-i-1
              return {i + 1, j - i - 1};
          };

          // 遍历每个可能的中心
          for (int i = 0; i < n; i++) {
              // 奇数长度：中心为i
              auto [start1, len1] = extend(i, i);
              // 偶数长度：中心为i和i+1之间
              auto [start2, len2] = extend(i, i + 1);

              // 更新最长回文信息
              if (len1 > max_len) {
                  max_len = len1;
                  start = start1;
              }
              if (len2 > max_len) {
                  max_len = len2;
                  start = start2;
              }
          }

          return s.substr(start, max_len);
      }
  };
  ```

### 最长回文子序列

- 给一个字符串 `s` ，找出其中最长的回文子序列，并返回该序列的长度

- 回文子串是连续的，而回文子序列是不连续的

- dp 数组的含义：`dp[i][j]` 表示区间范围 [i,j] 内的最长回文子序列长度

- 递推公式
  - 如果 s[i] 与 s[j] 相同，那么 `dp[i][j] = dp[i + 1][j - 1] + 2;`
  - 如果 s[i] 与 s[j] 不相同，那么 `dp[i][j] = max(dp[i + 1][j], dp[i][j - 1]);`

- dp 数组初始化
  - `dp[i][j]=1，当 i==j 时`
  - 其他元素初始化为 0

- 遍历顺序：`dp[i][j]` 依赖于 `dp[i + 1][j - 1]` ，`dp[i + 1][j]` 和 `dp[i][j - 1]`，因此要从下往上，从左到右遍历

- 代码实现

  ```cpp
  class Solution {
  public:
      int longestPalindromeSubseq(string s) {
          vector<vector<int>> dp(s.size(), vector<int>(s.size(), 0));
          for (int i = 0; i < s.size(); i++) dp[i][i] = 1;
          for (int i = s.size() - 1; i >= 0; i--) {
              for (int j = i + 1; j < s.size(); j++) {
                  if (s[i] == s[j]) {
                      dp[i][j] = dp[i + 1][j - 1] + 2;
                  } else {
                      dp[i][j] = max(dp[i + 1][j], dp[i][j - 1]);
                  }
              }
          }
          return dp[0][s.size() - 1];
      }
  };
  ```

## 其他

### 跳跃游戏 V

- 给你一个整数数组 `arr` 和一个整数 `d` 。每一步你可以从下标 `i` 跳到：
  - `i + x` ，其中 `i + x < arr.length` 且 `0 < x <= d` 。
  - `i - x` ，其中 `i - x >= 0` 且 `0 < x <= d` 。

- 除此以外，你从下标 `i` 跳到下标 `j` 需要满足：`arr[i] > arr[j]` 且 `arr[i] > arr[k]` ，其中下标 `k` 是所有 `i` 到 `j` 之间的数字（更正式的，`min(i, j) < k < max(i, j)`）

- 你可以选择数组的任意下标开始跳跃，请你返回你 最多 可以访问多少个下标

- 初次看到这个题目，会想到先用单调栈预处理左侧第一个更大元素，然后处理右侧第一个更大元素，那个这个元素的跳跃范围便可以确定，然后 DFS 求解有多少个节点已经访问过，但是题目所问的并不是最大的连通块大小；而是问的从某个位置开始跳跃，最大可以跳跃的次数，也就是某个位置，其只能挑选一个位置跳过去，而不是向 DFS 一样，遍历所有能够跳跃到的位置

- 而这个问题，实际上是一个动态规划问题，dp[i] 表示下标 i 的位置能够访问到的最多下标，那么 `dp[i]=max(dp[j])+1`，j 是 i 能够跳跃到的位置

- 代码实现

  ```cpp
  class Solution {
  public:
      vector<int> dp;
      vector<int> arr;
      int d;
      int n;

      int dfs(int i) {
          if (dp[i] != 0) return dp[i];
          int res = 1;
          // 向左跳 1~d 步
          for (int j = i - 1; j >= max(0, i - d); j--) {
              if (arr[j] >= arr[i]) break; // 遇到更高的，不能跳了
              res = max(res, 1 + dfs(j));
          }
          // 向右跳 1~d 步
          for (int j = i + 1; j <= min(n - 1, i + d); j++) {
              if (arr[j] >= arr[i]) break;
              res = max(res, 1 + dfs(j));
          }
          return dp[i] = res;
      }

      int maxJumps(vector<int>& arr, int d) {
          this->arr = arr;
          this->d = d;
          n = arr.size();
          dp.resize(n, 0);
          int ans = 0;
          for (int i = 0; i < n; i++) {
              ans = max(ans, dfs(i));
          }
          return ans;
      }
  };
  ```

- 如何转换为递推版本？这道题的本质是只能从高的点 跳到 矮的点，也就是必须按高度从小到大递推，因此需要按 arr 的值从小到大排序

  ```cpp
  class Solution {
  public:
      int maxJumps(vector<int>& arr, int d) {
          int n = arr.size();
          vector<int> dp(n, 1);  // dp[i] 初始 = 1（自身）
          vector<int> idx(n);

          // 步骤1：生成下标，并按 arr 的值从小到大排序
          iota(idx.begin(), idx.end(), 0);
          sort(idx.begin(), idx.end(), [&](int a, int b) {
              return arr[a] < arr[b];
          });

          // 步骤2：按从矮到高 递推 dp
          for (int i : idx) {
              // 向左跳 1~d 步
              for (int j = i - 1; j >= max(0, i - d); j--) {
                  if (arr[j] >= arr[i]) break;
                  dp[i] = max(dp[i], dp[j] + 1);
              }
              // 向右跳 1~d 步
              for (int j = i + 1; j <= min(n - 1, i + d); j++) {
                  if (arr[j] >= arr[i]) break;
                  dp[i] = max(dp[i], dp[j] + 1);
              }
          }

          // 取最大值
          return *max_element(dp.begin(), dp.end());
      }
  };
  ```

### 美团 2027 届实习第二次笔试（博弈 DP）

- 有一个 `n × m` 的棋盘，记第 `i` 行第 `j` 列为 `a_{i,j}`，字符仅为 `'0'` 或 `'1'`。棋盘上有且仅有一个棋子，初始位置在左上角 `(1,1)`

- 两名同学轮流操作，天才同学先手。在每一次操作中，当前同学需要将棋子从当前位置向右或向下移动一步（若对应方向越界，则该方向不可选）。移动完成后，若新的格子字符为 `'1'`，则本次移动的同学记 `+1` 分；若为 `'0'`，则记 `-1` 分。初始格子 `(1,1)` 不记分

- 当棋子到达右下角 `(n,m)` 后，游戏立即结束（此时无法继续移动）。请计算在双方都采取最优策略时，天才同学的总分减去笨蛋同学的总分的差值

- 输入描述
  - 第一行输入两个整数 `n, m`（`1 ≤ n, m ≤ 2×10^5`；`n × m ≤ 4×10^5`）
  - 此后一共 `n` 行，每行输入一个长度为 `m` 的字符串，仅包含字符 `'0'` 与 `'1'`，表示棋盘

- 输出描述
  - 输出一个整数，为最优博弈下天才同学分数减笨蛋同学分数的差值

- 这是一个零和博弈 + 动态规划问题：
  - 状态定义：`dp[i][j]` 表示当前在格子 `(i,j)` 时，当前玩家能获得的最大净得分（当前玩家总分 - 对手总分）
  - 边界条件：到达终点 `(n,m)` 时游戏结束，无法再移动，故 `dp[n][m] = 0`
  - 转移方程：
    - 对于非终点格子 `(i,j)`，当前玩家只能向右 `(i,j+1)` 或向下 `(i+1,j)` 移动
    - 移动到下一格 `(nx, ny)` 后，下一格的得分 `val = (a[nx][ny] == '1' ? 1 : -1)`，之后轮到对手操作，对手的最优净得分是 `dp[nx][ny]`
    - 当前玩家的收益为 `val - dp[nx][ny]`（对手的净得分会反过来减少当前玩家的优势）
    - 因此：`dp[i][j] = max( val_right - dp[i][j+1], val_down - dp[i+1][j])`
  - 遍历顺序：从终点 `(n,m)` 开始，逆序遍历（从下到上、从右到左），保证计算 `dp[i][j]` 时，`dp[i][j+1]` 和 `dp[i+1][j]` 已经计算完成

- 代码实现

  ```cpp
  #include <bits/stdc++.h>
  using namespace std;

  typedef long long ll;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);

      int n, m;
      cin >> n >> m;
      vector<string> a(n + 1);  // 1-based
      for (int i = 1; i <= n; i++) {
          cin >> a[i];
          a[i] = " " + a[i];  // 让列从1开始
      }

      vector<vector<ll>> dp(n + 2, vector<ll>(m + 2, 0));
      // 从终点逆推
      for (int i = n; i >= 1; i--) {
          for (int j = m; j >= 1; j--) {
              if (i == n && j == m) continue;  // 终点dp为0
              vector<ll> ops;
              // 向右走
              if (j + 1 <= m) {
                  ll val = (a[i][j+1] == '1') ? 1 : -1;
                  ops.push_back(val - dp[i][j+1]);
              }
              // 向下走
              if (i + 1 <= n) {
                  ll val = (a[i+1][j] == '1') ? 1 : -1;
                  ops.push_back(val - dp[i+1][j]);
              }
              // 当前玩家取最大值
              dp[i][j] = *max_element(ops.begin(), ops.end());
          }
      }

      cout << dp[1][1] << endl;
      return 0;
  }
  ```

### 美团 2027 届实习第二次笔试（划分型 DP）

- 给定一个数组 $t$，定义任意数 $x$ 在 $t$ 中的出现次数为 $\text{cnt}(x)$。称 $t$ 被 $v$ 支配，当且仅当对任意 $v'$ 有 $\text{cnt}(v) \ge \text{cnt}(v')$；若出现次数相同，则取数值最大的那个 $v$。定义数组 $t$ 的权值为 $v \times |t|$（其中 $|t|$ 为 $t$ 的长度）

- 现在给定一个长度为 $n$ 的数组 $a_1,a_2,\dots,a_n$，你需要将其划分为若干个非空连续子数组，使得各子数组权值之和最小，输出该最小值

- 输入包含多组测试数据
  - 第一行包含整数 $T$（$1 \le T \le 10^3$​）表示测试组数，每组数据描述如下：
  - 第一行包含一个整数 $n$（$1 \le n \le 2 \times 10^3$）
  - 第二行包含 $n$ 个整数，表示数组 $a_1,a_2,\dots,a_n$（$-10^9 \le a_i \le 10^9$）
  - 保证所有测试中 $n$ 的总和不超过 $5 \times 10^3$

- 输出描述：对于每组测试数据，输出一行一个整数，表示将数组划分为若干非空连续子数组后，权值之和的最小值。

- 输入例子

  ```
  3
  5
  1 1 2 2 3
  3
  5 5 5
  4
  1 2 3 4
  ```

- 输出例子

  ```
  8
  15
  10
  ```

- 例子说明
  - 样例一：一种最优划分为 $[1,1,2],[2],[3]$，权值分别为 $1 \times 3, 2 \times 1, 3 \times 1$，总和 $3+2+3=8$
  - 样例二：任意划分总和均为 $5 \times 3 = 15$
  - 样例三：将其划分为单点 $[1],[2],[3],[4]$，总和 $1+2+3+4=10$

- 显然，可以用动态规划解决
  - f[i] = 前 i 个数字划分完后的最小总权值

  - 枚举分割点 `j`，把数组分成：
    - 前 `j` 个元素（已划分好，最优解为 `dp[j]`）

    - 从 `j` 到 `i` 的新一段（计算这段的权值）

  - 转移方程

    ```text
    dp[i] = min(dp[i], dp[j] + 新段权值)
    ```

  - 每一段的权值 = 支配值 × 段长度，而支配值：段内出现次数最多的数，次数相同时选数值更大的数

- 代码实现

  ```cpp
  #include <climits>
  #include <iostream>
  #include <unordered_map>
  #include <vector>
  #include <algorithm>
  using namespace std;

  using ll = long long;
  const ll INF = 1e18;

  ll getMinWeight(vector<int>& nums) {
      int n = nums.size();
      vector<ll> f(n + 1, INF);
      f[0] = 0; // 前0个元素的最小权值和为0

      for (int j = 0; j < n; ++j) {
          unordered_map<int, int> freq;
          int maxFreq = 0;
          int domVal = INT_MIN;

          for (int i = j + 1; i <= n; ++i) {
              int val = nums[i - 1];
              freq[val]++;

              // 更新支配值：频率更高 或 频率相同但值更大
              if (freq[val] > maxFreq || (freq[val] == maxFreq && val > domVal)) {
                  maxFreq = freq[val];
                  domVal = val;
              }

              // 计算当前段[j, i-1]的权值
              ll weight = (ll)domVal * (i - j);
              // 状态转移：前i个元素的最小权值和 = min(原值, 前j个的最小和 + 当前段权值)
              f[i] = min(f[i], f[j] + weight);
          }
      }

      return f[n];
  }

  int main() {
      int T;
      cin >> T;
      while (T--) {
          int n;
          cin >> n;
          vector<int> nums(n);
          for (int i = 0; i < n; i++) cin >> nums[i];
          printf("%lld\n", getMinWeight(nums));
      }
      return 0;
  }
  ```

### 美团 2027 届实习第三次笔试（01 背包）

- 有红、黑两棵树，共进行 $n$ 天，每天可选三种操作之一：
  - 浇灌红树，累加第 $i$ 天红浇灌值
  - 浇灌黑树，累加第 $i$ 天黑浇灌值
  - 休息

- 限制：全程最多休息 $k$ 天

- 给定长度为 $n$ 数组：红每日浇灌值 $R[]$、黑每日浇灌值 $B[]$，求：两棵树总浇灌量的最小绝对差值

- `dp[i][j] = 前 i 天，用了 j 次休息，红总和 − 黑总和 的值`
  - 浇红：`dp[i][j] = dp[i-1][j] + R[i-1]`
  - 浇黑：`dp[i][j] = dp[i-1][j] - B[i-1]`
  - 休息（j ≥ 1）：`dp[i][j] = dp[i-1][j-1]`

- 代码实现

  ```cpp
  int minDiff(vector<int>& R, vector<int>& B, int n, int k) {
      // dp[i][j]：前 i 天，休息 j 次，红 - 黑的差值
      vector<vector<int>> dp(n + 1, vector<int>(k + 1, 0));

      for (int i = 1; i <= n; ++i) {
          for (int j = 0; j <= k; ++j) {
              // 1. 浇红树
              int opt1 = dp[i-1][j] + R[i-1];
              // 2. 浇黑树
              int opt2 = dp[i-1][j] - B[i-1];
              // 3. 休息（必须 j >= 1）
              int opt3 = (j >= 1) ? dp[i-1][j-1] : INT_MAX;

              // 选择让 abs 最小的那个
              int best = opt1;
              if (abs(opt2) < abs(best)) best = opt2;
              if (j >= 1 && abs(opt3) < abs(best)) best = opt3;

              dp[i][j] = best;
          }
      }

      // 取所有休息次数 0~k 中的最小绝对值
      int ans = INT_MAX;
      for (int j = 0; j <= k; ++j) {
          ans = min(ans, abs(dp[n][j]));
      }
      return ans;
  }
  ```

- 空间优化

  ```cpp
  int minDiff(vector<int>& R, vector<int>& B, int n, int k) {
      // 空间压缩：只用一维 dp[j] = 休息 j 次时的 红-黑 差值
      vector<int> dp(k + 1, 0);

      for (int i = 0; i < n; ++i) {
          // 必须倒序遍历，防止覆盖上一轮的值
          for (int j = k; j >= 0; --j) {
              int opt1 = dp[j] + R[i];    // 浇红
              int opt2 = dp[j] - B[i];    // 浇黑
              int best = (abs(opt1) < abs(opt2)) ? opt1 : opt2;

              // 可以休息
              if (j >= 1) {
                  int opt3 = dp[j - 1];   // 休息
                  if (abs(opt3) < abs(best))
                      best = opt3;
              }
              dp[j] = best;
          }
      }

      int ans = INT_MAX;
      for (int j = 0; j <= k; ++j)
          ans = min(ans, abs(dp[j]));
      return ans;
  }
  ```

## DP 题目类型

- 背包 DP：几乎所有资源分配、选或不选问题
  - 01 背包：分割等和子集、最后一块石头的重量、一和零、目标和

  - 完全背包：零钱兑换、零钱兑换 II、组合总和 IV、爬楼梯、斐波那契类、完全平方数

  - 多重背包

  - 分组背包

  - 背包方案数、恰好装满、背包容量为 k 的前提下的最大/最小价值

- 线性 DP ：状态沿着一维数组 / 序列转移
  - 不连续子序列：最长递增子序列 LIS、最长公共子序列 LCS、最长递增公共子序列
  - 连续子数组：最大子数组和（Kadane）、最长连续递增数组、最长重复子数组（718）
  - 打家劫舍 I、打家劫舍 II
  - 单词拆分
- 多维 DP：多个字符串/数组
  - 不同路径
  - 编辑距离
  - 两个字符串的删除操作
  - 最小路径和
  - 最长公共子序列 LCS、最长递增公共子序列
- 区间 DP：在区间 `[i,j]` 上做决策，从小区间推到大区间
  - 矩阵链乘法

  - 最长回文子串、最长回文子序列

  - 戳气球

  - 合并石子

  - 括号匹配类问题

- 树形 DP ：在树上做 DP，子节点推父节点
  - 树的最大独立集

  - 树的直径

  - 树的最大路径和

  - 打家劫舍 III

  - 子树统计类

- 状态压缩 DP（状压 DP）：用二进制表示状态，常见于小集合问题
  - 旅行商问题 TSP

  - 排列问题、分配问题

  - 棋盘类状压（如铺地砖）

- 数位 DP：求 `[L, R]` 内满足某种数字性质的数的个数
  - 不包含连续 1

  - 数字和为 k

  - 数字 0~9 出现次数统计

- 计数 DP / 概率 DP：求方案数、概率、期望
  - 路径方案数

  - 掷骰子概率

  - 期望 DP

- 坐标 / 网格 DP ：在二维网格上移动
  - 最小路径和

  - 不同路径

  - 地下城游戏

  - 机器人路径

- 双序列 DP：两个字符串 / 序列互相匹配
  - LCS

  - 编辑距离

  - 正则表达式匹配

  - 通配符匹配

- 博弈 DP：两个人轮流取，求谁必胜
  - 取石子游戏

  - 预测赢家

  - 数字博弈类
