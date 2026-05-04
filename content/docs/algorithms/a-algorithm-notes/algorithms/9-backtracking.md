---
title: 回溯算法
description: 回溯算法的本质、适用问题类型、代码模板与组合排列问题
---

## 回溯算法基础知识

- 回溯法也可以叫做回溯搜索法，它是一种搜索的方式

- 回溯的本质是穷举，穷举所有可能，然后选出想要的答案，如果想让回溯法高效一些，可以进行剪枝，但也改不了回溯法就是穷举的本质

- 回溯法一般可以解决如下几种问题：
  - 组合问题：N个数里面按一定规则找出k个数的集合
  - 切割问题：一个字符串按一定规则有几种切割方式
  - 子集问题：一个N个数的集合里有多少符合条件的子集
  - 排列问题：N个数按一定规则全排列，有几种排列方式
  - 棋盘问题：N皇后，解数独等等

- 其中，组合是不强调元素顺序的，排列是强调元素顺序

- 回溯法解决的问题都可以抽象为树形结构，因为回溯法解决的都是在集合中递归查找子集，集合的大小就构成了树的宽度，递归的深度就构成了树的深度

- 回溯法的模板
  - 回溯函数模板返回值及参数：一般命名为 backtracking，返回值一般为 void
  - 终止条件：一般来说，找到了满足条件的一条答案，旧保存起来并结束本层递归
  - 回溯搜索的遍历过程：backtracking 是纵向遍历

- 完整模板

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

## 组合问题

### 组合

- 给定两个整数 n 和 k，返回 1 ... n 中所有可能的 k 个数的组合

- 暴力解法

  ```cpp
  int n = 4;
  for (int i = 1; i <= n; i++) {
      for (int j = i + 1; j <= n; j++) {
          cout << i << " " << j << endl;
      }
  }
  ```

- 当 k 越大时，嵌套循环层数就越多，显然无法进行暴力搜索

- 而回溯法使用递归来解决嵌套层数的问题，每一次递归中嵌套一个循环，那么递归就可以用于解决多层嵌套循环的问题

- 可以看出，每次从集合中选取元素，可选择的范围随着选择的进行而收缩，调整可选择的范围

- 这个过程可以组织为一棵树，n 相当于树的宽度，k 相当于树的深度，每次搜索到了叶子节点，就找到了一个结果

- 递归函数的返回值和参数
  - startIndex：记录本层递归从哪里开始遍历，防止出现重复的集合
  - n、k
  - 全局变量 path：`vector<int>`，表示符合条件的单一结果
  - 全局变量 result：`vector<vector<int>>`，表示符合条件结果的集合

- 当 path 的长度等于 k 时，说明已经找到了一个结果，可以结束

- 在每次遍历一个新节点后，需要进行回溯，来撤销已经处理的节点

- 示例代码

  ```cpp
  class Solution {
  private:
      vector<vector<int>> result; // 存放符合条件结果的集合
      vector<int> path; // 用来存放符合条件结果
      void backtracking(int n, int k, int startIndex) {
          if (path.size() == k) {
              result.push_back(path);
              return;
          }
          for (int i = startIndex; i <= n; i++) {
              path.push_back(i); // 处理节点
              backtracking(n, k, i + 1); // 递归
              path.pop_back(); // 回溯，撤销处理的节点
          }
      }
  public:
      vector<vector<int>> combine(int n, int k) {
          result.clear(); // 可以不写
          path.clear();   // 可以不写
          backtracking(n, k, 1);
          return result;
      }
  };
  ```

- 时间复杂度为 $O(n*2^n)$，空间复杂度为 $O(n)$​

- 剪枝优化：当 n=4，k=4 时，对于数组 [1,2,3,4]，从元素 2 开始的遍历都没有意义了，因为一定不可能构成满足 k=4 的结果，所以可以剪枝的地方就在递归中每一层的for循环所选择的起始位置
  - 已经选择的元素个数：path.size();
  - 还需要的元素个数为: k - path.size();
  - 在集合 n 中至多要从该起始位置 : n - (k - path.size()) + 1，开始遍历

- 优化后循环

  ```cpp
  class Solution {
  private:
      vector<vector<int>> result;
      vector<int> path;
      void backtracking(int n, int k, int startIndex) {
          if (path.size() == k) {
              result.push_back(path);
              return;
          }
          for (int i = startIndex; i <= n - (k - path.size()) + 1; i++) { // 优化的地方
              path.push_back(i); // 处理节点
              backtracking(n, k, i + 1);
              path.pop_back(); // 回溯，撤销处理的节点
          }
      }
  public:

      vector<vector<int>> combine(int n, int k) {
          backtracking(n, k, 1);
          return result;
      }
  };
  ```

- 相关题目
  - [77. 组合](https://leetcode.cn/problems/combinations/)
  - [39. 组合总和](https://leetcode.cn/problems/combination-sum/)
  - [40. 组合总和 II](https://leetcode.cn/problems/combination-sum-ii/description/)
  - [216. 组合总和 III](https://leetcode.cn/problems/combination-sum-iii/description/)
  - [377. 组合总和 Ⅳ](https://leetcode.cn/problems/combination-sum-iv/description/)
  - [17. 电话号码的字母组合](https://leetcode.cn/problems/letter-combinations-of-a-phone-number/)
  - [46. 全排列](https://leetcode.cn/problems/permutations/description/)
  - [47. 全排列 II](https://leetcode.cn/problems/permutations-ii/description/)
  - [60. 排列序列](https://leetcode.cn/problems/permutation-sequence/description/)
  - [31. 下一个排列](https://leetcode.cn/problems/next-permutation/description/)

### 组合总和

- 找出所有相加之和为 n 的 k 个数的组合；组合中只允许含有 1 - 9 的正整数，并且每种组合中不存在重复的数字

- 所有数字都是正整数，解集不能包含重复的组合

- 示例 1: 输入: k = 3, n = 7 输出: [[1,2,4]]

- 示例 2: 输入: k = 3, n = 9 输出: [[1,2,6], [1,3,5], [2,3,4]]

- 也即在 [1,2,3,4,5,6,7,8,9] 这个集合中找到和为 n 的 k 个数的组合

- 相比于普通的组合， 这里固定了集合，并且添加了一个需要额外满足的条件

- 递归函数的参数
  - targetSum：目标和，也就是题目中的 n
  - k：要求 k 个数的集合
  - sum：已经收集的元素的总和，也就是 path 里元素的总和
  - startIndex：下一层 for 循环搜索的起始位置

- 终止条件
  - 如果 k == path.size()，即可终止
  - 此时如果 sum == targetSum，那么就用 result 收集结果

- 示例代码

  ```cpp
  class Solution {
  private:
      vector<vector<int>> result; // 存放结果集
      vector<int> path; // 符合条件的结果
      // targetSum：目标和，也就是题目中的n。
      // k：题目中要求k个数的集合。
      // sum：已经收集的元素的总和，也就是path里元素的总和。
      // startIndex：下一层for循环搜索的起始位置。
      void backtracking(int targetSum, int k, int sum, int startIndex) {
          if (path.size() == k) {
              if (sum == targetSum) result.push_back(path);
              return; // 如果path.size() == k 但sum != targetSum 直接返回
          }
          for (int i = startIndex; i <= 9; i++) {
              sum += i; // 处理
              path.push_back(i); // 处理
              backtracking(targetSum, k, sum, i + 1); // 注意i+1调整startIndex
              sum -= i; // 回溯
              path.pop_back(); // 回溯
          }
      }

  public:
      vector<vector<int>> combinationSum3(int k, int n) {
          result.clear(); // 可以不加
          path.clear();   // 可以不加
          backtracking(n, k, 0, 1);
          return result;
      }
  };
  ```

- 剪枝优化
  - 当已选元素总和已经大于 n 了，就可以直接剪枝
  - for 循环范围也可以剪枝

- 优化后代码

  ```cpp
  class Solution {
  private:
      vector<vector<int>> result; // 存放结果集
      vector<int> path; // 符合条件的结果
      void backtracking(int targetSum, int k, int sum, int startIndex) {
          if (sum > targetSum) { // 剪枝操作
              return;
          }
          if (path.size() == k) {
              if (sum == targetSum) result.push_back(path);
              return; // 如果path.size() == k 但sum != targetSum 直接返回
          }
          for (int i = startIndex; i <= 9 - (k - path.size()) + 1; i++) { // 剪枝
              sum += i; // 处理
              path.push_back(i); // 处理
              backtracking(targetSum, k, sum, i + 1); // 注意i+1调整startIndex
              sum -= i; // 回溯
              path.pop_back(); // 回溯
          }
      }

  public:
      vector<vector<int>> combinationSum3(int k, int n) {
          result.clear(); // 可以不加
          path.clear();   // 可以不加
          backtracking(n, k, 0, 1);
          return result;
      }
  };
  ```

- 时间复杂度为 $O(n*2^n)$，空间复杂度为 $O(n)$​

### 组合总和 II

- 给定一个无重复元素的数组 candidates 和一个目标数 target ，找出 candidates 中所有可以使数字和为 target 的组合

- candidates 中的数字可以无限制重复被选取

- 所有数字（包括 target）都是正整数，解集不能包含重复的组合

- 与第一个组合总和问题的区别在于，此处没有数量要求，可以无限重复选择，但由于有总和的限制，所以相当于也有个数的限制

- 其关键区别在于，在递归调用回溯函数时，startIndex 不需要再赋值为 i+1，而是保持 i 来表示可以重复读取当前的数

- 示例代码

  ```cpp
  class Solution {
  private:
      vector<vector<int>> result;
      vector<int> path;
      void backtracking(vector<int>& candidates, int target, int sum, int startIndex) {
          if (sum > target) {
              return;
          }
          if (sum == target) {
              result.push_back(path);
              return;
          }

          for (int i = startIndex; i < candidates.size(); i++) {
              sum += candidates[i];
              path.push_back(candidates[i]);
              backtracking(candidates, target, sum, i); // 不用i+1了，表示可以重复读取当前的数
              sum -= candidates[i];
              path.pop_back();
          }
      }
  public:
      vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
          result.clear();
          path.clear();
          backtracking(candidates, target, 0, 0);
          return result;
      }
  };
  ```

- 剪枝优化：实际上，可以对原数组进行排序，如果下一层的 sum（本轮 sum + candidates[i]）已经大于 target，就可以直接结束本轮 for 循环的遍历

- 优化后代码

  ```cpp
  class Solution {
  private:
      vector<vector<int>> result;
      vector<int> path;
      void backtracking(vector<int>& candidates, int target, int sum, int startIndex) {
          if (sum == target) {
              result.push_back(path);
              return;
          }

          // 如果 sum + candidates[i] > target 就终止遍历
          for (int i = startIndex; i < candidates.size() && sum + candidates[i] <= target; i++) {
              sum += candidates[i];
              path.push_back(candidates[i]);
              backtracking(candidates, target, sum, i);
              sum -= candidates[i];
              path.pop_back();

          }
      }
  public:
      vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
          result.clear();
          path.clear();
          sort(candidates.begin(), candidates.end()); // 需要排序
          backtracking(candidates, target, 0, 0);
          return result;
      }
  };
  ```

- 时间复杂度：$O(n * 2^n)$，注意这只是复杂度的上界，因为剪枝的存在，真实的时间复杂度远小于此

- 空间复杂度：$O(target)$​

### 组合总和 III

- 给定一个数组 candidates 和一个目标数 target ，找出 candidates 中所有可以使数字和为 target 的组合

- 这个问题与组合总和问题类似，只是 candidates 数组是无序的，且其元素可能是会重复的，但是依旧不能包含重复的组合

- 去重，实际上就是已经选择过的元素不能重复选取

- 回溯过程可以看成一棵树
  - 同一树枝：往下递归，代表同一个组合
  - 同一树层：横向 for 循环，代表不同的组合分支

- 同一树枝上不用去重，都是同一个组合里的元素，允许重复；同一树层上必须去重，因为树层重复 = 生成重复组合 = 必须剪掉

- 为了方便树层去重，需要先对 candidates 数组进行排序

- 代码实现

  ```cpp
  class Solution {
  private:
      vector<vector<int>> result;
      vector<int> path;
      void backtracking(vector<int>& candidates, int target, int sum, int startIndex, vector<bool>& used) {
          if (sum == target) {
              result.push_back(path);
              return;
          }
          for (int i = startIndex; i < candidates.size() && sum + candidates[i] <= target; i++) {
              // used[i - 1] == true，说明同一树枝candidates[i - 1]使用过
              // used[i - 1] == false，说明同一树层candidates[i - 1]使用过
              // 要对同一树层使用过的元素进行跳过
              if (i > 0 && candidates[i] == candidates[i - 1] && used[i - 1] == false) {
                  continue;
              }
              sum += candidates[i];
              path.push_back(candidates[i]);
              used[i] = true;
              backtracking(candidates, target, sum, i + 1, used); // 和39.组合总和的区别1，这里是i+1，每个数字在每个组合中只能使用一次
              used[i] = false;
              sum -= candidates[i];
              path.pop_back();
          }
      }

  public:
      vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
          vector<bool> used(candidates.size(), false);
          path.clear();
          result.clear();
          // 首先把给candidates排序，让其相同的元素都挨在一起。
          sort(candidates.begin(), candidates.end());
          backtracking(candidates, target, 0, 0, used);
          return result;
      }
  };
  ```

- 也可以直接利用 start 来去重

  ```cpp
  class Solution {
  private:
      vector<vector<int>> result;
      vector<int> path;
      void backtracking(vector<int>& candidates, int target, int sum, int startIndex) {
          if (sum == target) {
              result.push_back(path);
              return;
          }
          for (int i = startIndex; i < candidates.size() && sum + candidates[i] <= target; i++) {
              // 要对同一树层使用过的元素进行跳过
              if (i > startIndex && candidates[i] == candidates[i - 1]) {
                  continue;
              }
              sum += candidates[i];
              path.push_back(candidates[i]);
              backtracking(candidates, target, sum, i + 1); // 和39.组合总和的区别1，这里是i+1，每个数字在每个组合中只能使用一次
              sum -= candidates[i];
              path.pop_back();
          }
      }

  public:
      vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
          path.clear();
          result.clear();
          // 首先把给candidates排序，让其相同的元素都挨在一起。
          sort(candidates.begin(), candidates.end());
          backtracking(candidates, target, 0, 0);
          return result;
      }
  };
  ```

### 电话号码的字母组合

- 给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合，其中映射为
  - 2：abc
  - 3：def
  - 4：ghi
  - 5：jkl
  - 6：mno
  - 7：pqrs
  - 8：tuv
  - 9：wxyz

- 示例
  - 输入："23"
  - 输出：["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]

- 显然，根据输入长度暴力嵌套 for 循环是不现实的

- 使用回溯法，遍历的深度就是输入字符串的长度，叶子节点就是要收集的结果

- 回溯函数的参数
  - 输入的字符串 digits
  - index 表示遍历到第几个数字的，也表示树的深度

- 示例代码

  ```cpp
  class Solution {
  private:
      const string letterMap[10] = {
          "", // 0
          "", // 1
          "abc", // 2
          "def", // 3
          "ghi", // 4
          "jkl", // 5
          "mno", // 6
          "pqrs", // 7
          "tuv", // 8
          "wxyz", // 9
      };
  public:
      vector<string> result;
      string s;
      void backtracking(const string& digits, int index) {
          if (index == digits.size()) {
              result.push_back(s);
              return;
          }
          int digit = digits[index] - '0';        // 将index指向的数字转为int
          string letters = letterMap[digit];      // 取数字对应的字符集
          for (int i = 0; i < letters.size(); i++) {
              s.push_back(letters[i]);            // 处理
              backtracking(digits, index + 1);    // 递归，注意index+1，一下层要处理下一个数字了
              s.pop_back();                       // 回溯
          }
      }
      vector<string> letterCombinations(string digits) {
          s.clear();
          result.clear();
          if (digits.size() == 0) {
              return result;
          }
          backtracking(digits, 0);
          return result;
      }
  };
  ```

- 时间复杂度：$O(3^m * 4^n)$，其中 m 是对应三个字母的数字个数，n 是对应四个字母的数字个数

- 空间复杂度：$O(3^m * 4^n)$​

- 另一种写法可以将回溯的过程写到参数中

  ```cpp
  class Solution {
  private:
          const string letterMap[10] = {
              "", // 0
              "", // 1
              "abc", // 2
              "def", // 3
              "ghi", // 4
              "jkl", // 5
              "mno", // 6
              "pqrs", // 7
              "tuv", // 8
              "wxyz", // 9
          };
  public:
      vector<string> result;
      void getCombinations(const string& digits, int index, const string& s) { // 注意参数的不同
          if (index == digits.size()) {
              result.push_back(s);
              return;
          }
          int digit = digits[index] - '0';
          string letters = letterMap[digit];
          for (int i = 0; i < letters.size(); i++) {
              getCombinations(digits, index + 1, s + letters[i]);  // 注意这里的不同
          }
      }
      vector<string> letterCombinations(string digits) {
          result.clear();
          if (digits.size() == 0) {
              return result;
          }
          getCombinations(digits, 0, "");
          return result;

      }
  };
  ```

- 以上代码的关键在于，通过参数传递回溯状态，参数 s 表示已经拼接好的字母字符串，对当前数字的每一个字母，递归调用函数处理下一个数字（index+1），并将当前字母拼接到 s 后作为新的参数传递，这里的 `s + letters[i]` 是关键，相当于 “记录当前选择的字母”，而由于是值传递（而非引用），递归返回后无需手动 “回溯”（撤销选择），因为每一层递归的`s`都是独立的，不会互相影响

## 分割问题

### 分割回文串

- 给定一个字符串 s，将 s 分割成一些子串，使每个子串都是回文串，返回 s 所有可能的分割方案

- 示例: 输入: "aab" 输出: [ ["aa","b"], ["a","a","b"] ]

- 涉及到两个关键问题：
  - 切割问题，有不同的切割方式
  - 判断是否回文

- 对于字符串abcdef：
  - 组合问题：选取一个 a 之后，在 bcdef 中再去选取第二个，选取 b 之后在 cdef 中再选取第三个.....
  - 切割问题：切割一个 a 之后，在 bcdef 中再去切割第二段，切割 b 之后在 cdef 中再切割第三段.....

- 切割问题也可以抽象为树形结构，横向决定切割的位置，纵向决定切割后的子串再继续如何切割；而结束/剪枝条件即为判断是否是回文字符串

- 代码示例

  ```cpp
  class Solution {
  private:
      vector<vector<string>> result;
      vector<string> path; // 放已经回文的子串
      void backtracking (const string& s, int startIndex) {
          // 如果起始位置已经大于s的大小，说明已经找到了一组分割方案了
          if (startIndex >= s.size()) {
              result.push_back(path);
              return;
          }
          for (int i = startIndex; i < s.size(); i++) {
              if (isPalindrome(s, startIndex, i)) {   // 是回文子串
                  // 获取[startIndex,i]在s中的子串
                  string str = s.substr(startIndex, i - startIndex + 1);
                  path.push_back(str);
              } else {                                // 不是回文，跳过
                  continue;
              }
              backtracking(s, i + 1); // 寻找i+1为起始位置的子串
              path.pop_back(); // 回溯过程，弹出本次已经添加的子串
          }
      }
      bool isPalindrome(const string& s, int start, int end) {
          for (int i = start, j = end; i < j; i++, j--) {
              if (s[i] != s[j]) {
                  return false;
              }
          }
          return true;
      }
  public:
      vector<vector<string>> partition(string s) {
          result.clear();
          path.clear();
          backtracking(s, 0);
          return result;
      }
  };
  ```

- 优化如何判断是否是回文字符串：给定一个字符串 `s`, 长度为 `n` , 它成为回文字串的充分必要条件是 `s[0] == s[n-1]` 且 `s[1:n-1]` 是回文字串

- 那么可以根据动态规划算法，高效地事先一次性计算出，针对一个字符串 `s`，其任何子串是否为回文字符串，从而避免每次都要重新判断是否为回文字符串

- 优化代码

  ```cpp
  class Solution {
  private:
      vector<vector<string>> result;
      vector<string> path; // 放已经回文的子串
      vector<vector<bool>> isPalindrome; // 放事先计算好的是否回文子串的结果
      void backtracking (const string& s, int startIndex) {
          // 如果起始位置已经大于s的大小，说明已经找到了一组分割方案了
          if (startIndex >= s.size()) {
              result.push_back(path);
              return;
          }
          for (int i = startIndex; i < s.size(); i++) {
              if (isPalindrome[startIndex][i]) {   // 是回文子串
                  // 获取[startIndex,i]在s中的子串
                  string str = s.substr(startIndex, i - startIndex + 1);
                  path.push_back(str);
              } else {                                // 不是回文，跳过
                  continue;
              }
              backtracking(s, i + 1); // 寻找i+1为起始位置的子串
              path.pop_back(); // 回溯过程，弹出本次已经添加的子串
          }
      }
      void computePalindrome(const string& s) {
          // isPalindrome[i][j] 代表 s[i:j](双边包括)是否是回文字串
          isPalindrome.resize(s.size(), vector<bool>(s.size(), false)); // 根据字符串s, 刷新布尔矩阵的大小
          for (int i = s.size() - 1; i >= 0; i--) {
              // 需要倒序计算, 保证在i行时, i+1行已经计算好了
              for (int j = i; j < s.size(); j++) {
                  if (j == i) {isPalindrome[i][j] = true;}
                  else if (j - i == 1) {isPalindrome[i][j] = (s[i] == s[j]);}
                  else {isPalindrome[i][j] = (s[i] == s[j] && isPalindrome[i+1][j-1]);}
              }
          }
      }
  public:
      vector<vector<string>> partition(string s) {
          result.clear();
          path.clear();
          computePalindrome(s);
          backtracking(s, 0);
          return result;
      }
  };
  ```

- 参考题目
  - [131. 分割回文串](https://leetcode.cn/problems/palindrome-partitioning/description/)
  - [132. 分割回文串 II](https://leetcode.cn/problems/palindrome-partitioning-ii/description/)
  - [1278. 分割回文串 III](https://leetcode.cn/problems/palindrome-partitioning-iii/description/)
  - [1745. 分割回文串 IV](https://leetcode.cn/problems/palindrome-partitioning-iv/description/)
  - [2472. 不重叠回文子字符串的最大数目](https://leetcode.cn/problems/maximum-number-of-non-overlapping-palindrome-substrings/description/)
  - [2518. 好分区的数目](https://leetcode.cn/problems/number-of-great-partitions/description/)
  - [416. 分割等和子集](https://leetcode.cn/problems/partition-equal-subset-sum/description/)

### 复原 IP 地址

- 给定一个只包含数字的字符串，复原它并返回所有可能的 IP 地址格式

- 示例 1：
  - 输入：s = "25525511135"
  - 输出：["255.255.11.135","255.255.111.35"]

- 示例 2：
  - 输入：s = "0000"
  - 输出：["0.0.0.0"]

- 示例 3：
  - 输入：s = "1111"
  - 输出：["1.1.1.1"]

- 示例 4：
  - 输入：s = "010010"
  - 输出：["0.10.0.10","0.100.1.0"]

- 示例 5：
  - 输入：s = "101023"
  - 输出：["1.0.10.23","1.0.102.3","10.1.0.23","10.10.2.3","101.0.2.3"]

- 显然，这个问题是一个切割问题，横向选定切割的位置，纵向继续切割剩下未切割的部分；而需要写的辅助函数是判断是否为合法的 IP 地址，注意 IP 地址的每一部分最大为 255

- 示例代码

  ```cpp
  class Solution {
  private:
      vector<string> result;// 记录结果
      // startIndex: 搜索的起始位置，pointNum:添加逗点的数量
      void backtracking(string& s, int startIndex, int pointNum) {
          if (pointNum == 3) { // 逗点数量为3时，分隔结束
              // 判断第四段子字符串是否合法，如果合法就放进result中
              if (isValid(s, startIndex, s.size() - 1)) {
                  result.push_back(s);
              }
              return;
          }
          for (int i = startIndex; i < s.size(); i++) {
              if (isValid(s, startIndex, i)) { // 判断 [startIndex,i] 这个区间的子串是否合法
                  s.insert(s.begin() + i + 1 , '.');  // 在i的后面插入一个逗点
                  pointNum++;
                  backtracking(s, i + 2, pointNum);   // 插入逗点之后下一个子串的起始位置为i+2
                  pointNum--;                         // 回溯
                  s.erase(s.begin() + i + 1);         // 回溯删掉逗点
              } else break; // 不合法，直接结束本层循环
          }
      }
      // 判断字符串s在左闭右闭区间[start, end]所组成的数字是否合法
      bool isValid(const string& s, int start, int end) {
          if (start > end) {
              return false;
          }
          if (s[start] == '0' && start != end) { // 0开头的数字不合法
                  return false;
          }
          int num = 0;
          for (int i = start; i <= end; i++) {
              if (s[i] > '9' || s[i] < '0') { // 遇到非数字字符不合法
                  return false;
              }
              num = num * 10 + (s[i] - '0');
              if (num > 255) { // 如果大于255了不合法
                  return false;
              }
          }
          return true;
      }
  public:
      vector<string> restoreIpAddresses(string s) {
          result.clear();
          if (s.size() < 4 || s.size() > 12) return result; // 算是剪枝了
          backtracking(s, 0, 0);
          return result;
      }
  };
  ```

- 参考题目
  - [93. 复原 IP 地址](https://leetcode.cn/problems/restore-ip-addresses/)

## 子集问题

### 子集

- 给定一组不含重复元素的整数数组 nums，返回该数组所有可能的子集（幂集）

- 解集不能包含重复的子集

- 示例：输入：nums = [1,2,3] 输出：[ [3], [1], [2], [1,2,3], [1,3], [2,3], [1,2], [] ]

- 如果把子集问题、组合问题、分割问题都抽象为一棵树结构，那么组合问题和分割问题都是收集树的叶子节点，而子集问题是找树的所有节点

- 子集问题也可以看作一种组合问题，因为它的集合是无序的，既然是无序的，那么 for 循环的时候就要从 startIndex 开始

- 示例代码

  ```cpp
  class Solution {
  private:
      vector<vector<int>> result;
      vector<int> path;
      void backtracking(vector<int>& nums, int startIndex) {
          result.push_back(path); // 收集子集，要放在终止添加的上面，否则会漏掉自己
          if (startIndex >= nums.size()) { // 终止条件可以不加
              return;
          }
          for (int i = startIndex; i < nums.size(); i++) {
              path.push_back(nums[i]);
              backtracking(nums, i + 1);
              path.pop_back();
          }
      }
  public:
      vector<vector<int>> subsets(vector<int>& nums) {
          result.clear();
          path.clear();
          backtracking(nums, 0);
          return result;
      }
  };
  ```

- 参考题目
  - [78. 子集](https://leetcode.cn/problems/subsets/description/)
  - [90. 子集 II](https://leetcode.cn/problems/subsets-ii/description/)
  - [784. 字母大小写全排列](https://leetcode.cn/problems/letter-case-permutation/description/)
  - [1982. 从子集的和还原数组](https://leetcode.cn/problems/find-array-given-subset-sums/description/)
  - [2044. 统计按位或能得到最大值的子集数目](https://leetcode.cn/problems/count-number-of-maximum-bitwise-or-subsets/description/)

### 子集 II

- 给定一个可能包含重复元素的整数数组 nums，返回该数组所有可能的子集（幂集）

- 和之前有所不同，这次的子集可能包含重复的元素，而且求取的子集不能包含重复的子集，那么应该如何处理

- 其实，这与组合总和中的处理逻辑类似，需要先对集合中的数字进行排序，然后进行去重操作

- 示例代码

  ```cpp
  class Solution {
  private:
      vector<vector<int>> result;
      vector<int> path;
      void backtracking(vector<int>& nums, int startIndex) {
          result.push_back(path);
          for (int i = startIndex; i < nums.size(); i++) {
              // 而我们要对同一树层使用过的元素进行跳过
              if (i > startIndex && nums[i] == nums[i - 1] ) { // 注意这里使用i > startIndex
                  continue;
              }
              path.push_back(nums[i]);
              backtracking(nums, i + 1);
              path.pop_back();
          }
      }

  public:
      vector<vector<int>> subsetsWithDup(vector<int>& nums) {
          result.clear();
          path.clear();
          sort(nums.begin(), nums.end()); // 去重需要排序
          backtracking(nums, 0);
          return result;
      }
  };
  ```

- 使用 used 数组

  ```cpp
  class Solution {
  private:
      vector<vector<int>> result;
      vector<int> path;
      void backtracking(vector<int>& nums, int startIndex) {
          result.push_back(path);
          unordered_set<int> uset;
          for (int i = startIndex; i < nums.size(); i++) {
              if (uset.find(nums[i]) != uset.end()) {
                  continue;
              }
              uset.insert(nums[i]);
              path.push_back(nums[i]);
              backtracking(nums, i + 1);
              path.pop_back();
          }
      }

  public:
      vector<vector<int>> subsetsWithDup(vector<int>& nums) {
          result.clear();
          path.clear();
          sort(nums.begin(), nums.end()); // 去重需要排序
          backtracking(nums, 0);
          return result;
      }
  };
  ```

### 划分 k 个等和子集

- 给定一个整数数组 `nums` 和一个正整数 `k`，找出是否有可能把这个数组分成 `k` 个非空子集，其总和都相等

- 代码实现

  ```cpp
  class Solution {
  public:
      bool backtracking(vector<int>& nums, vector<int>& buckets, int target,
                        int index) {
          if (index == nums.size())
              return true;
          int num = nums[index];
          for (int i = 0; i < buckets.size(); i++) {
              // 相同和的桶，跳过重复
              if (i > 0 && buckets[i] == buckets[i - 1])
                  continue;
              if (buckets[i] + num > target)
                  continue;
              buckets[i] += num;
              if (backtracking(nums, buckets, target, index + 1))
                  return true;
              buckets[i] -= num;
              // 如果放入的是空桶，失败后直接退出（空桶放谁都一样）
              if (buckets[i] == 0)
                  break;
          }
          return false;
      }
      bool canPartitionKSubsets(vector<int>& nums, int k) {
          int sum = 0;
          for (int num : nums) {
              sum += num;
          }
          if (sum % k != 0)
              return false;
          int target = sum / k;
          sort(nums.rbegin(), nums.rend());
          if (nums[0] > target)
              return false;
          vector<int> buckets(k, 0);
          return backtracking(nums, buckets, target, 0);
      }
  };
  ```

### 递增子序列

- 给定一个整型数组，找到所有该数组的递增子序列，递增子序列的长度至少是2

- 给定数组的长度不会超过15；数组中的整数范围是 [-100,100]

- 示例:
  - 输入: [4, 6, 7, 7]
  - 输出: [[4, 6], [4, 7], [4, 6, 7], [4, 6, 7, 7], [6, 7], [6, 7, 7], [7,7], [4,7,7]]

- 给定数组中可能包含重复数字，相等的数字应该被视为递增的一种情况

- 递增子序列比较类似取有序的子集，但是在之前的子集问题中，会对数组进行排序来去重，但是这里要求数组的递增子序列，不能对原数组进行排序

- 在树结构中，同一父节点下的同层上使用过的元素就不能再使用，因此，只需要在一次递归中维护临时变量，记录本层已经使用过哪些数字，从而避免在循环中重复使用

- 示例代码

  ```cpp
  class Solution {
  private:
      vector<vector<int>> result;
      vector<int> path;
      void backtracking(vector<int>& nums, int startIndex) {
          if (path.size() > 1) {
              result.push_back(path);
              // 注意这里不要加return，要取树上的节点
          }
          unordered_set<int> uset; // 使用set对本层元素进行去重
          for (int i = startIndex; i < nums.size(); i++) {
              if ((!path.empty() && nums[i] < path.back())
                      || uset.find(nums[i]) != uset.end()) {
                      continue;
              }
              uset.insert(nums[i]); // 记录这个元素在本层用过了，本层后面不能再用了
              path.push_back(nums[i]);
              backtracking(nums, i + 1);
              path.pop_back();
          }
      }
  public:
      vector<vector<int>> findSubsequences(vector<int>& nums) {
          result.clear();
          path.clear();
          backtracking(nums, 0);
          return result;
      }
  };
  ```

- 题目中已经给出了数值范围，因此可以直接使用数组做哈希表，从而避免使用 unordered_set 而导致的效率问题

- 频繁对 `unordered_set` 执行 `insert` 操作会导致双重性能损耗：一是每次插入需计算键值的哈希值，二是底层哈希表需频繁扩容，涉及内存重分配和数据迁移，显著增加耗时

- 优化后代码

  ```cpp
  class Solution {
  private:
      vector<vector<int>> result;
      vector<int> path;
      void backtracking(vector<int>& nums, int startIndex) {
          if (path.size() > 1) {
              result.push_back(path);
          }
          int used[201] = {0}; // 这里使用数组来进行去重操作，题目说数值范围[-100, 100]
          for (int i = startIndex; i < nums.size(); i++) {
              if ((!path.empty() && nums[i] < path.back())
                      || used[nums[i] + 100] == 1) {
                      continue;
              }
              used[nums[i] + 100] = 1; // 记录这个元素在本层用过了，本层后面不能再用了
              path.push_back(nums[i]);
              backtracking(nums, i + 1);
              path.pop_back();
          }
      }
  public:
      vector<vector<int>> findSubsequences(vector<int>& nums) {
          result.clear();
          path.clear();
          backtracking(nums, 0);
          return result;
      }
  };
  ```

- 参考题目
  - [491. 非递减子序列](https://leetcode.cn/problems/non-decreasing-subsequences/)
  - [646. 最长数对链](https://leetcode.cn/problems/maximum-length-of-pair-chain/)
  - [300. 最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence/description/)
  - [2771. 构造最长非递减子数组](https://leetcode.cn/problems/longest-non-decreasing-subarray-from-two-arrays/description/)

## 排列问题

### 全排列

- 给定一个没有重复数字的序列，返回其所有可能的全排列

- 示例：
  - 输入：[1,2,3]
  - 输出：[ [1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1] ]

- 全排列问题也可以抽象为树形结构，但是排列问题需要使用 used 数组，标记已经选择的元素

- 与组合、切割、子集问题的最大区别在于 for 循环里不需要 startIndex；因为排列问题中，每次都要从头开始搜索，例如元素 1 在 [1,2] 中已经使用过了，但是在 [2,1] 中还要再使用一次 1

- 而 used 数组，其实就是记录此时 path 里都有哪些元素使用了，一个排列里一个元素只能使用一次

- 示例代码

  ```cpp
  class Solution {
  public:
      vector<vector<int>> result;
      vector<int> path;
      void backtracking (vector<int>& nums, vector<bool>& used) {
          // 此时说明找到了一组
          if (path.size() == nums.size()) {
              result.push_back(path);
              return;
          }
          for (int i = 0; i < nums.size(); i++) {
              if (used[i] == true) continue; // path里已经收录的元素，直接跳过
              used[i] = true;
              path.push_back(nums[i]);
              backtracking(nums, used);
              path.pop_back();
              used[i] = false;
          }
      }
      vector<vector<int>> permute(vector<int>& nums) {
          result.clear();
          path.clear();
          vector<bool> used(nums.size(), false);
          backtracking(nums, used);
          return result;
      }
  };
  ```

- 时间复杂度：$O(n!)$

- 空间复杂度：$O(n)$

- 参考题目
  - [46. 全排列](https://leetcode.cn/problems/permutations/)
  - [47. 全排列 II](https://leetcode.cn/problems/permutations-ii/description/)
  - [31. 下一个排列](https://leetcode.cn/problems/next-permutation/description/)
  - [60. 排列序列](https://leetcode.cn/problems/permutation-sequence/description/)
  - [996. 平方数组的数目](https://leetcode.cn/problems/number-of-squareful-arrays/)
  - [1850. 邻位交换的最小次数](https://leetcode.cn/problems/minimum-adjacent-swaps-to-reach-the-kth-smallest-number/)

### 全排列 II

- 给定一个可包含重复数字的序列 nums ，按任意顺序 返回所有不重复的全排列

- 1 <= nums.length <= 8、-10 <= nums[i] <= 10

- 示例 1：
  - 输入：nums = [1,1,2]
  - 输出： [[1,1,2], [1,2,1], [2,1,1]]

- 示例 2：
  - 输入：nums = [1,2,3]
  - 输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]

- 这里允许序列中元素重复，那么就需要进行去重，而必须要对元素进行排序，从而可以通过相邻节点判断是否重复使用

- 示例代码

  ```cpp
  class Solution {
  private:
      vector<vector<int>> result;
      vector<int> path;
      void backtracking (vector<int>& nums, vector<bool>& used) {
          // 此时说明找到了一组
          if (path.size() == nums.size()) {
              result.push_back(path);
              return;
          }
          for (int i = 0; i < nums.size(); i++) {
              // used[i - 1] == true，说明同一树枝nums[i - 1]使用过
              // used[i - 1] == false，说明同一树层nums[i - 1]使用过
              // 如果同一树层nums[i - 1]使用过则直接跳过
              if (i > 0 && nums[i] == nums[i - 1] && used[i - 1] == false) {
                  continue;
              }
              if (used[i] == false) {
                  used[i] = true;
                  path.push_back(nums[i]);
                  backtracking(nums, used);
                  path.pop_back();
                  used[i] = false;
              }
          }
      }
  public:
      vector<vector<int>> permuteUnique(vector<int>& nums) {
          result.clear();
          path.clear();
          sort(nums.begin(), nums.end()); // 排序
          vector<bool> used(nums.size(), false);
          backtracking(nums, used);
          return result;
      }
  };

  // 时间复杂度: 最差情况所有元素都是唯一的。复杂度和全排列1都是 O(n! * n) 对于 n 个元素一共有 n! 中排列方案。而对于每一个答案，需要 O(n) 去复制最终放到 result 数组
  // 空间复杂度: O(n) 回溯树的深度取决于有多少个元素
  ```

## 棋盘问题

### N 皇后

- n 皇后问题 研究的是如何将 n 个皇后放置在 n×n 的棋盘上，并且使皇后彼此之间不能相互攻击

- 给一个整数 n ，返回所有不同的 n 皇后问题 的解决方案

- 每一种解法包含一个不同的 n 皇后问题 的棋子放置方案，该方案中 'Q' 和 '.' 分别代表了皇后和空位

- 皇后的约束条件
  - 不能同行
  - 不能同列
  - 不能同斜线

- N 皇后问题也可以抽象为树形结构，二维矩阵中矩阵的高就是这课树的高度，矩阵的宽就是每个节点的宽度

- 代码示例

  ```cpp
  class Solution {
  private:
  vector<vector<string>> result;
  // n 为输入的棋盘大小
  // row 是当前递归到棋盘的第几行了
  void backtracking(int n, int row, vector<string>& chessboard) {
      if (row == n) {
          result.push_back(chessboard);
          return;
      }
      for (int col = 0; col < n; col++) {
          if (isValid(row, col, chessboard, n)) { // 验证合法就可以放
              chessboard[row][col] = 'Q'; // 放置皇后
              backtracking(n, row + 1, chessboard);
              chessboard[row][col] = '.'; // 回溯，撤销皇后
          }
      }
  }
  bool isValid(int row, int col, vector<string>& chessboard, int n) {
      // 检查列
      for (int i = 0; i < row; i++) { // 这是一个剪枝
          if (chessboard[i][col] == 'Q') {
              return false;
          }
      }
      // 检查 45度角是否有皇后
      for (int i = row - 1, j = col - 1; i >=0 && j >= 0; i--, j--) {
          if (chessboard[i][j] == 'Q') {
              return false;
          }
      }
      // 检查 135度角是否有皇后
      for(int i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
          if (chessboard[i][j] == 'Q') {
              return false;
          }
      }
      return true;
  }
  public:
      vector<vector<string>> solveNQueens(int n) {
          result.clear();
          std::vector<std::string> chessboard(n, std::string(n, '.'));
          backtracking(n, 0, chessboard);
          return result;
      }
  };
  ```

- 优化代码

  ```cpp
  class Solution {
  private:
      int count = 0;

      // row：当前处理到第几行
      // col：已占用的列（二进制位为1表示该列被占用）
      // diag1：已占用的正对角线（45°，row-col 固定）
      // diag2：已占用的反对角线（135°，row+col 固定）
      // n：棋盘大小
      void backtracking(int n, int row, int col, int diag1, int diag2) {
          // 终止条件：所有行都放完皇后，计数+1
          if (row == n) {
              count++;
              return;
          }

          // 计算当前行可放置皇后的位置：
          // ~(col | diag1 | diag2) ：取反后，0表示不可放，1表示可放
          // ((1 << n) - 1) ：保留低n位，高位清零（避免无关位干扰）
          int available = ~(col | diag1 | diag2) & ((1 << n) - 1);

          // 遍历所有可放置的位置（available不为0时继续）
          while (available) {
              // 提取最低位的1（表示当前要放置皇后的列）
              int pos = available & -available;
              // 清除最低位的1（标记该位置已被使用）
              available -= pos;

              // 递归处理下一行：
              // col | pos：标记该列被占用
              // (diag1 | pos) << 1：正对角线向下一行偏移
              // (diag2 | pos) >> 1：反对角线向下一行偏移
              backtracking(n, row + 1, col | pos, (diag1 | pos) << 1, (diag2 | pos) >> 1);
              // 无需回溯！因为col/diag1/diag2是按值传递，递归返回后自动恢复状态
          }
      }

  public:
      int totalNQueens(int n) {
          count = 0;
          // 初始状态：col=0（无列占用）、diag1=0（无正对角线占用）、diag2=0（无反对角线占用）
          backtracking(n, 0, 0, 0, 0);
          return count;
      }
  };
  ```

- 参考题目
  - [51. N 皇后](https://leetcode.cn/problems/n-queens/)
  - [52. N 皇后 II](https://leetcode.cn/problems/n-queens-ii/description/)
  - [1001. 网格照明](https://leetcode.cn/problems/grid-illumination/)

### 数独

- 一个数独的解法需遵循如下规则： 数字 1-9 在每一行只能出现一次。 数字 1-9 在每一列只能出现一次。 数字 1-9 在每一个以粗实线分隔的 3x3 宫内只能出现一次。 空白格用 '.' 表示

- 前面的问题都是一维递归问题，即使是 N 皇后问题，由于每一行每一列只放一个皇后，只需要一层for循环遍历一行，递归来遍历列，然后一行一列确定皇后的唯一位置

- 而数独游戏中，棋盘的每一个位置都要放一个数字（而 N 皇后是一行只放一个皇后），并检查数字是否合法，解数独的树形结构要比 N 皇后更宽更深

- 实现代码

  ```cpp
  class Solution {
  private:
  bool backtracking(vector<vector<char>>& board) {
      for (int i = 0; i < board.size(); i++) {        // 遍历行
          for (int j = 0; j < board[0].size(); j++) { // 遍历列
              if (board[i][j] == '.') {
                  for (char k = '1'; k <= '9'; k++) {     // (i, j) 这个位置放k是否合适
                      if (isValid(i, j, k, board)) {
                          board[i][j] = k;                // 放置k
                          if (backtracking(board)) return true; // 如果找到合适一组立刻返回
                          board[i][j] = '.';              // 回溯，撤销k
                      }
                  }
                  return false;  // 9个数都试完了，都不行，那么就返回false
              }
          }
      }
      return true; // 遍历完没有返回false，说明找到了合适棋盘位置了
  }
  bool isValid(int row, int col, char val, vector<vector<char>>& board) {
      for (int i = 0; i < 9; i++) { // 判断行里是否重复
          if (board[row][i] == val) {
              return false;
          }
      }
      for (int j = 0; j < 9; j++) { // 判断列里是否重复
          if (board[j][col] == val) {
              return false;
          }
      }
      int startRow = (row / 3) * 3;
      int startCol = (col / 3) * 3;
      for (int i = startRow; i < startRow + 3; i++) { // 判断9方格里是否重复
          for (int j = startCol; j < startCol + 3; j++) {
              if (board[i][j] == val ) {
                  return false;
              }
          }
      }
      return true;
  }
  public:
      void solveSudoku(vector<vector<char>>& board) {
          backtracking(board);
      }
  };
  ```

- 参考题目
  - [37. 解数独](https://leetcode.cn/problems/sudoku-solver/description/)
  - [36. 有效的数独](https://leetcode.cn/problems/valid-sudoku/)
  - [2133. 检查是否每一行每一列都包含全部整数](https://leetcode.cn/problems/check-if-every-row-and-column-contains-all-numbers/description/)
  - [62. 不同路径](https://leetcode.cn/problems/unique-paths/)
  - [63. 不同路径 II](https://leetcode.cn/problems/unique-paths-ii/)
  - [980. 不同路径 III](https://leetcode.cn/problems/unique-paths-iii/description/)
  - [79. 单词搜索](https://leetcode.cn/problems/word-search/)
  - [212. 单词搜索 II](https://leetcode.cn/problems/word-search-ii/description/)
  - [2227. 加密解密字符串](https://leetcode.cn/problems/encrypt-and-decrypt-strings/description/)
  - [208. 实现 Trie (前缀树)](https://leetcode.cn/problems/implement-trie-prefix-tree/description/)

## 回溯算法总结

- 回溯法 = 决策树的 DFS 遍历
- 所有回溯问题都可以抽象为一棵决策树：
  - 树的节点：表示当前的决策状态（已选元素、当前位置等）
  - 树的分支：表示当前步的可选决策（选哪个元素、切在哪里等）
  - 树的深度：表示决策的步骤（比如组合选第 k 个元素、切割切第 k 刀）
  - 回溯（回退）：从子节点回到父节点，撤销当前决策，尝试下一个分支
- 树结构的差异
  - 组合 / 子集：树的分支是「从当前位置往后选」，避免重复；子集是「每个节点都收集结果」，组合是「仅叶子节点收集」
  - 切割：树的分支是「当前切割点的所有回文子串」，结束条件是「切割到末尾」
  - 排列：树的分支是「所有未选元素」，需用 `used` 标记，允许选前面的元素（因此有顺序）
  - 棋盘（N 皇后）：树的每一层是「一行」，分支是「该行的合法列」，需检查列 / 对角线约束
- 回溯法技巧
  - 剪枝：提前排除无效选择（如组合的剩余元素检查、N 皇后的对角线检查），大幅提升效率
  - 状态回退：递归后必须撤销选择（`pop()`、`used`重置等），恢复到父节点状态
  - 结果收集：注意拷贝路径（`path.copy()`），避免后续修改覆盖结果
