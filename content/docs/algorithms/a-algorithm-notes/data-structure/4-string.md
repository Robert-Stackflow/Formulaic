---
title: 字符串
description: 字符串的基本性质、常用操作、KMP 算法等常用技巧
---

## 字符串

### 反转字符串

- 编写一个函数，其作用是将输入的字符串反转过来，输入字符串以字符数组 char[] 的形式给出；必须原地修改输入数组、使用 O(1) 的额外空间解决

- 类似反转链表，可以使用双指针方法，定义两个指针（也可以说是索引下标），一个从字符串前面，一个从字符串后面，两个指针同时向中间移动，并交换元素

- 代码实现

  ```cpp
  class Solution {
  public:
      void reverseString(vector<char>& s) {
          for (int i = 0, j = s.size() - 1; i < s.size()/2; i++, j--) {
              swap(s[i],s[j]);
          }
      }
  };

  # swap 1
  int tmp = s[i];
  s[i] = s[j];
  s[j] = tmp;
  # swap 2
  s[i] ^= s[j];
  s[j] ^= s[i];
  s[i] ^= s[j];
  ```

- 进阶：给定一个字符串 s 和一个整数 k，从字符串开头算起，每计数至 2k 个字符，就反转这 2k 个字符中的前 k 个字符；如果剩余字符少于 k 个，则将剩余字符全部反转；如果剩余字符小于 2k 但大于或等于 k 个，则反转前 k 个字符，其余字符保持原样

- 代码实现

  ```cpp
  class Solution {
  public:
      void reverse(string& s, int start, int end) {
          for (int i = start, j = end; i < j; i++, j--) {
              swap(s[i], s[j]);
          }
      }
      string reverseStr(string s, int k) {
          for (int i = 0; i < s.size(); i += (2 * k)) {
              // 1. 每隔 2k 个字符的前 k 个字符进行反转
              // 2. 剩余字符小于 2k 但大于或等于 k 个，则反转前 k 个字符
              if (i + k <= s.size()) {
                  reverse(s, i, i + k - 1);
                  continue;
              }
              // 3. 剩余字符少于 k 个，则将剩余字符全部反转。
              reverse(s, i, s.size() - 1);
          }
          return s;
      }
  };
  ```

- 进阶：给定一个字符串，逐个翻转字符串中的每个单词，如输入: "the sky is blue"，输出: "blue is sky the"

- 可以先反转整个字符串，然后逐个单词反转

  ```cpp
  class Solution {
  public:
      void reverse(string& s, int start, int end){ //翻转，区间写法：左闭右闭 []
          for (int i = start, j = end; i < j; i++, j--) {
              swap(s[i], s[j]);
          }
      }

      void removeExtraSpaces(string& s) {//去除所有空格并在相邻单词之间添加空格, 快慢指针。
          int slow = 0;   //整体思想参考https://programmercarl.com/0027.移除元素.html
          for (int i = 0; i < s.size(); ++i) { //
              if (s[i] != ' ') { //遇到非空格就处理，即删除所有空格。
                  if (slow != 0) s[slow++] = ' '; //手动控制空格，给单词之间添加空格。slow != 0说明不是第一个单词，需要在单词前添加空格。
                  while (i < s.size() && s[i] != ' ') { //补上该单词，遇到空格说明单词结束。
                      s[slow++] = s[i++];
                  }
              }
          }
          s.resize(slow); //slow的大小即为去除多余空格后的大小。
      }

      string reverseWords(string s) {
          removeExtraSpaces(s); //去除多余空格，保证单词之间之只有一个空格，且字符串首尾没空格。
          reverse(s, 0, s.size() - 1);
          int start = 0; //removeExtraSpaces后保证第一个单词的开始下标一定是0。
          for (int i = 0; i <= s.size(); ++i) {
              if (i == s.size() || s[i] == ' ') { //到达空格或者串尾，说明一个单词结束。进行翻转。
                  reverse(s, start, i - 1); //翻转，注意是左闭右闭 []的翻转。
                  start = i + 1; //更新下一个单词的开始下标start
              }
          }
          return s;
      }
  };
  ```

- 参考题目
  - [344. 反转字符串](https://leetcode.cn/problems/reverse-string/)
  - [541. 反转字符串 II](https://leetcode.cn/problems/reverse-string-ii/description/)
  - [557. 反转字符串中的单词 III](https://leetcode.cn/problems/reverse-words-in-a-string-iii/description/)
  - [2810. 故障键盘](https://leetcode.cn/problems/faulty-keyboard/description/)
  - [917. 仅仅反转字母](https://leetcode.cn/problems/reverse-only-letters/description/)
  - [345. 反转字符串中的元音字母](https://leetcode.cn/problems/reverse-vowels-of-a-string/description/)
  - [2785. 将字符串中的元音字母排序](https://leetcode.cn/problems/sort-vowels-in-a-string/description/)
  - [3330. 找到初始输入字符串 I](https://leetcode.cn/problems/find-the-original-typed-string-i/description/)
  - [3333. 找到初始输入字符串 II](https://leetcode.cn/problems/find-the-original-typed-string-ii/description/)

## 替换数字

- 给定一个字符串 s，它包含小写字母和数字字符，请编写一个函数，将字符串中的字母字符保持不变，而将每个数字字符替换为number

- 例如，对于输入字符串 "a1b2c3"，函数应该将其转换为 "anumberbnumbercnumber"

- 要求不要只用额外的辅助空间

- 可以使用双指针法，i 指向新长度的末尾，j指向旧长度的末尾，j 向左遍历，遇到非数字，则进行赋值并同时移动指针；遇到数字，则替换为“number”，移动指针

- 对于很多数组填充类的问题，其做法都是先预先给数组扩容至填充后的大小，然后从后向前进行操作，这样可以避免申请新数组，同时从后向前填充元素时，避免了从前向后填充元素时每次添加元素都要批量移动元素的问题

- 代码实现

  ```cpp
  #include <iostream>
  using namespace std;
  int main() {
      string s;
      while (cin >> s) {
          int sOldIndex = s.size() - 1;
          int count = 0; // 统计数字的个数
          for (int i = 0; i < s.size(); i++) {
              if (s[i] >= '0' && s[i] <= '9') {
                  count++;
              }
          }
          // 扩充字符串s的大小，也就是将每个数字替换成"number"之后的大小
          s.resize(s.size() + count * 5);
          int sNewIndex = s.size() - 1;
          // 从后往前将数字替换为"number"
          while (sOldIndex >= 0) {
              if (s[sOldIndex] >= '0' && s[sOldIndex] <= '9') {
                  s[sNewIndex--] = 'r';
                  s[sNewIndex--] = 'e';
                  s[sNewIndex--] = 'b';
                  s[sNewIndex--] = 'm';
                  s[sNewIndex--] = 'u';
                  s[sNewIndex--] = 'n';
              } else {
                  s[sNewIndex--] = s[sOldIndex];
              }
              sOldIndex--;
          }
          cout << s << endl;
      }
  }
  ```

## 右旋字符串

- 字符串的右旋转操作是把字符串尾部的若干个字符转移到字符串的前面。给定一个字符串 s 和一个正整数 k，请编写一个函数，将字符串中的后面 k 个字符移到字符串的前面，实现字符串的右旋转操作

- 例如，对于输入字符串 "abcdefg" 和整数 2，函数应该将其转换为 "fgabcde"

- 要求在原地操作，不能申请额外的空间

- 可以先反转整个字符串，然后分两段再次分别反转字符串

- 代码实现

  ```cpp
  #include<iostream>
  #include<algorithm>
  using namespace std;
  int main() {
      int n;
      string s;
      cin >> n;
      cin >> s;
      int len = s.size(); //获取长度

      reverse(s.begin(), s.end()); // 整体反转
      reverse(s.begin(), s.begin() + n); // 先反转前一段，长度n
      reverse(s.begin() + n, s.end()); // 再反转后一段

      cout << s << endl;

  }
  ```

## KMP

- 实现 strStr() 函数：给定一个 haystack 字符串和一个 needle 字符串，在 haystack 字符串中找出 needle 字符串出现的第一个位置 (从0开始)。如果不存在，则返回 -1

- KMP 的思路
  - 暴力匹配的思路是：主串和模式串逐字符比对，匹配失败就主串回退、模式串归零，时间复杂度 O (n\*m)（n 是主串长度，m 是模式串长度）
  - 暴力匹配的痛点：比如主串是 `ABCDABCX`，模式串是 `ABCDABD`，当匹配到第 7 位（主串 C vs 模式串 D）失败时，暴力法会让主串从第 2 位、模式串从第 0 位重新匹配；但 KMP 知道 “已匹配的前缀 `ABCDAB` 有公共前后缀 `AB`”，因此模式串只需回退到第 2 位，主串继续往后走即可
  - 核心结论：匹配失败时，模式串回退的位置由「模式串自身的前后缀公共长度」决定—— 这就是 KMP 的核心，而记录这个长度的数组就是「next 数组（前缀函数数组）」
  - KMP 的思路是：匹配失败时，模式串尽可能少回退，主串不回退，时间复杂度 O (n+m)，效率大幅提升

- 前缀函数（next 数组）
  - 对一个字符串 `s`，假设长度为 m：
    - 前缀：包含首字符、不包含尾字符的所有子串（比如 `abcd` 的前缀：`a, ab, abc`）；
    - 后缀：包含尾字符、不包含首字符的所有子串（比如 `abcd` 的后缀：`d, cd, bcd`）；
    - 最长相等前后缀长度：前缀和后缀中最长的相等子串长度（比如 `ABCDAB` 的最长相等前后缀是 `AB`，长度为 2）

  - next [i] 表示：模式串 P 的前 i+1 个字符组成的子串 `P[0..i]` 的「最长相等前后缀长度」

  - 对于模式串 `ABCDABD`，其 next 数组为

    | 模式串下标 i  | 0(A) | 1(B) | 2(C) | 3(D) | 4(A)  | 5(B)   | 6(D)    |
    | :------------ | :--- | :--- | :--- | :--- | :---- | :----- | :------ |
    | 子串 P [0..i] | A    | AB   | ABC  | ABCD | ABCDA | ABCDAB | ABCDABD |
    | next[i]       | 0    | 0    | 0    | 0    | 1     | 2      | 0       |

- 使用递推法计算 next 数组：
  - 初始化：`j=0`（最长相等前后缀长度），`next[0]=0`
  - 遍历模式串（i 从 1 开始）：
    - 若 `P[i] == P[j]`：j++，next[i]=j；
    - 若 `P[i] != P[j]`：j 回退到 `next[j-1]`（直到 j=0 或匹配）；
    - 若 j=0 且仍不匹配：next [i]=0

- 得到 next 数组后，用 next 数组指导主串和模式串的匹配
  - 初始化：主串指针 `i=0`，模式串指针 `j=0`
  - 遍历主串（i < 主串长度）：
    - 若 `S[i] == P[j]`：i++，j++；
    - 若 `S[i] != P[j]`：
      - 若 j>0：j = next [j-1]（模式串回退）；
      - 若 j=0：i++（主串前进）；
    - 若 j == 模式串长度：匹配成功，返回 `i-j`（模式串在主串中的起始下标）；
  - 遍历结束未匹配：返回 - 1

- 代码实现

  ```cpp
  #include <iostream>
  #include <vector>
  #include <string>
  using namespace std;

  // 步骤1：计算模式串的next数组
  vector<int> getNext(const string& pattern) {
      int m = pattern.size();
      vector<int> next(m, 0); // 初始化next数组，长度为模式串长度，默认0
      int j = 0; // j表示最长相等前后缀的长度

      for (int i = 1; i < m; ++i) {
          // 情况1：当前字符不匹配，j回退
          while (j > 0 && pattern[i] != pattern[j]) {
              j = next[j-1];
          }
          // 情况2：当前字符匹配，j++
          if (pattern[i] == pattern[j]) {
              j++;
          }
          // 记录next[i]
          next[i] = j;
      }
      return next;
  }

  // 步骤2：KMP匹配主串和模式串，返回模式串在主串中的起始下标（无则返回-1）
  int kmpSearch(const string& text, const string& pattern) {
      if (pattern.empty()) return 0; // 模式串为空，默认匹配
      int n = text.size();
      int m = pattern.size();
      vector<int> next = getNext(pattern);
      int j = 0; // 模式串指针

      for (int i = 0; i < n; ++i) {
          // 匹配失败，模式串指针回退
          while (j > 0 && text[i] != pattern[j]) {
              j = next[j-1];
          }
          // 匹配成功，模式串指针前进
          if (text[i] == pattern[j]) {
              j++;
          }
          // 模式串完全匹配，返回起始下标
          if (j == m) {
              return i - m + 1;
          }
      }
      return -1; // 无匹配
  }
  ```

- 时间复杂度分析
  - 计算 next 数组的复杂度：$O(m)$
  - 匹配过程的复杂度：$O(n)$
  - 总复杂度：$O(m+n)$

## 重复的子字符串

- 给定字符串 $S$，长度为 $n$，判断是否存在一个非空真子串 $T$，使得

  $$
  S = T^k,\quad k \ge 2
  $$

- 暴力解法：一个 for 循环获取子串的终止位置，然后判断子串是否能重复构成一个字符串，即 $O(n^2)$

### 移动窗口法

- 当一个字符串 s 由重复的子串组成，那么这个子串一定是从头开始的一个子串
- 那么，两个 s 拼接后的字符串一定会组成一个新的 s
- 当然，要刨除 s+s 的首尾字符，来防止会搜索出原来的 s 字符串

### KMP 方法

- 设 $lps[i]$ 表示 $S[0..i]$ 的最长真前缀与真后缀的公共长度，令 $L = lps[n-1]$，则

  $$
  S \text{ 可以由某个子串重复构成} \iff L > 0 \  \text{且} \ n \bmod (n - L) = 0
  $$

- 字符串 `s` 能由子串 `t` 重复多次构成的充要条件：
  - 字符串长度 `n` 能被「最小重复子串长度」整除；
  - 前缀函数数组的最后一个值 `next[n-1]` 满足：`n % (n - next[n-1]) == 0`
  - `next[n-1]` 是 `s` 的「最长相等前后缀长度」
  - `n - next[n-1]` 就是「最小重复子串的长度」
  - 若 `n` 能被这个长度整除，说明 `s` 是由该子串重复构成的

- 代码实现

  ```cpp
  class Solution {
  public:
      void getNext (int* next, const string& s){
          next[0] = -1;
          int j = -1;
          for(int i = 1;i < s.size(); i++){
              while(j >= 0 && s[i] != s[j + 1]) {
                  j = next[j];
              }
              if(s[i] == s[j + 1]) {
                  j++;
              }
              next[i] = j;
          }
      }
      bool repeatedSubstringPattern (string s) {
          if (s.size() == 0) {
              return false;
          }
          int next[s.size()];
          getNext(next, s);
          int len = s.size();
          if (next[len - 1] != -1 && len % (len - (next[len - 1] + 1)) == 0) {
              return true;
          }
          return false;
      }
  };
  ```

- 参考题目
  - [28. 找出字符串中第一个匹配项的下标](https://leetcode.cn/problems/find-the-index-of-the-first-occurrence-in-a-string/description/)
  - [459. 重复的子字符串](https://leetcode.cn/problems/repeated-substring-pattern/description/)
  - [686. 重复叠加字符串匹配](https://leetcode.cn/problems/repeated-string-match/description/)

## 字典树（Trie）

- 字典树 = 前缀树 = 多叉树，专门用来存字符串，快速查「前缀是否存在」「整个串是否存在」「有多少串以这个前缀开头」

- 字典树（Trie，Prefix Tree）是一种基于前缀共享的多叉树结构，用于高效存储和检索字符串集合

- 字典树的核心思想是将字符串按字符逐层拆分，通过公共前缀共享路径，从而在时间复杂度上实现与字符串长度线性相关的查找与插入

- 设字符集为 $\Sigma$，大小为 $|\Sigma| = K$

- 给定字符串集合 $S = {s_1, s_2, \dots, s_n}$，其中任意 $s_i \in \Sigma^*$

- Trie 是一棵有根树 $T$，满足：
  - 根节点表示空串 $\epsilon$
  - 每条边标记一个字符 $c \in \Sigma$
  - 任意从根到节点 $v$ 的路径字符拼接构成一个前缀字符串
  - 若某节点对应字符串 $s \in S$，则该节点标记为终止节点

- 节点结构通常包含：
  - children：长度为 $K$ 的子指针数组（一般是 26），或哈希表
  - is_end / count：标记是否是单词结尾 / 统计数量
  - 可选：pass_count、end_count 等统计信息

- 核心功能
  - 插入一个字符串
  - 查询一个字符串是否存在
  - 查询是否有字符串以某个前缀开头
  - 统计有多少字符串以某个前缀开头

- 初始化：创建一棵 26 叉树，一开始只有一个根节点 root。26 叉树的每个节点包含一个长为 26 的儿子节点列表 son，以及一个布尔值 end，表示是否为终止节点

- insert：
  - 遍历字符串 word，同时用一个变量 cur 表示当前在 26 叉树的哪个节点，初始值为 root
  - 如果 word[i] 不是 cur 的儿子，那么创建一个新的节点 node 作为 cur 的儿子；如果 word[i]=a，那么把 node 记录到 cur 的 son[0] 中；如果 word[i]=b，那么把 node 记录到 cur 的 son[1] 中；依此类推
  - 更新 cur 为儿子列表中的相应节点
  - 遍历结束，把 cur 的 end 标记为 true

- search 和 startsWith 可以复用同一个函数 find：
  - 遍历字符串 word，同时用一个变量 cur 表示当前在 26 叉树的哪个节点，初始值为 root
  - 如果 word[i] 不是 cur 的儿子，返回 0。search 和 startsWith 收到 0 之后返回 false
  - 更新 cur 为儿子列表中的相应节点
  - 遍历结束，如果 cur 的 end 是 false，返回 1，否则返回 2。search 如果收到的是 2，返回 true，否则返回 false。startsWith 如果收到的是非 0 数字，返回 true，否则返回 false

- 字典树模板

  ```cpp
  #include <iostream>
  #include <string>
  #include <vector>
  #include <cstring> // 用于 memset
  using namespace std;

  // 用class封装Trie，私有成员隐藏实现细节，公共接口提供功能
  class Trie {
  private:
      // 字母表大小（仅处理小写字母），私有常量
      static constexpr int ALPHABET = 26;

      // 前缀树节点结构（私有，外部不可访问）
      struct Node {
          int next[ALPHABET]; // 子节点索引（-1表示无该子节点）
          int pass;           // 经过该节点的单词数量
          int end;            // 以该节点为结尾的单词数量

          // 节点构造函数：初始化所有字段
          Node() {
              memset(next, -1, sizeof(next)); // 批量初始化next数组为-1
              pass = 0;
              end = 0;
          }
      };

      vector<Node> tree; // 存储所有节点，root固定为索引0（私有）

      // 私有辅助函数：将字符转换为0-25的索引（外部无需调用）
      inline int charToId(char c) const {
          return c - 'a'; // 仅支持小写字母，若需支持大写可额外处理
      }

  public:
      // 构造函数：初始化根节点
      Trie() {
          tree.emplace_back(); // root节点（索引0）
      }

      // 公共接口1：插入单词
      void insert(const string& s) {
          int current = 0; // 从根节点开始
          tree[current].pass++; // 根节点的pass计数+1
          for (char c : s) {
              int id = charToId(c);
              // 若当前字符对应的子节点不存在，创建新节点
              if (tree[current].next[id] == -1) {
                  tree[current].next[id] = tree.size(); // 新节点的索引为当前vector大小
                  tree.emplace_back(); // 构造新节点
              }
              // 移动到子节点
              current = tree[current].next[id];
              tree[current].pass++; // 该节点的pass计数+1
          }
          tree[current].end++; // 单词结尾节点的end计数+1
      }

      // 公共接口2：查找单词是否存在（完全匹配）
      bool search(const string& s) const {
          int current = 0;
          for (char c : s) {
              int id = charToId(c);
              // 字符对应的子节点不存在，直接返回false
              if (tree[current].next[id] == -1) {
                  return false;
              }
              current = tree[current].next[id];
          }
          // 遍历完单词后，判断是否是某个单词的结尾（end>0）
          return tree[current].end > 0;
      }

      // 公共接口3：判断是否存在以指定前缀开头的单词
      bool startsWith(const string& prefix) const {
          int current = 0;
          for (char c : prefix) {
              int id = charToId(c);
              if (tree[current].next[id] == -1) {
                  return false;
              }
              current = tree[current].next[id];
          }
          // 遍历完前缀即说明存在该前缀
          return true;
      }

      // 公共接口4：统计以指定前缀开头的单词数量
      int countPrefix(const string& prefix) const {
          int current = 0;
          for (char c : prefix) {
              int id = charToId(c);
              if (tree[current].next[id] == -1) {
                  return 0; // 前缀不存在，数量为0
              }
              current = tree[current].next[id];
          }
          // 返回前缀最后一个节点的pass值（即经过该节点的单词数）
          return tree[current].pass;
      }

      // 可选扩展接口：删除单词（补充常用功能）
      bool remove(const string& s) {
          // 先检查单词是否存在
          if (!search(s)) {
              return false;
          }
          int current = 0;
          tree[current].pass--;
          for (char c : s) {
              int id = charToId(c);
              int nextNode = tree[current].next[id];
              // 若子节点的pass减1后为0，可删除该子节点（优化内存）
              if (--tree[nextNode].pass == 0) {
                  tree[current].next[id] = -1;
                  // 注：vector无法高效删除中间节点，此处仅标记为-1，若需严格释放内存可改用其他结构
              }
              current = nextNode;
          }
          tree[current].end--;
          return true;
      }
  };

  // 测试用例：验证Trie的所有功能
  int main() {
      Trie trie;

      // 插入单词
      trie.insert("apple");
      trie.insert("app");
      trie.insert("banana");
      trie.insert("app"); // 重复插入app

      // 测试search
      cout << "查找'app'：" << boolalpha << trie.search("app") << endl;       // true
      cout << "查找'apple'：" << boolalpha << trie.search("apple") << endl;   // true
      cout << "查找'apps'：" << boolalpha << trie.search("apps") << endl;     // false

      // 测试startsWith
      cout << "前缀'app'是否存在：" << boolalpha << trie.startsWith("app") << endl; // true
      cout << "前缀'ban'是否存在：" << boolalpha << trie.startsWith("ban") << endl; // true
      cout << "前缀'pear'是否存在：" << boolalpha << trie.startsWith("pear") << endl; // false

      // 测试countPrefix
      cout << "前缀'app'的单词数：" << trie.countPrefix("app") << endl; // 3（app×2 + apple×1）
      cout << "前缀'ban'的单词数：" << trie.countPrefix("ban") << endl; // 1

      // 测试remove
      cout << "删除'app'：" << boolalpha << trie.remove("app") << endl; // true
      cout << "删除后前缀'app'的单词数：" << trie.countPrefix("app") << endl; // 2
      cout << "删除后查找'app'：" << boolalpha << trie.search("app") << endl; // true（还剩1个app）

      return 0;
  }
  ```

- 相关题目
  - [208. 实现 Trie (前缀树)](https://leetcode.cn/problems/implement-trie-prefix-tree/)

### 前缀和后缀搜索

- 参考题目
  - [745. 前缀和后缀搜索](https://leetcode.cn/problems/prefix-and-suffix-search/)
  - [211. 添加与搜索单词 - 数据结构设计](https://leetcode.cn/problems/design-add-and-search-words-data-structure/description/)

### 单词搜索 II

- 参考题目
  - [676. 实现一个魔法字典](https://leetcode.cn/problems/implement-magic-dictionary/)
  - [212. 单词搜索 II](https://leetcode.cn/problems/word-search-ii/description/)
  - [720. 词典中最长的单词](https://leetcode.cn/problems/longest-word-in-dictionary/)

### 数组中最大异或对

- 参考题目
  - [LCR 067. 数组中两个数的最大异或值](https://leetcode.cn/problems/ms70jA/description/)

### 驼峰式匹配

- 参考题目
  - [1023. 驼峰式匹配](https://leetcode.cn/problems/camelcase-matching/)

### 多模式串匹配

- 参考题目
  - [面试题 17.17. 多次搜索](https://leetcode.cn/problems/multi-search-lcci/description/)

### AC 自动机

- 在多模式串匹配任务中，Trie 的做法是
  - 先将所有模式串插入到 Trie 中
  - 遍历文本串的每个字符，此时 Trie 可以判断：
    - 当前扫描位置是否匹配某个模式串的前缀
    - 是否匹配到完整模式串
  - 但仅仅靠 Trie 不够，因为当匹配失败时都要回到根节点重新扫描，无法高效回退，因此需要在 Trie 上增加失败指针
- Aho–Corasick 自动机结构
  - 在 Trie 基础上增加：
    - fail 指针：指向当前节点最长真后缀对应的节点
    - output 集合：当前节点对应的所有匹配模式串编号
  - 设节点 $u$ 表示字符串 $S_u$，其 fail 指针指向节点 $v$，满足：
    - $S_v$ 是 $S_u$ 的最长真后缀
    - 且 $S_v$ 是某个模式串前缀
  - 这本质上是对 KMP 中“最长相等前后缀”思想的推广

## 后缀自动机（SAM）

- Trie / AC 的核心是已知模式集合，在文本中查找这些模式
- 而后缀自动机（Suffix Automaton, SAM）处理的是已知一个文本串 $S$，需要回答关于 $S$ 的所有子串问题，它是“对一个字符串的所有子串建立的最小 DFA”
- 给定一个文本串，后缀自动机构造一个最小确定有限自动机，使得：
  - 语言为 $Sub(S)$
  - 任意子串都能在自动机上被识别
