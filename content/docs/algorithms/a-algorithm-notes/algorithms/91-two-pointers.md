---
title: 双指针
description: 双指针技巧的核心思想、分类（相向、同向、滑动窗口）
---

## 基本思想

- 双指针法的核心是用两个指针（下标）在数组 / 链表上移动，替代暴力枚举的嵌套循环，将时间复杂度从 $O (n^2)$ 降到 $O (n)$​，所有应用场景都围绕 “减少重复遍历” 展开
- 相向双指针：数组 / 字符串的「两端向中间」移动（左右指针）
  - 适用于有序数组 / 字符串，需要从两端向中间逼近找目标的场景，核心是 “缩小搜索范围”
  - 两数之和（有序数组）
  - 反转字符串
  - 盛最多水的容器
- 同向双指针：数组 / 链表的「同向快慢」移动（快慢指针）
  - 适用于需要找规律 / 去重 / 找环的场景，核心是 “快指针探路，慢指针记录有效位置 / 找环”
  - 移除数组中的重复项（有序数组）
  - 链表中环的检测（Floyd 判圈算法）
  - 删除链表的倒数第 N 个节点
  - 移动零
- 滑动窗口（双指针维护窗口范围）
  - 属于 “同向双指针” 的延伸，专门解决「子数组 / 子字符串的范围问题」
  - 核心是 “用左右指针维护一个窗口，动态调整窗口大小”（注：滑动窗口是双指针的进阶，本质还是双指针）
  - 无重复字符的最长子串
  - 最小覆盖子串
  - 长度最小的子数组
- 背向双指针
  - 两个指针从数组中的同一个位置出发，一个向左，另一个向右，背向移动
  - 好子数组的最大分数
- 双序列双指针：「两个数组 / 字符串」的同步遍历（双指针分别遍历）
  - 适用于需要合并 / 比较两个有序数组 / 字符串的场景，核心是 “一次遍历完成合并 / 比较”
  - 合并两个有序数组
  - 判断子序列
- 只要问题满足以下任一特征，优先考虑双指针：
  - 数据是有序的（数组 / 字符串），需要找两端 / 中间的目标；
  - 需要去重 / 找环 / 找倒数第 N 个元素（链表 / 数组）；
  - 需要合并 / 比较两个有序数据（两个数组 / 字符串）；
  - 需要找子数组 / 子字符串的范围（滑动窗口）；
  - 暴力解法是嵌套循环（O (n²)），希望优化到 O (n)
- 双指针是 “空间换时间” 的反向优化 —— 用 O (1) 的额外空间，把时间复杂度从平方级降到线性级
- 双指针的常见作用
  - 左指针作为处理后的结果的下标，右指针作为原数组的遍历下标，遇到符合条件的，就复制到左指针位置，然后左指针向右移动

## 定长滑动窗口

- 滑动窗口本质是用双指针（左指针 l + 右指针 r） 维护一个「窗口区间 [l, r]」，通过移动右指针扩大窗口、移动左指针收缩窗口，在遍历过程中动态更新目标值（如最大值、满足条件的子串数等），避免暴力枚举所有子区间，将时间复杂度从 O (n²) 优化到 O (n)

- 核心逻辑分为三步：
  - 扩大窗口：移动右指针 r，将新元素纳入窗口，更新窗口内的状态（如计数、和、满足条件的数量）；

  - 收缩窗口：当窗口不满足「约束条件」时（如长度超限、窗口内元素不满足题目要求），移动左指针 l，直到窗口重新满足条件；

  - 更新结果：在每一步（或收缩后），根据窗口状态更新最终结果

- 题目模板如下

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

### 定长子串中元音的最大数目

- 以题目 [1456. 定长子串中元音的最大数目](https://leetcode.cn/problems/maximum-number-of-vowels-in-a-substring-of-given-length/description/)为例，要求解所有长度恰好为 k 的子串中，最多可以包含多少个元音字母

- 显然，可以枚举所有子串，时间复杂度为 $O(nk)$，那么能否在 $O(1)$ 时间内统计每个子串的元音字母数量？

- 窗口右端点在 i 时，由于窗口长度为 k，所以窗口左端点为 i−k+1，其流程可以总结成三步：入-更新-出
  - 入：下标为 i 的元素进入窗口，更新相关统计量。如果窗口左端点 i−k+1<0，则尚未形成第一个窗口，重复第一步
  - 更新：更新答案，一般是更新最大值/最小值
  - 出：下标为 i−k+1 的元素离开窗口，更新相关统计量，为下一个循环做准备

- 代码实现

  ```cpp
  class Solution {
  public:
      int maxVowels(string s, int k) {
          int ans = 0, vowel = 0;
          for (int i = 0; i < s.size(); i++) { // 枚举窗口右端点 i
              // 1. 右端点进入窗口
              if (s[i] == 'a' || s[i] == 'e' || s[i] == 'i' || s[i] == 'o' || s[i] == 'u') {
                  vowel++;
              }

              int left = i - k + 1; // 窗口左端点
              if (left < 0) { // 窗口大小不足 k，尚未形成第一个窗口
                  continue;
              }

              // 2. 更新答案
              ans = max(ans, vowel);

              // 3. 左端点离开窗口，为下一个循环做准备
              char out = s[left];
              if (out == 'a' || out == 'e' || out == 'i' || out == 'o' || out == 'u') {
                  vowel--;
              }
          }
          return ans;
      }
  };
  ```

- 另一种写法如下

  ```cpp
  #include <string>
  #include <algorithm> // 用于max函数
  using namespace std;

  class Solution {
  public:
      // 函数功能：找出字符串s中长度为k的连续子串里包含的最大元音字母数量
      // 参数说明：
      //   s: 输入的字符串
      //   k: 子串的固定长度
      // 返回值：满足条件的子串中元音字母的最大数量
      int maxVowels(string s, int k) {
          int ans = 0; // 记录最终结果（最大元音字母数）
          int cur = 0; // 记录当前滑动窗口内的元音字母数量

          // 滑动窗口双指针：l是左边界，r是右边界，r逐个遍历字符串
          for (int l = 0, r = 0; r < s.size(); r++) {
              // 检查当前右指针指向的字符是否是元音字母，若是则当前窗口计数+1
              if (s[r] == 'a' || s[r] == 'e' || s[r] == 'i' || s[r] == 'o' || s[r] == 'u') {
                  cur++;
              }

              // 当窗口长度超过k时，需要收缩左边界
              if (r - l + 1 > k) {
                  // 如果左边界指向的字符是元音，窗口计数需要减1（因为该字符移出窗口）
                  if (s[l] == 'a' || s[l] == 'e' || s[l] == 'i' || s[l] == 'o' || s[l] == 'u') {
                      cur--;
                  }
                  l++; // 左指针右移，保持窗口长度为k
              }

              // 更新最大元音字母数
              ans = max(cur, ans);

              // 剪枝优化：如果当前最大数已经等于k（窗口长度），不可能更大了，直接退出循环
              if (ans == k) {
                  break;
              }
          }

          return ans; // 返回最大元音字母数
      }
  };
  ```

### 可获得的最大点数

- 题目：[1423. 可获得的最大点数](https://leetcode.cn/problems/maximum-points-you-can-obtain-from-cards/description/)

- 可以逆向思维来思考，拿走 k 张，剩下 n−k 张（这里 n 是 cardPoints 的长度）

- 由于拿走的点数和 + 剩下的点数和 = 所有点数和 = 常数，所以为了最大化拿走的点数和，应当最小化剩下的点数和

- 由于只能从开头或末尾拿牌，所以最后剩下的牌必然是连续的

- 至此，问题变成：计算长为 n−k 的连续子数组和的最小值

- 因此可以用定长窗口来解决

- 代码实现

  ```cpp
  #include <vector>
  #include <climits> // 用于INT_MAX
  #include <algorithm> // 用于min函数（代码中隐式使用）
  using namespace std;

  class Solution {
  public:
      // 函数功能：从数组nums中选取k个元素（只能从两端选取），返回选取元素的最大和（得分）
      // 解题思路：正难则反 → 总元素和 - 长度为(n-k)的连续子数组的最小和 = 最大得分
      // 参数说明：
      //   nums: 输入的整数数组
      //   k: 需要选取的元素个数
      // 返回值：选取k个元素的最大得分
      int maxScore(vector<int>& nums, int k) {
          int n = nums.size();          // 数组总长度
          int ans = INT_MAX;            // 记录长度为(n-k)的子数组的最小和（初始化为极大值）
          int sum = 0;                  // 记录当前滑动窗口内的子数组和
          int total = 0;                // 记录数组所有元素的总和

          // 第一步：计算数组的总元素和
          for (int num : nums)
              total += num;

          // 第二步：滑动窗口找长度为(n-k)的连续子数组的最小和
          // 窗口含义：[l, r] 是当前遍历的、长度为(n-k)的连续子数组
          for (int l = 0, r = 0; r < nums.size(); r++) {
              // 1. 扩大窗口：将右指针元素纳入窗口，更新窗口和
              sum += nums[r];

              // 2. 收缩窗口：当窗口长度超过(n-k)时，收缩左边界（定长窗口逻辑）
              if (r - l + 1 > n - k) {
                  sum -= nums[l]; // 移出左指针元素，更新窗口和
                  l++;            // 左指针右移，保持窗口长度为(n-k)
              }

              // 3. 更新最小和：仅当窗口长度正好为(n-k)时，才更新最小和
              if (r - l + 1 == n - k)
                  ans = min(ans, sum);
          }

          // 第三步：总总和 - 最小子数组和 = 选取k个元素的最大得分
          return total - ans;
      }
  };
  ```

## 不定长滑动窗口

- 适用于「最长无重复字符子串」「最小覆盖子串」等问题，核心约束是窗口内元素满足特定条件（如无重复、包含目标字符等）
  - 收缩条件：`窗口不满足约束条件`（如出现重复字符）
  - 收缩逻辑：用`while`（因为可能需要多次收缩才能满足条件）

- 题目模板

  ```cpp
  int variableLengthWindow(string s) {
      int n = s.size();
      int l = 0, res = 0;
      unordered_map<char, int> cnt; // 记录窗口内字符出现次数

      for (int r = 0; r < n; r++) {
          // 1. 扩大窗口：右指针入窗
          cnt[s[r]]++;

          // 2. 收缩窗口：窗口内有重复字符，持续收缩直到无重复
          while (l <= r && cnt[s[r]] > 1) { // check() = (cnt[s[r]] <=1)，取反即收缩条件
              cnt[s[l]]--;
              l++;
          }

          // 3. 更新结果：此时窗口无重复字符，计算长度
          res = max(res, r - l + 1);
      }
      return res;
  }
  ```

### 无重复字符的最长子串

- 为了统计子串中的字符个数，来判断是否满足无重复字符的条件，需要维护一个哈希表/哈希集合

- 当右窗口扩展后，有重复字符时，就要收缩左边界，直至满足条件

- 代码实现

  ```cpp
  #include <iostream>
  #include <string>
  #include <unordered_map>
  #include <algorithm>
  using namespace std;

  class Solution {
  public:
      int lengthOfLongestSubstring(string s) {
          int n = s.size();
          int max_len = 0;       // 记录最长无重复子串长度
          int left = 0;          // 窗口左指针
          unordered_map<char, int> window_cnt; // 记录窗口内每个字符的出现次数

          // 右指针遍历，扩大窗口
          for (int right = 0; right < n; right++) {
              char cur_char = s[right];
              window_cnt[cur_char]++; // 将当前字符加入窗口，计数+1

              // 核心：用while循环收缩左边界，直到窗口内无重复字符（所有字符计数≤1）
              // 这是通用变长窗口的收缩逻辑：只要窗口不满足约束（有重复），就持续收缩
              while (window_cnt[cur_char] > 1) {
                  char left_char = s[left];
                  window_cnt[left_char]--; // 左指针字符移出窗口，计数-1
                  left++;                  // 左指针右移，收缩窗口
              }

              // 此时窗口[left, right]内无重复字符，更新最大长度
              max_len = max(max_len, right - left + 1);
          }

          return max_len;
      }
  };
  ```

- 实际上，可以记录每个字符的最后一次出现的位置，这样当该字符重复时，左边界直接移动至该字符最后一个出现的位置 +1，从而减少左指针移动次数

  ```cpp
  #include <iostream>
  #include <string>
  #include <unordered_map>
  #include <algorithm> // 用于max函数
  using namespace std;

  class Solution {
  public:
      // 函数功能：找出字符串中无重复字符的最长子串的长度
      // 参数：s - 输入的字符串
      // 返回值：最长无重复子串的长度
      int lengthOfLongestSubstring(string s) {
          int n = s.size();          // 字符串长度
          int max_len = 0;           // 记录最长无重复子串的长度
          int left = 0;              // 滑动窗口左指针（窗口起始位置）
          // 哈希表：记录字符 -> 字符最后一次出现的下标（用于快速判断重复）
          unordered_map<char, int> char_index;

          // 右指针遍历字符串，扩大窗口
          for (int right = 0; right < n; right++) {
              char current_char = s[right];

              // 关键：如果当前字符已在窗口内（哈希表中有且下标≥左指针），收缩左指针
              if (char_index.find(current_char) != char_index.end() && char_index[current_char] >= left) {
                  left = char_index[current_char] + 1; // 左指针移到重复字符的下一位
              }

              // 更新当前字符的最新下标
              char_index[current_char] = right;

              // 计算当前窗口长度，更新最大值
              max_len = max(max_len, right - left + 1);
          }

          return max_len;
      }
  };
  ```

### 删掉一个元素以后全为 1 的最长子数组

- 题目：[1493. 删掉一个元素以后全为 1 的最长子数组](https://leetcode.cn/problems/longest-subarray-of-1s-after-deleting-one-element/description/)

- 删掉 1 个 0 之后的最长子数组，也即包含至多 1 个 0 的最长子数组长度，可以维护上一个 0 出现的位置

- 当遇到 right 数字是0，且上一个 0 出现的位置不是 -1 时，说明窗口内有了两个 0，此时移动左边界到上一个 0 出现的位置

- 代码实现

  ```cpp
  #include <vector>
  #include <algorithm> // 用于max函数
  using namespace std;

  class Solution {
  public:
      // 函数功能：给定一个仅包含0和1的数组，删除**恰好一个元素**后，返回全1子数组的最长长度
      // 解题思路：滑动窗口（允许窗口内最多包含1个0）→ 找到最长的「最多1个0的子数组」→ 长度-1（删除那个0）
      // 参数：nums - 仅包含0和1的整数数组
      // 返回值：删除一个元素后全1子数组的最长长度
      int longestSubarray(vector<int>& nums) {
          int n = nums.size();
          int max_len = 0;    // 记录「最多包含1个0的子数组」的最长长度
          int left = 0;       // 滑动窗口左指针（窗口起始位置）
          int last_zero = -1; // 记录窗口内上一个0出现的下标，初始-1表示窗口内暂无0

          // 右指针遍历数组，扩大窗口
          for (int right = 0; right < n; right++) {
              int cur = nums[right]; // 当前右指针指向的元素

              // 遇到0时，调整窗口左边界（保证窗口内最多只有1个0）
              if (cur == 0) {
                  // 如果之前已经有0（last_zero≠-1），将左指针跳到「上一个0的下一位」
                  // 这样窗口内就只保留当前这个新的0，保证最多1个0
                  if (last_zero != -1)
                      left = last_zero + 1;
                  // 更新last_zero为当前0的位置
                  last_zero = right;
              }

              // 此时窗口[left, right]内最多只有1个0，计算窗口长度并更新最大值
              max_len = max(max_len, right - left + 1);
          }

          // 最终返回max_len-1：因为需要删除窗口内的那个0（即使窗口全1，也需删除一个元素）
          return max_len - 1;
      }
  };
  ```

- 也可以维护 0 出现的次数，使用 while 来缩短左边界

  ```cpp
  #include <vector>
  #include <algorithm> // 用于max函数
  using namespace std;

  class Solution {
  public:
      // 函数功能：给定仅含0和1的数组，删除恰好一个元素后，返回全1子数组的最长长度
      // 解题思路：通用变长滑动窗口 → 维护窗口内0的数量≤1 → 最长窗口长度-1（删除那个0）
      int longestSubarray(vector<int>& nums) {
          int n = nums.size();
          int max_len = 0;    // 记录「最多包含1个0的子数组」的最长长度
          int left = 0;       // 窗口左指针
          int zero_count = 0; // 记录当前窗口内0的数量（核心状态变量）

          // 右指针遍历数组，扩大窗口
          for (int right = 0; right < n; right++) {
              // 1. 扩大窗口：当前元素是0时，更新窗口内0的计数
              if (nums[right] == 0) {
                  zero_count++;
              }

              // 2. 核心：用while循环收缩左边界 → 直到窗口内0的数量≤1
              // 这是通用变长窗口的收缩逻辑：窗口不满足约束（0的数量>1）时，持续收缩
              while (zero_count > 1) {
                  // 左指针元素移出窗口，若为0则减少计数
                  if (nums[left] == 0) {
                      zero_count--;
                  }
                  left++; // 左指针右移，收缩窗口
              }

              // 3. 更新最长窗口长度（此时窗口内0的数量≤1）
              max_len = max(max_len, right - left + 1);
          }

          // 返回max_len-1：必须删除恰好一个元素（即使全1也需删一个）
          return max_len - 1;
      }
  };
  ```

### 使数组平衡的最少移除数目

- 题目：[3634. 使数组平衡的最少移除数目](https://leetcode.cn/problems/minimum-removals-to-balance-array/description/)

- 可以转化为求解将原数组排序后，最长的子数组，满足最大值/最小值<=k

- 代码实现

  ```cpp
  #include <vector>
  #include <algorithm> // 用于sort和max函数
  using namespace std;

  class Solution {
  public:
      // 函数功能：计算使数组平衡的最少移除元素数目
      // 题目要求：移除最少元素后，剩余数组中任意两个元素的比值（大数/小数）≤k
      // 解题思路：
      // 1. 先排序数组 → 排序后，任意子数组的最大值是nums[right]，最小值是nums[left]，只需满足nums[right]/nums[left]≤k即可
      // 2. 滑动窗口找最长的满足条件的子数组 → 最少移除数 = 数组总长度 - 最长满足条件的子数组长度
      // 参数：
      //   nums - 输入的整数数组（元素为正整数，否则除法逻辑需调整）
      //   k - 比值上限
      // 返回值：最少需要移除的元素数目
      int minRemoval(vector<int>& nums, int k) {
          // 步骤1：排序数组 → 关键！排序后子数组的最值就是左右指针指向的元素，简化比值判断
          sort(nums.begin(), nums.end());

          int n = nums.size();       // 数组总长度
          int max_len = 1;           // 记录满足条件的最长子数组长度（初始为1，单个元素必然满足）
          int left = 0;              // 滑动窗口左指针

          // 步骤2：变长滑动窗口遍历数组，找最长满足条件的子数组
          for (int right = 0; right < n; right++) {
              // 核心：收缩左边界 → 当当前窗口的最大值/最小值 >k 时，持续右移左指针，直到满足条件
              // （排序后nums[right]≥nums[left]，所以只需判断nums[right]/nums[left] >k）
              // 使用1.0和double是为了避免整数除法的精度丢失（如5/2=2，而5.0/2=2.5）
              while (left <= right && nums[right] * 1.0 / nums[left] > (double)k) {
                  left++; // 左指针右移，缩小窗口，直到比值≤k
              }

              // 更新最长满足条件的子数组长度（此时窗口[left, right]满足nums[right]/nums[left]≤k）
              max_len = max(max_len, right - left + 1);
          }

          // 步骤3：最少移除数 = 总元素数 - 最长满足条件的子数组长度
          return n - max_len;
      }
  };
  ```

### 删除子数组的最大得分

- 题目：[1695. 删除子数组的最大得分](https://leetcode.cn/problems/maximum-erasure-value/description/)

- 给你一个正整数数组 `nums` ，请你从中删除一个含有 若干不同元素 的子数组**。**删除子数组的 得分 就是子数组各元素之 和

- 返回 只删除一个 子数组可获得的 最大得分

- 如果数组 `b` 是数组 `a` 的一个连续子序列，即如果它等于 `a[l],a[l+1],...,a[r]` ，那么它就是 `a` 的一个子数组

- 显然，就是求无重复元素子数组的最大和

  ```cpp
  class Solution {
  public:
      int maximumUniqueSubarray(vector<int>& nums) {
          int n = nums.size();
          int ans = 0, sum = 0;
          unordered_map<int, int> cnt;
          for (int l = 0, r = 0; r < n; r++) {
              sum += nums[r];
              cnt[nums[r]]++;
              while (l <= r && cnt[nums[r]] > 1) {
                  sum -= nums[l];
                  cnt[nums[l]]--;
                  l++;
              }
              ans = max(ans, sum);
          }
          return ans;
      }
  };
  ```

- 如果元素可以是负数呢？核心问题是：负数的存在会打破「窗口越长和越大」的单调性，原有的滑动窗口逻辑（仅保证窗口无重复就更新最大值）不再适用

- 相关题目
  - [53. 最大子数组和](https://leetcode.cn/problems/maximum-subarray/description/)
  - [862. 和至少为 K 的最短子数组](https://leetcode.cn/problems/shortest-subarray-with-sum-at-least-k/description/)

- 需要结合前缀和 + 滑动窗口 + 哈希表来解决

  | 场景       | 正整数数组               | 含负数数组                       |
  | :--------- | :----------------------- | :------------------------------- |
  | 和的单调性 | 窗口越长，和一定越大     | 窗口越长，和可能更小（含负数）   |
  | 核心逻辑   | 合法窗口的和就是当前最优 | 需计算所有合法窗口的和，找最大值 |
  | 关键优化   | 无需前缀和，动态累加即可 | 必须用前缀和快速计算任意窗口和   |

- 代码实现

  ```cpp
  #include <vector>
  #include <unordered_map>
  #include <algorithm>
  #include <climits> // 用于INT_MIN
  #include <iostream>
  using namespace std;

  class Solution {
  public:
      // 函数功能：找到元素互不重复的连续子数组的最大和（数组可含负数）
      // 解题思路：前缀和 + 滑动窗口 + 哈希表
      // 1. 前缀和：快速计算任意窗口[left, right]的和 = prefix[right+1] - prefix[left]
      // 2. 哈希表：记录每个元素最后一次出现的下标，保证窗口[left, right]无重复
      // 3. 滑动窗口：左指针维护无重复的左边界，遍历所有合法窗口计算和，找最大值
      int maximumUniqueSubarray(vector<int>& nums) {
          int n = nums.size();
          // 前缀和数组：prefix[0]=0，prefix[i] = nums[0]+nums[1]+...+nums[i-1]
          vector<long long> prefix(n + 1, 0); // 用long long避免溢出（负数+大数可能超int）
          for (int i = 0; i < n; i++) {
              prefix[i+1] = prefix[i] + nums[i];
          }

          int max_sum = INT_MIN;             // 最大和（初始为极小值，适配负数）
          int left = 0;                      // 窗口左边界（保证[left, right]无重复）
          unordered_map<int, int> last_pos;  // 记录元素→最后一次出现的下标

          // 右指针遍历，枚举所有合法窗口的右边界
          for (int right = 0; right < n; right++) {
              int cur_num = nums[right];

              // 关键：如果当前元素已在[left, right]范围内出现过，更新左边界
              // 左边界取「当前left」和「该元素最后出现位置+1」的最大值，保证窗口无重复
              if (last_pos.find(cur_num) != last_pos.end() && last_pos[cur_num] >= left) {
                  left = last_pos[cur_num] + 1;
              }

              // 更新当前元素的最后出现位置
              last_pos[cur_num] = right;

              // 计算当前合法窗口[left, right]的和，更新最大值（核心：负数需计算所有合法窗口）
              long long current_sum = prefix[right+1] - prefix[left];
              max_sum = max(max_sum, (int)current_sum);
          }

          return max_sum;
      }
  };
  ```

### 不同元素和至少为 K 的最短子数组长度

- 题目：[3795. 不同元素和至少为 K 的最短子数组长度](https://leetcode.cn/problems/minimum-subarray-length-with-distinct-sum-at-least-k/)

- 代码实现

  ```cpp
  class Solution {
  public:
      int minLength(vector<int>& nums, int k) {
          int n = nums.size();
          int ans = n + 1;
          int sum = 0;
          unordered_map<int, int> cnt;
          for (int l = 0, r = 0; r < n; r++) {
              if (cnt[nums[r]] == 0)
                  sum += nums[r];
              cnt[nums[r]]++;
              while (cnt[nums[l]] > 1 || sum - nums[l] >= k) {
                  if (cnt[nums[l]] == 1) {
                      sum -= nums[l];
                  }
                  cnt[nums[l]]--;
                  l++;
              }
              if (sum >= k) {
                  ans = min(ans, r - l + 1);
              }
          }
          return ans == n + 1 ? -1 : ans;
      }
  };
  ```

### 最短且字典序最小的美丽子字符串

- 题目：[2904. 最短且字典序最小的美丽子字符串](https://leetcode.cn/problems/shortest-and-lexicographically-smallest-beautiful-string/description/)

- 代码实现

  ```cpp
  class Solution {
  public:
      string shortestBeautifulSubstring(string s, int k) {
          int n = s.size();
          int min_length = n + 1;
          int cnt1 = 0;
          vector<string> patterns;
          for (int l = 0, r = 0; r < n; r++) {
              if (s[r] == '1')
                  cnt1++;
              while (cnt1 >= k) {
                  if (s[l] == '1' && cnt1 == k) {
                      break;
                  } else if (s[l] == '0' && cnt1 == k) {
                      patterns.push_back(s.substr(l, r - l + 1));
                  } else if (s[l] == '1') {
                      cnt1--;
                  }
                  l++;
              }
              if (cnt1 == k) {
                  patterns.push_back(s.substr(l, r - l + 1));
              }
          }
          if (patterns.empty())
              return "";
          sort(patterns.begin(), patterns.end(), [](string s1, string s2) {
              if (s1.size() != s2.size())
                  return s1.size() < s2.size();
              return s1 < s2;
          });
          return patterns[0];
      }
  };
  ```

- 实际上，当拥有前导零时，其长度一定不是最短的，因此也不需要 push 到数组中，每次更新答案时，直接根据长度和字典序排序即可

  ```cpp
  class Solution {
  public:
      string shortestBeautifulSubstring(string s, int k) {
          if (ranges::count(s, '1') < k) {
              return "";
          }
          int n = s.size();
          int cnt1 = 0;
          string ans = s;
          for (int l = 0, r = 0; r < n; r++) {
              cnt1 += s[r] - '0';
              while (cnt1 > k || s[l] == '0') {
                  cnt1 -= s[l++] - '0';
              }
              if (cnt1 == k) {
                  string t = s.substr(l, r - l + 1);
                  if (t.length() < ans.length() ||
                      (t.length() == ans.length() && t < ans)) {
                      ans = move(t);
                  }
              }
          }
          return ans;
      }
  };
  ```

- 可以进一步优化创建临时字符串和字典序比较的代码

  ```cpp
  class Solution {
  public:
      string shortestBeautifulSubstring(string s, int k) {
          // 先统计总1的数量，不足则直接返回空
          int total_ones = count(s.begin(), s.end(), '1');
          if (total_ones < k) {
              return "";
          }

          int n = s.size();
          int cnt1 = 0; // 滑动窗口内1的数量
          int min_len = n; // 记录最短子串长度
          int best_l = 0;  // 记录最优子串的左边界

          for (int l = 0, r = 0; r < n; ++r) {
              // 右指针右移，统计1的数量
              cnt1 += (s[r] == '1') ? 1 : 0;

              // 收缩左指针：两种情况 - 1的数量超过k 或 左指针指向0
              while ((cnt1 > k) || (s[l] == '0' && cnt1 >= k)) {
                  if (s[l] == '1') {
                      cnt1--;
                  }
                  l++;
              }

              // 当窗口内恰好有k个1时，判断是否更新最优解
              if (cnt1 == k) {
                  int current_len = r - l + 1;
                  // 情况1：当前子串更短 → 直接更新
                  if (current_len < min_len) {
                      min_len = current_len;
                      best_l = l;
                  }
                  // 情况2：长度相同 → 比较字典序，选择更小的
                  else if (current_len == min_len) {
                      // 直接在原字符串上比较子串，避免创建临时字符串
                      bool is_better = false;
                      for (int i = 0; i < min_len; ++i) {
                          if (s[l + i] < s[best_l + i]) {
                              is_better = true;
                              break;
                          } else if (s[l + i] > s[best_l + i]) {
                              break;
                          }
                          // 相等则继续比较下一个字符
                      }
                      if (is_better) {
                          best_l = l;
                      }
                  }
              }
          }

          // 最后截取最优子串（仅创建一次结果字符串）
          return s.substr(best_l, min_len);
      }
  };
  ```

### 替换子串得到平衡字符串

- 题目：[1234. 替换子串得到平衡字符串](https://leetcode.cn/problems/replace-the-substring-for-balanced-string/description/)

- 显然，这个最短的子串，需要包含每个字母多余的部分，因此要先统计每个字母的数目，那么这个子串中需要包含的字母的个数就可以得到

- 为了避免每次都要判断是否满足了字母数量条件，可以在字母数量达到要求时 satisfy+1，不满足要求时 satisfy-1

- 注意学会这其中，收缩左边界的写法，while 循环的判断中始终应该是是否满足条件

- 代码实现

  ```cpp
  class Solution {
  public:
      int balancedString(string s) {
          int n = s.size();
          int avg = n / 4;
          int ans = n; // 初始化为最大可能长度
          unordered_map<char, int> cnt;

          // 1. 统计所有字符的出现次数
          for (char c : s) {
              cnt[c]++;
          }

          // 2. 计算需要"抵消"的超额字符数量（只有超过avg的才需要在窗口中覆盖）
          unordered_map<char, int> need;
          for (char c : {'Q', 'W', 'E', 'R'}) { // 显式遍历四种字符，避免遗漏
              if (cnt[c] > avg) {
                  need[c] = cnt[c] - avg;
              }
          }

          // 如果所有字符数量都达标，直接返回0
          if (need.empty()) {
              return 0;
          }

          // 3. 滑动窗口核心逻辑：找包含所有need字符的最短窗口
          int l = 0;
          unordered_map<char, int> window; // 记录窗口内各字符的数量
          int satisfy = 0; // 记录已经满足"窗口内数量≥need数量"的字符数

          for (int r = 0; r < n; r++) {
              char c = s[r];
              // 只关注需要抵消的字符
              if (need.count(c)) {
                  window[c]++;
                  // 如果当前字符的窗口数量刚好满足need，satisfy+1
                  if (window[c] == need[c]) {
                      satisfy++;
                  }
              }

              // 4. 当所有需要的字符都满足时，尝试收缩左边界以找到最短窗口
              while (satisfy == need.size()) {
                  // 更新最短窗口长度
                  ans = min(ans, r - l + 1);

                  char left_c = s[l];
                  if (need.count(left_c)) {
                      // 如果收缩前该字符刚好满足条件，收缩后就不满足了，satisfy-1
                      if (window[left_c] == need[left_c]) {
                          satisfy--;
                      }
                      window[left_c]--;
                  }
                  l++; // 收缩左边界
              }
          }

          return ans;
      }
  };
  ```

### 无限数组的最短子数组

- 题目：[2875. 无限数组的最短子数组](https://leetcode.cn/problems/minimum-size-subarray-in-infinite-array/description/)

- 遇到问题，需要先在本子上分析清楚，而不是上来就盲目的套用模板逻辑，然后在代码中去处理各种乱七八糟的边界情况，应该线分析清楚，这个无限数组的问题实际上由重复的数组部分和剩余部分两部分构成，重复的部分长度一定是固定的，没有最短可言，那么只需要处理剩余部分的最短子数组

- 可以将环形数组问题拆解为「完整重复次数」+「剩余目标值的最短子数组」两部分

- 那么只需要使用滑动窗口，遍历至多 2 个原数组，来求解剩余目标值的最短子数组

- 代码实现

  ```cpp
  #include <vector>
  #include <climits>
  #include <algorithm>
  using namespace std;

  class Solution {
  public:
      int minSizeSubarray(vector<int>& nums, int target) {
          // 处理边界情况：目标值为0时，最短子数组长度为0
          if (target == 0) return 0;

          int n = nums.size();
          long long total_sum = 0; // 数组总和（用long long避免溢出）
          for (int num : nums) {
              total_sum += num;
          }

          // 处理总和为0的情况：无法组成非零target
          if (total_sum == 0) return -1;

          // 计算需要完整重复的数组次数和剩余目标值
          int full_cycles = 0;
          int remaining_target = target;
          if (total_sum > 0) {
              full_cycles = target / total_sum; // 完整重复的次数
              remaining_target = target % total_sum; // 剩余需要凑的目标值

              // 如果刚好整除，直接返回完整次数*数组长度
              if (remaining_target == 0) {
                  return full_cycles * n;
              }
          }

          // 滑动窗口求解环形数组中满足剩余目标值的最短子数组
          int min_len = INT_MAX;
          long long window_sum = 0; // 窗口和（用long long避免溢出）
          int left = 0;
          // 扩展数组为两倍长度（模拟环形），避免取模操作，简化逻辑
          for (int right = 0; right < 2 * n; ++right) {
              window_sum += nums[right % n];

              // 窗口和超过剩余目标值时，收缩左边界
              while (window_sum > remaining_target) {
                  window_sum -= nums[left % n];
                  left++;
              }

              // 找到满足条件的子数组，更新最小长度
              if (window_sum == remaining_target) {
                  min_len = min(min_len, right - left + 1);
              }
          }

          // 若未找到满足条件的子数组，返回-1；否则返回完整次数+最短子数组长度
          return min_len == INT_MAX ? -1 : full_cycles * n + min_len;
      }
  };
  ```

- 简洁代码

  ```cpp
  class Solution {
  public:
      int minSizeSubarray(vector<int>& nums, int target) {
          long long total = reduce(nums.begin(), nums.end(), 0LL);
          int n = nums.size();
          int ans = INT_MAX;
          long long sum = 0;
          int left = 0;
          for (int right = 0; right < n * 2; right++) {
              sum += nums[right % n];
              while (sum > target % total) {
                  sum -= nums[left % n];
                  left++;
              }
              if (sum == target % total) {
                  ans = min(ans, right - left + 1);
              }
          }
          return ans == INT_MAX ? -1 : ans + target / total * n;
      }
  };
  ```

### 最小区间

- 题目：[632. 最小区间](https://leetcode.cn/problems/smallest-range-covering-elements-from-k-lists/description/)

- 可以使用堆来维护当前所有列表的最小值，每次弹出最小值，压入对应列表的下一个值，更新最小区间长度

- 代码实现

  ```cpp
  class Solution {
  public:
      vector<int> smallestRange(vector<vector<int>>& nums) {
          int res_left = 0, res_right = INT_MAX;
          priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>>
              min_heap;
          vector<int> cur_idx(nums.size(), 0);
          int current_max = INT_MIN;

          for (int i = 0; i < nums.size(); ++i) {
              min_heap.emplace(nums[i][0], i);
              current_max = max(current_max, nums[i][0]);
          }

          while (true) {
              auto [cur_min, arr_idx] = min_heap.top();
              min_heap.pop();

              if (current_max - cur_min < res_right - res_left) {
                  res_left = cur_min;
                  res_right = current_max;
              }

              cur_idx[arr_idx]++;
              if (cur_idx[arr_idx] >= nums[arr_idx].size()) {
                  break;
              }

              int next_val = nums[arr_idx][cur_idx[arr_idx]];
              min_heap.emplace(next_val, arr_idx);
              current_max = max(current_max, next_val);
          }

          return {res_left, res_right};
      }
  };
  ```

- 也可以用滑动窗口来解决，将所有值按照顺序排序之后，可以使用滑动窗口来解决，即这个滑动窗口中，每个列表至少存在一个数

  ```cpp
  class Solution {
  public:
      vector<int> smallestRange(vector<vector<int>>& nums) {
          vector<pair<int, int>> pairs;
          for (int i = 0; i < nums.size(); i++) {
              for (int x : nums[i]) {
                  pairs.emplace_back(x, i);
              }
          }
          // 看上去 std::sort 比 ranges::sort 更快
          sort(pairs.begin(), pairs.end());

          int ans_l = pairs[0].first;
          int ans_r = pairs.back().first;
          int empty = nums.size();
          vector<int> cnt(empty);
          int left = 0;
          for (auto [r, i] : pairs) {
              if (cnt[i] == 0) { // 包含 nums[i] 的数字
                  empty--;
              }
              cnt[i]++;
              while (empty == 0) { // 每个列表都至少包含一个数
                  auto [l, i] = pairs[left];
                  if (r - l < ans_r - ans_l) {
                      ans_l = l;
                      ans_r = r;
                  }
                  cnt[i]--;
                  if (cnt[i] == 0) { // 不包含 nums[i] 的数字
                      empty++;
                  }
                  left++;
              }
          }
          return {ans_l, ans_r};
      }
  };
  ```

### 乘积小于 K 的子数组

- 题目：[713. 乘积小于 K 的子数组](https://leetcode.cn/problems/subarray-product-less-than-k/description/)

- 对于数组中的每个右指针 `right`，找到最小的左指针 `left`，使得区间 `[left, right]` 内的子数组乘积 < k

- 此时，以 `right` 为右端点的合法子数组数量是 `right - left + 1`（即 `[left,right]`、`[left+1,right]`、…、`[right,right]`）

- 显然，当累积乘积大于等于 k 时，就需要移动左端点，此时从左端点到右端点之间的数组都合法，因此 ans+= r-l+1

- 然后移动左边界，直到乘积合法

- 代码实现

  ```cpp
  class Solution {
  public:
      int numSubarrayProductLessThanK(vector<int>& nums, int k) {
          // 边界条件：k≤1时，所有子数组乘积≥1≥k，结果为0
          if (k <= 1) {
              return 0;
          }
          // 初始化变量：
          // ans：最终答案（合法子数组总数）
          // prod：当前窗口 [left, right] 内的乘积
          // left：滑动窗口的左指针（初始为0）
          int ans = 0, prod = 1, left = 0;

          // 右指针遍历数组，逐个扩展窗口右端点
          for (int right = 0; right < nums.size(); right++) {
              // 1. 将当前右指针元素加入窗口，更新乘积
              prod *= nums[right];

              // 2. 如果乘积≥k，收缩左指针，直到乘积<k
              while (prod >= k) {
                  prod /= nums[left]; // 移除左指针元素的乘积贡献
                  left++; // 左指针右移，缩小窗口
              }

              // 3. 统计以right为右端点的合法子数组数量
              // 数量 = right - left + 1（左端点可以是left到right之间的任意位置）
              ans += right - left + 1;
          }
          return ans;
      }
  };
  ```

### 不间断子数组

- 题目：[2762. 不间断子数组](https://leetcode.cn/problems/continuous-subarrays/description/)

- 显然，只要子数组中的最大值和最小值差值不超过 2 即可，也就是要实时维护滑动窗口中的最大值和最小值
  - 滑动窗口：用左指针`l`、右指针`r`维护一个窗口`[l, r]`，保证窗口内的子数组满足「最大值 - 最小值≤2」
  - 单调队列：
    - `max_que`（单调递减队列）：队列中存储的是数组索引，对应的值从队头到队尾递减，队头始终是当前窗口的最大值索引；
    - `min_que`（单调递增队列）：队列中存储的是数组索引，对应的值从队头到队尾递增，队头始终是当前窗口的最小值索引；
  - 统计数量：对于每个右指针`r`，满足条件的窗口`[l, r]`内，以`r`为右端点的合法子数组数量是`r - l + 1`（左端点可以是`l`到`r`之间的任意位置），累加所有数量即为答案

- 代码实现

  ```cpp
  class Solution {
  public:
      long long continuousSubarrays(vector<int>& nums) {
          int n = nums.size();
          long long ans = 0; // 结果可能很大，用long long避免溢出
          // 双端队列：存储数组索引，而非值（方便判断是否超出窗口左边界）
          std::deque<int> max_que; // 单调递减队列，队头是当前窗口最大值索引
          std::deque<int> min_que; // 单调递增队列，队头是当前窗口最小值索引

          // 滑动窗口：l是左指针，r是右指针，r遍历数组
          for (int l = 0, r = 0; r < n; r++) {
              // 1. 维护max_que：保证队列单调递减，加入当前r前，移除所有比nums[r]小的索引
              while (!max_que.empty() && nums[max_que.back()] < nums[r]) {
                  max_que.pop_back();
              }
              max_que.push_back(r); // 加入当前r的索引

              // 2. 维护min_que：保证队列单调递增，加入当前r前，移除所有比nums[r]大的索引
              while (!min_que.empty() && nums[min_que.back()] > nums[r]) {
                  min_que.pop_back();
              }
              min_que.push_back(r); // 加入当前r的索引

              // 3. 收缩左指针l：直到窗口内最大值-最小值 ≤ 2
              while (nums[max_que.front()] - nums[min_que.front()] > 2) {
                  // 如果最大值的索引是l，说明l要移出窗口，需从max_que中删除
                  if (max_que.front() == l)
                      max_que.pop_front();
                  // 如果最小值的索引是l，说明l要移出窗口，需从min_que中删除
                  if (min_que.front() == l)
                      min_que.pop_front();
                  l++; // 左指针右移，缩小窗口
              }

              // 4. 统计以r为右端点的合法子数组数量，累加到答案
              ans += r - l + 1;
          }
          return ans;
      }
  };
  ```

- 也可以使用有序集合，维护窗口内的元素，以在 $O(1)$ 时间内查询最大值和最小值

  ```cpp
  class Solution {
  public:
      long long continuousSubarrays(vector<int>& nums) {
          int n = nums.size();
          long long ans = 0;
          multiset<int> window; // 有序集合，维护窗口内的元素
          int left = 0;

          for (int right = 0; right < n; ++right) {
              // 1. 将当前元素加入窗口
              window.insert(nums[right]);

              // 2. 收缩左指针，直到窗口满足 max-min ≤ 2
              while (*window.rbegin() - *window.begin() > 2) {
                  // 移除左指针元素（注意：multiset删除指定值需用erase(迭代器)，避免删所有相同值）
                  window.erase(window.find(nums[left]));
                  left++;
              }

              // 3. 统计以right为右端点的合法子数组数量
              ans += right - left + 1;
          }

          return ans;
      }
  };
  ```

- 时间复杂度为 $O(n\log n)$（每个元素的插入/删除是 $O(\log k)$，k ≤ n）

### 美丽的花束

- 题目：[LCP 68. 美观的花束](https://leetcode.cn/problems/1GxJYY/description/)

- 代码实现

  ```cpp
  class Solution {
  public:
      int beautifulBouquet(vector<int>& flowers, int k) {
          unordered_map<int, int> cnt;
          int n = flowers.size();
          int ans = 0;
          int satisfy = 0;
          for (int l = 0, r = 0; r < n; r++) {
              if (cnt.find(flowers[r]) == cnt.end())
                  satisfy++;
              cnt[flowers[r]]++;
              if (cnt[flowers[r]] > k)
                  satisfy--;
              while (satisfy < cnt.size()) {
                  if (cnt[flowers[l]] == k + 1)
                      satisfy++;
                  cnt[flowers[l]]--;
                  l++;
              }
              ans += r - l + 1;
          }
          return ans;
      }
  };
  ```

- 实际上，不满足条件的只有 cnt[flowers[r]]，因此 while 循环只需要考虑当前花束即可

  ```cpp
  #include <vector>
  #include <unordered_map>
  using namespace std;

  class Solution {
  public:
      int beautifulBouquet(vector<int>& flowers, int k) {
          const int MOD = 1e9 + 7; // 题目隐含取模要求，避免结果溢出
          int n = flowers.size();
          long long ans = 0; // 用long long防止累加溢出
          unordered_map<int, int> count; // 统计窗口内每种花的数量
          int left = 0;

          for (int right = 0; right < n; ++right) {
              int cur_flower = flowers[right];
              count[cur_flower]++; // 无需find判断，不存在则默认0，自增后自然统计

              // 核心：只有当前加入的花可能超量，收缩左指针直到合规
              while (count[cur_flower] > k) {
                  int left_flower = flowers[left];
                  count[left_flower]--;
                  left++;
              }

              // 统计以right为右端点的合法子数组数量
              ans = (ans + right - left + 1) % MOD;
          }

          return static_cast<int>(ans % MOD);
      }
  };
  ```

### 包含所有三种字符的子字符串数目

- 题目：[1358. 包含所有三种字符的子字符串数目](https://leetcode.cn/problems/number-of-substrings-containing-all-three-characters/description/)

- 给定仅包含 `a/b/c` 的字符串 `s`，统计所有包含至少一个 a、一个 b、一个 c 的子字符串的数量

- 最小合法左端点：对于固定的右端点right，能让[l, right]成为合法窗口的最小的 l（最靠左的 l）

- 代码实现

  ```cpp
  class Solution {
  public:
      int numberOfSubstrings(string s) {
          int n = s.size();
          int ans = 0;
          vector<int> cnt(3, 0); // 统计a/b/c的数量
          int left = 0;

          for (int right = 0; right < n; ++right) {
              // 加入当前字符，更新计数
              cnt[s[right] - 'a']++;

              // 收缩左指针：找到以right为右端点的最小合法窗口
              while (cnt[0] > 0 && cnt[1] > 0 && cnt[2] > 0) {
                  // 关键修正：先减计数，再右移左指针
                  cnt[s[left] - 'a']--;
                  left++;
              }

              // 此时left-1是最小合法左端点，合法子串数量为left（左端点0~left-1）
              ans += left;
          }

          return ans;
      }
  };
  ```

### 越长越合法与越短越合法

- 两类窗口的定义

  | 类型         | 核心特征                                                                         | 典型问题                                                                   |
  | :----------- | :------------------------------------------------------------------------------- | :------------------------------------------------------------------------- |
  | 越长越合法型 | 若窗口`[l,r]`合法，则所有包含`[l,r]`的更大窗口（如`[l-1,r]`、`[l,r+1]`）都合法   | 统计包含至少一个 a/b/c 的子串数、统计包含所有目标字符的子串数              |
  | 越短越合法型 | 若窗口`[l,r]`合法，则所有被`[l,r]`包含的更小窗口（如`[l+1,r]`、`[l,r-1]`）都合法 | 统计乘积小于 k 的子数组数、统计和小于 k 的子数组数、统计每种花 ≤k 的花束数 |

- 差异对比

  | 对比维度     | 越长越合法型（包含 a/b/c）                       | 越短越合法型（统计每种花 ≤k 的花束数）               |
  | :----------- | :----------------------------------------------- | :--------------------------------------------------- |
  | 窗口合法定义 | 包含至少一个 a/b/c                               | 每种花束的数量 ≤k                                    |
  | 收缩触发条件 | 窗口「合法」时收缩（找最小合法窗口）             | 窗口「不合法」时收缩（找最大合法窗口）               |
  | 收缩终止条件 | 窗口变为「不合法」                               | 窗口变为「合法」                                     |
  | 计数逻辑     | 合法左端点范围：`0 ~ left-1`，数量 =`left`       | 合法左端点范围：`left ~ right`，数量 =`right-left+1` |
  | 核心逻辑     | 最小合法窗口确定后，「往左扩展的所有窗口」都合法 | 最大合法窗口确定后，「往右收缩的所有窗口」都合法     |

- 越长越合法型

  ```cpp
  // 核心：找最小合法窗口 → 统计往左扩展的合法数量
  int solve_越长越合法(输入) {
      int ans = 0, left = 0;
      初始化计数结构;
      for (int right = 0; right < n; ++right) {
          加入right元素，更新计数;
          // 窗口合法时收缩，找最小合法窗口
          while (窗口合法) {
              移除left元素，更新计数;
              left++;
          }
          // 合法数量 = left（0~left-1的左端点）
          ans += left;
      }
      return ans;
  }
  ```

- 越短越合法型

  ```cpp
  // 核心：找最大合法窗口 → 统计往右收缩的合法数量
  int solve_越短越合法(输入) {
      int ans = 0, left = 0;
      初始化计数结构;
      for (int right = 0; right < n; ++right) {
          加入right元素，更新计数;
          // 窗口不合法时收缩，找最大合法窗口
          while (窗口不合法) {
              移除left元素，更新计数;
              left++;
          }
          // 合法数量 = right-left+1（left~right的左端点）
          ans += right - left + 1;
      }
      return ans;
  }
  ```

### 统计最大元素出现至少 K 次的子数组

- 给你一个整数数组 `nums` 和一个 正整数 `k`

- 请你统计有多少满足 「 `nums` 中的 最大 元素」至少出现 `k` 次的子数组，并返回满足这一条件的子数组的数目

- 代码实现

  ```cpp
  class Solution {
  public:
      long long countSubarrays(vector<int>& nums, int k) {
          int n = nums.size();
          long long ans = 0, l = 0;
          int maxx = 0;
          for (int num : nums) {
              maxx = max(maxx, num);
          }
          int cnt = 0;
          for (int r = 0; r < n; ++r) {
              if (nums[r] == maxx)
                  cnt++;
              while (cnt >= k) {
                  if (nums[l] == maxx)
                      cnt--;
                  l++;
              }
              ans += l;
          }
          return ans;
      }
  };
  ```

- 如果改为子数组的最大值在子数组中至少出现 k 次，要怎么做？

- 可以反向求解
  - 总子数组数：total=n∗(n+1)/2（n 是数组长度）
  - 需减去：所有「最大值出现次数 <k」的子数组数
  - 最终答案 = total - 不满足条件的子数组数

- 代码实现

  ```cpp
  class Solution {
  public:
      long long countSubarrays(vector<int>& nums, int k) {
          int n = nums.size();
          // 步骤1：计算总子数组数
          long long total = (long long)n * (n + 1) / 2;
          // 步骤2：计算「最大值出现次数 <k」的子数组数
          long long invalid = 0;

          deque<int> max_que; // 单调递减队列，存储索引，队头是窗口最大值索引
          vector<int> cnt(n + 1, 0); // 统计当前窗口内各数值的出现次数（nums[i]范围可能大，这里用值作为键）

          int left = 0;
          for (int right = 0; right < n; ++right) {
              // 维护单调队列：保证队头是当前窗口最大值索引
              while (!max_que.empty() && nums[max_que.back()] < nums[right]) {
                  max_que.pop_back();
              }
              max_que.push_back(right);
              cnt[nums[right]]++; // 统计当前值的出现次数

              // 收缩左指针：直到窗口内最大值出现次数 <k
              while (!max_que.empty()) {
                  int cur_max = nums[max_que.front()];
                  if (cnt[cur_max] >= k) {
                      // 最大值出现次数≥k，收缩左指针
                      cnt[nums[left]]--;
                      // 如果左指针是当前最大值索引，弹出队头
                      if (max_que.front() == left) {
                          max_que.pop_front();
                      }
                      left++;
                  } else {
                      break; // 满足「最大值出现次数<k」，停止收缩
                  }
              }

              // 统计以right为右端点的不合法子数组数（最大值出现次数<k）
              invalid += right - left + 1;
          }

          // 最终答案 = 总子数组数 - 不合法子数组数
          return total - invalid;
      }
  };
  ```

- 要统计「最大值至少出现 k 次」的子数组，可拆分为：
  - 对数组中的每个元素`nums[i]`，找到它作为子数组最大值的所有区间范围`[L, R]`（L 是左边第一个比它大的元素位置，R 是右边第一个≥它的元素位置）；
  - 在`[L, R]`范围内，计算包含`nums[i]`且`nums[i]`出现≥k 次的子数组数量；
  - 累加所有元素的贡献（注意去重：避免同一子数组被多个最大值重复统计）

- 用单调递减栈找到每个元素的「左边界 L」和「右边界 R」：
  - 左边界`left[i]`：i 左侧第一个比`nums[i]`大的元素索引（无则为 - 1）；
  - 右边界`right[i]`：i 右侧第一个≥`nums[i]`的元素索引（无则为 n）；
  - 这样能保证：以`nums[i]`为严格最大值的子数组，左端点范围是`(left[i], i]`，右端点范围是`[i, right[i))`（避免重复统计）

- 统计有效子数组：对于每个最大值 `val` 的区间 `[L, R]`，先收集所有 `val` 出现的位置 `pos`，然后计算「包含至少 k 个 val」的子数组数：
  - 总子数组数（区间内）：`total_in_range = (R-L) * (R-L+1) / 2`；
  - 无效子数组数（包含 < k 个 val）：和之前补集思路里的计算逻辑一致；
  - 该区间内有效子数组数 = `total_in_range - 无效子数组数`；

- 累加所有区间的有效数：最终结果就是所有最大值区间的有效子数组数之和

- 代码实现

  ```cpp
  class Solution {
  public:
      long long countSubarrays(vector<int>& nums, int k) {
          int n = nums.size();
          long long ans = 0;

          // 步骤1：找每个元素作为最大值的左右边界（单调递减栈）
          // left[i]：i左边第一个>nums[i]的元素下标（不存在为-1）
          // right[i]：i右边第一个>=nums[i]的元素下标（不存在为n）
          vector<int> left(n, -1);
          vector<int> right(n, n);
          stack<int> st;

          // 找left数组
          for (int i = 0; i < n; ++i) {
              while (!st.empty() && nums[st.top()] <= nums[i]) {
                  st.pop();
              }
              if (!st.empty()) {
                  left[i] = st.top();
              }
              st.push(i);
          }

          // 清空栈，找right数组
          while (!st.empty()) st.pop();
          for (int i = n - 1; i >= 0; --i) {
              while (!st.empty() && nums[st.top()] < nums[i]) {
                  st.pop();
              }
              if (!st.empty()) {
                  right[i] = st.top();
              }
              st.push(i);
          }

          // 步骤2：正向统计每个最大值区间的有效子数组数
          vector<bool> visited(n, false); // 避免重复处理同一最大值的位置

          for (int i = 0; i < n; ++i) {
              if (visited[i]) continue;

              int val = nums[i];
              int L = left[i] + 1;    // 当前最大值区间的左边界（闭）
              int R = right[i] - 1;   // 当前最大值区间的右边界（闭）
              int len = R - L + 1;    // 区间长度

              // 收集区间[L, R]内所有值为val的下标
              vector<int> pos;
              for (int j = L; j <= R; ++j) {
                  if (nums[j] == val) {
                      pos.push_back(j);
                      visited[j] = true;
                  }
              }
              int m = pos.size(); // 当前最大值在区间内出现的次数

              // 情况1：如果出现次数 <k，该区间没有有效子数组，直接跳过
              if (m < k) continue;

              // 情况2：计算该区间内「包含至少k个val」的子数组数
              // 第一步：先算区间内总子数组数
              long long total_in_range = (long long)len * (len + 1) / 2;

              // 第二步：算区间内「包含<k个val」的子数组数（无效数）
              long long invalid = 0;
              for (int j = 0; j < m; ++j) {
                  // 左可选范围：从L到pos[j]
                  int left_cnt = pos[j] - L + 1;
                  // 右可选范围：最多到pos[j+k-1]-1（保证val出现次数<k）
                  int right_end = (j + k - 1 >= m) ? R : pos[j + k - 1] - 1;
                  int right_cnt = right_end - pos[j] + 1;
                  invalid += (long long)left_cnt * right_cnt;
              }

              // 该区间有效数 = 总子数组数 - 无效数
              ans += (total_in_range - invalid);
          }

          return ans;
      }
  };
  ```

- 时间复杂度 O (n)（单调栈和滑动窗口都是线性），空间复杂度 O (n)，能高效处理大规模数据

- 实际上，可以进一步优化该实现
  - 单调不升栈：栈中存储数组索引，保证索引对应的值从栈底到栈顶不升（即 `a[st[i]] ≥ a[st[i+1]]`）；
  - 哨兵技巧：
    - 数组末尾追加 `max(a)+1`：强制触发栈中所有剩余元素出栈，避免最大值未被处理；
    - 栈初始化为 `[-1]`：作为左边界哨兵，简化左区间长度计算；
  - 出栈贡献计算：当遇到比栈顶元素大的值时，栈顶元素出栈，此时计算该元素作为最大值且出现≥k 次的子数组数量

- 代码实现

  ```cpp
  #include <vector>
  #include <stack>
  #include <algorithm>
  using namespace std;

  long long solve3(vector<int>& a, int k) {
      long long ans = 0;
      // 哨兵1：数组末尾添加比最大值大1的数
      int max_val = *max_element(a.begin(), a.end());
      a.push_back(max_val + 1);

      // 哨兵2：栈初始化为{-1}，维护单调不升栈（存储索引）
      stack<int> st;
      st.push(-1);

      int n = a.size();
      for (int i = 0; i < n; ++i) {
          int v = a[i];
          // 维护单调不升栈：当前值大于栈顶索引对应的值，触发出栈
          while (st.size() > 1 && a[st.top()] < v) {
              int j = st.top(); // 出栈元素的索引
              // 检查栈中是否有至少k个连续的、与a[j]相等的值
              if (st.size() > k) {
                  // 复制栈（栈不支持随机访问，需临时存储）
                  stack<int> temp = st;
                  // 弹出栈顶j，找到第k个元素
                  temp.pop();
                  int cnt = 1;
                  int target_idx = -1;
                  while (!temp.empty() && cnt <= k) {
                      int top_idx = temp.top();
                      if (a[top_idx] == a[j]) {
                          cnt++;
                          if (cnt == k) {
                              target_idx = top_idx;
                              break;
                          }
                      } else {
                          break; // 不连续，直接退出
                      }
                      temp.pop();
                  }
                  // 找到第k个相同值的索引，计算贡献
                  if (target_idx != -1) {
                      // 恢复temp到target_idx的前一个元素
                      while (temp.top() != target_idx) {
                          temp.pop();
                      }
                      int left_prev = temp.top();
                      temp.pop();
                      int left_len = target_idx - temp.top();
                      int right_len = i - j;
                      ans += (long long)left_len * right_len;
                  }
              }
              st.pop(); // 栈顶出栈
          }
          st.push(i); // 当前索引入栈
      }
      // 移除末尾的哨兵（还原原数组）
      a.pop_back();
      return ans;
  }
  ```

### 子数组的最小值之和

- 题目：[907. 子数组的最小值之和](https://leetcode.cn/problems/sum-of-subarray-minimums/description/)

- 可以枚举每个窗口，并使用单调队列维护最小值

  ```cpp
  class Solution {
  public:
      const int MOD = 1e9 + 7;
      int sumSubarrayMins(vector<int>& arr) {
          long long ans = 0;
          int n = arr.size();
          for (int i = 0; i < n; i++) {
              deque<int> que;
              for (int j = i; j < n; j++) {
                  while (!que.empty() && arr[que.back()] > arr[j]) {
                      que.pop_back();
                  }
                  que.push_back(j);
                  ans = (ans + arr[que.front()]) % MOD;
              }
          }
          return (int)ans;
      }
  };
  ```

- 但是其时间复杂度为 $O(n^2)$

- 可以使用单调栈来实现，计算每个元素作为子数组最小值时，能贡献多少次，而不是枚举所有子数组再找最小值

- 对于数组中的每个元素 `arr[i]`：
  - 找到左边第一个比 `arr[i]` 小的元素的位置 `left`（记为 `L`）
  - 找到右边第一个小于等于 `arr[i]` 的元素的位置 `right`（记为 `R`）
  - 该元素能作为最小值的子数组数量 = `(i - L) * (R - i)`
  - 总贡献 = `arr[i] * (i - L) * (R - i)`，最后累加所有元素的贡献并取模
  - 右边找「小于等于」是为了避免重复计算（比如数组中有相同元素时，确保每个子数组的最小值只被计算一次）

- 代码实现

  ```cpp
  class Solution {
  public:
      const int MOD = 1e9 + 7;
      int sumSubarrayMins(vector<int>& arr) {
          int n = arr.size();
          // left[i]：i左边第一个比arr[i]小的元素的下标（不存在则为-1）
          vector<int> left(n, -1);
          // right[i]：i右边第一个小于等于arr[i]的元素的下标（不存在则为n）
          vector<int> right(n, n);
          stack<int> st; // 单调递增栈，存储下标

          // 第一步：找left数组
          for (int i = 0; i < n; ++i) {
              // 栈不为空且栈顶元素对应的值 >= 当前值，弹出（维护单调递增）
              while (!st.empty() && arr[st.top()] >= arr[i]) {
                  st.pop();
              }
              if (!st.empty()) {
                  left[i] = st.top();
              }
              st.push(i);
          }

          // 清空栈，准备找right数组
          while (!st.empty()) {
              st.pop();
          }

          // 第二步：找right数组
          for (int i = n - 1; i >= 0; --i) {
              // 栈不为空且栈顶元素对应的值 > 当前值，弹出（维护单调递增）
              while (!st.empty() && arr[st.top()] > arr[i]) {
                  st.pop();
              }
              if (!st.empty()) {
                  right[i] = st.top();
              }
              st.push(i);
          }

          // 第三步：计算总贡献
          long long ans = 0;
          for (int i = 0; i < n; ++i) {
              // 左边可选数量：i - left[i]，右边可选数量：right[i] - i
              long long cnt = (long long)(i - left[i]) * (right[i] - i);
              ans = (ans + arr[i] * cnt) % MOD;
          }

          return (int)ans;
      }
  };
  ```

### 统计好子数组的数目

- 题目：[2537. 统计好子数组的数目](https://leetcode.cn/problems/count-the-number-of-good-subarrays/description/)

- 代码实现

  ```cpp
  class Solution {
  public:
      long long countGood(vector<int>& nums, int k) {
          int n = nums.size();
          long long ans = 0;
          unordered_map<int, int> cnt;
          long long now = 0;
          for (int l = 0, r = 0; r < n; r++) {
              now += cnt[nums[r]]++;
              while (now >= k) {
                  if (--cnt[nums[l]] > 0)
                      now -= cnt[nums[l]];
                  l++;
              }
              ans += l;
          }
          return ans;
      }
  };
  ```

### 统计重新排列后包含另一个字符串的子字符串数目 II

- 题目：[3298. 统计重新排列后包含另一个字符串的子字符串数目 II](https://leetcode.cn/problems/count-substrings-that-can-be-rearranged-to-contain-a-string-ii/description/)

- 实际上就是字串覆盖问题，唯一的难题是如何维护是否满足条件的状态

- 如果使用 map，那么注意修改 need 时不能检查不在 pattern 中的字母

- 代码实现

  ```cpp
  class Solution {
  public:
      long long validSubstringCount(string word1, string word2) {
          int n = word1.size();
          unordered_map<char, int> pattern;
          unordered_map<char, int> cnt;
          for (char c : word2)
              pattern[c]++;
          long long ans = 0;
          int need = pattern.size();
          for (int l = 0, r = 0; r < n; r++) {
              int c = word1[r];
              cnt[c]++;
              if (pattern.find(c) != pattern.end() && cnt[c] == pattern[c])
                  need--;
              while (need == 0) {
                  int cl = word1[l++];
                  if (pattern.find(cl) != pattern.end() && cnt[cl] == pattern[cl])
                      need++;
                  cnt[cl]--;
              }
              std::cout << l << " " << r << " : " << ans << std::endl;
              ans += l;
          }
          return ans;
      }
  };
  ```

- 可以使用数组来表示，并根据 req[c]>0 表示被需求

  ```cpp
  class Solution {
  public:
      long long validSubstringCount(string s, string t) {
          int req[26] = {0}; // 替代unordered_map，记录t的字符需求
          int need = 0;      // 需要满足的字符种类数
          for (char c : t) {
              if (req[c - 'a']++ == 0) need++; // 仅当字符首次统计时，need+1
          }

          long long ans = 0;
          int win[26] = {0}; // 窗口字符计数
          int l = 0, n = s.size();
          for (int r = 0; r < n; r++) {
              char c = s[r];
              int idx = c - 'a';
              // 仅当字符在t中，且窗口计数刚达标时，need-1
              if (req[idx] > 0 && ++win[idx] == req[idx]) {
                  need--;
              }

              // 收缩窗口到最小满足状态
              while (need == 0) {
                  char cl = s[l];
                  int lidx = cl - 'a';
                  // 仅当字符在t中，且窗口计数刚达标时，need+1
                  if (req[lidx] > 0 && win[lidx] == req[lidx]) {
                      need++;
                  }
                  win[lidx]--;
                  l++;
              }
              ans += l; // 核心：累加当前右指针对应的合法子串数
          }
          return ans;
      }
  };
  ```

- 相关问题：[76. 最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/)

## 单序列双指针

### 反转字符串中的单词

- 题目：[151. 反转字符串中的单词 - 力扣（LeetCode）](https://leetcode.cn/problems/reverse-words-in-a-string/)

- 可以先清洗多余的空格，并将所有单词记录到数组中，最后拼接起来

  ```cpp
  string reverseWords(string s) {
      vector<string> words; // 存储提取出的有效单词
      int n = s.size();
      int i = 0;

      // 步骤1：遍历字符串，提取所有有效单词（跳过空格）
      while (i < n) {
          // 跳过当前位置的所有空格（处理前导空格/单词间多空格）
          while (i < n && s[i] == ' ') {
              i++;
          }
          // 如果遍历到字符串末尾，退出循环
          if (i >= n) {
              break;
          }
          // 提取当前单词（从非空格字符开始）
          string word;
          while (i < n && s[i] != ' ') {
              word += s[i];
              i++;
          }
          // 将提取的单词加入列表
          words.push_back(word);
      }

      // 步骤2：反转单词列表
      reverse(words.begin(), words.end());

      // 步骤3：拼接反转后的单词（用单个空格分隔）
      string result;
      for (int j = 0; j < words.size(); j++) {
          if (j > 0) { // 除第一个单词外，每个单词前加一个空格
              result += ' ';
          }
          result += words[j];
      }

      return result;
  }
  ```

- 如何进行原地修改？
  - 先整体反转原字符串：这一步会把单词顺序和单词本身都反转（比如 `"  hello world  "` → `"  dlrow olleh  "`）。
  - 遍历反转后的字符串（快慢指针）：
    - 用 `slow` 指针标记结果位置，`fast` 指针遍历字符
    - 跳过所有前导 / 多余空格，遇到有效单词时，先将单词反转回原顺序，再复制到 `slow` 位置，同时保证单词间仅留一个空格
  - 截断字符串：最后根据 `slow` 指针位置截断，去除尾部多余空格

- 代码实现

  ```cpp
  // 辅助函数：反转字符串中 [start, end] 区间的字符（左闭右闭）
  void reverseRange(string &s, int start, int end) {
      while (start < end) {
          swap(s[start++], s[end--]);
      }
  }

  string reverseWords(string s) {
      int n = s.size();
      // 步骤1：先整体反转整个字符串（包括空格）
      reverseRange(s, 0, n - 1);

      int slow = 0; // 慢指针：指向结果字符串的下一个写入位置
      int fast = 0; // 快指针：遍历反转后的字符串

      while (fast < n) {
          // 跳过当前所有连续空格（处理前导/单词间多余空格）
          while (fast < n && s[fast] == ' ') {
              fast++;
          }
          if (fast >= n) break; // 遍历结束，退出

          // 如果不是第一个单词，先添加一个空格（保证单词间仅一个空格）
          if (slow > 0) {
              s[slow++] = ' ';
          }

          // 记录当前单词的起始位置（用于后续反转）
          int word_start = slow;
          // 将当前单词的字符复制到 slow 位置（此时单词是反转后的）
          while (fast < n && s[fast] != ' ') {
              s[slow++] = s[fast++];
          }

          // 反转当前单词，恢复其原本的顺序
          reverseRange(s, word_start, slow - 1);
      }

      // 截断字符串到有效长度（去除尾部多余字符）
      s.resize(slow);
      return s;
  }
  ```

### 反转字符串中的单词 III

- 题目：[557. 反转字符串中的单词 III - 力扣（LeetCode）](https://leetcode.cn/problems/reverse-words-in-a-string-iii/description/)

- 代码实现

  ```cpp
  class Solution {
  public:
      string reverseWords(string s) {
          int n = s.size(), blank = 0, l = 0, r = 0;
          for (; blank < n; blank++) {
              if (s[blank] == ' ') {
                  for (r = blank - 1; l < r; l++, r--) {
                      swap(s[l], s[r]);
                  }
                  l = blank + 1;
              }
          }
          for (r = blank - 1; l < r; l++, r--) {
              swap(s[l], s[r]);
          }
          return s;
      }
  };
  ```

### 反转字符串 II

- 题目：[541. 反转字符串 II - 力扣（LeetCode）](https://leetcode.cn/problems/reverse-string-ii/description/)

- 代码实现

  ```cpp
  class Solution {
  public:
      string reverseStr(string s, int k) {
          int n = s.size();
          for (int stride = 0; stride * k <= n; stride += 2) {
              if ((stride + 1) * k > n ||
                  ((stride + 1) * k <= n && (stride + 2) * k > n)) {
                  for (int l = stride * k, r = min(n - 1, (stride + 1) * k - 1);
                       l < r; l++, r--) {
                      swap(s[l], s[r]);
                  }
                  break;
              }
              for (int l = stride * k, r = (stride + 1) * k - 1; l < r;
                   l++, r--) {
                  swap(s[l], s[r]);
              }
          }
          return s;
      }
  };
  ```

## 双序列双指针

## 三指针

## 分组循环
